import { NextResponse } from "next/server";
import { ensureDbLoadedAsync, getEventsAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbLoadedAsync();
    const events = await getEventsAsync("all");
    return NextResponse.json({ events });
  } catch (err) {
    console.error("Error fetching public events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
