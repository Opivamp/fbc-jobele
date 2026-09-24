import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("Error fetching public settings:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
