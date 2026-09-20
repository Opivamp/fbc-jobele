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
  getSettings,
  getFeaturedEvent,
  getMinistries,
  getLatestSermon,
  getFeaturedGalleryImages,
  getNews,
} from "@/lib/db";

// Dynamic rendering so newly uploaded photos and events reflect instantly without rebuilding
export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = getSettings();
  const featuredEvent = getFeaturedEvent();
  const ministries = getMinistries();
  const latestSermon = getLatestSermon();
  const galleryImages = getFeaturedGalleryImages(6);
  const news = getNews(true).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* 1. Immersive Editorial Hero */}
      <Hero settings={settings} />

      {/* 2. Compact Worship Times Information Strip */}
      <WorshipStrip settings={settings} />

      {/* 3. A Church Family for Every Season */}
      <StorySection />

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

      {/* 11. Plan Your Visit CTA */}
      <VisitorCtaSection settings={settings} />
    </div>
  );
}
