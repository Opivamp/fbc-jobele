"use client";

import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  CheckCircle2,
  Trash2,
  Lock,
  Calendar,
  Phone,
  Mail,
  Archive,
  Eye,
  X,
  MessageSquare,
} from "lucide-react";
import { PrayerRequest } from "@/lib/types";

export default function AdminPrayersPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "prayed" | "archived">("all");
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [pastoralNote, setPastoralNote] = useState("");

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/prayers");
      if (res.ok) {
        const data = await res.json();
        setPrayers(data.prayerRequests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: "unread" | "prayed" | "archived",
    notes?: string
  ) => {
    try {
      const res = await fetch("/api/admin/prayers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          ...(notes !== undefined ? { pastoralNotes: notes } : {}),
        }),
      });
      if (res.ok) {
        setPrayers((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  ...(notes !== undefined ? { pastoralNotes: notes } : {}),
                }
              : p
          )
        );
        if (selectedPrayer && selectedPrayer.id === id) {
          setSelectedPrayer((prev) =>
            prev
              ? {
                  ...prev,
                  status,
                  ...(notes !== undefined ? { pastoralNotes: notes } : {}),
                }
              : null
          );
        }
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this prayer request?")) return;
    try {
      const res = await fetch(`/api/admin/prayers?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPrayers((prev) => prev.filter((p) => p.id !== id));
        if (selectedPrayer?.id === id) setSelectedPrayer(null);
      }
    } catch {
      alert("Failed to delete request");
    }
  };

  const filtered = prayers.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-crimson-600 uppercase tracking-widest font-sans flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1" />
            Strictly Confidential Pastoral Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Prayer Requests & Intercession
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            These submissions are never displayed publicly. Review, intercede, and track spiritual care.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 bg-ivory-200 p-1 rounded-xl border border-ivory-300 text-xs font-semibold">
          {(["all", "unread", "prayed", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? "bg-burgundy-700 text-white shadow-xs"
                  : "text-obsidian-700 hover:text-obsidian-950"
              }`}
            >
              {f} ({f === "all" ? prayers.length : prayers.filter((p) => p.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading prayer requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            No prayer requests in this category.
          </p>
          <p className="text-xs text-obsidian-500 mt-1">
            New confidential submissions submitted through the public website will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((prayer) => (
            <div
              key={prayer.id}
              className={`p-6 rounded-2xl border transition-all duration-200 bg-white ${
                prayer.status === "unread"
                  ? "border-crimson-600/40 shadow-sm border-l-4"
                  : prayer.status === "prayed"
                  ? "border-sanctuary-500/40 shadow-subtle border-l-4"
                  : "border-ivory-300 opacity-75"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ivory-200">
                <div className="flex items-center space-x-3">
                  <span className="font-serif font-bold text-base text-obsidian-950">
                    {prayer.isAnonymous ? "Anonymous Believer" : prayer.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-ivory-200 text-obsidian-700 text-[10px] font-bold uppercase tracking-wider">
                    {prayer.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      prayer.status === "unread"
                        ? "bg-red-100 text-red-800"
                        : prayer.status === "prayed"
                        ? "bg-sanctuary-100 text-sanctuary-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {prayer.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-obsidian-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    {new Date(prayer.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Request Text */}
              <div className="py-4 space-y-2">
                <p className="text-sm text-obsidian-800 leading-relaxed font-light">
                  {prayer.request}
                </p>

                {/* Contact info if provided */}
                {!prayer.isAnonymous && (prayer.phone || prayer.email) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-obsidian-600 pt-1">
                    {prayer.phone && (
                      <span className="flex items-center text-burgundy-700">
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        {prayer.phone}
                      </span>
                    )}
                    {prayer.email && (
                      <span className="flex items-center text-navy-800">
                        <Mail className="w-3.5 h-3.5 mr-1" />
                        {prayer.email}
                      </span>
                    )}
                    <span className="text-[11px] text-obsidian-500">
                      Preferred: {prayer.preferredContact}
                    </span>
                  </div>
                )}

                {/* Pastoral Notes */}
                {prayer.pastoralNotes && (
                  <div className="p-3 rounded-xl bg-gold-50/80 border border-gold-200 text-xs text-gold-950 mt-2">
                    <span className="font-bold block">Pastoral Care Note:</span>
                    <p className="mt-0.5">{prayer.pastoralNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs">
                  {prayer.status !== "prayed" && (
                    <button
                      onClick={() => handleUpdateStatus(prayer.id, "prayed")}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-sanctuary-600 hover:bg-sanctuary-700 text-white font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      <span>Mark as Lifted in Prayer</span>
                    </button>
                  )}

                  {prayer.status !== "archived" && (
                    <button
                      onClick={() => handleUpdateStatus(prayer.id, "archived")}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-ivory-200 hover:bg-ivory-300 text-obsidian-700 font-semibold"
                    >
                      <Archive className="w-3.5 h-3.5 mr-1" />
                      <span>Archive</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedPrayer(prayer);
                      setPastoralNote(prayer.pastoralNotes || "");
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-ivory-300 hover:bg-ivory-50 text-obsidian-700 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    <span>{prayer.pastoralNotes ? "Edit Pastoral Note" : "Add Note"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(prayer.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Delete prayer request"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      {selectedPrayer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedPrayer(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif font-bold text-lg text-obsidian-950">
                Pastoral Care Notes
              </h3>
              <button
                onClick={() => setSelectedPrayer(null)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-ivory-100 text-obsidian-700">
                <span className="font-bold">From: </span>
                {selectedPrayer.name} ({selectedPrayer.category})
              </div>

              <div>
                <label className="block font-semibold text-obsidian-800 mb-1">
                  Private Intercessory & Follow-up Notes
                </label>
                <textarea
                  rows={4}
                  value={pastoralNote}
                  onChange={(e) => setPastoralNote(e.target.value)}
                  placeholder="e.g. Prayed for during Tuesday ministerial prayer. Contacted via phone on Thursday..."
                  className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedPrayer(null)}
                  className="px-4 py-2 rounded-xl bg-ivory-200 text-obsidian-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(
                      selectedPrayer.id,
                      selectedPrayer.status,
                      pastoralNote
                    );
                    setSelectedPrayer(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-burgundy-700 text-white font-bold"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
