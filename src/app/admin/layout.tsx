"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  BookOpen,
  Calendar,
  Newspaper,
  Users,
  Shield,
  HeartHandshake,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // If on login or register page, render children directly without admin chrome
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register";

  useEffect(() => {
    if (isAuthPage) return;

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Photo Gallery", href: "/admin/gallery", icon: Images },
    { name: "Sermons", href: "/admin/sermons", icon: BookOpen },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Announcements", href: "/admin/news", icon: Newspaper },
    { name: "Ministries", href: "/admin/ministries", icon: Users },
    { name: "Leadership", href: "/admin/leadership", icon: Shield },
    { name: "Prayer Requests", href: "/admin/prayers", icon: HeartHandshake },
    { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "content_admin":
        return "Content Admin";
      case "staff":
        return "Pastoral Staff";
      default:
        return "Administrator";
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col lg:flex-row text-obsidian-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-burgundy-950 text-white p-4 flex items-center justify-between border-b border-gold-500/30 sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-400">
            <Image
              src="/images/brand/logo.jpg"
              alt="FBC Seal"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-sm leading-none block">
              FBC JOBELE CMS
            </span>
            <span className="text-[10px] text-gold-400">
              Sanctuary of Divine Power
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-burgundy-900 text-gold-300"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-burgundy-950 via-obsidian-950 to-navy-950 text-ivory-200 border-r-2 border-gold-500/30 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-ivory-200/10 flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400 shadow-sm flex-shrink-0">
              <Image
                src="/images/brand/logo.jpg"
                alt="FBC Jobele Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-ivory-100 leading-tight">
                FBC JOBELE
              </h2>
              <p className="text-[10px] text-gold-400 font-semibold tracking-wider uppercase">
                Admin Control Desk
              </p>
              <p className="text-[10px] text-ivory-400">
                Nigerian Baptist Conv.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {menuItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-gold-500 text-obsidian-950 shadow-md font-bold"
                      : "text-ivory-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      active ? "text-obsidian-950" : "text-gold-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-ivory-200/10 bg-black/40 space-y-3">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-burgundy-800 border border-gold-400 flex items-center justify-center text-gold-300 font-serif font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-ivory-100 truncate">
                  {user.name}
                </p>
                <span className="text-[10px] text-gold-400 block font-medium">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center text-ivory-300 hover:text-gold-300 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center text-red-300 hover:text-red-200 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-ivory-100">
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
