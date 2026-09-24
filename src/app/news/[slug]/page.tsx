import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Tag, ShieldCheck } from "lucide-react";
import { getNewsBySlug, getNews } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const post = getNewsBySlug(params.slug);
  if (!post) return { title: "Article Not Found | FBC Jobele" };

  return {
    title: `${post.title} | First Baptist Church Jobele`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || "/images/brand/building.jpg"],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const post = getNewsBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const related = getNews(true)
    .filter((n) => n.id !== post.id && n.category === post.category)
    .slice(0, 2);

  return (
    <div className="bg-ivory-100 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-burgundy-700 hover:text-burgundy-900 group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Announcements</span>
          </Link>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-elevated border border-gold-500/30">
          {/* Header Image */}
          <div className="relative h-72 sm:h-96 w-full">
            <Image
              src={post.featuredImage || "/images/brand/building.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="px-3 py-1 rounded-full bg-burgundy-800 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-400/40">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-ivory-100 leading-tight">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Metadata bar */}
          <div className="px-6 sm:px-10 py-4 bg-ivory-200/70 border-b border-ivory-300 flex flex-wrap items-center justify-between text-xs text-obsidian-700 gap-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center font-semibold text-burgundy-800">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center text-navy-800 font-medium">
                <User className="w-3.5 h-3.5 mr-1" />
                Authored by {post.author}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-gold-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official FBC Notice</span>
            </div>
          </div>

          {/* Article Body */}
          <div className="px-6 sm:px-10 py-8 sm:py-12 space-y-6 text-obsidian-800 text-base sm:text-lg leading-relaxed font-light">
            <p className="text-lg font-serif italic text-burgundy-950 font-normal border-l-4 border-gold-500 pl-4 py-1 bg-ivory-50 rounded-r-lg">
              {post.excerpt}
            </p>

            <div className="whitespace-pre-line space-y-4 pt-4 text-sm sm:text-base leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 sm:px-10 py-6 bg-ivory-100 border-t border-ivory-300 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-obsidian-600">
              <Tag className="w-3.5 h-3.5 text-gold-600" />
              <span>Sanctuary of Divine Power &bull; Nigerian Baptist Convention</span>
            </div>

            <Link
              href="/news"
              className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900"
            >
              Browse More Church News &rarr;
            </Link>
          </div>
        </article>

        {/* Related Announcements */}
        {related.length > 0 && (
          <div className="mt-14 space-y-6">
            <h3 className="font-serif font-bold text-2xl text-obsidian-950">
              Related Announcements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-subtle hover:shadow-card transition-shadow"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-700 block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-obsidian-950 mb-2">
                    <Link
                      href={`/news/${item.slug || item.id}`}
                      className="hover:text-burgundy-700"
                    >
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-obsidian-600 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
