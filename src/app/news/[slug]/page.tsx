import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Tag, ShieldCheck } from "lucide-react";
import { ensureDbLoadedAsync, getNewsBySlugAsync, getNewsAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  await ensureDbLoadedAsync();
  const post = await getNewsBySlugAsync(params.slug);
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

export default async function ArticlePage({ params }: ArticlePageProps) {
  await ensureDbLoadedAsync();
  const post = await getNewsBySlugAsync(params.slug);
  if (!post) {
    notFound();
  }

  const allNews = await getNewsAsync(true);
  const related = allNews
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-burgundy-700 text-gold-300 text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight leading-tight">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Metadata & Author Bar */}
          <div className="p-6 sm:p-8 border-b border-ivory-300 flex flex-wrap items-center justify-between gap-4 text-xs text-obsidian-600 bg-ivory-50">
            <div className="flex items-center space-x-6">
              <span className="flex items-center font-medium">
                <Calendar className="w-4 h-4 mr-1.5 text-gold-600" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center font-medium">
                <User className="w-4 h-4 mr-1.5 text-burgundy-700" />
                {post.author}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gold-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Official FBC Jobele Bulletin</span>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="p-4 rounded-xl bg-burgundy-50 border-l-4 border-burgundy-700 text-burgundy-950 text-base font-serif italic leading-relaxed">
              {post.excerpt}
            </div>

            <div className="prose prose-lg max-w-none text-obsidian-800 leading-relaxed space-y-4">
              {post.content.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base text-obsidian-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Related Announcements */}
        {related.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="font-serif font-bold text-2xl text-obsidian-950">
              Related Announcements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-subtle hover:shadow-card transition-all block group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-700 block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-bold text-base text-obsidian-950 group-hover:text-burgundy-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-obsidian-600 mt-2 line-clamp-2">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
