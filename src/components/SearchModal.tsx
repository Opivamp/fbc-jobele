"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Calendar, Newspaper, Users, ArrowRight, Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "sermon" | "event" | "news" | "ministry" | "page";
  url: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sermon":
        return <BookOpen className="w-4 h-4 text-burgundy-600" />;
      case "event":
        return <Calendar className="w-4 h-4 text-navy-600" />;
      case "news":
        return <Newspaper className="w-4 h-4 text-gold-600" />;
      case "ministry":
        return <Users className="w-4 h-4 text-sanctuary-600" />;
      default:
        return <ArrowRight className="w-4 h-4 text-obsidian-600" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "sermon":
        return "Sermon";
      case "event":
        return "Event";
      case "news":
        return "Announcement";
      case "ministry":
        return "Ministry";
      default:
        return "Page";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-ivory-100 w-full max-w-2xl rounded-2xl shadow-elevated border border-gold-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-ivory-300 p-4 flex items-center bg-white">
          <Search className="w-5 h-5 text-burgundy-700 ml-1 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sermons, events, ministries, announcements..."
            className="w-full bg-transparent pl-3 pr-10 text-obsidian-900 placeholder:text-obsidian-400 focus:outline-none text-base"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-gold-600 animate-spin absolute right-4" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-obsidian-400 hover:text-obsidian-700 absolute right-4"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === "" ? (
            <div className="text-center py-8 text-obsidian-500 text-sm">
              <p className="font-serif text-lg text-burgundy-900 font-semibold mb-1">
                Explore First Baptist Church Jobele
              </p>
              <p className="text-xs text-obsidian-600">
                Type keywords like &quot;Worship&quot;, &quot;Revival&quot;, &quot;Choir&quot;, or &quot;Youth&quot; to discover content.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Sunday Service", "Sanctuary Choir", "Annual Revival", "Give", "Plan Visit"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 rounded-full bg-ivory-200 text-xs text-burgundy-800 hover:bg-gold-100 hover:text-burgundy-900 transition-colors border border-ivory-300"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.url}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-ivory-200 group transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-ivory-100 border border-ivory-300 group-hover:border-gold-400 transition-colors">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-obsidian-900 group-hover:text-burgundy-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-obsidian-600 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-ivory-300/60 text-obsidian-700 uppercase tracking-wider group-hover:bg-gold-200/50">
                    {getTypeName(item.type)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-8 text-obsidian-600 text-sm">
                <p className="font-medium text-obsidian-800 mb-1">
                  We couldn&apos;t find anything matching &quot;{query}&quot;
                </p>
                <p className="text-xs text-obsidian-500">
                  Try checking your spelling or searching for a different keyword.
                </p>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-ivory-200/80 border-t border-ivory-300 text-xs text-obsidian-500 flex justify-between items-center px-4">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border text-[10px]">ESC</kbd> to close</span>
          <span className="text-burgundy-800 font-medium">First Baptist Church Jobele</span>
        </div>
      </div>
    </div>
  );
}
