"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Mail, Sparkles, ArrowRight, Heart } from "lucide-react";
import { initialMinistries } from "@/lib/seed-data";
import { Ministry } from "@/lib/types";

export default function MinistriesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [ministries, setMinistries] = useState<Ministry[]>(initialMinistries);

  useEffect(() => {
    fetch("/api/public/ministries")
      .then((r) => r.json())
      .then((data) => {
        if (data.ministries && Array.isArray(data.ministries)) {
          setMinistries(data.ministries);
        }
      })
      .catch((err) => console.error("Could not fetch latest ministries:", err));
  }, []);

  const categories = [
    { label: "All Ministries", value: "all" },
    { label: "Worship & Arts", value: "Worship & Arts" },
    { label: "Generations & Youth", value: "Generations" },
    { label: "Adult Fellowships", value: "Fellowships" },
    { label: "Missions & Outreach", value: "Outreach & Missions" },
    { label: "Spiritual Life", value: "Spiritual Life" },
  ];

  const filtered = activeCategory === "all"
    ? ministries
    : ministries.filter((m) => m.category === activeCategory);

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Find Your Spiritual Family
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Ministries & Fellowships
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Every member has a calling. Explore our ministries designed to foster biblical discipleship, community impact, and Christlike fellowship.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-ivory-300 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-burgundy-700 text-white shadow-md border border-burgundy-900"
                  : "bg-white text-obsidian-700 hover:bg-ivory-200 border border-ivory-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ministries Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((min) => (
            <div
              key={min.id}
              id={min.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-ivory-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={min.coverImage || "/images/brand/building.jpg"}
                    alt={min.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400/30">
                      {min.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif font-bold text-xl leading-snug drop-shadow-sm">
                      {min.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy-700 mb-1">
                      Our Purpose
                    </h4>
                    <p className="text-xs text-obsidian-700 leading-relaxed font-light">
                      {min.purpose}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
                    {min.description}
                  </p>

                  <div className="pt-3 border-t border-ivory-200 space-y-2 text-xs text-obsidian-700">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2 text-burgundy-700 flex-shrink-0" />
                      <span className="font-semibold">{min.meetingTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-2 text-navy-800 flex-shrink-0" />
                      <span>Coordinator: {min.leader}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2 text-gold-600 flex-shrink-0" />
                      <span>{min.contact}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-2 border-t border-ivory-200 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900 group-hover:translate-x-1 transition-transform"
                >
                  <Heart className="w-3.5 h-3.5 mr-1.5 fill-burgundy-700" />
                  <span>Get Involved With This Ministry</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
