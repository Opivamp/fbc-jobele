"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Calendar, User, X, Newspaper } from "lucide-react";
import { NewsPost } from "@/lib/types";

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/news");
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost({
      title: "",
      slug: "",
      featuredImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
      date: new Date().toISOString().split("T")[0],
      author: "Church Secretary",
      category: "Announcements",
      excerpt: "",
      content: "",
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: NewsPost) => {
    setEditingPost(p);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      alert("Failed to delete post");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const isEdit = Boolean(editingPost.id);
      const slug = editingPost.slug || editingPost.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch("/api/admin/news", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingPost, slug }),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingPost(null);
        fetchNews();
      } else {
        alert("Failed to save post");
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
            Church Communications
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            News & Announcements Management
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Publish pastoral notices, community outreach updates, and convention reports.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Post Announcement</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading announcements...
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            No announcements posted yet.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-3 text-xs font-bold text-burgundy-700 underline"
          >
            Draft your first announcement &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-black">
                  <Image
                    src={item.featuredImage || "/images/brand/building.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-obsidian-500">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-burgundy-700" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-navy-800" />
                      {item.author}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-obsidian-950 leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-obsidian-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-ivory-200 bg-ivory-50 flex items-center justify-between text-xs">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.isPublished ? "bg-sanctuary-100 text-sanctuary-800" : "bg-gray-200 text-gray-700"}`}>
                  {item.isPublished ? "Published" : "Draft"}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-obsidian-700 hover:bg-white hover:text-burgundy-700 border border-ivory-300"
                    title="Edit announcement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-ivory-300"
                    title="Delete announcement"
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
      {modalOpen && editingPost && (
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
                {editingPost.id ? "Edit Announcement" : "Post Announcement"}
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
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ""}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editingPost.author || ""}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, author: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Category
                  </label>
                  <select
                    value={editingPost.category || "Announcements"}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  >
                    <option value="Announcements">Announcements</option>
                    <option value="Outreach & Missions">Outreach & Missions</option>
                    <option value="Discipleship">Discipleship & Education</option>
                    <option value="Pastoral Notice">Pastoral Notice</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    value={editingPost.featuredImage || ""}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        featuredImage: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Short Excerpt (Shows in previews)
                  </label>
                  <textarea
                    rows={2}
                    value={editingPost.excerpt || ""}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, excerpt: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Full Content
                  </label>
                  <textarea
                    rows={6}
                    value={editingPost.content || ""}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, content: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300 leading-relaxed font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={editingPost.isPublished || false}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      isPublished: e.target.checked,
                    })
                  }
                  className="rounded border-ivory-300 text-burgundy-700"
                />
                <label htmlFor="pub" className="text-obsidian-800 font-semibold cursor-pointer">
                  Publish to church website immediately
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
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
