"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "content_admin",
    passcode: "FBC-JOBELE-COVENANT-2026", // Preloaded default for convenience
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!formData.passcode.trim()) {
      setError("Church Staff Security Passcode is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role,
          passcode: formData.passcode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Successfully registered and session cookie is set
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Registration failed. Please verify your details.");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-burgundy-950 to-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Seal Watermark */}
      <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none">
        <Image
          src="/images/brand/logo.jpg"
          alt="Watermark Logo"
          fill
          className="object-contain"
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center px-4">
        {/* Brand Seal */}
        <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-gold-400 shadow-elevated mb-3">
          <Image
            src="/images/brand/logo.jpg"
            alt="FBC Jobele Seal"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100 tracking-tight">
          STAFF ONBOARDING PORTAL
        </h2>
        <p className="text-xs text-gold-400 font-semibold uppercase tracking-widest mt-1">
          First Baptist Church Jobele &bull; CMS Administration
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border-2 border-gold-500/30 space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-obsidian-950">
              Register New Administrator
            </h3>
            <p className="text-xs text-obsidian-600 mt-0.5">
              Strictly for appointed pastors, ministers, deacons, and media workers.
            </p>
          </div>

          {/* Security Passcode Banner */}
          <div className="p-3.5 rounded-xl bg-gold-50 border border-gold-300 text-gold-950 text-xs flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Protected Staff Registration</p>
              <p className="text-gold-900 mt-0.5">
                To prevent unauthorized access, an official security passcode is required.
                Default demo passcode: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-gold-300 font-bold">FBC-JOBELE-COVENANT-2026</code>
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Full Name & Title <span className="text-crimson-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Deaconess Funke Adeleke"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                />
              </div>
            </div>

            {/* Email & Username Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Email Address <span className="text-crimson-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@fbcjobele.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Department / Role <span className="text-crimson-600">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900 font-medium"
                >
                  <option value="content_admin">Media & News Directorate</option>
                  <option value="staff">Pastoral Care & Prayer Desk</option>
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Password <span className="text-crimson-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 chars"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Confirm Password <span className="text-crimson-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Church Staff Security Passcode */}
            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Church Staff Security Passcode <span className="text-crimson-600">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gold-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="passcode"
                  required
                  value={formData.passcode}
                  onChange={handleChange}
                  placeholder="Enter church security passcode"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-300 focus:outline-none focus:border-gold-600 bg-gold-50/50 text-xs text-obsidian-900 font-mono font-bold tracking-wider"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 btn-shimmer-sweep"
            >
              <span>{loading ? "Registering Account..." : "Create Staff Account & Enter Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Return to Login */}
          <div className="pt-4 border-t border-ivory-200 text-center space-y-2">
            <p className="text-xs text-obsidian-600">
              Already have an administrator or pastoral account?{" "}
              <Link
                href="/admin/login"
                className="font-bold text-burgundy-700 hover:underline"
              >
                Sign in here
              </Link>
            </p>
            <div>
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
    </div>
  );
}
