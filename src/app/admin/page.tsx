"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Images,
  BookOpen,
  Calendar,
  Newspaper,
  Users,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Upload,
  PlusCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    galleryCount: 0,
    sermonCount: 0,
    eventCount: 0,
    newsCount: 0,
    ministryCount: 0,
    prayerCount: 0,
    messageCount: 0,
  });

  useEffect(() => {
    // Load counts
    async function loadStats() {
      try {
        const [gRes, sRes, eRes, nRes, mRes, pRes, cRes] = await Promise.all([
          fetch("/api/admin/gallery"),
          fetch("/api/admin/sermons"),
          fetch("/api/admin/events"),
          fetch("/api/admin/news"),
          fetch("/api/admin/ministries"),
          fetch("/api/admin/prayers"),
          fetch("/api/admin/contact-messages"),
        ]);

        const g = await gRes.json();
        const s = await sRes.json();
        const e = await eRes.json();
        const n = await nRes.json();
        const m = await mRes.json();
        const p = await pRes.json();
        const c = await cRes.json();

        setStats({
          galleryCount: g.images?.length || 0,
          sermonCount: s.sermons?.length || 0,
          eventCount: e.events?.length || 0,
          newsCount: n.news?.length || 0,
          ministryCount: m.ministries?.length || 0,
          prayerCount: p.prayerRequests?.filter((x: any) => x.status === "unread")?.length || 0,
          messageCount: c.messages?.filter((x: any) => x.status === "new")?.length || 0,
        });
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Gallery Photos",
      value: stats.galleryCount,
      desc: "Live photographs",
      href: "/admin/gallery",
      icon: Images,
      color: "text-burgundy-700",
      bg: "bg-burgundy-50",
    },
    {
      title: "Sermons",
      value: stats.sermonCount,
      desc: "Audio & video messages",
      href: "/admin/sermons",
      icon: BookOpen,
      color: "text-navy-800",
      bg: "bg-navy-50",
    },
    {
      title: "Events",
      value: stats.eventCount,
      desc: "Upcoming & past programs",
      href: "/admin/events",
      icon: Calendar,
      color: "text-gold-700",
      bg: "bg-gold-50",
    },
    {
      title: "Announcements",
      value: stats.newsCount,
      desc: "News & ministry updates",
      href: "/admin/news",
      icon: Newspaper,
      color: "text-sanctuary-700",
      bg: "bg-sanctuary-50",
    },
    {
      title: "Unread Prayers",
      value: stats.prayerCount,
      desc: "Confidential requests",
      href: "/admin/prayers",
      icon: HeartHandshake,
      color: "text-crimson-600",
      bg: "bg-red-50",
    },
    {
      title: "New Messages",
      value: stats.messageCount,
      desc: "Contact submissions",
      href: "/admin/messages",
      icon: MessageSquare,
      color: "text-navy-900",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-950 to-navy-950 text-white p-6 sm:p-8 rounded-3xl shadow-card border-2 border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-gold-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to FBC Jobele CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
            Sanctuary Administration Desk
          </h1>
          <p className="text-xs sm:text-sm text-ivory-300 font-light max-w-xl leading-relaxed">
            Manage your church photo gallery, publish weekly sermons, schedule events, review private prayer requests, and update website information without writing code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow transition-colors"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            <span>Upload Photos</span>
          </Link>

          <Link
            href="/admin/events"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
            <span>New Event</span>
          </Link>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-xl text-obsidian-950">
            Quick Statistics
          </h2>
          <span className="text-xs text-obsidian-500">Live Database Overview</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                href={c.href}
                className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-9 h-9 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-serif font-black text-obsidian-950 block">
                    {c.value}
                  </span>
                  <p className="text-xs font-bold text-obsidian-800 mt-1">
                    {c.title}
                  </p>
                </div>
                <p className="text-[10px] text-obsidian-500 mt-2 truncate">
                  {c.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Action Shortcuts (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle space-y-6">
          <h3 className="font-serif font-bold text-lg text-obsidian-950">
            Frequent Content Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/gallery"
              className="p-4 rounded-2xl bg-ivory-100 hover:bg-gold-50 border border-ivory-300 hover:border-gold-300 transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-burgundy-700 text-white group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4 text-gold-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-obsidian-900 group-hover:text-burgundy-800">
                  Upload Photos
                </h4>
                <p className="text-xs text-obsidian-600 mt-0.5">
                  Single or bulk drag-and-drop to live gallery.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/sermons"
              className="p-4 rounded-2xl bg-ivory-100 hover:bg-gold-50 border border-ivory-300 hover:border-gold-300 transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-navy-800 text-white group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4 text-gold-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-obsidian-900 group-hover:text-burgundy-800">
                  Publish Sermon
                </h4>
                <p className="text-xs text-obsidian-600 mt-0.5">
                  Add YouTube video or audio recordings.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/events"
              className="p-4 rounded-2xl bg-ivory-100 hover:bg-gold-50 border border-ivory-300 hover:border-gold-300 transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-gold-600 text-white group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-obsidian-900 group-hover:text-burgundy-800">
                  Schedule Event
                </h4>
                <p className="text-xs text-obsidian-600 mt-0.5">
                  Promote upcoming conferences and revivals.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/news"
              className="p-4 rounded-2xl bg-ivory-100 hover:bg-gold-50 border border-ivory-300 hover:border-gold-300 transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-sanctuary-700 text-white group-hover:scale-105 transition-transform">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-obsidian-900 group-hover:text-burgundy-800">
                  Post News
                </h4>
                <p className="text-xs text-obsidian-600 mt-0.5">
                  Share reports, notices, and bulletins.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Info Box (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 text-gold-700 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-sanctuary-600" />
            <span>Content Management Guarantee</span>
          </div>

          <h3 className="font-serif font-bold text-lg text-obsidian-950">
            Real-Time Website Updates
          </h3>

          <p className="text-xs text-obsidian-600 leading-relaxed">
            Every update you perform here is saved directly to your local persistent database. Uploading new church photographs, creating events, or updating service times updates the public website <strong className="text-burgundy-800">instantly</strong> with zero code modifications.
          </p>

          <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200/80 space-y-2 text-xs">
            <p className="font-bold text-gold-950">Church Metadata Status:</p>
            <p className="text-gold-900">
              &bull; Nigerian Baptist Convention Affiliated
            </p>
            <p className="text-gold-900">
              &bull; Location: P. O. Box 184, Jobele, Oyo State
            </p>
            <p className="text-gold-900">
              &bull; Primary colors: Heritage Burgundy & Baptist Navy
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/settings"
              className="inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900"
            >
              <span>Edit Church Contact, Bank Details & Times</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
