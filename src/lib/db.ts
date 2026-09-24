import fs from "fs";
import path from "path";
import os from "os";
import {
  SiteSettings,
  GalleryImage,
  GalleryCategory,
  Sermon,
  Event,
  NewsPost,
  Ministry,
  Leadership,
  PrayerRequest,
  ContactMessage,
  User,
} from "./types";
import {
  initialSiteSettings,
  initialCategories,
  initialGalleryImages,
  initialSermons,
  initialEvents,
  initialNews,
  initialMinistries,
  initialLeadership,
  initialUsers,
} from "./seed-data";

export interface DatabaseSchema {
  settings: SiteSettings;
  categories: GalleryCategory[];
  gallery: GalleryImage[];
  sermons: Sermon[];
  events: Event[];
  news: NewsPost[];
  ministries: Ministry[];
  leadership: Leadership[];
  prayerRequests: PrayerRequest[];
  contactMessages: ContactMessage[];
  users: User[];
}

// Global in-memory cache to preserve data across warm serverless requests
declare global {
  var __fbc_db_memory: DatabaseSchema | undefined;
  var __fbc_db_last_synced: number | undefined;
}

const PRIMARY_DB_DIR = path.join(process.cwd(), "src", "data");
const PRIMARY_DB_PATH = path.join(PRIMARY_DB_DIR, "db.json");
const TMP_DB_DIR = path.join(os.tmpdir(), "fbc-jobele");
const TMP_DB_PATH = path.join(TMP_DB_DIR, "db.json");

function getInitialDatabase(): DatabaseSchema {
  return {
    settings: initialSiteSettings,
    categories: initialCategories,
    gallery: initialGalleryImages,
    sermons: initialSermons,
    events: initialEvents,
    news: initialNews,
    ministries: initialMinistries,
    leadership: initialLeadership,
    prayerRequests: [
      {
        id: "prayer-seed-1",
        name: "Anonymous Sister",
        email: "",
        phone: "",
        request: "Please intercede for complete restoration of health for my mother and divine peace in our family.",
        isAnonymous: true,
        preferredContact: "none",
        category: "Healing",
        status: "prayed",
        pastoralNotes: "Lifted up during Wednesday morning pastoral prayer session.",
        createdAt: "2026-09-10T08:30:00Z",
      },
    ],
    contactMessages: [
      {
        id: "contact-seed-1",
        name: "Brother Tunde Adeyemi",
        email: "tunde.adeyemi@example.com",
        phone: "+234 802 111 2233",
        subject: "Inquiring about Believer's Baptism Class",
        message: "Good day Pastor, I recently moved to Jobele and would love to join the upcoming believer's baptism class. When is the next orientation?",
        status: "read",
        createdAt: "2026-09-12T14:15:00Z",
      },
    ],
    users: initialUsers,
  };
}

/**
 * Awaited cloud persistence to Cloudinary Raw Storage
 */
async function syncDbToCloudAsync(data: DatabaseSchema): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return false;

  try {
    const { v2: cloudinary } = require("cloudinary");
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });

    const jsonStr = JSON.stringify(data);
    const base64Data = Buffer.from(jsonStr, "utf-8").toString("base64");
    const dataUri = `data:application/json;base64,${base64Data}`;

    await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      public_id: "fbc-jobele/database/db.json",
      overwrite: true,
      invalidate: true,
    });

    return true;
  } catch (err) {
    console.warn("Could not sync database to Cloudinary:", err);
    return false;
  }
}

/**
 * Ensures the database is loaded from memory, Cloudinary raw storage, or disk.
 * Uses a 5-second freshness window to balance real-time sync with high performance.
 */
export async function ensureDbLoadedAsync(): Promise<DatabaseSchema> {
  const now = Date.now();

  // 1. If in-memory database exists and was synced within the last 5 seconds, return immediately
  if (
    globalThis.__fbc_db_memory &&
    globalThis.__fbc_db_last_synced &&
    now - globalThis.__fbc_db_last_synced < 5000
  ) {
    return globalThis.__fbc_db_memory;
  }

  // 2. Fetch fresh global database state from Cloudinary CDN with cache-busting
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (cloudName) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const url = `https://res.cloudinary.com/${cloudName.trim()}/raw/upload/fbc-jobele/database/db.json?t=${now}`;

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const cloudData = (await res.json()) as DatabaseSchema;
        if (cloudData && cloudData.settings && cloudData.users) {
          globalThis.__fbc_db_memory = cloudData;
          globalThis.__fbc_db_last_synced = now;

          // Mirror to serverless /tmp
          try {
            if (!fs.existsSync(TMP_DB_DIR)) {
              fs.mkdirSync(TMP_DB_DIR, { recursive: true });
            }
            fs.writeFileSync(TMP_DB_PATH, JSON.stringify(cloudData, null, 2), "utf-8");
          } catch {}

          return cloudData;
        }
      }
    } catch {
      // Cloudinary fetch error or timeout, proceed to local mirrors
    }
  }

  // 3. Fallback to existing memory if available
  if (globalThis.__fbc_db_memory) {
    return globalThis.__fbc_db_memory;
  }

  // 4. Fallback to /tmp disk cache
  if (fs.existsSync(TMP_DB_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_DB_PATH, "utf-8");
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed && parsed.settings && parsed.users) {
        globalThis.__fbc_db_memory = parsed;
        globalThis.__fbc_db_last_synced = now;
        return parsed;
      }
    } catch {}
  }

  // 5. Fallback to bundled repository seed file
  if (fs.existsSync(PRIMARY_DB_PATH)) {
    try {
      const raw = fs.readFileSync(PRIMARY_DB_PATH, "utf-8");
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed && parsed.settings && parsed.users) {
        globalThis.__fbc_db_memory = parsed;
        globalThis.__fbc_db_last_synced = now;
        return parsed;
      }
    } catch {}
  }

  // 6. Default fresh seed database
  const initial = getInitialDatabase();
  globalThis.__fbc_db_memory = initial;
  globalThis.__fbc_db_last_synced = now;
  saveDb(initial);
  return initial;
}

/**
 * Synchronous database loader for backwards compatibility
 */
export function ensureDbExists(): DatabaseSchema {
  if (globalThis.__fbc_db_memory) {
    return globalThis.__fbc_db_memory;
  }

  if (fs.existsSync(TMP_DB_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_DB_PATH, "utf-8");
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed && parsed.settings && parsed.users) {
        globalThis.__fbc_db_memory = parsed;
        return parsed;
      }
    } catch {}
  }

  if (fs.existsSync(PRIMARY_DB_PATH)) {
    try {
      const raw = fs.readFileSync(PRIMARY_DB_PATH, "utf-8");
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed && parsed.settings && parsed.users) {
        globalThis.__fbc_db_memory = parsed;
        return parsed;
      }
    } catch {}
  }

  const initial = getInitialDatabase();
  globalThis.__fbc_db_memory = initial;
  saveDb(initial);
  return initial;
}

/**
 * Asynchronous persistence guaranteeing writes finish before serverless freeze
 */
export async function saveDbAsync(data: DatabaseSchema): Promise<void> {
  globalThis.__fbc_db_memory = data;
  globalThis.__fbc_db_last_synced = Date.now();

  // 1. Try primary repo directory (local development)
  try {
    if (!fs.existsSync(PRIMARY_DB_DIR)) {
      fs.mkdirSync(PRIMARY_DB_DIR, { recursive: true });
    }
    const tempPath = `${PRIMARY_DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, PRIMARY_DB_PATH);
  } catch {}

  // 2. Try /tmp directory (serverless disk)
  try {
    if (!fs.existsSync(TMP_DB_DIR)) {
      fs.mkdirSync(TMP_DB_DIR, { recursive: true });
    }
    const tempTmpPath = `${TMP_DB_PATH}.tmp`;
    fs.writeFileSync(tempTmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempTmpPath, TMP_DB_PATH);
  } catch (err) {
    console.warn("Could not write to disk mirror:", err);
  }

  // 3. Await Cloudinary cloud upload
  await syncDbToCloudAsync(data);
}

/**
 * Synchronous save database (triggers async cloud sync in background)
 */
export function saveDb(data: DatabaseSchema) {
  globalThis.__fbc_db_memory = data;
  globalThis.__fbc_db_last_synced = Date.now();

  try {
    if (!fs.existsSync(PRIMARY_DB_DIR)) {
      fs.mkdirSync(PRIMARY_DB_DIR, { recursive: true });
    }
    const tempPath = `${PRIMARY_DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, PRIMARY_DB_PATH);
  } catch {}

  try {
    if (!fs.existsSync(TMP_DB_DIR)) {
      fs.mkdirSync(TMP_DB_DIR, { recursive: true });
    }
    const tempTmpPath = `${TMP_DB_PATH}.tmp`;
    fs.writeFileSync(tempTmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempTmpPath, TMP_DB_PATH);
  } catch {}

  syncDbToCloudAsync(data).catch(() => {});
}

/**
 * Auto-discovers and syncs any photos uploaded directly to Cloudinary
 * ensuring pictures never disappear even if initial metadata write was interrupted.
 */
export async function syncCloudinaryGalleryImagesAsync(): Promise<number> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return 0;

  try {
    const { v2: cloudinary } = require("cloudinary");
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });

    const db = await ensureDbLoadedAsync();
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "fbc-jobele/gallery",
      max_results: 100,
    });

    let addedCount = 0;
    if (result && Array.isArray(result.resources)) {
      for (const res of result.resources) {
        const secureUrl = res.secure_url;
        const exists = db.gallery.some(
          (img) =>
            img.imageUrl === secureUrl ||
            (res.public_id && img.imageUrl.includes(res.public_id))
        );

        if (!exists) {
          const rawName = res.public_id.split("/").pop() || "Sanctuary Photo";
          const friendlyTitle = rawName
            .replace(/_\d+$/, "")
            .replace(/[_-]+/g, " ")
            .trim();
          const title =
            friendlyTitle.charAt(0).toUpperCase() + friendlyTitle.slice(1);

          db.gallery.unshift({
            id: `img-cloud-${res.asset_id || Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: title || "Moments at First Baptist Church Jobele",
            caption: "Photographed at First Baptist Church Jobele sanctuary fellowship.",
            category: "Worship & Services",
            imageUrl: secureUrl,
            date: res.created_at
              ? res.created_at.split("T")[0]
              : new Date().toISOString().split("T")[0],
            photographer: "Church Media Unit",
            isFeatured: false,
            order: 0,
            createdAt: res.created_at || new Date().toISOString(),
          });
          addedCount++;
        }
      }

      if (addedCount > 0) {
        await saveDbAsync(db);
        console.log(`[Gallery Sync] Auto-recovered ${addedCount} uploaded images from Cloudinary!`);
      }
    }
    return addedCount;
  } catch (err) {
    console.warn("[Gallery Sync] Could not list Cloudinary assets:", err);
    return 0;
  }
}

// ==================== SETTINGS ====================
export function getSettings(): SiteSettings {
  const db = ensureDbExists();
  return db.settings;
}

export async function getSettingsAsync(): Promise<SiteSettings> {
  const db = await ensureDbLoadedAsync();
  return db.settings;
}

export function updateSettings(partial: Partial<SiteSettings>): SiteSettings {
  const db = ensureDbExists();
  db.settings = { ...db.settings, ...partial };
  saveDb(db);
  return db.settings;
}

export async function updateSettingsAsync(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await ensureDbLoadedAsync();
  db.settings = { ...db.settings, ...partial };
  await saveDbAsync(db);
  return db.settings;
}

// ==================== GALLERY ====================
export function getGalleryImages(categorySlug?: string, search?: string): GalleryImage[] {
  const db = ensureDbExists();
  let list = [...db.gallery];

  if (categorySlug && categorySlug !== "all") {
    list = list.filter(
      (img) => img.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (img) =>
        img.title.toLowerCase().includes(q) ||
        img.caption.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q)
    );
  }

  return list.sort(
    (a, b) =>
      (a.order || 0) - (b.order || 0) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getGalleryImagesAsync(categorySlug?: string, search?: string): Promise<GalleryImage[]> {
  const db = await ensureDbLoadedAsync();
  let list = [...db.gallery];

  if (categorySlug && categorySlug !== "all") {
    list = list.filter(
      (img) => img.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (img) =>
        img.title.toLowerCase().includes(q) ||
        img.caption.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q)
    );
  }

  return list.sort(
    (a, b) =>
      (a.order || 0) - (b.order || 0) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getFeaturedGalleryImages(limit = 6): GalleryImage[] {
  const db = ensureDbExists();
  const featured = db.gallery.filter((img) => img.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const all = [...db.gallery].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return all.slice(0, limit);
}

export async function getFeaturedGalleryImagesAsync(limit = 6): Promise<GalleryImage[]> {
  const db = await ensureDbLoadedAsync();
  const featured = db.gallery.filter((img) => img.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const all = [...db.gallery].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return all.slice(0, limit);
}

export function addGalleryImage(image: Omit<GalleryImage, "id" | "createdAt">): GalleryImage {
  const db = ensureDbExists();
  const newImg: GalleryImage = {
    ...image,
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  db.gallery.unshift(newImg);
  saveDb(db);
  return newImg;
}

export async function addGalleryImageAsync(image: Omit<GalleryImage, "id" | "createdAt">): Promise<GalleryImage> {
  const db = await ensureDbLoadedAsync();
  const newImg: GalleryImage = {
    ...image,
    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  db.gallery.unshift(newImg);
  await saveDbAsync(db);
  return newImg;
}

export function updateGalleryImage(id: string, partial: Partial<GalleryImage>): GalleryImage | null {
  const db = ensureDbExists();
  const index = db.gallery.findIndex((img) => img.id === id);
  if (index === -1) return null;
  db.gallery[index] = { ...db.gallery[index], ...partial };
  saveDb(db);
  return db.gallery[index];
}

export async function updateGalleryImageAsync(id: string, partial: Partial<GalleryImage>): Promise<GalleryImage | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.gallery.findIndex((img) => img.id === id);
  if (index === -1) return null;
  db.gallery[index] = { ...db.gallery[index], ...partial };
  await saveDbAsync(db);
  return db.gallery[index];
}

export function getGalleryImageById(id: string): GalleryImage | null {
  const db = ensureDbExists();
  return db.gallery.find((img) => img.id === id) || null;
}

export function deleteGalleryImage(id: string): boolean {
  const db = ensureDbExists();
  const before = db.gallery.length;
  db.gallery = db.gallery.filter((img) => img.id !== id);
  if (db.gallery.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteGalleryImageAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.gallery.length;
  db.gallery = db.gallery.filter((img) => img.id !== id);
  if (db.gallery.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

export function getGalleryCategories(): GalleryCategory[] {
  const db = ensureDbExists();
  return db.categories;
}

export async function getGalleryCategoriesAsync(): Promise<GalleryCategory[]> {
  const db = await ensureDbLoadedAsync();
  return db.categories;
}

export function addGalleryCategory(cat: Omit<GalleryCategory, "id">): GalleryCategory {
  const db = ensureDbExists();
  const newCat: GalleryCategory = {
    ...cat,
    id: `cat-${Date.now()}`,
  };
  db.categories.push(newCat);
  saveDb(db);
  return newCat;
}

export async function addGalleryCategoryAsync(cat: Omit<GalleryCategory, "id">): Promise<GalleryCategory> {
  const db = await ensureDbLoadedAsync();
  const newCat: GalleryCategory = {
    ...cat,
    id: `cat-${Date.now()}`,
  };
  db.categories.push(newCat);
  await saveDbAsync(db);
  return newCat;
}

// ==================== SERMONS ====================
export function getSermons(search?: string, series?: string, speaker?: string): Sermon[] {
  const db = ensureDbExists();
  let list = [...db.sermons];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.scripture.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (series && series !== "all") {
    list = list.filter((s) => s.series.toLowerCase() === series.toLowerCase());
  }

  if (speaker && speaker !== "all") {
    list = list.filter((s) => s.speaker.toLowerCase() === speaker.toLowerCase());
  }

  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSermonsAsync(search?: string, series?: string, speaker?: string): Promise<Sermon[]> {
  const db = await ensureDbLoadedAsync();
  let list = [...db.sermons];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.scripture.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (series && series !== "all") {
    list = list.filter((s) => s.series.toLowerCase() === series.toLowerCase());
  }

  if (speaker && speaker !== "all") {
    list = list.filter((s) => s.speaker.toLowerCase() === speaker.toLowerCase());
  }

  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLatestSermon(): Sermon | null {
  const db = ensureDbExists();
  const featured = db.sermons.find((s) => s.isFeatured);
  if (featured) return featured;
  const sorted = [...db.sermons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0] || null;
}

export async function getLatestSermonAsync(): Promise<Sermon | null> {
  const db = await ensureDbLoadedAsync();
  const featured = db.sermons.find((s) => s.isFeatured);
  if (featured) return featured;
  const sorted = [...db.sermons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0] || null;
}

export function addSermon(sermon: Omit<Sermon, "id">): Sermon {
  const db = ensureDbExists();
  const newSermon: Sermon = {
    ...sermon,
    id: `sermon-${Date.now()}`,
  };
  if (newSermon.isFeatured) {
    db.sermons.forEach((s) => (s.isFeatured = false));
  }
  db.sermons.unshift(newSermon);
  saveDb(db);
  return newSermon;
}

export async function addSermonAsync(sermon: Omit<Sermon, "id">): Promise<Sermon> {
  const db = await ensureDbLoadedAsync();
  const newSermon: Sermon = {
    ...sermon,
    id: `sermon-${Date.now()}`,
  };
  if (newSermon.isFeatured) {
    db.sermons.forEach((s) => (s.isFeatured = false));
  }
  db.sermons.unshift(newSermon);
  await saveDbAsync(db);
  return newSermon;
}

export function updateSermon(id: string, partial: Partial<Sermon>): Sermon | null {
  const db = ensureDbExists();
  const index = db.sermons.findIndex((s) => s.id === id);
  if (index === -1) return null;
  if (partial.isFeatured) {
    db.sermons.forEach((s) => (s.isFeatured = false));
  }
  db.sermons[index] = { ...db.sermons[index], ...partial };
  saveDb(db);
  return db.sermons[index];
}

export async function updateSermonAsync(id: string, partial: Partial<Sermon>): Promise<Sermon | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.sermons.findIndex((s) => s.id === id);
  if (index === -1) return null;
  if (partial.isFeatured) {
    db.sermons.forEach((s) => (s.isFeatured = false));
  }
  db.sermons[index] = { ...db.sermons[index], ...partial };
  await saveDbAsync(db);
  return db.sermons[index];
}

export function deleteSermon(id: string): boolean {
  const db = ensureDbExists();
  const before = db.sermons.length;
  db.sermons = db.sermons.filter((s) => s.id !== id);
  if (db.sermons.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteSermonAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.sermons.length;
  db.sermons = db.sermons.filter((s) => s.id !== id);
  if (db.sermons.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== EVENTS ====================
export function getEvents(type: "all" | "upcoming" | "past" = "all", search?: string): Event[] {
  const db = ensureDbExists();
  const now = new Date().toISOString().split("T")[0];
  let list = db.events.filter((e) => e.isPublished);

  if (type === "upcoming") {
    list = list.filter((e) => e.date >= now);
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (type === "past") {
    list = list.filter((e) => e.date < now);
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getEventsAsync(type: "all" | "upcoming" | "past" = "all", search?: string): Promise<Event[]> {
  const db = await ensureDbLoadedAsync();
  const now = new Date().toISOString().split("T")[0];
  let list = db.events.filter((e) => e.isPublished);

  if (type === "upcoming") {
    list = list.filter((e) => e.date >= now);
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (type === "past") {
    list = list.filter((e) => e.date < now);
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getAllEventsAdmin(): Event[] {
  const db = ensureDbExists();
  return [...db.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllEventsAdminAsync(): Promise<Event[]> {
  const db = await ensureDbLoadedAsync();
  return [...db.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedEvent(): Event | null {
  const db = ensureDbExists();
  const now = new Date().toISOString().split("T")[0];
  const featured = db.events.find((e) => e.isFeatured && e.isPublished);
  if (featured) return featured;
  const upcoming = db.events
    .filter((e) => e.isPublished && e.date >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] || db.events[0] || null;
}

export async function getFeaturedEventAsync(): Promise<Event | null> {
  const db = await ensureDbLoadedAsync();
  const now = new Date().toISOString().split("T")[0];
  const featured = db.events.find((e) => e.isFeatured && e.isPublished);
  if (featured) return featured;
  const upcoming = db.events
    .filter((e) => e.isPublished && e.date >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] || db.events[0] || null;
}

export function addEvent(event: Omit<Event, "id">): Event {
  const db = ensureDbExists();
  const newEvent: Event = {
    ...event,
    id: `event-${Date.now()}`,
  };
  if (newEvent.isFeatured) {
    db.events.forEach((e) => (e.isFeatured = false));
  }
  db.events.unshift(newEvent);
  saveDb(db);
  return newEvent;
}

export async function addEventAsync(event: Omit<Event, "id">): Promise<Event> {
  const db = await ensureDbLoadedAsync();
  const newEvent: Event = {
    ...event,
    id: `event-${Date.now()}`,
  };
  if (newEvent.isFeatured) {
    db.events.forEach((e) => (e.isFeatured = false));
  }
  db.events.unshift(newEvent);
  await saveDbAsync(db);
  return newEvent;
}

export function updateEvent(id: string, partial: Partial<Event>): Event | null {
  const db = ensureDbExists();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  if (partial.isFeatured) {
    db.events.forEach((e) => (e.isFeatured = false));
  }
  db.events[index] = { ...db.events[index], ...partial };
  saveDb(db);
  return db.events[index];
}

export async function updateEventAsync(id: string, partial: Partial<Event>): Promise<Event | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  if (partial.isFeatured) {
    db.events.forEach((e) => (e.isFeatured = false));
  }
  db.events[index] = { ...db.events[index], ...partial };
  await saveDbAsync(db);
  return db.events[index];
}

export function deleteEvent(id: string): boolean {
  const db = ensureDbExists();
  const before = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteEventAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== NEWS ====================
export function getNews(publishedOnly = true, search?: string): NewsPost[] {
  const db = ensureDbExists();
  let list = [...db.news];
  if (publishedOnly) {
    list = list.filter((n) => n.isPublished);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getNewsAsync(publishedOnly = true, search?: string): Promise<NewsPost[]> {
  const db = await ensureDbLoadedAsync();
  let list = [...db.news];
  if (publishedOnly) {
    list = list.filter((n) => n.isPublished);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewsBySlug(slug: string): NewsPost | null {
  const db = ensureDbExists();
  return db.news.find((n) => n.slug === slug || n.id === slug) || null;
}

export async function getNewsBySlugAsync(slug: string): Promise<NewsPost | null> {
  const db = await ensureDbLoadedAsync();
  return db.news.find((n) => n.slug === slug || n.id === slug) || null;
}

export function addNewsPost(post: Omit<NewsPost, "id">): NewsPost {
  const db = ensureDbExists();
  const newPost: NewsPost = {
    ...post,
    id: `news-${Date.now()}`,
  };
  db.news.unshift(newPost);
  saveDb(db);
  return newPost;
}

export async function addNewsPostAsync(post: Omit<NewsPost, "id">): Promise<NewsPost> {
  const db = await ensureDbLoadedAsync();
  const newPost: NewsPost = {
    ...post,
    id: `news-${Date.now()}`,
  };
  db.news.unshift(newPost);
  await saveDbAsync(db);
  return newPost;
}

export function updateNewsPost(id: string, partial: Partial<NewsPost>): NewsPost | null {
  const db = ensureDbExists();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return null;
  db.news[index] = { ...db.news[index], ...partial };
  saveDb(db);
  return db.news[index];
}

export async function updateNewsPostAsync(id: string, partial: Partial<NewsPost>): Promise<NewsPost | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return null;
  db.news[index] = { ...db.news[index], ...partial };
  await saveDbAsync(db);
  return db.news[index];
}

export function deleteNewsPost(id: string): boolean {
  const db = ensureDbExists();
  const before = db.news.length;
  db.news = db.news.filter((n) => n.id !== id);
  if (db.news.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteNewsPostAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.news.length;
  db.news = db.news.filter((n) => n.id !== id);
  if (db.news.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== MINISTRIES ====================
export function getMinistries(): Ministry[] {
  const db = ensureDbExists();
  return [...db.ministries].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getMinistriesAsync(): Promise<Ministry[]> {
  const db = await ensureDbLoadedAsync();
  return [...db.ministries].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function addMinistry(ministry: Omit<Ministry, "id">): Ministry {
  const db = ensureDbExists();
  const newMin: Ministry = {
    ...ministry,
    id: `min-${Date.now()}`,
  };
  db.ministries.push(newMin);
  saveDb(db);
  return newMin;
}

export async function addMinistryAsync(ministry: Omit<Ministry, "id">): Promise<Ministry> {
  const db = await ensureDbLoadedAsync();
  const newMin: Ministry = {
    ...ministry,
    id: `min-${Date.now()}`,
  };
  db.ministries.push(newMin);
  await saveDbAsync(db);
  return newMin;
}

export function updateMinistry(id: string, partial: Partial<Ministry>): Ministry | null {
  const db = ensureDbExists();
  const index = db.ministries.findIndex((m) => m.id === id);
  if (index === -1) return null;
  db.ministries[index] = { ...db.ministries[index], ...partial };
  saveDb(db);
  return db.ministries[index];
}

export async function updateMinistryAsync(id: string, partial: Partial<Ministry>): Promise<Ministry | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.ministries.findIndex((m) => m.id === id);
  if (index === -1) return null;
  db.ministries[index] = { ...db.ministries[index], ...partial };
  await saveDbAsync(db);
  return db.ministries[index];
}

export function deleteMinistry(id: string): boolean {
  const db = ensureDbExists();
  const before = db.ministries.length;
  db.ministries = db.ministries.filter((m) => m.id !== id);
  if (db.ministries.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteMinistryAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.ministries.length;
  db.ministries = db.ministries.filter((m) => m.id !== id);
  if (db.ministries.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== LEADERSHIP ====================
export function getLeadership(): Leadership[] {
  const db = ensureDbExists();
  return [...db.leadership].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getLeadershipAsync(): Promise<Leadership[]> {
  const db = await ensureDbLoadedAsync();
  return [...db.leadership].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function addLeader(leader: Omit<Leadership, "id">): Leadership {
  const db = ensureDbExists();
  const newLead: Leadership = {
    ...leader,
    id: `lead-${Date.now()}`,
  };
  db.leadership.push(newLead);
  saveDb(db);
  return newLead;
}

export async function addLeaderAsync(leader: Omit<Leadership, "id">): Promise<Leadership> {
  const db = await ensureDbLoadedAsync();
  const newLead: Leadership = {
    ...leader,
    id: `lead-${Date.now()}`,
  };
  db.leadership.push(newLead);
  await saveDbAsync(db);
  return newLead;
}

export function updateLeader(id: string, partial: Partial<Leadership>): Leadership | null {
  const db = ensureDbExists();
  const index = db.leadership.findIndex((l) => l.id === id);
  if (index === -1) return null;
  db.leadership[index] = { ...db.leadership[index], ...partial };
  saveDb(db);
  return db.leadership[index];
}

export async function updateLeaderAsync(id: string, partial: Partial<Leadership>): Promise<Leadership | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.leadership.findIndex((l) => l.id === id);
  if (index === -1) return null;
  db.leadership[index] = { ...db.leadership[index], ...partial };
  await saveDbAsync(db);
  return db.leadership[index];
}

export function deleteLeader(id: string): boolean {
  const db = ensureDbExists();
  const before = db.leadership.length;
  db.leadership = db.leadership.filter((l) => l.id !== id);
  if (db.leadership.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteLeaderAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.leadership.length;
  db.leadership = db.leadership.filter((l) => l.id !== id);
  if (db.leadership.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== PRAYER REQUESTS ====================
export function getPrayerRequests(): PrayerRequest[] {
  const db = ensureDbExists();
  return [...db.prayerRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPrayerRequestsAsync(): Promise<PrayerRequest[]> {
  const db = await ensureDbLoadedAsync();
  return [...db.prayerRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addPrayerRequest(request: Omit<PrayerRequest, "id" | "createdAt" | "status" | "pastoralNotes">): PrayerRequest {
  const db = ensureDbExists();
  const newReq: PrayerRequest = {
    ...request,
    id: `prayer-${Date.now()}`,
    status: "unread",
    pastoralNotes: "",
    createdAt: new Date().toISOString(),
  };
  db.prayerRequests.unshift(newReq);
  saveDb(db);
  return newReq;
}

export async function addPrayerRequestAsync(request: Omit<PrayerRequest, "id" | "createdAt" | "status" | "pastoralNotes">): Promise<PrayerRequest> {
  const db = await ensureDbLoadedAsync();
  const newReq: PrayerRequest = {
    ...request,
    id: `prayer-${Date.now()}`,
    status: "unread",
    pastoralNotes: "",
    createdAt: new Date().toISOString(),
  };
  db.prayerRequests.unshift(newReq);
  await saveDbAsync(db);
  return newReq;
}

export function updatePrayerRequest(id: string, partial: Partial<PrayerRequest>): PrayerRequest | null {
  const db = ensureDbExists();
  const index = db.prayerRequests.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.prayerRequests[index] = { ...db.prayerRequests[index], ...partial };
  saveDb(db);
  return db.prayerRequests[index];
}

export async function updatePrayerRequestAsync(id: string, partial: Partial<PrayerRequest>): Promise<PrayerRequest | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.prayerRequests.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.prayerRequests[index] = { ...db.prayerRequests[index], ...partial };
  await saveDbAsync(db);
  return db.prayerRequests[index];
}

export function deletePrayerRequest(id: string): boolean {
  const db = ensureDbExists();
  const before = db.prayerRequests.length;
  db.prayerRequests = db.prayerRequests.filter((p) => p.id !== id);
  if (db.prayerRequests.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deletePrayerRequestAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.prayerRequests.length;
  db.prayerRequests = db.prayerRequests.filter((p) => p.id !== id);
  if (db.prayerRequests.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== CONTACT MESSAGES ====================
export function getContactMessages(): ContactMessage[] {
  const db = ensureDbExists();
  return [...db.contactMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getContactMessagesAsync(): Promise<ContactMessage[]> {
  const db = await ensureDbLoadedAsync();
  return [...db.contactMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addContactMessage(message: Omit<ContactMessage, "id" | "createdAt" | "status">): ContactMessage {
  const db = ensureDbExists();
  const newMsg: ContactMessage = {
    ...message,
    id: `contact-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.contactMessages.unshift(newMsg);
  saveDb(db);
  return newMsg;
}

export async function addContactMessageAsync(message: Omit<ContactMessage, "id" | "createdAt" | "status">): Promise<ContactMessage> {
  const db = await ensureDbLoadedAsync();
  const newMsg: ContactMessage = {
    ...message,
    id: `contact-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.contactMessages.unshift(newMsg);
  await saveDbAsync(db);
  return newMsg;
}

export function updateContactMessage(id: string, partial: Partial<ContactMessage>): ContactMessage | null {
  const db = ensureDbExists();
  const index = db.contactMessages.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.contactMessages[index] = { ...db.contactMessages[index], ...partial };
  saveDb(db);
  return db.contactMessages[index];
}

export async function updateContactMessageAsync(id: string, partial: Partial<ContactMessage>): Promise<ContactMessage | null> {
  const db = await ensureDbLoadedAsync();
  const index = db.contactMessages.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.contactMessages[index] = { ...db.contactMessages[index], ...partial };
  await saveDbAsync(db);
  return db.contactMessages[index];
}

export function deleteContactMessage(id: string): boolean {
  const db = ensureDbExists();
  const before = db.contactMessages.length;
  db.contactMessages = db.contactMessages.filter((c) => c.id !== id);
  if (db.contactMessages.length !== before) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteContactMessageAsync(id: string): Promise<boolean> {
  const db = await ensureDbLoadedAsync();
  const before = db.contactMessages.length;
  db.contactMessages = db.contactMessages.filter((c) => c.id !== id);
  if (db.contactMessages.length !== before) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ==================== USERS & AUTH ====================
export function getUsers(): User[] {
  const db = ensureDbExists();
  return db.users;
}

export async function getUsersAsync(): Promise<User[]> {
  const db = await ensureDbLoadedAsync();
  return db.users;
}

export function getUserByEmailOrUsername(identifier: string): User | null {
  const db = ensureDbExists();
  const id = identifier.toLowerCase().trim();
  return (
    db.users.find(
      (u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id
    ) || null
  );
}

export async function getUserByEmailOrUsernameAsync(identifier: string): Promise<User | null> {
  const db = await ensureDbLoadedAsync();
  const id = identifier.toLowerCase().trim();
  return (
    db.users.find(
      (u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id
    ) || null
  );
}

export function getUserById(id: string): User | null {
  const db = ensureDbExists();
  return db.users.find((u) => u.id === id) || null;
}

export async function getUserByIdAsync(id: string): Promise<User | null> {
  const db = await ensureDbLoadedAsync();
  return db.users.find((u) => u.id === id) || null;
}

export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const db = ensureDbExists();
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export async function addUserAsync(user: Omit<User, "id" | "createdAt">): Promise<User> {
  const db = await ensureDbLoadedAsync();
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  await saveDbAsync(db);
  return newUser;
}
