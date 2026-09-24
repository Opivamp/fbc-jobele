import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ensureDbLoadedAsync,
  syncCloudinaryGalleryImagesAsync,
  getGalleryImagesAsync,
  getGalleryImageById,
  addGalleryImageAsync,
  updateGalleryImageAsync,
  deleteGalleryImageAsync,
} from "@/lib/db";
import { deleteMedia } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureDbLoadedAsync();
  await syncCloudinaryGalleryImagesAsync();
  const images = await getGalleryImagesAsync();
  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const image = await addGalleryImageAsync(body);
    return NextResponse.json({ success: true, image });
  } catch (err) {
    console.error("Failed to create image record:", err);
    return NextResponse.json({ error: "Failed to create image record" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    const updated = await updateGalleryImageAsync(id, partial);
    if (!updated) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, image: updated });
  } catch (err) {
    console.error("Failed to update image:", err);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const existing = getGalleryImageById(id);
    if (existing && existing.imageUrl) {
      await deleteMedia(existing.imageUrl, "gallery");
    }
    const deleted = await deleteGalleryImageAsync(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Failed to delete image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
