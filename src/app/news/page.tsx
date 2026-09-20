"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Sparkles, Share2, Search } from "lucide-react";
import { initialNews } from "@/lib/seed-data";
import { NewsPost } from "@/lib/types";

export default function NewsPage() {
  const [posts] = useState<NewsPost[]>(initialNews);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const categories = ["all", "Announcements", "Outreach & Missions", "Discipleship"];

  const filtered = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCat === "all" || p.category === selectedCat;

    return matchesSearch && matchesCat;
  });

  const handleShare = async (post: NewsPost, e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/news/${post.slug || post.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Official Communications
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            News & Announcements
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Stay up to date with ministry initiatives, pastoral guidelines, and kingdom progress across First Baptist Church Jobele.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle border border-ivory-300 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-burgundy-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm bg-ivory-50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? "bg-burgundy-700 text-white shadow-xs"
                    : "bg-ivory-200 text-obsidian-700 hover:bg-ivory-300"
                }`}
              >
                {cat === "all" ? "All News" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-ivory-300 p-8">
            <p className="font-serif text-xl font-bold text-obsidian-900 mb-1">
              No announcements match your search.
            </p>
            <p className="text-xs text-obsidian-500">
              Please check back soon for further church updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-ivory-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={post.featuredImage || "/images/brand/building.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400/30">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-obsidian-500">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-burgundy-700" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-navy-800" />
                        {post.author}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-obsidian-950 group-hover:text-burgundy-700 transition-colors leading-snug">
                      <Link href={`/news/${post.slug || post.id}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-obsidian-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-ivory-200 flex items-center justify-between">
                  <Link
                    href={`/news/${post.slug || post.id}`}
                    className="inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>

                  <button
                    onClick={(e) => handleShare(post, e)}
                    aria-label="Share article"
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-burgundy-700 hover:bg-ivory-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
