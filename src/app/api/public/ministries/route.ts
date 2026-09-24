import { NextResponse } from "next/server";
import { ensureDbLoadedAsync, getMinistriesAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbLoadedAsync();
    const ministries = await getMinistriesAsync();
    return NextResponse.json({ ministries });
  } catch (err) {
    console.error("Error fetching public ministries:", err);
    return NextResponse.json({ error: "Failed to fetch ministries" }, { status: 500 });
  }
}
