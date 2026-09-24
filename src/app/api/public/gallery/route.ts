import { NextResponse } from "next/server";
import {
  ensureDbLoadedAsync,
  syncCloudinaryGalleryImagesAsync,
  getGalleryImagesAsync,
  getGalleryCategoriesAsync,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbLoadedAsync();
    await syncCloudinaryGalleryImagesAsync();
    const images = await getGalleryImagesAsync();
    const categories = await getGalleryCategoriesAsync();
    return NextResponse.json({
      images,
      categories,
    });
  } catch (err) {
    console.error("Error fetching public gallery:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
