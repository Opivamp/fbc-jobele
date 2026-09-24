import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ensureDbLoadedAsync,
  getNewsAsync,
  addNewsPostAsync,
  updateNewsPostAsync,
  deleteNewsPostAsync,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureDbLoadedAsync();
  const news = await getNewsAsync(false);
  return NextResponse.json({ news });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await ensureDbLoadedAsync();
    const post = await addNewsPostAsync(body);
    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("Failed to create announcement:", err);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    await ensureDbLoadedAsync();
    const updated = await updateNewsPostAsync(id, partial);
    return NextResponse.json({ success: true, post: updated });
  } catch (err) {
    console.error("Failed to update announcement:", err);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await ensureDbLoadedAsync();
    const success = await deleteNewsPostAsync(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Failed to delete announcement:", err);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
