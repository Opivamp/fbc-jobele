"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Headphones,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  X,
  Volume2,
} from "lucide-react";
import { Sermon } from "@/lib/types";

interface SermonSpotlightProps {
  sermon: Sermon | null;
}

export default function SermonSpotlight({ sermon }: SermonSpotlightProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  if (!sermon) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-navy-950 via-burgundy-950 to-obsidian-950 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-burgundy-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Proclaiming the Word of Truth
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory-100 tracking-tight">
            Listen. Learn. Grow.
          </h2>
          <p className="text-sm text-ivory-300 mt-2">
            Be renewed and spiritually equipped through the exposition of God&apos;s holy Word.
          </p>
        </div>

        {/* Featured Sermon Editorial Showcase */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border-2 border-gold-500/30 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Thumbnail with Play Overlay (6 Cols) */}
            <div className="lg:col-span-6 relative h-72 sm:h-80 lg:h-96 w-full group">
              <Image
                src={sermon.thumbnailUrl || "/images/brand/building.jpg"}
                alt={sermon.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-black/30 to-black/20" />

              {/* Series Ribbon */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-burgundy-900/90 text-gold-300 font-bold text-xs uppercase tracking-wider border border-gold-400/40 backdrop-blur-sm">
                  {sermon.series}
                </span>
              </div>

              {/* Play Button Pulsing */}
              <button
                onClick={() => setVideoModalOpen(true)}
                aria-label="Play sermon video"
                className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 flex items-center justify-center shadow-elevated transition-transform hover:scale-110 focus:outline-none group/play"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-obsidian-950 ml-1 group-hover/play:scale-105 transition-transform" />
              </button>

              {/* Duration badge */}
              {sermon.duration && (
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded bg-black/75 text-xs text-ivory-200">
                  {sermon.duration}
                </div>
              )}
            </div>

            {/* Sermon Description & Actions (6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3 text-xs text-gold-400 font-medium">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(sermon.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    {sermon.scripture}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100 leading-snug">
                  {sermon.title}
                </h3>

                <p className="text-sm font-semibold text-gold-300">
                  Speaker: {sermon.speaker}
                </p>
              </div>

              <p className="text-sm text-ivory-300 leading-relaxed line-clamp-3">
                {sermon.description}
              </p>

              {/* Inline Audio Player Bar with Visualizer */}
              {sermon.audioUrl && (
                <div className="p-3.5 rounded-xl bg-white/10 border border-gold-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span className="text-xs text-gold-300 font-semibold uppercase tracking-wider">
                        Audio Broadcast
                      </span>
                    </div>

                    {/* Animated Equalizer Soundwaves */}
                    <div className="flex items-end space-x-1 h-5 px-2">
                      <span className="w-1 bg-gold-400 rounded-full animate-soundwave sound-bar-1" />
                      <span className="w-1 bg-gold-300 rounded-full animate-soundwave sound-bar-2" />
                      <span className="w-1 bg-gold-500 rounded-full animate-soundwave sound-bar-3" />
                      <span className="w-1 bg-gold-400 rounded-full animate-soundwave sound-bar-4" />
                      <span className="w-1 bg-gold-200 rounded-full animate-soundwave sound-bar-5" />
                    </div>
                  </div>

                  <audio
                    controls
                    className="w-full h-8 accent-gold-500"
                    src={sermon.audioUrl}
                    onPlay={() => setIsPlayingAudio(true)}
                    onPause={() => setIsPlayingAudio(false)}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Action Buttons as requested */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-sm shadow-md transition-all btn-shimmer-sweep"
                >
                  <Play className="w-4 h-4 mr-1.5 fill-obsidian-950" />
                  Watch Sermon
                </button>

                <Link
                  href="/sermons"
                  className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-ivory-100 font-semibold text-sm border border-white/20 transition-all"
                >
                  <Headphones className="w-4 h-4 mr-1.5 text-gold-400" />
                  Sermon Archive
                </Link>

                <Link
                  href="/sermons"
                  className="inline-flex items-center px-4 py-2.5 text-xs text-gold-300 hover:text-white font-bold transition-colors ml-auto group"
                >
                  <span>Explore Series</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="bg-obsidian-900 border border-gold-500/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div>
                <h4 className="font-serif font-bold text-ivory-100 text-base">
                  {sermon.title}
                </h4>
                <p className="text-xs text-gold-400">
                  {sermon.speaker} &bull; {sermon.scripture}
                </p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-ivory-300 hover:text-white hover:bg-white/10"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {sermon.videoUrl?.includes("youtube") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    sermon.videoUrl.split("v=")[1] || "dQw4w9WgXcQ"
                  }?autoplay=1`}
                  title={sermon.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-ivory-300">
                  <Play className="w-12 h-12 text-gold-400 mb-3" />
                  <p className="text-base font-semibold text-white">
                    Video Stream Ready
                  </p>
                  <p className="text-xs max-w-sm mt-1">
                    This message is available via our church broadcast archive and local audio repository.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
