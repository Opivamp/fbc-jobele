import { MetadataRoute } from "next";
import { getNews, getEvents, getSermons } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fbcjobele.org";
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/leadership",
    "/ministries",
    "/sermons",
    "/events",
    "/gallery",
    "/news",
    "/plan-your-visit",
    "/give",
    "/prayer",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const news = getNews(true);
  const newsRoutes = news.map((post) => ({
    url: `${baseUrl}/news/${post.slug || post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}
