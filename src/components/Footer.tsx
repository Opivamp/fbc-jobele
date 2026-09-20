"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Send,
  Sparkles,
} from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not render public footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const churchName = settings?.churchName || "First Baptist Church Jobele";
  const tagline = settings?.tagline || "Sanctuary of Divine Power";
  const address = settings?.address || "P. O. Box 184, Jobele, Oyo State, Nigeria";
  const phone = settings?.phone || "+234 [Official Phone Number]";
  const email = settings?.email || "contact@fbcjobele.org";
  const social = settings?.socialLinks;

  return (
    <footer className="bg-gradient-to-b from-obsidian-900 via-burgundy-950 to-navy-950 text-ivory-200 border-t-2 border-gold-500/40 relative overflow-hidden">
      {/* Subtle background seal watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none w-96 h-96 transform translate-x-1/3 translate-y-1/3">
        <Image
          src="/images/brand/logo.jpg"
          alt="Watermark Seal"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Church Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400 shadow-md flex-shrink-0">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="First Baptist Church Jobele"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-ivory-100 tracking-tight leading-snug">
                  {churchName}
                </h3>
                <p className="text-xs text-gold-400 font-semibold tracking-wider uppercase">
                  {tagline}
                </p>
                <p className="text-[11px] text-ivory-300/80">
                  Nigerian Baptist Convention
                </p>
              </div>
            </div>

            <p className="text-sm text-ivory-300/90 leading-relaxed font-light">
              A vibrant family of believers anchored in the Word of God, committed to spiritual growth, fervent prayer, heartfelt worship, and extending Christ&apos;s love to Jobele and beyond.
            </p>

            {/* Social Media Links - dynamic visibility */}
            <div className="pt-2">
              <span className="text-xs text-gold-300 font-semibold tracking-wider uppercase block mb-2">
                Connect With Us
              </span>
              <div className="flex items-center space-x-3">
                {social?.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="p-2 rounded-full bg-burgundy-900/80 hover:bg-gold-500 hover:text-obsidian-950 text-ivory-200 transition-colors border border-gold-500/20"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {social?.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="p-2 rounded-full bg-burgundy-900/80 hover:bg-gold-500 hover:text-obsidian-950 text-ivory-200 transition-colors border border-gold-500/20"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {social?.whatsapp && (
                  <a
                    href={social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="p-2 rounded-full bg-burgundy-900/80 hover:bg-gold-500 hover:text-obsidian-950 text-ivory-200 transition-colors border border-gold-500/20"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}
                {social?.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="p-2 rounded-full bg-burgundy-900/80 hover:bg-gold-500 hover:text-obsidian-950 text-ivory-200 transition-colors border border-gold-500/20"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {social?.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="p-2 rounded-full bg-burgundy-900/80 hover:bg-gold-500 hover:text-obsidian-950 text-ivory-200 transition-colors border border-gold-500/20"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gold-400 tracking-wider uppercase border-b border-gold-500/20 pb-2 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Quick Exploration
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  About Our Church & Beliefs
                </Link>
              </li>
              <li>
                <Link
                  href="/leadership"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  Pastoral Leadership & Deacons
                </Link>
              </li>
              <li>
                <Link
                  href="/ministries"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  Ministries & Fellowships
                </Link>
              </li>
              <li>
                <Link
                  href="/sermons"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  Sermon Library & Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  Upcoming Church Events
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  Church Photo Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-ivory-300 hover:text-gold-300 transition-colors block py-0.5"
                >
                  News & Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Times & Spiritual Care */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gold-400 tracking-wider uppercase border-b border-gold-500/20 pb-2 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Service Times
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-ivory-300">
              <div className="p-2.5 rounded-lg bg-burgundy-950/60 border border-burgundy-800/40">
                <span className="font-semibold text-ivory-100 block text-xs uppercase tracking-wide text-gold-300">
                  Sunday Morning
                </span>
                <p className="font-medium text-ivory-200 mt-0.5">
                  8:30 AM &ndash; Sunday School
                </p>
                <p className="font-medium text-ivory-200">
                  9:30 AM &ndash; Celebration Worship
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-burgundy-950/60 border border-burgundy-800/40">
                <span className="font-semibold text-ivory-100 block text-xs uppercase tracking-wide text-gold-300">
                  Midweek Encounter
                </span>
                <p className="font-medium text-ivory-200 mt-0.5">
                  Wednesday: 5:30 PM &ndash; Bible Study & Prayer
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-burgundy-950/60 border border-burgundy-800/40">
                <span className="font-semibold text-ivory-100 block text-xs uppercase tracking-wide text-gold-300">
                  Monthly Night Vigil
                </span>
                <p className="font-medium text-ivory-200 mt-0.5">
                  Last Friday: 10:00 PM &ndash; Divine Power Night
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/prayer"
                className="inline-flex items-center text-xs font-semibold text-gold-300 hover:text-gold-200 underline underline-offset-4"
              >
                Submit a Private Prayer Request &rarr;
              </Link>
            </div>
          </div>

          {/* Column 4: Contact & Generosity */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gold-400 tracking-wider uppercase border-b border-gold-500/20 pb-2 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Contact Sanctuary
            </h4>
            <div className="space-y-3 text-sm text-ivory-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-1 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{email}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/give"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-obsidian-950 font-semibold text-sm shadow-md transition-all duration-200"
              >
                <Heart className="w-4 h-4 mr-2 text-burgundy-900 fill-burgundy-900" />
                Give With Purpose
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Pastoral Portal */}
        <div className="mt-12 pt-6 border-t border-ivory-200/10 flex flex-col sm:flex-row justify-between items-center text-xs text-ivory-400 gap-4">
          <p>
            &copy; {currentYear} First Baptist Church Jobele. All Rights Reserved. Affiliated with the Nigerian Baptist Convention.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/plan-your-visit"
              className="hover:text-gold-300 transition-colors"
            >
              Visitor Guide
            </Link>
            <span>&bull;</span>
            <Link
              href="/prayer"
              className="hover:text-gold-300 transition-colors"
            >
              Prayer Desk
            </Link>
            <span>&bull;</span>
            <Link
              href="/admin/login"
              className="hover:text-gold-300 text-ivory-400/80 transition-colors"
            >
              CMS Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
