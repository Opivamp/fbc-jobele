import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSermons, addSermon, updateSermon, deleteSermon } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ sermons: getSermons() });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const sermon = addSermon(body);
    return NextResponse.json({ success: true, sermon });
  } catch {
    return NextResponse.json({ error: "Failed to create sermon" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    const updated = updateSermon(id, partial);
    return NextResponse.json({ success: true, sermon: updated });
  } catch {
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
    const success = deleteSermon(id);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to delete sermon" }, { status: 500 });
  }
}
