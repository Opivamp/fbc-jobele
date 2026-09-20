"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Mail, Phone, Shield, X, Star } from "lucide-react";
import { Leadership } from "@/lib/types";

export default function AdminLeadershipPage() {
  const [leaders, setLeaders] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Partial<Leadership> | null>(null);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leadership");
      if (res.ok) {
        const data = await res.json();
        setLeaders(data.leadership || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleOpenCreate = () => {
    setEditingLeader({
      name: "",
      role: "Associate Minister",
      category: "Pastoral",
      bio: "",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      phone: "+234 [Church Phone]",
      email: "leader@fbcjobele.org",
      order: leaders.length + 1,
      isSeniorLeader: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (l: Leadership) => {
    setEditingLeader(l);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leader profile?")) return;
    try {
      const res = await fetch(`/api/admin/leadership?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeaders((prev) => prev.filter((l) => l.id !== id));
      }
    } catch {
      alert("Failed to delete leader");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeader) return;

    try {
      const isEdit = Boolean(editingLeader.id);
      const res = await fetch("/api/admin/leadership", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLeader),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingLeader(null);
        fetchLeaders();
      } else {
        alert("Failed to save leader profile");
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
            Pastoral Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Leadership & Council Management
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Manage pastoral biographies, deacon chairs, department leaders, and Senior Pastor spotlight.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Leader Profile</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading leadership team...
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            No leader profiles yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-black">
                  <Image
                    src={leader.image || "/images/brand/building.jpg"}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      {leader.category}
                    </span>
                  </div>
                  {leader.isSeniorLeader && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold uppercase flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-obsidian-950" />
                      <span>Senior Pastor</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif font-bold text-lg text-obsidian-950">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
                    {leader.role}
                  </p>
                  <p className="text-xs text-obsidian-600 line-clamp-3 leading-relaxed font-light">
                    {leader.bio}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-ivory-200 bg-ivory-50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-obsidian-500">
                  {leader.email}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(leader)}
                    className="p-1.5 rounded-lg text-obsidian-700 hover:bg-white hover:text-burgundy-700 border border-ivory-300"
                    title="Edit profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(leader.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-ivory-300"
                    title="Delete profile"
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
      {modalOpen && editingLeader && (
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
                {editingLeader.id ? "Edit Leader Profile" : "Add Leader Profile"}
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
                    Leader Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLeader.name || ""}
                    onChange={(e) =>
                      setEditingLeader({ ...editingLeader, name: e.target.value })
                    }
                    placeholder="e.g. Reverend Dr. [Pastor Name]"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Title / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLeader.role || ""}
                    onChange={(e) =>
                      setEditingLeader({ ...editingLeader, role: e.target.value })
                    }
                    placeholder="e.g. Senior Pastor & Spiritual Overseer"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Leadership Category
                  </label>
                  <select
                    value={editingLeader.category || "Pastoral"}
                    onChange={(e) =>
                      setEditingLeader({
                        ...editingLeader,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  >
                    <option value="Pastoral">Pastoral Ministry</option>
                    <option value="Deacons">Board of Deacons</option>
                    <option value="Ministers">Associate Ministers</option>
                    <option value="Heads">Department & Committee Heads</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={editingLeader.phone || ""}
                    onChange={(e) =>
                      setEditingLeader({ ...editingLeader, phone: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Email Contact
                  </label>
                  <input
                    type="email"
                    value={editingLeader.email || ""}
                    onChange={(e) =>
                      setEditingLeader({ ...editingLeader, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Portrait Photograph URL
                  </label>
                  <input
                    type="text"
                    value={editingLeader.image || ""}
                    onChange={(e) =>
                      setEditingLeader({ ...editingLeader, image: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Biography & Ministry Responsibility
                  </label>
                  <textarea
                    rows={4}
                    value={editingLeader.bio || ""}
                    onChange={(e) =>
                      setEditingLeader({ ...editingLeader, bio: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300 leading-relaxed font-light"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="senior"
                  checked={editingLeader.isSeniorLeader || false}
                  onChange={(e) =>
                    setEditingLeader({
                      ...editingLeader,
                      isSeniorLeader: e.target.checked,
                    })
                  }
                  className="rounded border-ivory-300 text-burgundy-700"
                />
                <label htmlFor="senior" className="text-obsidian-800 font-semibold cursor-pointer">
                  Mark as Senior Pastor (Featured prominent display on About & Leadership pages)
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
                  Save Leader Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
