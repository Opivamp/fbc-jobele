"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Users } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface StorySectionProps {
  settings?: SiteSettings;
}

export default function StorySection({ settings }: StorySectionProps) {
  const churchName = settings?.churchName || "First Baptist Church Jobele";
  const tagline = settings?.tagline || "Sanctuary of Divine Power";
  const affiliation = settings?.affiliation || "Nigerian Baptist Convention";

  return (
    <section className="py-20 md:py-28 bg-ivory-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Image Side (6 Cols) */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative">
              {/* Decorative architectural border frame */}
              <div className="absolute -top-6 -left-6 w-48 h-48 border-t-4 border-l-4 border-gold-500/40 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border-b-4 border-r-4 border-burgundy-700/30 pointer-events-none" />

              {/* Main Image */}
              <div className="relative h-[400px] sm:h-[480px] w-full rounded-xl overflow-hidden shadow-elevated border-2 border-ivory-300">
                <Image
                  src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80"
                  alt={`Worship Family at ${churchName}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/70 via-transparent to-transparent" />

                {/* Overlaid Editorial Note */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-lg bg-ivory-100/95 backdrop-blur-md border border-gold-500/30 shadow-md">
                  <p className="font-serif italic text-burgundy-950 text-sm md:text-base leading-snug">
                    &ldquo;A spiritual sanctuary where strangers become family and faith becomes active through love.&rdquo;
                  </p>
                  <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider mt-2">
                    {churchName} &bull; Oyo State
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Text Side (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div>
              <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block mb-2 font-sans">
                Our Heritage & Heartbeat
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-obsidian-950 tracking-tight leading-tight">
                A Church Family for Every Season
              </h2>
            </div>

            <p className="text-base text-obsidian-700 leading-relaxed">
              At <strong className="text-burgundy-800 font-semibold">{churchName}</strong> ({tagline}), we believe church is more than a weekly service—it is a spiritual home. Deeply anchored in our heritage under the <strong className="text-navy-900 font-semibold">{affiliation}</strong>, we gather together to seek the face of God, be transformed by the scriptures, and encourage one another across life&apos;s changing seasons.
            </p>

            <p className="text-sm text-obsidian-600 leading-relaxed">
              Whether you are an infant in the nursery, a searching youth, an industrious parent, or a venerable elder, there is a place for you to belong, grow in discipleship, and serve our surrounding town with sacrificial love.
            </p>

            {/* Three Pillar Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-ivory-200/70 border border-ivory-300">
                <BookOpen className="w-5 h-5 text-burgundy-700 mb-1.5" />
                <h4 className="text-xs font-bold text-obsidian-900 uppercase tracking-wide">
                  Sound Biblical Truth
                </h4>
                <p className="text-[11px] text-obsidian-600 mt-0.5">
                  Uncompromising teaching of the Holy Scriptures.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-ivory-200/70 border border-ivory-300">
                <Heart className="w-5 h-5 text-burgundy-700 mb-1.5" />
                <h4 className="text-xs font-bold text-obsidian-900 uppercase tracking-wide">
                  Loving Fellowship
                </h4>
                <p className="text-[11px] text-obsidian-600 mt-0.5">
                  A caring community where everyone belongs.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-ivory-200/70 border border-ivory-300">
                <Users className="w-5 h-5 text-burgundy-700 mb-1.5" />
                <h4 className="text-xs font-bold text-obsidian-900 uppercase tracking-wide">
                  Gospel Impact
                </h4>
                <p className="text-[11px] text-obsidian-600 mt-0.5">
                  Reaching Jobele and supporting missions.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-semibold text-burgundy-700 hover:text-burgundy-900 group"
              >
                <span>Read our full history & Baptist beliefs</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
