import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ensureDbLoadedAsync,
  getAllEventsAdminAsync,
  addEventAsync,
  updateEventAsync,
  deleteEventAsync,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureDbLoadedAsync();
  const events = await getAllEventsAdminAsync();
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await ensureDbLoadedAsync();
    const event = await addEventAsync(body);
    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error("Failed to create event:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    await ensureDbLoadedAsync();
    const updated = await updateEventAsync(id, partial);
    return NextResponse.json({ success: true, event: updated });
  } catch (err) {
    console.error("Failed to update event:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
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
    const success = await deleteEventAsync(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Failed to delete event:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
