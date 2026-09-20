"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Sparkles, Radio, Calendar, ArrowRight } from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  serviceName: string;
}

export default function WorshipCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    serviceName: "Sunday Celebration Service",
  });

  useEffect(() => {
    setMounted(true);

    const calculateNextService = () => {
      const now = new Date();
      // Target upcoming Sunday 9:30 AM
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Check if currently during Sunday worship (Sunday 9:30am - 12:00pm)
      if (
        currentDay === 0 &&
        (currentHours > 9 || (currentHours === 9 && currentMinutes >= 30)) &&
        currentHours < 12
      ) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: true,
          serviceName: "Sunday Celebration Service",
        };
      }

      // Check if upcoming is Wednesday Bible Study (Wednesday 5:30pm)
      // or next Sunday 9:30am
      const target = new Date(now);

      // Find next Sunday 9:30 AM
      let daysUntilSunday = (7 - currentDay) % 7;
      if (daysUntilSunday === 0 && (currentHours > 12 || (currentHours === 12 && currentMinutes > 0))) {
        daysUntilSunday = 7; // Next Sunday
      } else if (daysUntilSunday === 0 && currentHours < 9) {
        daysUntilSunday = 0; // Today Sunday morning
      }

      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(9, 30, 0, 0);

      let serviceName = "Sunday Celebration Service";

      // If today is Monday or Tuesday or Wed before 5:30pm, check if Wednesday Bible Study is closer
      if (currentDay >= 1 && currentDay <= 3) {
        const wedTarget = new Date(now);
        const daysUntilWed = (3 - currentDay);
        wedTarget.setDate(now.getDate() + daysUntilWed);
        wedTarget.setHours(17, 30, 0, 0);

        if (wedTarget.getTime() > now.getTime() && wedTarget.getTime() < target.getTime()) {
          const diffWed = wedTarget.getTime() - now.getTime();
          const d = Math.floor(diffWed / (1000 * 60 * 60 * 24));
          const h = Math.floor((diffWed / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diffWed / (1000 * 60)) % 60);
          const s = Math.floor((diffWed / 1000) % 60);
          return {
            days: d,
            hours: h,
            minutes: m,
            seconds: s,
            isLive: false,
            serviceName: "Midweek Bible Study & Prayer",
          };
        }
      }

      const diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return {
        days,
        hours,
        minutes,
        seconds,
        isLive: false,
        serviceName,
      };
    };

    setTimeLeft(calculateNextService());
    const interval = setInterval(() => {
      setTimeLeft(calculateNextService());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="py-2 flex items-center justify-center text-xs text-gold-300">
        <Clock className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        <span>Syncing worship countdown...</span>
      </div>
    );
  }

  if (timeLeft.isLive) {
    return (
      <div className="bg-gradient-to-r from-sanctuary-700 via-sanctuary-600 to-sanctuary-800 p-4 rounded-xl border border-sanctuary-400/50 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulseGlow">
        <div className="flex items-center space-x-3 text-white text-center sm:text-left">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-crimson-500 border-2 border-white animate-ping" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-crimson-600 text-white text-[10px] font-black uppercase tracking-widest">
                LIVE NOW
              </span>
              <span className="text-xs font-semibold text-white/90">Sanctuary of Divine Power</span>
            </div>
            <p className="font-serif font-bold text-base sm:text-lg text-white mt-0.5">
              Sunday Celebration Service in Session
            </p>
          </div>
        </div>

        <Link
          href="/plan-your-visit"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-sanctuary-800 hover:bg-gold-100 font-bold text-xs shadow-md transition-all btn-shimmer-sweep"
        >
          <span>Join Us Live in Sanctuary</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-md border border-gold-500/30 rounded-xl p-3 sm:p-4 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <div className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400 block font-sans">
              Next Worship Countdown
            </span>
            <span className="text-xs sm:text-sm font-serif font-bold text-ivory-100">
              {timeLeft.serviceName}
            </span>
          </div>
        </div>

        {/* Digits Display */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-burgundy-950/80 border border-gold-500/40 flex items-center justify-center shadow-inner">
              <span className="font-mono font-bold text-base sm:text-lg text-gold-300">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-ivory-300/80 mt-1 font-semibold">
              Days
            </span>
          </div>

          <span className="text-gold-400 font-bold text-base mb-4">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-burgundy-950/80 border border-gold-500/40 flex items-center justify-center shadow-inner">
              <span className="font-mono font-bold text-base sm:text-lg text-gold-300">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-ivory-300/80 mt-1 font-semibold">
              Hours
            </span>
          </div>

          <span className="text-gold-400 font-bold text-base mb-4">:</span>

          {/* Mins */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-burgundy-950/80 border border-gold-500/40 flex items-center justify-center shadow-inner">
              <span className="font-mono font-bold text-base sm:text-lg text-gold-300">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-ivory-300/80 mt-1 font-semibold">
              Mins
            </span>
          </div>

          <span className="text-gold-400 font-bold text-base mb-4">:</span>

          {/* Secs */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-burgundy-900 border border-gold-400 flex items-center justify-center shadow-inner">
              <span className="font-mono font-bold text-base sm:text-lg text-gold-200">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-gold-400 mt-1 font-semibold">
              Secs
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/plan-your-visit"
          className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs shadow transition-all btn-shimmer-sweep"
        >
          <span>Plan To Attend</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
