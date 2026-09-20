"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Sparkles, Eye, Filter } from "lucide-react";
import { GalleryImage, GalleryCategory } from "@/lib/types";
import { initialGalleryImages, initialCategories } from "@/lib/seed-data";
import LightboxModal from "@/components/LightboxModal";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch live images and categories from API so newly uploaded photos reflect immediately
  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/public/gallery");
        if (res.ok) {
          const data = await res.json();
          setImages(data.images || initialGalleryImages);
          setCategories(data.categories || initialCategories);
        } else {
          setImages(initialGalleryImages);
          setCategories(initialCategories);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setImages(initialGalleryImages);
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredImages = images.filter((img) => {
    const matchesCategory =
      selectedCategory === "all" ||
      img.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.caption.toLowerCase().includes(search.toLowerCase()) ||
      img.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Sacred Moments in His Presence
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Church Photo Gallery
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Visual storytelling of worship, revival, brotherly fellowship, and the living testimony of God&apos;s power at First Baptist Church Jobele.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle border border-ivory-300 flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-burgundy-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search photographs..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm bg-ivory-50"
            />
          </div>

          {/* Categories Pill Scroll */}
          <div className="w-full md:w-auto flex items-center overflow-x-auto gap-2 py-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-burgundy-700 text-white shadow-xs"
                  : "bg-ivory-200 text-obsidian-700 hover:bg-ivory-300"
              }`}
            >
              All Photos ({images.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-burgundy-700 text-white shadow-xs"
                    : "bg-ivory-200 text-obsidian-700 hover:bg-ivory-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry / Editorial Image Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="text-center py-20 text-obsidian-600 font-serif text-lg">
            Loading church moments...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-ivory-300 p-8">
            <p className="font-serif text-xl font-bold text-obsidian-900 mb-1">
              Our gallery is being updated. Check back soon.
            </p>
            <p className="text-xs text-obsidian-500">
              No photographs matched your filter. Try selecting &quot;All Photos&quot; or changing your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => {
              // Varying heights for editorial masonry rhythm
              const isTall = idx % 5 === 0 || idx % 5 === 3;

              return (
                <div
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-elevated transition-all duration-300 border border-gold-500/20 bg-black ${
                    isTall ? "h-80 sm:h-96" : "h-64 sm:h-72"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.title}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {img.category}
                    </span>
                  </div>

                  {/* Overlaid Title and Prompt */}
                  <div className="absolute bottom-3 left-3 right-3 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-serif font-bold text-base leading-snug drop-shadow-sm">
                      {img.title}
                    </h3>
                    {img.caption && (
                      <p className="text-xs text-ivory-200 line-clamp-1 font-light mt-0.5">
                        {img.caption}
                      </p>
                    )}
                    <div className="flex items-center text-[11px] text-gold-300 font-semibold mt-1.5">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>View in Fullscreen Lightbox</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reusable Lightbox Modal */}
      <LightboxModal
        images={filteredImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setCurrentIndex((prev) =>
            prev === 0 ? filteredImages.length - 1 : prev - 1
          )
        }
        onNext={() =>
          setCurrentIndex((prev) =>
            prev === filteredImages.length - 1 ? 0 : prev + 1
          )
        }
      />
    </div>
  );
}
