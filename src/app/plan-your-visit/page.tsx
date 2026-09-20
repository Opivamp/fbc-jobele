"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Car,
  Heart,
  Baby,
  Smile,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { getSettings } from "@/lib/db";

export default function PlanYourVisitPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [familySize, setFamilySize] = useState("1");
  const [hasKids, setHasKids] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || "visitor@fbcjobele.org",
          phone,
          subject: "First-Time Visitor Registration",
          message: `I am planning to visit FBC Jobele on ${expectedDate || "Next Sunday"}. Family members attending: ${familySize}. Children joining Kingdom Kids: ${hasKids ? "Yes" : "No"}. Looking forward to worshiping with you!`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Submission error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "What should I wear to service?",
      a: "Come as you are! You will see people in traditional Nigerian attire, suits, business casual, and relaxed dresses. There is no rigid dress code—we prioritize reverent hearts before God.",
      icon: Smile,
    },
    {
      q: "Where do I park when I arrive?",
      a: "Our church premises have dedicated, secure parking on the grounds of the sanctuary. Ushers and protocol officers will direct you to a convenient spot as you arrive.",
      icon: Car,
    },
    {
      q: "What is available for my children?",
      a: "Kingdom Kids & Sunday School offers safe, age-graded classes where children learn Bible stories, sing songs, and engage in creative activities led by trained teachers.",
      icon: Baby,
    },
    {
      q: "What happens during a Sunday service?",
      a: "Services typically run from 9:30 AM to 12:00 PM. Expect vibrant congregational singing, choir hymns, heartfelt prayers, and an uplifting expository message from the Bible.",
      icon: Heart,
    },
  ];

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Welcome to Your Spiritual Home
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            You&apos;re Welcome at FBC Jobele
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to know for your first visit to First Baptist Church Jobele (Sanctuary of Divine Power), Oyo State.
          </p>
        </div>
      </section>

      {/* Main Visitor Overview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Information Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block font-sans">
                What to Expect
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
                Warm Welcome. Divine Encounter.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-obsidian-700 leading-relaxed">
              We know visiting a new church can feel intimidating. At First Baptist Church Jobele, our desire is that from the moment you step onto our sanctuary grounds, you feel respected, received as family, and inspired by the presence of Almighty God.
            </p>

            {/* Quick schedule pill box */}
            <div className="p-6 rounded-2xl bg-white border border-gold-500/30 shadow-subtle space-y-3">
              <h3 className="font-serif font-bold text-base text-burgundy-900 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gold-600" />
                Sunday Gathering Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-obsidian-700 pt-1">
                <div className="p-3 rounded-xl bg-ivory-200/80">
                  <span className="font-bold text-obsidian-900 block text-sm">
                    8:30 AM &ndash; 9:30 AM
                  </span>
                  <p className="text-obsidian-600 mt-0.5">
                    Sunday School & Bible Exposition
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-burgundy-50 border border-burgundy-200/60">
                  <span className="font-bold text-burgundy-950 block text-sm">
                    9:30 AM &ndash; 12:00 PM
                  </span>
                  <p className="text-burgundy-800 mt-0.5">
                    Celebration Service & Preaching
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Directions Card */}
            <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-subtle space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-burgundy-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-base text-obsidian-950">
                    Sanctuary Address & Directions
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-600 mt-0.5">
                    P. O. Box 184, Jobele, Oyo State, Nigeria. Conveniently located along the main town road of Jobele with prominent signage.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=Jobele,+Oyo+State,+Nigeria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900 underline underline-offset-4"
                    >
                      <span>Open in Google Maps / Get Directions</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pre-Register Your Visit Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border-2 border-gold-500/40 space-y-6">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-gold-600 font-sans block">
                  First-Time Guest VIP Form
                </span>
                <h3 className="text-2xl font-serif font-bold text-obsidian-950 mt-1">
                  Let Us Know You&apos;re Coming
                </h3>
                <p className="text-xs text-obsidian-600 mt-1">
                  Fill out this brief note so our hospitality unit can prepare a welcome pack and greet you warmly!
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-sanctuary-50 border border-sanctuary-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-sanctuary-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-sanctuary-800">
                    We Can&apos;t Wait to Meet You!
                  </h4>
                  <p className="text-xs text-obsidian-700 leading-relaxed font-light">
                    Your visit details have been sent to our Church Reception & Hospitality Desk. An usher will be waiting to assist you when you arrive!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-burgundy-700 hover:underline pt-2"
                  >
                    Submit Another Visit Registration
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-obsidian-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Brother Samuel Adebayo"
                      className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 000 0000"
                        className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Date You Hope to Visit
                      </label>
                      <input
                        type="date"
                        value={expectedDate}
                        onChange={(e) => setExpectedDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Number in Party
                      </label>
                      <select
                        value={familySize}
                        onChange={(e) => setFamilySize(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      >
                        <option value="1">Just Me (1)</option>
                        <option value="2">Two People (2)</option>
                        <option value="3-4">Family (3 - 4)</option>
                        <option value="5+">Large Family / Group (5+)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="kids"
                      checked={hasKids}
                      onChange={(e) => setHasKids(e.target.checked)}
                      className="rounded border-ivory-400 text-burgundy-700 focus:ring-gold-500"
                    />
                    <label htmlFor="kids" className="text-obsidian-700 cursor-pointer">
                      I am bringing children who will join Kingdom Kids Sunday School
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5 text-gold-300" />
                    <span>{loading ? "Registering..." : "Submit Plan My Visit"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visitor FAQs */}
      <section className="py-16 bg-ivory-200/60 border-t border-burgundy-900/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block font-sans">
              Common Questions
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => {
              const Icon = faq.icon;
              return (
                <div
                  key={faq.q}
                  className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-subtle space-y-2"
                >
                  <div className="flex items-center space-x-2 text-burgundy-700 font-bold">
                    <Icon className="w-4 h-4 text-gold-600" />
                    <h4 className="font-serif text-base text-obsidian-950">
                      {faq.q}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed font-light pl-6">
                    {faq.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
