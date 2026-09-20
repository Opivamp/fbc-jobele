import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-ivory-100 flex flex-col items-center justify-center text-center px-4 py-20 relative">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold-400 shadow-md mb-6">
        <Image
          src="/images/brand/logo.jpg"
          alt="FBC Jobele Seal"
          fill
          className="object-cover"
        />
      </div>

      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-800 text-xs font-bold uppercase tracking-widest mb-3">
        <Sparkles className="w-3.5 h-3.5 text-gold-600" />
        <span>Page Not Found</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-serif font-black text-obsidian-950 tracking-tight">
        404 &ndash; Page Not Found
      </h1>

      <p className="text-sm text-obsidian-600 mt-3 max-w-md font-light leading-relaxed">
        The page you are looking for may have been moved, renamed, or is temporarily unavailable. We invite you to return to our homepage or explore our sermons and ministries.
      </p>

      <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow transition-colors"
        >
          <Home className="w-4 h-4 mr-2 text-gold-300" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/sermons"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-obsidian-800 font-semibold text-xs transition-colors"
        >
          <span>Browse Sermons</span>
        </Link>
      </div>
    </div>
  );
}
