"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Star,
  X,
  Sparkles,
} from "lucide-react";
import { Event } from "@/lib/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent({
      title: "",
      coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      location: "Main Sanctuary, FBC Jobele, Oyo State",
      description: "",
      organizer: "FBC Jobele Planning Committee",
      registrationLink: "",
      contact: "+234 803 000 1234",
      isFeatured: false,
      category: "Conferences & Revivals",
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (e: Event) => {
    setEditingEvent(e);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      alert("Failed to delete event");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const isEdit = Boolean(editingEvent.id);
      const res = await fetch("/api/admin/events", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        alert("Failed to save event");
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
            Gatherings & Calendar
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
            Church Events Management
          </h1>
          <p className="text-xs text-obsidian-600 mt-0.5">
            Schedule upcoming conventions, outreaches, and services. Marking an event as &quot;Featured&quot; displays it prominently on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Create New Event</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            No events scheduled yet.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-3 text-xs font-bold text-burgundy-700 underline"
          >
            Create your first church event &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-black">
                  <Image
                    src={event.coverImage || "/images/brand/building.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-burgundy-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  {event.isFeatured && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold uppercase flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-obsidian-950" />
                      <span>Featured on Home</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center space-x-3 text-xs text-burgundy-700 font-bold">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {event.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center text-gold-700">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {event.startTime}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-obsidian-950">
                    {event.title}
                  </h3>

                  <p className="text-xs text-obsidian-500 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-navy-800" />
                    {event.location}
                  </p>

                  <p className="text-xs text-obsidian-600 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-ivory-200 bg-ivory-50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-obsidian-500">
                  Organizer: {event.organizer}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(event)}
                    className="p-1.5 rounded-lg text-obsidian-700 hover:bg-white hover:text-burgundy-700 border border-ivory-300"
                    title="Edit event"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-ivory-300"
                    title="Delete event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {modalOpen && editingEvent && (
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
                {editingEvent.id ? "Edit Event" : "Create Church Event"}
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
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, title: e.target.value })
                    }
                    placeholder="e.g. Annual Divine Power Convention"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Category
                  </label>
                  <select
                    value={editingEvent.category || "Conferences & Revivals"}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  >
                    <option value="Conferences & Revivals">Conferences & Revivals</option>
                    <option value="Worship">Special Worship Service</option>
                    <option value="Outreach">Community Outreach</option>
                    <option value="Youth">Youth Program</option>
                    <option value="Fellowship">Fellowship Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={editingEvent.startTime || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, startTime: e.target.value })
                    }
                    placeholder="e.g. 05:00 PM"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={editingEvent.endTime || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, endTime: e.target.value })
                    }
                    placeholder="e.g. 08:30 PM"
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Location Venue
                  </label>
                  <input
                    type="text"
                    value={editingEvent.location || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, location: e.target.value })
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
                    value={editingEvent.coverImage || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, coverImage: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Description & Program Details
                  </label>
                  <textarea
                    rows={4}
                    value={editingEvent.description || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Organizer / Board
                  </label>
                  <input
                    type="text"
                    value={editingEvent.organizer || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, organizer: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian-800 mb-1">
                    Registration Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.registrationLink || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, registrationLink: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-ivory-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-event"
                  checked={editingEvent.isFeatured || false}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="rounded border-ivory-300 text-burgundy-700"
                />
                <label htmlFor="featured-event" className="text-obsidian-800 font-semibold cursor-pointer">
                  Feature this event on the Homepage Spotlight (One at a time)
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
