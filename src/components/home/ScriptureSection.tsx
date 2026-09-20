"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface ScriptureSectionProps {
  settings: SiteSettings;
}

export default function ScriptureSection({ settings }: ScriptureSectionProps) {
  const scripture = settings.scriptureHighlight || {
    verse: "Your word is a lamp to my feet and a light to my path.",
    reference: "Psalm 119:105",
    theme: "Standing Firm on God's Unshakable Word",
  };

  return (
    <section className="py-20 md:py-24 bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-navy-950 text-white relative overflow-hidden border-y-2 border-gold-500/30">
      {/* Background seal watermark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] opacity-5 pointer-events-none">
        <Image
          src="/images/brand/logo.jpg"
          alt="Watermark Logo"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs font-bold uppercase tracking-widest font-sans">
            {scripture.theme || "Spiritual Meditation"}
          </span>
        </div>

        {/* Large Classical Serif Scripture Quote */}
        <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight text-ivory-100 italic drop-shadow-sm">
          &ldquo;{scripture.verse}&rdquo;
        </blockquote>

        <div className="pt-2 flex flex-col items-center">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-3" />
          <cite className="not-italic text-sm sm:text-base font-serif font-bold text-gold-400 tracking-wider uppercase">
            {scripture.reference}
          </cite>
          <span className="text-xs text-ivory-300/80 mt-1 font-sans">
            First Baptist Church Jobele &bull; Sanctuary of Divine Power
          </span>
        </div>
      </div>
    </section>
  );
}
