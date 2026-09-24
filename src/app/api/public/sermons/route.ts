import { NextResponse } from "next/server";
import { getSermons } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sermons = getSermons();
    return NextResponse.json({ sermons });
  } catch (err) {
    console.error("Error fetching public sermons:", err);
    return NextResponse.json({ error: "Failed to fetch sermons" }, { status: 500 });
  }
}
