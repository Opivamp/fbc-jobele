"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Sparkles, Share2 } from "lucide-react";
import { NewsPost } from "@/lib/types";

interface LatestNewsSectionProps {
  news: NewsPost[];
}

export default function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const displayNews = news.slice(0, 3);

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
        // Share cancelled or unavailable
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="py-20 bg-ivory-200/50 relative border-t border-burgundy-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block mb-1 font-sans flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Church Communications
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              News & Announcements
            </h2>
            <p className="text-sm text-obsidian-600 mt-1 max-w-xl">
              Stay informed with official updates, ministry reports, and pastoral notices from FBC Jobele.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-bold text-burgundy-700 hover:text-burgundy-900 group"
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-ivory-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.featuredImage || "/images/brand/building.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-burgundy-800 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400/40">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
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
                      <User className="w-3.5 h-3.5 mr-1 text-navy-700" />
                      {post.author}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-obsidian-950 group-hover:text-burgundy-700 transition-colors leading-snug line-clamp-2">
                    <Link href={`/news/${post.slug || post.id}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-obsidian-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 pt-2 border-t border-ivory-200 flex items-center justify-between">
                <Link
                  href={`/news/${post.slug || post.id}`}
                  className="inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Article</span>
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
      </div>
    </section>
  );
}
