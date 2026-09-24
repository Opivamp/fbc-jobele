"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { initialEvents } from "@/lib/seed-data";
import { Event } from "@/lib/types";

export default function EventsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<Event[]>(initialEvents);

  useEffect(() => {
    fetch("/api/public/events")
      .then((r) => r.json())
      .then((data) => {
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      })
      .catch((err) => console.error("Could not fetch latest events:", err));
  }, []);

  const now = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter((e) => e.date >= now);
  const pastEvents = events.filter((e) => e.date < now);

  const displayList = tab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Church Calendar & Gatherings
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Events & Special Programs
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Stay engaged with our upcoming revivals, conferences, community outreaches, and covenant services.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-center space-x-4 border-b border-ivory-300 pb-6">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === "upcoming"
                ? "bg-burgundy-700 text-white shadow-md border border-burgundy-900"
                : "bg-white text-obsidian-700 hover:bg-ivory-200 border border-ivory-300"
            }`}
          >
            Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === "past"
                ? "bg-burgundy-700 text-white shadow-md border border-burgundy-900"
                : "bg-white text-obsidian-700 hover:bg-ivory-200 border border-ivory-300"
            }`}
          >
            Past Events ({pastEvents.length})
          </button>
        </div>
      </div>

      {/* Event Cards */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {displayList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-ivory-300 p-8">
            <p className="font-serif text-xl font-bold text-obsidian-900 mb-1">
              No {tab} events at the moment.
            </p>
            <p className="text-xs text-obsidian-500">
              Check back soon or consult the church bulletin for the latest announcements.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayList.map((event) => {
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
              const day = eventDate.toLocaleDateString("en-US", { day: "numeric" });
              const fullDate = eventDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-ivory-300 grid grid-cols-1 lg:grid-cols-12"
                >
                  {/* Left: Image (4 cols) */}
                  <div className="lg:col-span-4 relative min-h-[240px] sm:min-h-[280px]">
                    <Image
                      src={event.coverImage || "/images/brand/building.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-burgundy-900/95 text-white text-center shadow border border-gold-400 min-w-[60px]">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gold-300">
                        {month}
                      </span>
                      <span className="block text-2xl font-serif font-black leading-none my-0.5">
                        {day}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Right: Info (8 cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-gold-700 uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-gold-600" />
                        <span>Organized by {event.organizer}</span>
                      </div>

                      <h3 className="font-serif font-bold text-2xl text-obsidian-950 leading-snug">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-obsidian-700 pt-1">
                        <span className="flex items-center">
                          <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-burgundy-700" />
                          {fullDate}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                          {event.startTime} {event.endTime ? `– ${event.endTime}` : ""}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-navy-800" />
                          {event.location}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed font-light">
                        {event.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-4">
                      {event.registrationLink ? (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <span>Register For Gathering</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                      ) : (
                        <Link
                          href="/plan-your-visit"
                          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          Plan to Attend &rarr;
                        </Link>
                      )}

                      <span className="text-xs text-obsidian-500">
                        Sanctuary of Divine Power &bull; FBC Jobele
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
