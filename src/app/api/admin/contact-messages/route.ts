import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContactMessages, updateContactMessage, deleteContactMessage } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ messages: getContactMessages() });
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    const updated = updateContactMessage(id, partial);
    return NextResponse.json({ success: true, message: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const success = deleteContactMessage(id);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
