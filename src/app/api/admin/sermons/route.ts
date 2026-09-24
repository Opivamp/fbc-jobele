import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ensureDbLoadedAsync,
  getSermonsAsync,
  addSermonAsync,
  updateSermonAsync,
  deleteSermonAsync,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureDbLoadedAsync();
  const sermons = await getSermonsAsync();
  return NextResponse.json({ sermons });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await ensureDbLoadedAsync();
    const sermon = await addSermonAsync(body);
    return NextResponse.json({ success: true, sermon });
  } catch (err) {
    console.error("Failed to create sermon:", err);
    return NextResponse.json({ error: "Failed to create sermon" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    await ensureDbLoadedAsync();
    const updated = await updateSermonAsync(id, partial);
    return NextResponse.json({ success: true, sermon: updated });
  } catch (err) {
    console.error("Failed to update sermon:", err);
    return NextResponse.json({ error: "Failed to update sermon" }, { status: 500 });
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
    const success = await deleteSermonAsync(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Failed to delete sermon:", err);
    return NextResponse.json({ error: "Failed to delete sermon" }, { status: 500 });
  }
}
