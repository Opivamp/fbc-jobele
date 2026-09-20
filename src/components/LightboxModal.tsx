"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar, User, Tag } from "lucide-react";
import { GalleryImage } from "@/lib/types";

interface LightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function LightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Lightbox Content Container */}
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-obsidian-950 rounded-2xl overflow-hidden border border-gold-500/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 bg-obsidian-900/90 border-b border-white/10 flex items-center justify-between text-white z-10">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-500/30">
              {current.category}
            </span>
            <span className="text-xs text-ivory-400">
              {currentIndex + 1} of {images.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ivory-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Image Stage */}
        <div className="relative flex-grow flex items-center justify-center min-h-[350px] sm:min-h-[480px] bg-black">
          <div className="relative w-full h-[55vh] sm:h-[65vh]">
            <Image
              src={current.imageUrl}
              alt={current.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                aria-label="Previous photograph"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-gold-500 text-white hover:text-obsidian-950 transition-all border border-white/20 focus:outline-none"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                aria-label="Next photograph"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-gold-500 text-white hover:text-obsidian-950 transition-all border border-white/20 focus:outline-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Metadata Bar */}
        <div className="p-4 sm:p-5 bg-obsidian-900 text-white border-t border-white/10 space-y-2">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-ivory-100 leading-snug">
            {current.title}
          </h3>

          {current.caption && (
            <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed font-light">
              {current.caption}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-gold-400/90 pt-1">
            {current.date && (
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gold-400" />
                {new Date(current.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}

            {current.photographer && (
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-gold-400" />
                Photo: {current.photographer}
              </span>
            )}

            <span className="flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-gold-400" />
              First Baptist Church Jobele
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
