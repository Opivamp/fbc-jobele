"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Quote, Sparkles, Heart, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  context: string;
  category: "Faith & Healing" | "Family & Youth" | "Discipleship" | "Community";
  year: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    author: "Deaconess Morounranti Alabi",
    role: "Women's Missionary Union Member",
    category: "Faith & Healing",
    quote:
      "When my family went through an arduous health trial last year, the Pastoral team and Church Family did not just pray from afar—they visited, held hands, and stood on God's covenant with us. God granted miraculous restoration!",
    context: "Member for over 18 years in Jobele",
    year: "2025 Testimony",
  },
  {
    id: "test-2",
    author: "Bro. Emmanuel Ogundele",
    role: "Baptist Youth Fellowship Leader",
    category: "Family & Youth",
    quote:
      "Growing up in FBC Jobele shaped my character and career. The sound biblical teachings, youth retreats, and mentorship from mature leaders gave me unshakeable spiritual grounding in university.",
    context: "BYF Alumnus & Software Engineer",
    year: "Youth Ministry",
  },
  {
    id: "test-3",
    author: "Pa Gabriel & Mama Comfort Adeleke",
    role: "Golden Age Fellowship",
    category: "Discipleship",
    quote:
      "First Baptist Church Jobele has been our spiritual sanctuary through seasons of joy and trials. The word of God is taught with undiluted purity and the love within this congregation is genuine and enduring.",
    context: "Worshipping together for 32 years",
    year: "Golden Heritage",
  },
  {
    id: "test-4",
    author: "Sister Grace Adebisi",
    role: "Kingdom Kids Teacher",
    category: "Community",
    quote:
      "Teaching Sunday School to our young children is the joy of my week. Watching them recite Bible memory verses and grow in reverence for Jesus fills my heart with immense gratitude for this church family.",
    context: "Children's Ministry Worker",
    year: "Kingdom Kids",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Faith & Healing", "Family & Youth", "Discipleship", "Community"];

  const filtered = selectedCategory === "All"
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.category === selectedCategory);

  const current = filtered[activeIndex % filtered.length] || TESTIMONIALS[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-ivory-100 via-ivory-200 to-ivory-100 relative overflow-hidden border-t border-b border-gold-500/20">
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-burgundy-100/30 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-burgundy-50 border border-burgundy-200/80 text-burgundy-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Living Testimonies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-obsidian-950 tracking-tight">
            Voices of Our Church Family
          </h2>
          <p className="text-sm sm:text-base text-obsidian-600 mt-2 font-normal">
            Real stories of God&apos;s faithfulness, transformed lives, and divine power in Jobele.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-burgundy-800 text-white shadow-sm"
                    : "bg-white text-obsidian-700 hover:bg-gold-100 border border-ivory-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-elevated border-2 border-gold-500/40 transition-all duration-300">
            {/* Top Quote Icon */}
            <div className="flex items-center justify-between border-b border-ivory-300 pb-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-700">
                  <Quote className="w-6 h-6 rotate-180 fill-burgundy-700/20" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gold-600 uppercase tracking-widest block font-sans">
                    {current.category}
                  </span>
                  <span className="text-xs text-obsidian-500 font-medium">
                    {current.year}
                  </span>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous testimony"
                  className="p-2 rounded-full border border-ivory-300 hover:border-burgundy-700 hover:bg-burgundy-50 text-obsidian-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next testimony"
                  className="p-2 rounded-full border border-ivory-300 hover:border-burgundy-700 hover:bg-burgundy-50 text-obsidian-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-xl lg:text-2xl font-serif text-obsidian-900 leading-relaxed italic text-center sm:text-left">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Author Footer */}
            <div className="mt-8 pt-6 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-burgundy-800 to-navy-900 text-gold-300 flex items-center justify-center font-serif font-bold text-lg border-2 border-gold-400 shadow-sm">
                  {current.author.charAt(0)}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-serif font-bold text-base text-obsidian-950 flex items-center justify-center sm:justify-start">
                    <span>{current.author}</span>
                    <CheckCircle className="w-4 h-4 ml-1.5 text-sanctuary-600" />
                  </h3>
                  <p className="text-xs text-burgundy-800 font-medium">
                    {current.role} &bull; <span className="text-obsidian-500">{current.context}</span>
                  </p>
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex items-center space-x-1.5">
                {filtered.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeIndex % filtered.length
                        ? "w-6 bg-gold-500"
                        : "w-2 bg-ivory-300 hover:bg-gold-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
