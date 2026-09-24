import { NextResponse } from "next/server";
import { getEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = getEvents("all");
    return NextResponse.json({ events });
  } catch (err) {
    console.error("Error fetching public events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
