"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  Calendar,
  BookOpen,
  User,
  Star,
  X,
  Volume2,
} from "lucide-react";
import { Sermon } from "@/lib/types";

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Partial<Sermon> | null>(null);

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sermons");
      if (res.ok) {
        const data = await res.json();
        setSermons(data.sermons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const handleOpenCreate = () => {
    setEditingSermon({
      title: "",
      speaker: "Reverend Dr. [Pastor Name]",
      date: new Date().toISOString().split("T")[0],
      scripture: "",
      series: "Sanctuary of Power Series",
      thumbnailUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1000&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      audioUrl: "",
      description: "",
      transcript: "",
      isFeatured: false,
      duration: "45 mins",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Sermon) => {
    setEditingSermon(s);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return;
    try {
      const res = await fetch(`/api/admin/sermons?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSermons((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Error deleting sermon");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSermon) return;

    try {
      const isEdit = Boolean(editingSermon.id);
      const res = await fetch("/api/admin/sermons", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSermon),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingSermon(null);
        fetchSermons();
      } else {
        alert("Failed to save sermon");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-burgundy-700 uppercase tracking-widest font-sans">
            Pulpit Ministry
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Sermon Management
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Add, update, or feature audio and video messages on the public sermon library.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Publish New Sermon</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading sermons...
        </div>
      ) : sermons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            No sermons published yet.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-3 text-xs font-bold text-burgundy-700 underline"
          >
            Create your first message &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sermons.map((sermon) => (
            <div
              key={sermon.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-black">
                  <Image
                    src={sermon.thumbnailUrl || "/images/brand/building.jpg"}
                    alt={sermon.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      {sermon.series}
                    </span>
                  </div>
                  {sermon.isFeatured && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold uppercase flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-obsidian-950" />
                      <span>Homepage Featured</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-gold-700 font-bold uppercase">
                    <BookOpen className="w-3 h-3" />
                    <span>{sermon.scripture}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-obsidian-950">
                    {sermon.title}
                  </h3>

                  <p className="text-xs text-obsidian-600 font-medium">
                    {sermon.speaker} &bull; {new Date(sermon.date).toLocaleDateString()}
                  </p>

                  <p className="text-xs text-obsidian-600 line-clamp-2 leading-relaxed">
                    {sermon.description}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-ivory-200 bg-ivory-50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-obsidian-500">
                  {sermon.videoUrl ? "Video Linked" : "Audio Only"}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(sermon)}
                    className="p-1.5 rounded-lg text-obsidian-700 hover:bg-white hover:text-burgundy-700 border border-ivory-300"
                    title="Edit sermon"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sermon.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-ivory-300"
                    title="Delete sermon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sermon Modal */}
      {modalOpen && editingSermon && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif font-bold text-lg text-obsidian-950">
                {editingSermon.id ? "Edit Sermon" : "Publish New Sermon"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Sermon Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSermon.title || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, title: e.target.value })
                    }
                    placeholder="e.g. Walking in the Reality of Divine Power"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Speaker / Minister *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSermon.speaker || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, speaker: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Scripture Reference *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSermon.scripture || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, scripture: e.target.value })
                    }
                    placeholder="e.g. Ephesians 1:18-20"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Sermon Series
                  </label>
                  <input
                    type="text"
                    value={editingSermon.series || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, series: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Date Preached
                  </label>
                  <input
                    type="date"
                    value={editingSermon.date || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, date: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Video URL (YouTube or Vimeo)
                  </label>
                  <input
                    type="url"
                    value={editingSermon.videoUrl || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, videoUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Audio MP3 Stream / File URL
                  </label>
                  <input
                    type="url"
                    value={editingSermon.audioUrl || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, audioUrl: e.target.value })
                    }
                    placeholder="https://.../sermon.mp3"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={editingSermon.thumbnailUrl || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, thumbnailUrl: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Description & Summary
                  </label>
                  <textarea
                    rows={3}
                    value={editingSermon.description || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Sermon Notes / Transcript Outline
                  </label>
                  <textarea
                    rows={4}
                    value={editingSermon.transcript || ""}
                    onChange={(e) =>
                      setEditingSermon({ ...editingSermon, transcript: e.target.value })
                    }
                    placeholder="Key sermon outline points..."
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-sermon"
                  checked={editingSermon.isFeatured || false}
                  onChange={(e) =>
                    setEditingSermon({
                      ...editingSermon,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="rounded border-ivory-300 text-burgundy-700"
                />
                <label htmlFor="featured-sermon" className="text-obsidian-800 font-semibold cursor-pointer">
                  Feature this sermon on the Homepage Spotlight
                </label>
              </div>

              <div className="pt-4 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-ivory-200 text-obsidian-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-burgundy-700 text-white font-bold hover:bg-burgundy-800"
                >
                  Save Sermon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
