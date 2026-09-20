"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Shield, Sparkles, CheckCircle2, UserCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("admin@fbcjobele.org");
  const [password, setPassword] = useState("JobeleFaith2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed. Check your username and password.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const setRoleDemo = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-burgundy-950 to-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Seal Watermark */}
      <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none">
        <Image
          src="/images/brand/logo.jpg"
          alt="Watermark Logo"
          fill
          className="object-contain"
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Brand Logo */}
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gold-400 shadow-elevated mb-4">
          <Image
            src="/images/brand/logo.jpg"
            alt="FBC Jobele Seal"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100 tracking-tight">
          FIRST BAPTIST CHURCH JOBELE
        </h2>
        <p className="text-xs text-gold-400 font-semibold uppercase tracking-widest mt-1">
          CMS Administration Portal &bull; Nigerian Baptist Convention
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border-2 border-gold-500/30 space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-obsidian-950">
              Sign In to Church Dashboard
            </h3>
            <p className="text-xs text-obsidian-600 mt-0.5">
              Authorized church administrators and pastoral staff only.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@fbcjobele.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Verifying Credentials..." : "Enter Administration Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Demo Roles for Evaluation */}
          <div className="pt-4 border-t border-ivory-200">
            <p className="text-[11px] font-bold text-obsidian-500 uppercase tracking-wider mb-2">
              Quick Preloaded Test Accounts:
            </p>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => setRoleDemo("admin@fbcjobele.org", "JobeleFaith2026!")}
                className="w-full text-left p-2 rounded-lg bg-burgundy-50 hover:bg-burgundy-100 border border-burgundy-200 flex items-center justify-between text-burgundy-900 transition-colors"
              >
                <div>
                  <span className="font-bold">Super Admin:</span> admin@fbcjobele.org
                </div>
                <span className="text-[10px] bg-burgundy-700 text-white px-2 py-0.5 rounded">
                  Full Access
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRoleDemo("media@fbcjobele.org", "MediaTeam2026!")}
                className="w-full text-left p-2 rounded-lg bg-gold-50 hover:bg-gold-100 border border-gold-200 flex items-center justify-between text-gold-950 transition-colors"
              >
                <div>
                  <span className="font-bold">Content Admin:</span> media@fbcjobele.org
                </div>
                <span className="text-[10px] bg-gold-600 text-white px-2 py-0.5 rounded">
                  Media & News
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRoleDemo("pastor@fbcjobele.org", "PrayerDesk2026!")}
                className="w-full text-left p-2 rounded-lg bg-navy-50 hover:bg-navy-100 border border-navy-200 flex items-center justify-between text-navy-950 transition-colors"
              >
                <div>
                  <span className="font-bold">Pastoral Staff:</span> pastor@fbcjobele.org
                </div>
                <span className="text-[10px] bg-navy-800 text-white px-2 py-0.5 rounded">
                  Prayer Desk
                </span>
              </button>
            </div>
          </div>

          {/* New Staff Registration Link */}
          <div className="pt-2 text-center border-t border-ivory-200">
            <p className="text-xs text-obsidian-600 mb-2">
              New Church Staff, Minister, or Media Unit?
            </p>
            <Link
              href="/admin/register"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-gold-100 hover:bg-gold-200 text-gold-950 font-bold text-xs border border-gold-400/50 shadow-xs transition-colors"
            >
              <span>Register Staff Account (With Church Passcode)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-obsidian-500 hover:text-burgundy-700 font-medium"
            >
              &larr; Return to Public Church Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
