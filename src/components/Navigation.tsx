"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Calendar,
  Heart,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import SearchModal from "./SearchModal";
import { SiteSettings } from "@/lib/types";

interface NavigationProps {
  settings?: SiteSettings;
  worshipTimes?: { title: string; day: string; time: string }[];
}

export default function Navigation({ settings: propSettings, worshipTimes }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | undefined>(propSettings);
  const pathname = usePathname();

  // Sync with prop and refresh from API on client navigation
  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
    }
  }, [propSettings]);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, [pathname]);

  // Handle sticky navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Leadership", href: "/leadership" },
    { name: "Ministries", href: "/ministries" },
    { name: "Sermons", href: "/sermons" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news" },
    { name: "Give", href: "/give" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  // Don't render public navigation on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const churchName = settings?.churchName || "First Baptist Church Jobele";
  const tagline = settings?.tagline || "Sanctuary of Divine Power";
  const affiliation = settings?.affiliation || "Nigerian Baptist Convention";
  const address = settings?.address || "P. O. Box 184, Jobele, Oyo State";
  const timesList = settings?.worshipTimes || worshipTimes || [];
  const primaryTime = timesList[0]
    ? `${timesList[0].title}: ${timesList[0].time}`
    : "Sunday Worship: 9:30 AM";

  return (
    <>
      {/* Top Banner with Convention Affiliation & Quick Contact */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-navy-900 text-ivory-100 text-xs py-1.5 px-4 hidden md:block border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-gold-300 font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
              {tagline} &bull; {affiliation}
            </span>
            <span className="text-ivory-300/40">|</span>
            <span className="flex items-center text-ivory-200">
              <MapPin className="w-3 h-3 mr-1 text-gold-400" />
              {address}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-ivory-200">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1 text-gold-400" />
              {primaryTime}
            </span>
            <Link
              href="/prayer"
              className="text-gold-300 hover:text-gold-200 font-medium transition-colors"
            >
              Need Prayer?
            </Link>
            <Link
              href="/admin/login"
              className="text-ivory-300/70 hover:text-ivory-100 transition-colors"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-ivory-100/95 backdrop-blur-md shadow-card border-b border-burgundy-900/10 py-2.5"
            : "bg-ivory-100/90 backdrop-blur-sm py-3.5 border-b border-burgundy-900/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center space-x-3 group text-left focus:outline-none max-w-[50%] sm:max-w-none"
          >
            <div className="relative w-11 h-11 md:w-13 md:h-13 rounded-full overflow-hidden border-2 border-gold-500 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/brand/logo.jpg"
                alt={`${churchName} Official Seal`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center">
                <span className="text-burgundy-700 font-serif font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-tight leading-snug line-clamp-1 uppercase">
                  {churchName}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 mt-0.5">
                <span className="inline-block px-2 py-0.5 bg-gold-100 text-gold-800 text-[10px] font-semibold rounded-full uppercase tracking-wider border border-gold-400/30 truncate max-w-[200px] sm:max-w-none">
                  {tagline}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? "text-burgundy-700 font-semibold bg-burgundy-50"
                      : "text-obsidian-800 hover:text-burgundy-700 hover:bg-ivory-200"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-burgundy-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search site"
              className="p-2 text-obsidian-700 hover:text-burgundy-700 hover:bg-ivory-200 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Plan Your Visit CTA */}
            <Link
              href="/plan-your-visit"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-ivory-100 text-sm font-semibold shadow-sm hover:shadow transition-all duration-200 group border border-burgundy-900/30"
            >
              <Calendar className="w-4 h-4 mr-1.5 text-gold-400 group-hover:rotate-6 transition-transform" />
              <span>Plan Your Visit</span>
            </Link>

            {/* Give Button */}
            <Link
              href="/give"
              className="hidden md:inline-flex items-center px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-obsidian-950 text-sm font-bold shadow-sm transition-all duration-200 group"
            >
              <Heart className="w-3.5 h-3.5 mr-1.5 fill-obsidian-950 group-hover:scale-110 transition-transform" />
              <span>Give</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 text-obsidian-800 hover:text-burgundy-700 hover:bg-ivory-200 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sliding Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-ivory-100 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-4 bg-gradient-to-r from-burgundy-900 to-navy-950 text-white flex items-center justify-between border-b border-gold-500/30">
                <div className="flex items-center space-x-2.5">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold-400">
                    <Image
                      src="/images/brand/logo.jpg"
                      alt={churchName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xs leading-tight text-ivory-100 uppercase truncate max-w-[170px]">
                      {churchName}
                    </h3>
                    <p className="text-[10px] text-gold-300 truncate max-w-[170px]">
                      {tagline}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-ivory-200 hover:text-white hover:bg-burgundy-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Service times quick notice */}
              {timesList.length > 0 && (
                <div className="p-4 bg-gold-50 border-b border-gold-200/60">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-gold-700 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gold-950">
                      <p className="font-semibold mb-1">Worship With Us:</p>
                      {timesList.slice(0, 3).map((t, idx) => (
                        <p key={idx} className="text-gold-900 text-[11px]">
                          {t.title}: {t.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div className="py-2 px-3 space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-burgundy-700 text-ivory-100 font-semibold"
                          : "text-obsidian-800 hover:bg-ivory-200 hover:text-burgundy-700"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          active ? "text-gold-300" : "text-obsidian-400"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-ivory-300 bg-ivory-200 space-y-2">
              <Link
                href="/plan-your-visit"
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-burgundy-700 text-ivory-100 font-semibold text-sm shadow-sm hover:bg-burgundy-800 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2 text-gold-300" />
                Plan Your Visit
              </Link>
              <Link
                href="/give"
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-navy-800 text-ivory-100 font-semibold text-sm shadow-sm hover:bg-navy-900 transition-colors"
              >
                <Heart className="w-4 h-4 mr-2 text-gold-300" />
                Give With Purpose
              </Link>
              <div className="pt-2 text-center">
                <Link
                  href="/admin/login"
                  className="text-xs text-obsidian-600 hover:text-burgundy-700"
                >
                  Admin CMS Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
