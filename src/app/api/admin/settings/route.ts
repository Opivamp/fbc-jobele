import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSettingsAsync, updateSettingsAsync, ensureDbLoadedAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureDbLoadedAsync();
  const settings = await getSettingsAsync();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const updated = await updateSettingsAsync(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
