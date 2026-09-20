import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrayerRequests, updatePrayerRequest, deletePrayerRequest } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ prayerRequests: getPrayerRequests() });
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    const updated = updatePrayerRequest(id, partial);
    return NextResponse.json({ success: true, prayerRequest: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update prayer request" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const success = deletePrayerRequest(id);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to delete prayer request" }, { status: 500 });
  }
}
