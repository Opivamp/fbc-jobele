"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Headphones, ArrowRight, Sparkles, Shield } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface HeroProps {
  settings: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory-100 via-ivory-200/50 to-ivory-100 py-12 md:py-20 lg:py-24 border-b border-burgundy-900/10">
      {/* Decorative architectural background accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-100/30 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-burgundy-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-navy-100/30 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT: Editorial Typography & Mission Statement (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-burgundy-50 border border-burgundy-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-crimson-600 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-burgundy-800 uppercase font-sans">
                {settings.tagline || "Sanctuary of Divine Power"}
              </span>
              <span className="text-burgundy-300">&bull;</span>
              <span className="text-xs font-semibold text-navy-800">
                Nigerian Baptist Convention
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-obsidian-950 tracking-tight leading-[1.08]">
              WELCOME TO{" "}
              <span className="block text-burgundy-700">
                FIRST BAPTIST
              </span>
              <span className="block text-navy-900 relative inline-block">
                CHURCH JOBELE
                <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent rounded-full" />
              </span>
            </h1>

            {/* Supporting statement as requested */}
            <p className="text-base sm:text-lg md:text-xl text-obsidian-800 font-serif italic max-w-xl leading-relaxed text-burgundy-950/90">
              &ldquo;Growing in Christ. Serving with love. Reaching our community.&rdquo;
            </p>

            <p className="text-xs sm:text-sm md:text-base text-obsidian-600 max-w-xl font-normal leading-relaxed">
              We are an established family of believers in Jobele, Oyo State, rooted in the sound doctrine of God&apos;s Word, vibrant worship, and heartfelt fellowship for all generations.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/plan-your-visit"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 via-burgundy-800 to-burgundy-900 hover:from-burgundy-800 hover:to-burgundy-950 text-white font-semibold text-sm shadow-card hover:shadow-elevated transition-all duration-200 group border border-burgundy-900/40 btn-shimmer-sweep"
              >
                <Calendar className="w-4 h-4 mr-2 text-gold-300 group-hover:rotate-12 transition-transform" />
                Plan Your Visit
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/sermons"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-ivory-50 hover:bg-white text-navy-900 font-semibold text-sm border-2 border-navy-800/20 hover:border-navy-800/40 shadow-sm transition-all duration-200 group"
              >
                <Headphones className="w-4 h-4 mr-2 text-burgundy-700 group-hover:scale-110 transition-transform" />
                Listen to Sermons
              </Link>
            </div>

            {/* Trust signals / Community tags */}
            <div className="pt-4 border-t border-burgundy-900/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-obsidian-600 font-medium">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                Biblical Teaching
              </span>
              <span className="flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1.5 text-burgundy-700" />
                Loving Family Environment
              </span>
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sanctuary-600" />
                Generational Discipleship
              </span>
            </div>
          </div>

          {/* RIGHT: Editorial Crop with Architectural Gold/Burgundy Geometry (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {/* Architectural decorative backing frames */}
            <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl bg-gradient-to-tr from-gold-500/20 to-burgundy-700/10 transform rotate-1 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl border-2 border-gold-500/30 transform -rotate-1 pointer-events-none" />

            {/* Main Featured Church Photo Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border-4 border-white bg-white group">
              <div className="relative h-80 sm:h-96 md:h-[420px] w-full">
                <Image
                  src="/images/brand/building.jpg"
                  alt="First Baptist Church Jobele Sanctuary of Divine Power"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-black/10" />

                {/* Floating Badge on the image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-ivory-100/95 backdrop-blur-md border border-gold-500/30 shadow-card">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500 flex-shrink-0 shadow-sm">
                      <Image
                        src="/images/brand/logo.jpg"
                        alt="FBC Jobele Seal"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-sm text-burgundy-900 leading-tight">
                        Sanctuary of Divine Power
                      </p>
                      <p className="text-xs text-navy-800 font-medium mt-0.5">
                        P. O. Box 184, Jobele, Oyo State
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
