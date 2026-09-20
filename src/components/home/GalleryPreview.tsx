"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Eye } from "lucide-react";
import { GalleryImage } from "@/lib/types";
import LightboxModal from "../LightboxModal";

interface GalleryPreviewProps {
  images: GalleryImage[];
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.slice(0, 6);

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-ivory-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header as requested */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold-600 uppercase block mb-1 font-sans flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Living Sanctuary
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              Life at FBC Jobele
            </h2>
            <p className="text-sm text-obsidian-600 mt-1 max-w-xl">
              Moments of worship, fellowship, service, and community.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/gallery"
              className="inline-flex items-center text-sm font-bold text-burgundy-700 hover:text-burgundy-900 group"
            >
              <span>Explore Our Gallery</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6-Photo Masonry / Asymmetrical Editorial Grid */}
        {displayImages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-ivory-300 p-8">
            <p className="font-serif text-lg text-obsidian-800 font-semibold mb-1">
              Our gallery is being updated. Check back soon.
            </p>
            <p className="text-xs text-obsidian-500">
              New photos uploaded through the admin portal will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayImages.map((img, idx) => {
              // Create visual rhythm with varying heights
              const isTall = idx === 0 || idx === 4;

              return (
                <div
                  key={img.id}
                  onClick={() => openImage(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-elevated transition-all duration-300 border border-gold-500/20 bg-black ${
                    isTall ? "h-72 sm:h-84 lg:h-96" : "h-64 sm:h-72"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {img.category}
                    </span>
                  </div>

                  {/* Hover Caption Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-serif font-bold text-sm sm:text-base leading-snug line-clamp-1 drop-shadow-sm">
                      {img.title}
                    </h3>
                    {img.caption && (
                      <p className="text-xs text-ivory-200 line-clamp-1 font-light mt-0.5">
                        {img.caption}
                      </p>
                    )}
                    <div className="flex items-center text-[11px] text-gold-300 font-medium mt-1">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>Click to enlarge photo</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <LightboxModal
        images={displayImages}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setSelectedIndex((prev) =>
            prev === 0 ? displayImages.length - 1 : prev - 1
          )
        }
        onNext={() =>
          setSelectedIndex((prev) =>
            prev === displayImages.length - 1 ? 0 : prev + 1
          )
        }
      />
    </section>
  );
}
