"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles, Calendar } from "lucide-react";
import { SiteSettings } from "@/lib/types";
import WorshipCountdown from "./WorshipCountdown";

interface WorshipStripProps {
  settings: SiteSettings;
}

export default function WorshipStrip({ settings }: WorshipStripProps) {
  const times = settings.worshipTimes || [];
  const sundayWorship = times.find(
    (t) =>
      t.title.toLowerCase().includes("worship") ||
      t.title.toLowerCase().includes("celebration")
  ) || {
    title: "Sunday Celebration",
    time: "9:30 AM – 12:00 PM",
    day: "Sunday",
  };
  const sundaySchool = times.find((t) =>
    t.title.toLowerCase().includes("school")
  ) || {
    title: "Sunday School",
    time: "8:30 AM – 9:30 AM",
    day: "Sunday",
  };
  const midweek = times.find(
    (t) =>
      t.day.toLowerCase().includes("wednesday") ||
      t.title.toLowerCase().includes("midweek") ||
      t.title.toLowerCase().includes("bible")
  ) || {
    title: "Midweek Bible Study",
    time: "Wednesday, 5:30 PM",
    day: "Wednesday",
  };

  return (
    <div className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* 1. Main Worship Schedule Strip */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-950 to-navy-950 text-white rounded-2xl shadow-elevated border-2 border-gold-500/40 p-5 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Header Label (3 Cols) */}
          <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-gold-500/30 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Join Us In Person</span>
            </div>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-ivory-100 tracking-tight">
              WORSHIP WITH US
            </h3>
            <p className="text-xs text-ivory-300 font-light mt-0.5">
              Open doors. Loving hearts.
            </p>
          </div>

          {/* Schedule Slots (6 Cols) */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Slot 1: Sunday Worship */}
            <div className="space-y-0.5 p-2 sm:p-0 rounded-lg bg-white/5 sm:bg-transparent border sm:border-0 border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 block">
                {sundayWorship.day} Worship
              </span>
              <p className="text-sm font-bold text-ivory-100 font-sans">
                {sundayWorship.time}
              </p>
              <p className="text-[11px] text-ivory-300 line-clamp-1">
                Celebration & Word
              </p>
            </div>

            {/* Slot 2: Bible Study */}
            <div className="space-y-0.5 p-2 sm:p-0 rounded-lg bg-white/5 sm:bg-transparent border sm:border-0 border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 block">
                Bible Study
              </span>
              <p className="text-sm font-bold text-ivory-100 font-sans">
                {midweek.time}
              </p>
              <p className="text-[11px] text-ivory-300 line-clamp-1">
                Spiritual growth & prayer
              </p>
            </div>

            {/* Slot 3: Sunday School */}
            <div className="space-y-0.5 p-2 sm:p-0 rounded-lg bg-white/5 sm:bg-transparent border sm:border-0 border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 block">
                Sunday School
              </span>
              <p className="text-sm font-bold text-ivory-100 font-sans">
                {sundaySchool.time}
              </p>
              <p className="text-[11px] text-ivory-300 line-clamp-1">
                Interactive classes for all
              </p>
            </div>
          </div>

          {/* CTA Link (3 Cols) */}
          <div className="md:col-span-3 flex justify-start md:justify-end">
            <Link
              href="/plan-your-visit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-obsidian-950 font-bold text-sm shadow-md transition-all group btn-shimmer-sweep"
            >
              <span>Plan Your Visit</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Integrated Live Countdown Module */}
        <div className="mt-5 pt-5 border-t border-gold-500/20">
          <WorshipCountdown />
        </div>
      </div>
    </div>
  );
}
