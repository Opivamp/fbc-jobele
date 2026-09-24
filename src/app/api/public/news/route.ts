import { NextResponse } from "next/server";
import { getNews } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const news = getNews(true);
    return NextResponse.json({ news });
  } catch (err) {
    console.error("Error fetching public news:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
