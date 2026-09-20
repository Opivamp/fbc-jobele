"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Copy,
  Check,
  CreditCard,
  Building,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { initialSiteSettings } from "@/lib/seed-data";

export default function GivePage() {
  const [copied, setCopied] = useState(false);
  const giving = initialSiteSettings.giving;

  const handleCopy = () => {
    navigator.clipboard.writeText(giving.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const purposes = [
    {
      title: "Tithes & Offerings",
      desc: "Returning the first tenth and cheerful free-will offerings in obedience to Malachi 3:10 for the general ministry of the local church.",
    },
    {
      title: "Missions & Evangelism",
      desc: "Funding outreaches in Jobele, church plants across Oyo State, and medical missions to vulnerable communities.",
    },
    {
      title: "Sanctuary & Building Fund",
      desc: "Maintaining and expanding the physical house of God as a welcoming, enduring sanctuary of divine power.",
    },
    {
      title: "Benevolence & Welfare",
      desc: "Caring for widows, orphans, students, and struggling families within our church body and surrounding neighborhood.",
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
              Biblical Stewardship
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Give With Purpose
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo; &mdash; 2 Corinthians 9:7
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Introduction */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Investing in the Kingdom of God
          </h2>
          <p className="text-sm text-obsidian-600 leading-relaxed font-light">
            Your faithful financial support enables First Baptist Church Jobele to faithfully preach the Gospel, shepherd families, care for the needy, and maintain the Sanctuary of Divine Power.
          </p>
        </div>

        {/* Bank Transfer Details Card (Primary giving method) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border-2 border-gold-500/40 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-ivory-300">
            <div className="p-3 rounded-2xl bg-burgundy-50 border border-burgundy-200 text-burgundy-700">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 block">
                Direct Electronic Bank Transfer
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-obsidian-950">
                Church Bank Account
              </h3>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="p-6 rounded-2xl bg-ivory-200/80 border border-ivory-300 space-y-4">
            <div>
              <span className="text-[11px] text-obsidian-500 font-semibold uppercase tracking-wider block">
                Bank Name
              </span>
              <p className="font-serif font-bold text-base sm:text-lg text-obsidian-900 mt-0.5">
                {giving.bankName || "First Bank of Nigeria"}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-obsidian-500 font-semibold uppercase tracking-wider block">
                Account Name
              </span>
              <p className="font-serif font-bold text-base sm:text-lg text-burgundy-900 mt-0.5">
                {giving.accountName || "First Baptist Church Jobele"}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-obsidian-500 font-semibold uppercase tracking-wider block">
                Account Number
              </span>
              <div className="flex items-center justify-between mt-1 bg-white p-3 rounded-xl border border-ivory-300">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-navy-950">
                  {giving.accountNumber}
                </span>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    copied
                      ? "bg-sanctuary-600 text-white"
                      : "bg-gold-500 hover:bg-gold-600 text-obsidian-950"
                  }`}
                  aria-label="Copy account number"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {giving.sortCode && (
              <div className="text-xs text-obsidian-500">
                Sort Code: <span className="font-mono font-semibold">{giving.sortCode}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-gold-50 border border-gold-300/60 text-xs text-gold-950 leading-relaxed font-light">
            <strong>Payment Reference Note:</strong> {giving.notes}
          </div>
        </div>

        {/* Giving Purpose Breakdown */}
        <div className="space-y-6 pt-6">
          <div className="text-center">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-obsidian-950">
              Ways Your Giving Makes a Difference
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purposes.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-subtle space-y-2"
              >
                <h4 className="font-serif font-bold text-base text-burgundy-900">
                  {p.title}
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Confidentiality Note */}
        <div className="p-6 rounded-2xl bg-white border border-ivory-300 flex items-start space-x-3 text-xs text-obsidian-600 max-w-2xl mx-auto">
          <ShieldCheck className="w-5 h-5 text-sanctuary-600 flex-shrink-0 mt-0.5" />
          <p>
            All financial stewardship at First Baptist Church Jobele is audited and stewarded with transparency under the oversight of the Board of Deacons and the Church Finance Committee, in accordance with the Nigerian Baptist Convention standards.
          </p>
        </div>
      </section>
    </div>
  );
}
