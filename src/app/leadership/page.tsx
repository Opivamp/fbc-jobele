import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Sparkles, Shield, Heart } from "lucide-react";
import { ensureDbLoadedAsync, getLeadershipAsync, getSettingsAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pastoral Leadership & Deacons | First Baptist Church Jobele",
  description:
    "Meet the pastoral leadership, ministers, deacons, and administrators serving First Baptist Church Jobele in Oyo State.",
};

export default async function LeadershipPage() {
  await ensureDbLoadedAsync();
  const settings = await getSettingsAsync();
  const leaders = await getLeadershipAsync();
  const seniorLeader = leaders.find((l) => l.isSeniorLeader) || leaders[0];
  const otherLeaders = leaders.filter((l) => l.id !== seniorLeader?.id);

  return (
    <div className="bg-ivory-100 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white border-b-2 border-gold-500/40 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Servants of Christ
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight">
            Our Pastoral Leadership
          </h1>
          <p className="text-base sm:text-lg text-ivory-200 max-w-2xl mx-auto font-light leading-relaxed">
            Godly men and women dedicated to prayer, pastoral care, spiritual mentorship, and the oversight of {settings.churchName || "First Baptist Church Jobele"}.
          </p>
        </div>
      </section>

      {/* Senior Pastor Feature Section */}
      {seniorLeader && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-elevated border-2 border-gold-500/40">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-full min-h-[380px]">
                <Image
                  src={seniorLeader.image}
                  alt={seniorLeader.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-burgundy-800 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-400/30">
                    Senior Pastor
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block font-sans">
                      Spiritual Shepherd & Teacher
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 mt-1">
                      {seniorLeader.name}
                    </h2>
                    <p className="text-base font-semibold text-gold-700 mt-1">
                      {seniorLeader.role}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-obsidian-700 leading-relaxed font-light">
                    {seniorLeader.bio}
                  </p>

                  <div className="p-4 rounded-xl bg-ivory-200/80 border-l-4 border-gold-500 text-xs text-obsidian-700 space-y-1">
                    <p className="font-semibold text-obsidian-900">
                      Pastoral Office Hours:
                    </p>
                    <p>Tuesdays & Thursdays: 10:00 AM – 2:00 PM (By Appointment)</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-ivory-300 flex flex-wrap items-center gap-4 text-xs font-semibold text-obsidian-700">
                  {seniorLeader.phone && (
                    <span className="flex items-center text-burgundy-700">
                      <Phone className="w-4 h-4 mr-1.5" />
                      {seniorLeader.phone}
                    </span>
                  )}
                  {seniorLeader.email && (
                    <span className="flex items-center text-navy-800">
                      <Mail className="w-4 h-4 mr-1.5" />
                      {seniorLeader.email}
                    </span>
                  )}
                  <Link
                    href="/prayer"
                    className="ml-auto inline-flex items-center text-xs font-bold text-burgundy-700 hover:text-burgundy-900 underline underline-offset-4"
                  >
                    Request Pastoral Counseling &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Leadership Team Grid */}
      <section className="py-16 bg-ivory-200/50 border-t border-burgundy-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block mb-1 font-sans">
              Ministry Leaders & Deacons
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              Church Council & Department Heads
            </h3>
            <p className="text-sm text-obsidian-600 mt-2">
              Serving the body of Christ with spiritual integrity, servant leadership, and dedicated care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-ivory-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={leader.image || "/images/brand/building.jpg"}
                      alt={leader.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-burgundy-900/90 text-gold-300 text-[10px] font-bold uppercase tracking-wider border border-gold-400/30">
                        {leader.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <h4 className="font-serif font-bold text-xl text-obsidian-950 group-hover:text-burgundy-700 transition-colors">
                      {leader.name}
                    </h4>
                    <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
                      {leader.role}
                    </p>
                    <p className="text-xs text-obsidian-600 leading-relaxed font-light pt-2 line-clamp-3">
                      {leader.bio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-2 border-t border-ivory-200 flex items-center justify-between text-xs text-obsidian-500">
                  <span className="flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    FBC Jobele
                  </span>
                  {leader.email && (
                    <a
                      href={`mailto:${leader.email}`}
                      className="text-burgundy-700 hover:underline font-medium"
                    >
                      {leader.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
