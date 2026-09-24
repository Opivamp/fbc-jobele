import { NextResponse } from "next/server";
import { getLeadership } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leadership = getLeadership();
    return NextResponse.json({ leadership });
  } catch (err) {
    console.error("Error fetching public leadership:", err);
    return NextResponse.json({ error: "Failed to fetch leadership" }, { status: 500 });
  }
}
