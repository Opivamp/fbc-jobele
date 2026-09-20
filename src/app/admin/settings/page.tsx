"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  Clock,
  BookOpen,
  Share2,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert("Failed to save settings");
      }
    } catch {
      alert("Network error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="text-center py-20 text-obsidian-500 text-xs">
        Loading site configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-burgundy-700 uppercase tracking-widest font-sans">
            Site Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Church Information & Settings
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Modify church name, service times, giving bank details, and social media handles in real time.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow transition-colors"
        >
          <Save className="w-4 h-4 mr-1.5 text-gold-300" />
          <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-sanctuary-50 border border-sanctuary-400 text-sanctuary-900 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-sanctuary-700 flex-shrink-0" />
          <span>
            Church settings updated successfully! All changes are now live on the public website.
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs sm:text-sm">
        {/* 1. General Church Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-burgundy-900 flex items-center">
            <Building className="w-4 h-4 mr-2 text-gold-600" />
            General Church Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Official Church Name
              </label>
              <input
                type="text"
                value={settings.churchName}
                onChange={(e) =>
                  setSettings({ ...settings, churchName: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Convention Affiliation
              </label>
              <input
                type="text"
                value={settings.affiliation}
                onChange={(e) =>
                  setSettings({ ...settings, affiliation: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Sanctuary Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Official Telephone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-obsidian-800 mb-1">
                Church Secretariat Office Hours
              </label>
              <input
                type="text"
                value={settings.officeHours}
                onChange={(e) =>
                  setSettings({ ...settings, officeHours: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 2. Giving & Financial Stewardship */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-gold-700 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-gold-600" />
            Bank Transfer & Giving Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={settings.giving.bankName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giving: { ...settings.giving, bankName: e.target.value },
                  })
                }
                placeholder="[Bank Name]"
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={settings.giving.accountName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giving: { ...settings.giving, accountName: e.target.value },
                  })
                }
                placeholder="[Account Name]"
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={settings.giving.accountNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giving: { ...settings.giving, accountNumber: e.target.value },
                  })
                }
                placeholder="[Account Number]"
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Online Giving URL (Optional Paystack / Flutterwave)
              </label>
              <input
                type="url"
                value={settings.giving.onlineGivingUrl || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giving: { ...settings.giving, onlineGivingUrl: e.target.value },
                  })
                }
                placeholder="https://paystack.com/pay/..."
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-obsidian-800 mb-1">
                Giving Narrative Note / Instructions
              </label>
              <textarea
                rows={2}
                value={settings.giving.notes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giving: { ...settings.giving, notes: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Scripture Reflection Highlight */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-navy-800 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-navy-700" />
            Homepage Scripture Reflection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-obsidian-800 mb-1">
                Scripture Verse Text
              </label>
              <input
                type="text"
                value={settings.scriptureHighlight?.verse || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scriptureHighlight: {
                      ...settings.scriptureHighlight,
                      verse: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Scripture Reference
              </label>
              <input
                type="text"
                value={settings.scriptureHighlight?.reference || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scriptureHighlight: {
                      ...settings.scriptureHighlight,
                      reference: e.target.value,
                    },
                  })
                }
                placeholder="e.g. Psalm 119:105"
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Meditation Theme
              </label>
              <input
                type="text"
                value={settings.scriptureHighlight?.theme || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scriptureHighlight: {
                      ...settings.scriptureHighlight,
                      theme: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 4. Social Media Links */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
          <h3 className="font-serif font-bold text-base text-obsidian-950 flex items-center">
            <Share2 className="w-4 h-4 mr-2 text-gold-600" />
            Social Media Handles (Hidden automatically when empty)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      facebook: e.target.value,
                    },
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      youtube: e.target.value,
                    },
                  })
                }
                placeholder="https://youtube.com/@..."
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                WhatsApp Chat Link
              </label>
              <input
                type="url"
                value={settings.socialLinks?.whatsapp || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      whatsapp: e.target.value,
                    },
                  })
                }
                placeholder="https://wa.me/234..."
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian-800 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                placeholder="https://instagram.com/..."
                className="w-full p-2.5 rounded-xl border border-ivory-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-900 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
