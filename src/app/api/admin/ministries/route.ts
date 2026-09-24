import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ensureDbLoadedAsync,
  getMinistriesAsync,
  addMinistryAsync,
  updateMinistryAsync,
  deleteMinistryAsync,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureDbLoadedAsync();
  const ministries = await getMinistriesAsync();
  return NextResponse.json({ ministries });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await ensureDbLoadedAsync();
    const min = await addMinistryAsync(body);
    return NextResponse.json({ success: true, ministry: min });
  } catch (err) {
    console.error("Failed to create ministry:", err);
    return NextResponse.json({ error: "Failed to create ministry" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    await ensureDbLoadedAsync();
    const updated = await updateMinistryAsync(id, partial);
    return NextResponse.json({ success: true, ministry: updated });
  } catch (err) {
    console.error("Failed to update ministry:", err);
    return NextResponse.json({ error: "Failed to update ministry" }, { status: 500 });
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
    const success = await deleteMinistryAsync(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Failed to delete ministry:", err);
    return NextResponse.json({ error: "Failed to delete ministry" }, { status: 500 });
  }
}
