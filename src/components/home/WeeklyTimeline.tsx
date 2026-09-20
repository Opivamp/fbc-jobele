"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface WeeklyTimelineProps {
  settings: SiteSettings;
}

export default function WeeklyTimeline({ settings }: WeeklyTimelineProps) {
  const worshipTimes = settings.worshipTimes || [];

  const weeklySchedule = [
    {
      day: "SUNDAY",
      badge: "Lord's Day",
      title: "Sunday School & Celebration Worship",
      time: "8:30 AM – 12:00 PM",
      location: "Main Sanctuary, FBC Jobele",
      description:
        "Systematic biblical exposition in Sunday School followed by spirited congregational praise, prayer, and sermon.",
      highlight: true,
    },
    {
      day: "WEDNESDAY",
      badge: "Midweek Spiritual Food",
      title: "Interactive Bible Study & Intercession",
      time: "5:30 PM – 7:00 PM",
      location: "Sanctuary / Online Stream",
      description:
        "Verse-by-verse scriptural discipleship, spiritual Q&A, and targeted community prayer requests.",
      highlight: false,
    },
    {
      day: "FRIDAY",
      badge: "Night of Power",
      title: "Covenant Prayer Vigil & Fellowship",
      time: "10:00 PM – 4:00 AM (Monthly)",
      location: "Main Sanctuary",
      description:
        "Prophetic intercession, breaking spiritual bondages, seeking divine breakthrough, and sacrificial praise.",
      highlight: false,
    },
    {
      day: "SATURDAY",
      badge: "Ministries & Youth",
      title: "Youth Ignite & Sanctuary Choir Rehearsals",
      time: "4:00 PM – 7:00 PM",
      location: "Youth Chapel & Choir Gallery",
      description:
        "Preparation of heart and harmony for Sunday celebration, youth mentorship, and creative arts.",
      highlight: false,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-ivory-100 to-ivory-200 border-y border-burgundy-900/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold-600 uppercase block mb-1 font-sans flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Weekly Rhythm of Worship
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              This Week at FBC Jobele
            </h2>
            <p className="text-sm text-obsidian-600 mt-1 max-w-xl">
              Consistent gatherings designed to anchor your week in the presence and power of God.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/events"
              className="inline-flex items-center text-sm font-bold text-burgundy-700 hover:text-burgundy-900 group"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Horizontal Timeline Strip */}
        <div className="relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gold-400/30 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {weeklySchedule.map((item, idx) => (
              <div
                key={item.day}
                className={`flex flex-col justify-between p-6 rounded-xl transition-all duration-300 ${
                  item.highlight
                    ? "bg-gradient-to-b from-burgundy-900 to-burgundy-950 text-white shadow-elevated border-2 border-gold-400 transform -translate-y-1"
                    : "bg-white text-obsidian-900 shadow-subtle hover:shadow-card border border-ivory-300"
                }`}
              >
                <div>
                  {/* Top Badge and Day */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-black tracking-widest uppercase font-serif ${
                        item.highlight ? "text-gold-300" : "text-burgundy-700"
                      }`}
                    >
                      {item.day}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.highlight
                          ? "bg-gold-500/20 text-gold-300 border border-gold-400/30"
                          : "bg-ivory-200 text-obsidian-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-serif font-bold text-base sm:text-lg mb-2 leading-snug ${
                      item.highlight ? "text-white" : "text-obsidian-950"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Time & Location */}
                  <div
                    className={`space-y-1 text-xs mb-3 font-medium ${
                      item.highlight ? "text-ivory-200" : "text-obsidian-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <Clock
                        className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${
                          item.highlight ? "text-gold-400" : "text-burgundy-700"
                        }`}
                      />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin
                        className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${
                          item.highlight ? "text-gold-400" : "text-navy-700"
                        }`}
                      />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs leading-relaxed ${
                      item.highlight ? "text-ivory-300/90" : "text-obsidian-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-current/10">
                  <Link
                    href="/plan-your-visit"
                    className={`inline-flex items-center text-xs font-bold ${
                      item.highlight
                        ? "text-gold-300 hover:text-white"
                        : "text-burgundy-700 hover:text-burgundy-900"
                    }`}
                  >
                    Attend This Gathering &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
