import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ensureDbLoadedAsync,
  getLeadershipAsync,
  addLeaderAsync,
  updateLeaderAsync,
  deleteLeaderAsync,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureDbLoadedAsync();
  const leadership = await getLeadershipAsync();
  return NextResponse.json({ leadership });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await ensureDbLoadedAsync();
    const lead = await addLeaderAsync(body);
    return NextResponse.json({ success: true, leader: lead });
  } catch (err) {
    console.error("Failed to add leader:", err);
    return NextResponse.json({ error: "Failed to add leader" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    await ensureDbLoadedAsync();
    const updated = await updateLeaderAsync(id, partial);
    return NextResponse.json({ success: true, leader: updated });
  } catch (err) {
    console.error("Failed to update leader:", err);
    return NextResponse.json({ error: "Failed to update leader" }, { status: 500 });
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
    const success = await deleteLeaderAsync(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Failed to delete leader:", err);
    return NextResponse.json({ error: "Failed to delete leader" }, { status: 500 });
  }
}
