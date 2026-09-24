"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Facebook,
  Youtube,
  MessageSquare,
} from "lucide-react";
import { initialSiteSettings } from "@/lib/seed-data";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(initialSiteSettings);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Could not fetch latest contact settings:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit message.");
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
              Connect With Church Office
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Contact First Baptist Church Jobele
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Have questions, need pastoral counseling, or want to connect with our administrative secretary? We are here to assist you.
          </p>
        </div>
      </section>

      {/* Main Form & Info Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block font-sans">
                Reach Us Directly
              </span>
              <h2 className="text-3xl font-serif font-bold text-obsidian-950">
                Church Secretariat
              </h2>
              <p className="text-sm text-obsidian-600 leading-relaxed font-light">
                Our church office is available throughout the week to support church members, coordinate weddings, child dedications, and respond to general inquiries.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-subtle flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-burgundy-50 text-burgundy-700 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-obsidian-950">
                    Sanctuary Address
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-600 mt-0.5">
                    {settings.address}
                  </p>
                  <p className="text-xs text-gold-700 font-semibold mt-1">
                    Jobele, Oyo State, Nigeria
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-subtle flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-gold-50 text-gold-700 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-obsidian-950">
                    Telephone
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-600 mt-0.5">
                    {settings.phone}
                  </p>
                  <p className="text-xs text-obsidian-500 mt-0.5">
                    Pastoral Care & Office Inquiries
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-subtle flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-navy-50 text-navy-800 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-obsidian-950">
                    Email Correspondence
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-600 mt-0.5">
                    {settings.email}
                  </p>
                  <p className="text-xs text-obsidian-500 mt-0.5">
                    Official inquiries & correspondence
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-subtle flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-sanctuary-50 text-sanctuary-700 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-obsidian-950">
                    Pastoral Office Hours
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-600 mt-0.5">
                    {settings.officeHours}
                  </p>
                  <p className="text-xs text-obsidian-500 mt-0.5">
                    Saturdays: Choir & Ministry Rehearsals
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border-2 border-gold-500/40 space-y-6">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-gold-600 font-sans block">
                  Send a Message
                </span>
                <h3 className="text-2xl font-serif font-bold text-obsidian-950 mt-1">
                  How Can We Help You?
                </h3>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-sanctuary-50 border border-sanctuary-500/40 text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-sanctuary-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-sanctuary-900">
                    Message Sent Successfully
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-700 leading-relaxed font-light">
                    Thank you for contacting First Baptist Church Jobele. Our church secretariat has received your note and will be in touch shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="text-xs font-bold text-burgundy-700 hover:underline pt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Deaconess Funke"
                        className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-obsidian-800 mb-1">
                        Subject / Department
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900"
                      >
                        <option value="General Inquiry">General Church Inquiry</option>
                        <option value="Pastoral Counseling">Pastoral Counseling</option>
                        <option value="Wedding / Child Dedication">Wedding or Child Dedication</option>
                        <option value="Baptism & Membership">Baptism & Membership Classes</option>
                        <option value="Welfare & Support">Welfare & Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-obsidian-800 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full p-3 rounded-xl border border-ivory-300 focus:outline-none focus:border-gold-500 bg-ivory-50 text-xs text-obsidian-900 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4 text-gold-300" />
                    <span>{loading ? "Sending Message..." : "Send Message to Church Office"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
