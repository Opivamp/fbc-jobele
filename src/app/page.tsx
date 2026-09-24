import React from "react";
import Hero from "@/components/home/Hero";
import WorshipStrip from "@/components/home/WorshipStrip";
import StorySection from "@/components/home/StorySection";
import WeeklyTimeline from "@/components/home/WeeklyTimeline";
import FeaturedEventSection from "@/components/home/FeaturedEventSection";
import MinistriesGrid from "@/components/home/MinistriesGrid";
import SermonSpotlight from "@/components/home/SermonSpotlight";
import ScriptureSection from "@/components/home/ScriptureSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import VisitorCtaSection from "@/components/home/VisitorCtaSection";
import {
  ensureDbLoadedAsync,
  getSettingsAsync,
  getFeaturedEventAsync,
  getMinistriesAsync,
  getLatestSermonAsync,
  getFeaturedGalleryImagesAsync,
  getNewsAsync,
} from "@/lib/db";

// Dynamic rendering so newly uploaded photos and events reflect instantly without rebuilding
export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureDbLoadedAsync();
  const settings = await getSettingsAsync();
  const featuredEvent = await getFeaturedEventAsync();
  const ministries = await getMinistriesAsync();
  const latestSermon = await getLatestSermonAsync();
  const galleryImages = await getFeaturedGalleryImagesAsync(6);
  const newsList = await getNewsAsync(true);
  const news = newsList.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* 1. Immersive Editorial Hero */}
      <Hero settings={settings} />

      {/* 2. Compact Worship Times Information Strip */}
      <WorshipStrip settings={settings} />

      {/* 3. A Church Family for Every Season */}
      <StorySection settings={settings} />

      {/* 4. This Week at FBC Jobele */}
      <WeeklyTimeline settings={settings} />

      {/* 5. Featured Event Section */}
      <FeaturedEventSection event={featuredEvent} />

      {/* 6. Ministries Grid */}
      <MinistriesGrid ministries={ministries} />

      {/* 7. Latest Sermon Spotlight */}
      <SermonSpotlight sermon={latestSermon} />

      {/* 8. Scripture / Spiritual Reflection */}
      <ScriptureSection settings={settings} />

      {/* 9. Dynamic Church Life / Gallery Preview */}
      <GalleryPreview images={galleryImages} />

      {/* 10. Living Testimonies / Community Voices */}
      <TestimonialsSection />

      {/* 11. News & Announcements */}
      <LatestNewsSection news={news} />

      {/* 12. Plan Your Visit CTA */}
      <VisitorCtaSection settings={settings} />
    </div>
  );
}
