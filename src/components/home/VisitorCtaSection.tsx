"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Heart } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface VisitorCtaSectionProps {
  settings: SiteSettings;
}

export default function VisitorCtaSection({ settings }: VisitorCtaSectionProps) {
  return (
    <section className="py-20 bg-ivory-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-burgundy-900 via-burgundy-950 to-navy-950 text-white shadow-elevated border-2 border-gold-500/40 p-8 sm:p-12 lg:p-16">
          {/* Subtle watermark */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 opacity-10 pointer-events-none">
            <Image
              src="/images/brand/logo.jpg"
              alt="Watermark Logo"
              fill
              className="object-contain"
            />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
              <Heart className="w-3.5 h-3.5 fill-gold-400" />
              <span className="text-xs font-bold uppercase tracking-wider font-sans">
                A Warm Welcome Awaits You
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight text-ivory-100">
              You&apos;re Welcome at First Baptist Church Jobele
            </h2>

            <p className="text-base sm:text-lg text-ivory-200/90 leading-relaxed font-light">
              Visiting a church for the first time should be warm, refreshing, and inspiring. We have friendly ushers ready to guide you, safe programs for your children, and a family that will receive you with open arms.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-gold-300">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gold-400" />
                Sundays @ 8:30 AM & 9:30 AM
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gold-400" />
                {settings.address || "P. O. Box 184, Jobele, Oyo State"}
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/plan-your-visit"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-sm shadow-md transition-all group"
              >
                <span>Plan Your Visit Guide</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <span>Contact Pastoral Office</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
