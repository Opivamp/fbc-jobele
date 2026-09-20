"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Clock, Users, X } from "lucide-react";
import { Ministry } from "@/lib/types";

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMin, setEditingMin] = useState<Partial<Ministry> | null>(null);

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ministries");
      if (res.ok) {
        const data = await res.json();
        setMinistries(data.ministries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleOpenCreate = () => {
    setEditingMin({
      name: "",
      slug: "",
      coverImage: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
      description: "",
      purpose: "",
      meetingTime: "Saturdays, 5:00 PM",
      leader: "[Leader Name]",
      contact: "ministry@fbcjobele.org",
      category: "Worship & Arts",
      order: ministries.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: Ministry) => {
    setEditingMin(m);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ministry?")) return;
    try {
      const res = await fetch(`/api/admin/ministries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMinistries((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Failed to delete ministry");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMin) return;

    try {
      const isEdit = Boolean(editingMin.id);
      const slug = editingMin.slug || editingMin.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch("/api/admin/ministries", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingMin, slug }),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingMin(null);
        fetchMinistries();
      } else {
        alert("Failed to save ministry");
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
            Church Fellowships
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Ministries Management
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Add, edit, reorder, or update meeting times and department coordinators.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Ministry</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading ministries...
        </div>
      ) : ministries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            No ministries registered yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((min) => (
            <div
              key={min.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-black">
                  <Image
                    src={min.coverImage || "/images/brand/building.jpg"}
                    alt={min.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      {min.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-obsidian-950">
                    {min.name}
                  </h3>
                  <p className="text-xs text-obsidian-600 line-clamp-2">
                    {min.description}
                  </p>

                  <div className="pt-2 text-xs text-obsidian-500 space-y-1">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-burgundy-700" />
                      <span>{min.meetingTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-navy-800" />
                      <span>Leader: {min.leader}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-ivory-200 bg-ivory-50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-obsidian-500">
                  {min.contact}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(min)}
                    className="p-1.5 rounded-lg text-obsidian-700 hover:bg-white hover:text-burgundy-700 border border-ivory-300"
                    title="Edit ministry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(min.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-ivory-300"
                    title="Delete ministry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && editingMin && (
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
                {editingMin.id ? "Edit Ministry" : "Add New Ministry"}
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
                    Ministry Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMin.name || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Category
                  </label>
                  <select
                    value={editingMin.category || "Worship & Arts"}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  >
                    <option value="Worship & Arts">Worship & Arts</option>
                    <option value="Generations">Generations & Youth</option>
                    <option value="Fellowships">Adult Fellowships</option>
                    <option value="Outreach & Missions">Outreach & Missions</option>
                    <option value="Spiritual Life">Spiritual Life</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Meeting Time & Frequency
                  </label>
                  <input
                    type="text"
                    value={editingMin.meetingTime || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, meetingTime: e.target.value })
                    }
                    placeholder="e.g. Saturdays, 5:00 PM"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Coordinator / Leader
                  </label>
                  <input
                    type="text"
                    value={editingMin.leader || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, leader: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Contact Email / Phone
                  </label>
                  <input
                    type="text"
                    value={editingMin.contact || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, contact: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={editingMin.coverImage || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, coverImage: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Ministry Purpose Statement
                  </label>
                  <textarea
                    rows={2}
                    value={editingMin.purpose || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, purpose: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingMin.description || ""}
                    onChange={(e) =>
                      setEditingMin({ ...editingMin, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>
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
                  Save Ministry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
