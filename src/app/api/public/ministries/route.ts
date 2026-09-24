import { NextResponse } from "next/server";
import { getMinistries } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ministries = getMinistries();
    return NextResponse.json({ ministries });
  } catch (err) {
    console.error("Error fetching public ministries:", err);
    return NextResponse.json({ error: "Failed to fetch ministries" }, { status: 500 });
  }
}
