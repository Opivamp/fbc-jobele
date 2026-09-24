"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Headphones,
  Search,
  Calendar,
  BookOpen,
  User,
  Volume2,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { initialSermons } from "@/lib/seed-data";
import { Sermon } from "@/lib/types";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons);
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [activeVideoSermon, setActiveVideoSermon] = useState<Sermon | null>(null);
  const [activeNotesSermon, setActiveNotesSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    fetch("/api/public/sermons")
      .then((r) => r.json())
      .then((data) => {
        if (data.sermons && Array.isArray(data.sermons)) {
          setSermons(data.sermons);
        }
      })
      .catch((err) => console.error("Could not fetch latest sermons:", err));
  }, []);

  // Extract unique series
  const seriesList = ["all", ...Array.from(new Set(sermons.map((s) => s.series)))];

  const filteredSermons = sermons.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speaker.toLowerCase().includes(search.toLowerCase()) ||
      s.scripture.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());

    const matchesSeries =
      selectedSeries === "all" || s.series === selectedSeries;

    return matchesSearch && matchesSeries;
  });

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Word of Truth & Life
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Sermon Archive & Messages
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Listen, watch, and be nourished by the expository preaching of the Word of God from the pulpit of First Baptist Church Jobele.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle border border-ivory-300 flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-burgundy-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, speaker, scripture..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 text-sm bg-ivory-50"
            />
          </div>

          {/* Series Dropdown / Filter */}
          <div className="w-full md:w-auto flex items-center space-x-3">
            <span className="text-xs font-bold text-obsidian-700 uppercase tracking-wider whitespace-nowrap">
              Sermon Series:
            </span>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 text-sm bg-white"
            >
              {seriesList.map((series) => (
                <option key={series} value={series}>
                  {series === "all" ? "All Series" : series}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredSermons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-ivory-300 p-8">
            <p className="font-serif text-xl font-bold text-obsidian-900 mb-1">
              No sermons found matching your criteria.
            </p>
            <p className="text-xs text-obsidian-500">
              New messages will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-ivory-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail with quick watch/listen triggers */}
                  <div className="relative h-60 w-full overflow-hidden group">
                    <Image
                      src={sermon.thumbnailUrl || "/images/brand/building.jpg"}
                      alt={sermon.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400/30">
                        {sermon.series}
                      </span>
                    </div>

                    {/* Play Video Trigger */}
                    <button
                      onClick={() => setActiveVideoSermon(sermon)}
                      aria-label="Watch sermon"
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 fill-obsidian-950 ml-0.5" />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4 text-white flex justify-between items-center text-xs">
                      <span className="flex items-center text-ivory-200">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gold-400" />
                        {new Date(sermon.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {sermon.duration && (
                        <span className="bg-black/60 px-2 py-0.5 rounded text-[11px]">
                          {sermon.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-gold-700 font-bold uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{sermon.scripture}</span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-obsidian-950 leading-snug">
                      {sermon.title}
                    </h3>

                    <p className="text-xs text-obsidian-600 font-medium flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-burgundy-700" />
                      {sermon.speaker}
                    </p>

                    <p className="text-xs text-obsidian-600 line-clamp-3 leading-relaxed">
                      {sermon.description}
                    </p>

                    {/* Audio Player Bar */}
                    {sermon.audioUrl && (
                      <div className="pt-2">
                        <div className="p-2.5 rounded-lg bg-ivory-200/80 border border-ivory-300 flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-burgundy-700 flex-shrink-0" />
                          <audio
                            controls
                            className="w-full h-7"
                            src={sermon.audioUrl}
                          >
                            Audio not supported
                          </audio>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-2 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveVideoSermon(sermon)}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 mr-1 fill-obsidian-950" />
                      Watch
                    </button>

                    {sermon.transcript && (
                      <button
                        onClick={() => setActiveNotesSermon(sermon)}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-ivory-200 hover:bg-ivory-300 text-obsidian-800 font-semibold text-xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-burgundy-700" />
                        Sermon Notes
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-obsidian-500">
                    FBC Jobele Pulpit
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideoSermon && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveVideoSermon(null)}
        >
          <div
            className="bg-obsidian-950 border border-gold-500/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/50 text-white">
              <div>
                <h4 className="font-serif font-bold text-ivory-100 text-base">
                  {activeVideoSermon.title}
                </h4>
                <p className="text-xs text-gold-400">
                  {activeVideoSermon.speaker} &bull; {activeVideoSermon.scripture}
                </p>
              </div>
              <button
                onClick={() => setActiveVideoSermon(null)}
                className="p-1.5 rounded-lg text-ivory-300 hover:text-white"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {activeVideoSermon.videoUrl?.includes("youtube") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    activeVideoSermon.videoUrl.split("v=")[1] || "dQw4w9WgXcQ"
                  }?autoplay=1`}
                  title={activeVideoSermon.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-ivory-300">
                  <Play className="w-12 h-12 text-gold-400 mb-3" />
                  <p className="text-base font-semibold text-white">
                    Video Message Loaded
                  </p>
                  <p className="text-xs max-w-sm mt-1">
                    Streaming directly from the First Baptist Church Jobele media repository.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sermon Notes Modal */}
      {activeNotesSermon && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveNotesSermon(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-ivory-300 flex items-center justify-between bg-ivory-100">
              <div>
                <h4 className="font-serif font-bold text-lg text-obsidian-950">
                  {activeNotesSermon.title} &ndash; Notes
                </h4>
                <p className="text-xs text-burgundy-700 font-semibold">
                  {activeNotesSermon.speaker} &bull; {activeNotesSermon.scripture}
                </p>
              </div>
              <button
                onClick={() => setActiveNotesSermon(null)}
                className="p-1.5 rounded-lg text-obsidian-500 hover:text-obsidian-800"
                aria-label="Close notes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-obsidian-800 leading-relaxed font-light">
              <div className="p-3 rounded-lg bg-gold-50 border border-gold-200 text-xs text-gold-950">
                <strong>Main Scripture Reference:</strong> {activeNotesSermon.scripture}
              </div>
              <div className="whitespace-pre-line">
                {activeNotesSermon.transcript || activeNotesSermon.description}
              </div>
            </div>

            <div className="p-4 border-t border-ivory-300 bg-ivory-100 flex justify-end">
              <button
                onClick={() => setActiveNotesSermon(null)}
                className="px-4 py-2 rounded-xl bg-burgundy-700 text-white text-xs font-semibold"
              >
                Close Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
