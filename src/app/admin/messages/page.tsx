"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Trash2,
  Calendar,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, status: "new" | "read" | "replied") => {
    try {
      const res = await fetch("/api/admin/contact-messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/contact-messages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Failed to delete message");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-burgundy-700 uppercase tracking-widest font-sans">
          Secretariat Inbox
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-950">
          Contact Messages & Inquiries
        </h1>
        <p className="text-xs text-obsidian-600 mt-0.5">
          General inquiries, visitor pre-registrations, and correspondence submitted through the website.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-obsidian-500 text-xs">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-ivory-300 p-8">
          <p className="font-serif font-bold text-obsidian-900">
            Inbox is clean. No inquiries at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl bg-white border transition-all ${
                msg.status === "new"
                  ? "border-navy-700/50 shadow-sm border-l-4"
                  : "border-ivory-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ivory-200">
                <div className="flex items-center space-x-3">
                  <span className="font-serif font-bold text-base text-obsidian-950">
                    {msg.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-ivory-200 text-obsidian-700 text-[10px] font-bold uppercase tracking-wider">
                    {msg.subject}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      msg.status === "new"
                        ? "bg-blue-100 text-blue-800"
                        : msg.status === "read"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-sanctuary-100 text-sanctuary-800"
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-obsidian-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-sm text-obsidian-800 leading-relaxed font-light">
                  {msg.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-obsidian-600 pt-1">
                  <a
                    href={`mailto:${msg.email}`}
                    className="flex items-center text-navy-800 hover:underline font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    {msg.email}
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="flex items-center text-burgundy-700 hover:underline font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1" />
                      {msg.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  {msg.status === "new" && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, "read")}
                      className="px-3 py-1.5 rounded-lg bg-ivory-200 hover:bg-ivory-300 text-obsidian-800 font-semibold"
                    >
                      Mark as Read
                    </button>
                  )}
                  {msg.status !== "replied" && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, "replied")}
                      className="px-3 py-1.5 rounded-lg bg-sanctuary-600 hover:bg-sanctuary-700 text-white font-bold"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                      msg.subject
                    )} - First Baptist Church Jobele`}
                    className="px-3 py-1.5 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold inline-flex items-center space-x-1"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1 text-gold-300" />
                    <span>Reply via Email</span>
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
