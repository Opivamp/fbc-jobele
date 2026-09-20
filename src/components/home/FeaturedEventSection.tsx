"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Event } from "@/lib/types";

interface FeaturedEventSectionProps {
  event: Event | null;
}

export default function FeaturedEventSection({ event }: FeaturedEventSectionProps) {
  if (!event) return null;

  // Format date nicely
  const eventDate = new Date(event.date);
  const formattedMonth = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const formattedDay = eventDate.toLocaleDateString("en-US", { day: "numeric" });
  const formattedFull = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-20 bg-ivory-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-100 border border-gold-300/60 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-gold-900 font-sans">
              Spotlight Church Gathering
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
            What&apos;s Happening at FBC?
          </h2>
          <p className="text-sm text-obsidian-600 mt-2">
            Join our church family for moments of spiritual renewal, revival, and community engagement.
          </p>
        </div>

        {/* Large Editorial Card */}
        <div className="bg-white rounded-2xl shadow-elevated border-2 border-gold-500/30 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Event Flyer / Image (6 Cols) */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full">
              <Image
                src={event.coverImage || "/images/brand/building.jpg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Prominent Date Stamp Ribbon */}
              <div className="absolute top-6 left-6 p-3 rounded-xl bg-burgundy-900/95 text-white text-center shadow-lg border border-gold-400 backdrop-blur-sm min-w-[70px]">
                <span className="block text-xs font-bold uppercase tracking-widest text-gold-300">
                  {formattedMonth}
                </span>
                <span className="block text-2xl sm:text-3xl font-serif font-black leading-none my-0.5">
                  {formattedDay}
                </span>
                <span className="block text-[10px] text-ivory-200">
                  2026
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-crimson-600 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                  {event.category || "Featured Event"}
                </span>
                <p className="text-xs text-ivory-200">
                  Organized by {event.organizer || "FBC Jobele Planning Committee"}
                </p>
              </div>
            </div>

            {/* Event Details (6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs font-semibold text-burgundy-700 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Official Church Event</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950 tracking-tight leading-snug">
                  {event.title}
                </h3>

                {/* Metadata List */}
                <div className="space-y-2.5 text-sm text-obsidian-700 pt-2 border-y border-ivory-300 py-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-burgundy-700 flex-shrink-0" />
                    <span className="font-semibold text-obsidian-900">
                      {formattedFull}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span>
                      {event.startTime} {event.endTime ? `– ${event.endTime}` : ""}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
                    <span className="text-obsidian-800 font-medium">
                      {event.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-obsidian-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-ivory-300">
                {event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-sm shadow-md transition-colors"
                  >
                    Register / RSVP Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                ) : (
                  <Link
                    href="/plan-your-visit"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-sm shadow-md transition-colors"
                  >
                    Plan to Attend
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                )}

                <Link
                  href="/events"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-obsidian-900 font-semibold text-sm transition-colors"
                >
                  All Church Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
