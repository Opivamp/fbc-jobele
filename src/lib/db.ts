import fs from "fs";
import path from "path";
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

interface DatabaseSchema {
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

import os from "os";

// Global in-memory cache to preserve data across warm serverless requests
declare global {
  var __fbc_db_memory: DatabaseSchema | undefined;
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

function ensureDbExists(): DatabaseSchema {
  if (globalThis.__fbc_db_memory) {
    return globalThis.__fbc_db_memory;
  }

  // Check candidate locations on disk
  const candidates = [PRIMARY_DB_PATH, TMP_DB_PATH];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, "utf-8");
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (parsed && parsed.settings && parsed.users) {
          globalThis.__fbc_db_memory = parsed;
          return parsed;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // Fallback to fresh seed data
  const initial = getInitialDatabase();
  globalThis.__fbc_db_memory = initial;
  saveDb(initial);
  return initial;
}

function saveDb(data: DatabaseSchema) {
  // Always update in-memory state so subsequent requests see it instantly
  globalThis.__fbc_db_memory = data;

  // 1. Try saving to project directory (works in local development)
  try {
    if (!fs.existsSync(PRIMARY_DB_DIR)) {
      fs.mkdirSync(PRIMARY_DB_DIR, { recursive: true });
    }
    const tempPath = `${PRIMARY_DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, PRIMARY_DB_PATH);
    return;
  } catch {
    // Expected on Vercel / serverless read-only filesystem
  }

  // 2. Fallback to /tmp directory (always writable on Vercel & AWS Lambda)
  try {
    if (!fs.existsSync(TMP_DB_DIR)) {
      fs.mkdirSync(TMP_DB_DIR, { recursive: true });
    }
    const tempTmpPath = `${TMP_DB_PATH}.tmp`;
    fs.writeFileSync(tempTmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempTmpPath, TMP_DB_PATH);
  } catch (err) {
    console.warn("Could not write to disk, maintaining in-memory database:", err);
  }
}

// ==================== SETTINGS ====================
export function getSettings(): SiteSettings {
  const db = ensureDbExists();
  return db.settings;
}

export function updateSettings(partial: Partial<SiteSettings>): SiteSettings {
  const db = ensureDbExists();
  db.settings = { ...db.settings, ...partial };
  saveDb(db);
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

  return list.sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getFeaturedGalleryImages(limit = 6): GalleryImage[] {
  const db = ensureDbExists();
  const featured = db.gallery.filter((img) => img.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);
  // fallback to newest if not enough marked featured
  const all = [...db.gallery].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

export function updateGalleryImage(id: string, partial: Partial<GalleryImage>): GalleryImage | null {
  const db = ensureDbExists();
  const index = db.gallery.findIndex((img) => img.id === id);
  if (index === -1) return null;
  db.gallery[index] = { ...db.gallery[index], ...partial };
  saveDb(db);
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

export function getGalleryCategories(): GalleryCategory[] {
  const db = ensureDbExists();
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

export function getLatestSermon(): Sermon | null {
  const db = ensureDbExists();
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

export function getAllEventsAdmin(): Event[] {
  const db = ensureDbExists();
  return [...db.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedEvent(): Event | null {
  const db = ensureDbExists();
  const now = new Date().toISOString().split("T")[0];
  const featured = db.events.find((e) => e.isFeatured && e.isPublished);
  if (featured) return featured;
  // fallback to next upcoming event
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

export function getNewsBySlug(slug: string): NewsPost | null {
  const db = ensureDbExists();
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

export function updateNewsPost(id: string, partial: Partial<NewsPost>): NewsPost | null {
  const db = ensureDbExists();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return null;
  db.news[index] = { ...db.news[index], ...partial };
  saveDb(db);
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

// ==================== MINISTRIES ====================
export function getMinistries(): Ministry[] {
  const db = ensureDbExists();
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

export function updateMinistry(id: string, partial: Partial<Ministry>): Ministry | null {
  const db = ensureDbExists();
  const index = db.ministries.findIndex((m) => m.id === id);
  if (index === -1) return null;
  db.ministries[index] = { ...db.ministries[index], ...partial };
  saveDb(db);
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

// ==================== LEADERSHIP ====================
export function getLeadership(): Leadership[] {
  const db = ensureDbExists();
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

export function updateLeader(id: string, partial: Partial<Leadership>): Leadership | null {
  const db = ensureDbExists();
  const index = db.leadership.findIndex((l) => l.id === id);
  if (index === -1) return null;
  db.leadership[index] = { ...db.leadership[index], ...partial };
  saveDb(db);
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

// ==================== PRAYER REQUESTS ====================
export function getPrayerRequests(): PrayerRequest[] {
  const db = ensureDbExists();
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

export function updatePrayerRequest(id: string, partial: Partial<PrayerRequest>): PrayerRequest | null {
  const db = ensureDbExists();
  const index = db.prayerRequests.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.prayerRequests[index] = { ...db.prayerRequests[index], ...partial };
  saveDb(db);
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

// ==================== CONTACT MESSAGES ====================
export function getContactMessages(): ContactMessage[] {
  const db = ensureDbExists();
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

export function updateContactMessage(id: string, partial: Partial<ContactMessage>): ContactMessage | null {
  const db = ensureDbExists();
  const index = db.contactMessages.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.contactMessages[index] = { ...db.contactMessages[index], ...partial };
  saveDb(db);
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

// ==================== USERS & AUTH ====================
export function getUsers(): User[] {
  const db = ensureDbExists();
  return db.users;
}

export function getUserByEmailOrUsername(identifier: string): User | null {
  const db = ensureDbExists();
  const id = identifier.toLowerCase().trim();
  return db.users.find(
    (u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id
  ) || null;
}

export function getUserById(id: string): User | null {
  const db = ensureDbExists();
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

