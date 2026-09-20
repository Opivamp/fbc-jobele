import { NextResponse } from "next/server";
import { getGalleryImages, getGalleryCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const images = getGalleryImages();
    const categories = getGalleryCategories();
    return NextResponse.json({
      images,
      categories,
    });
  } catch (err) {
    console.error("Error fetching public gallery:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
