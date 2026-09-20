"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Users, Sparkles } from "lucide-react";
import { Ministry } from "@/lib/types";

interface MinistriesGridProps {
  ministries: Ministry[];
}

export default function MinistriesGrid({ ministries }: MinistriesGridProps) {
  // Take up to 6 key ministries for homepage presentation
  const displayMinistries = ministries.slice(0, 6);

  return (
    <section className="py-20 bg-ivory-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block mb-1 font-sans flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Community & Fellowship
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              Ministries for Every Member
            </h2>
            <p className="text-sm text-obsidian-600 mt-1 max-w-xl">
              Discover a circle of spiritual growth, support, and active service tailored to your stage of life.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/ministries"
              className="inline-flex items-center text-sm font-bold text-burgundy-700 hover:text-burgundy-900 group"
            >
              <span>Explore All Ministries</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dynamic Grid with Varied Visual Weights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMinistries.map((min, index) => {
            // First item gets a prominent card style
            const isFeaturedWeight = index === 0 || index === 3;

            return (
              <div
                key={min.id}
                className={`group rounded-2xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between ${
                  isFeaturedWeight
                    ? "border-gold-500/40 shadow-card hover:shadow-elevated lg:col-span-2 md:col-span-2"
                    : "border-ivory-300 shadow-subtle hover:shadow-card"
                }`}
              >
                {/* Image Container */}
                <div
                  className={`relative overflow-hidden ${
                    isFeaturedWeight ? "h-64 sm:h-72" : "h-48 sm:h-52"
                  }`}
                >
                  <Image
                    src={min.coverImage || "/images/brand/building.jpg"}
                    alt={min.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full bg-ivory-100/95 backdrop-blur-sm text-burgundy-800 font-bold text-[11px] tracking-wider uppercase border border-gold-400/50 shadow-xs">
                      {min.category || "Ministry"}
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif font-bold text-xl sm:text-2xl leading-snug drop-shadow-sm">
                      {min.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-sm text-obsidian-700 line-clamp-2 leading-relaxed">
                      {min.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-ivory-200 space-y-1.5 text-xs text-obsidian-600">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-burgundy-700 flex-shrink-0" />
                        <span className="font-medium text-obsidian-800">
                          {min.meetingTime}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-navy-700 flex-shrink-0" />
                        <span>Leader: {min.leader}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/ministries#${min.slug}`}
                      className="inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Learn More & Join</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
