import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMinistries, addMinistry, updateMinistry, deleteMinistry } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ministries: getMinistries() });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const min = addMinistry(body);
    return NextResponse.json({ success: true, ministry: min });
  } catch {
    return NextResponse.json({ error: "Failed to create ministry" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    const updated = updateMinistry(id, partial);
    return NextResponse.json({ success: true, ministry: updated });
  } catch {
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
    const success = deleteMinistry(id);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to delete ministry" }, { status: 500 });
  }
}
