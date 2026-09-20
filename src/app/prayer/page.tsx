"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Lock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function PrayerRequestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [category, setCategory] = useState("Healing");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [preferredContact, setPreferredContact] = useState("none");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) {
      setError("Please share your prayer request.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/public/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isAnonymous ? "Anonymous Believer" : name,
          email,
          phone,
          request,
          category,
          isAnonymous,
          preferredContact,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit request.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Sanctuary of Divine Intercession
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Confidential Prayer Requests
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            &ldquo;Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.&rdquo; &mdash; Philippians 4:6
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border-2 border-gold-500/30 space-y-6">
          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex items-start space-x-3 text-xs text-burgundy-950">
            <Lock className="w-4 h-4 text-burgundy-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-burgundy-900">
                Strict Pastoral Confidentiality Guaranteed
              </p>
              <p className="text-burgundy-800/90 mt-0.5">
                Your prayer request is handled with sacred trust. It will <strong className="font-semibold">never appear publicly</strong> on the website. Only our pastoral intercessory ministers have access to pray over your need.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-sanctuary-50 border border-sanctuary-500/40 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-sanctuary-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-sanctuary-900">
                Thank you. Your prayer request has been received.
              </h3>
              <p className="text-sm text-obsidian-700 max-w-lg mx-auto leading-relaxed font-light">
                Our pastors and intercessory prayer band will hold your need in prayer before the throne of grace during our corporate and pastoral prayer sessions. May the Lord answer you speedily according to His sovereign will.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setRequest("");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-burgundy-700 text-white font-bold text-xs shadow hover:bg-burgundy-800 transition-colors"
                >
                  Submit Another Prayer Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Anonymous Toggle */}
              <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-obsidian-900 block">
                    Submit Anonymously
                  </span>
                  <span className="text-xs text-obsidian-600 font-light">
                    Check this if you do not wish to share your name or contact details.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 rounded border-ivory-400 text-burgundy-700 focus:ring-gold-500"
                />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-obsidian-800 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sister Grace"
                      className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-obsidian-800 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-obsidian-800 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="grace@example.com"
                      className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                    />
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Prayer Need Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                >
                  <option value="Healing">Health, Healing & Medical Restoration</option>
                  <option value="Family">Family, Marriage & Child Dedication</option>
                  <option value="Breakthrough">Career, Business & Divine Breakthrough</option>
                  <option value="Spiritual Growth">Spiritual Deliverance & Growth</option>
                  <option value="Thanksgiving">Testimony & Thanksgiving Praise</option>
                  <option value="General">General Intercession</option>
                </select>
              </div>

              {/* Prayer Request Details */}
              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Your Prayer Request *
                </label>
                <textarea
                  rows={5}
                  required
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Please share what you would like our pastoral team to intercede for..."
                  className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900 leading-relaxed"
                />
              </div>

              {/* Preferred Contact Method */}
              {!isAnonymous && (
                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Would you like a pastor to contact you?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { label: "No Contact Needed", val: "none" },
                      { label: "Phone Call", val: "phone" },
                      { label: "WhatsApp", val: "whatsapp" },
                      { label: "Email", val: "email" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setPreferredContact(opt.val)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                          preferredContact === opt.val
                            ? "bg-burgundy-700 text-white border-burgundy-900"
                            : "bg-white text-obsidian-700 border-ivory-300 hover:bg-ivory-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 text-gold-300" />
                <span>{loading ? "Submitting Privately..." : "Submit Prayer Request"}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
