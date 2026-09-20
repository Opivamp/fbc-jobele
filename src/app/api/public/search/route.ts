import { NextRequest, NextResponse } from "next/server";
import { getSermons, getEvents, getNews, getMinistries } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results: Array<{
    id: string;
    title: string;
    subtitle: string;
    type: "sermon" | "event" | "news" | "ministry" | "page";
    url: string;
  }> = [];

  // Match static pages
  const staticPages = [
    { title: "About FBC Jobele", subtitle: "Our story, mission, and Baptist beliefs", url: "/about", keywords: "about mission vision story history believe beliefs" },
    { title: "Pastoral Leadership", subtitle: "Meet our pastors, deacons, and leaders", url: "/leadership", keywords: "pastor leadership ministers deacons elder" },
    { title: "Plan Your Visit", subtitle: "Visitor guide, directions, service times", url: "/plan-your-visit", keywords: "visit visitor directions time dress welcome parking kids" },
    { title: "Giving & Generosity", subtitle: "Bank transfer details, tithes, offerings", url: "/give", keywords: "give giving tithe tithes offering transfer account donate bank" },
    { title: "Prayer Requests", subtitle: "Confidential pastoral prayer desk", url: "/prayer", keywords: "prayer intercession pray request need healing" },
    { title: "Contact Us", subtitle: "Church address, phone, email, office hours", url: "/contact", keywords: "contact address phone email location office" },
  ];

  for (const page of staticPages) {
    if (page.title.toLowerCase().includes(q) || page.keywords.includes(q)) {
      results.push({
        id: page.url,
        title: page.title,
        subtitle: page.subtitle,
        type: "page",
        url: page.url,
      });
    }
  }

  // Match sermons
  const sermons = getSermons(q);
  sermons.slice(0, 4).forEach((s) => {
    results.push({
      id: s.id,
      title: s.title,
      subtitle: `${s.speaker} • ${s.scripture}`,
      type: "sermon",
      url: `/sermons`,
    });
  });

  // Match events
  const events = getEvents("all", q);
  events.slice(0, 4).forEach((e) => {
    results.push({
      id: e.id,
      title: e.title,
      subtitle: `${e.date} at ${e.location}`,
      type: "event",
      url: `/events`,
    });
  });

  // Match news
  const news = getNews(true, q);
  news.slice(0, 4).forEach((n) => {
    results.push({
      id: n.id,
      title: n.title,
      subtitle: `${n.category} • ${n.excerpt.substring(0, 60)}...`,
      type: "news",
      url: `/news/${n.slug || n.id}`,
    });
  });

  // Match ministries
  const ministries = getMinistries();
  ministries
    .filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((m) => {
      results.push({
        id: m.id,
        title: m.name,
        subtitle: m.meetingTime,
        type: "ministry",
        url: `/ministries#${m.slug}`,
      });
    });

  return NextResponse.json({ results });
}
