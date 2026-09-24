import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Shield,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  Cross,
  CheckCircle2,
} from "lucide-react";
import { getSettings, getLeadership } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us | First Baptist Church Jobele",
  description:
    "Discover the history, mission, vision, and core Baptist beliefs of First Baptist Church Jobele (Sanctuary of Divine Power), affiliated with the Nigerian Baptist Convention.",
};

export default function AboutPage() {
  const settings = getSettings();
  const leadership = getLeadership();
  const seniorLeader = leadership.find((l) => l.isSeniorLeader) || leadership[0];

  const coreValues = [
    {
      title: "Biblical Authority",
      desc: "We stand firmly on the infallible Scriptures as the sole sufficient rule of Christian faith and practice.",
      icon: BookOpen,
      color: "text-burgundy-700",
      bg: "bg-burgundy-50",
    },
    {
      title: "Christ-Centered Worship",
      desc: "Every gathering elevates the finished work of Jesus Christ on the cross, ushering in the tangible power of God.",
      icon: Cross,
      color: "text-crimson-600",
      bg: "bg-red-50",
    },
    {
      title: "Kingdom Discipleship",
      desc: "Nurturing believers from spiritual infancy to mature Christlikeness through intentional Bible study and prayer.",
      icon: Compass,
      color: "text-gold-700",
      bg: "bg-gold-50",
    },
    {
      title: "Sacrificial Community",
      desc: "Cultivating a warm, authentic spiritual family where every member is loved, valued, and supported.",
      icon: Heart,
      color: "text-burgundy-800",
      bg: "bg-burgundy-50",
    },
    {
      title: "Missional Outreach",
      desc: "Taking the Gospel to every street in Jobele, Oyo State, and supporting global missionary evangelism.",
      icon: Users,
      color: "text-sanctuary-700",
      bg: "bg-sanctuary-50",
    },
  ];

  const baptistBeliefs = [
    {
      title: "The Holy Scriptures",
      summary:
        "The 66 books of the Old and New Testaments are divinely inspired, inerrant in their original manuscripts, and the supreme authority for doctrine and life.",
    },
    {
      title: "The Triune God",
      summary:
        "We worship the one eternal, holy God revealed in three distinct co-equal persons: Father, Son, and Holy Spirit.",
    },
    {
      title: "Salvation by Grace through Faith",
      summary:
        "Salvation is entirely the gift of God through sovereign grace, received through personal faith in Jesus Christ, whose atoning death and resurrection provide full redemption.",
    },
    {
      title: "Believer's Baptism by Immersion",
      summary:
        "Baptism is an act of obedience symbolizing the believer's faith in a crucified, buried, and risen Savior, conducted by immersion in water following personal repentance and faith.",
    },
    {
      title: "The Lord's Supper",
      summary:
        "A symbolic commemoration whereby members of the church, by partaking of the bread and the cup, memorialize the sacrificial death of the Redeemer and anticipate His second coming.",
    },
    {
      title: "The Priesthood of All Believers",
      summary:
        "Every born-again believer has direct spiritual access to God through our one High Priest, Jesus Christ, and is endowed with spiritual gifts for mutual edification and service.",
    },
    {
      title: "Autonomous Local Church & Religious Liberty",
      summary:
        "In accordance with historic Baptist convictions, each local congregation is self-governing under the Lordship of Christ, while maintaining voluntary cooperation with the Nigerian Baptist Convention.",
    },
  ];

  return (
    <div className="bg-ivory-100">
      {/* Editorial Page Header */}
      <section className="relative py-20 bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-navy-950 text-white overflow-hidden border-b-2 border-gold-500/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-bold uppercase tracking-widest font-sans">
              Our Identity & Calling
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-ivory-100 tracking-tight leading-tight">
            About First Baptist Church Jobele
          </h1>
          <p className="text-base sm:text-xl text-ivory-200 mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            A Place of Faith. A Family of Believers. A Community on Mission in Jobele, Oyo State.
          </p>
        </div>
      </section>

      {/* 1. Our Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Left */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block font-sans">
              A Legacy of Divine Faithfulness
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              Our Story & Heritage
            </h2>

            <p className="text-base text-obsidian-700 leading-relaxed">
              Founded as an outpost of biblical truth and Baptist witness, <strong className="text-burgundy-800">First Baptist Church Jobele</strong> has stood for decades as a spiritual lighthouse in Jobele, Oyo State. Affiliated with the historic <strong className="text-navy-900">Nigerian Baptist Convention</strong>, our sanctuary has been home to continuous generations of worshippers who gather to experience the transformative power of God.
            </p>

            <p className="text-sm text-obsidian-600 leading-relaxed">
              Known affectionately as the <strong className="text-obsidian-900">Sanctuary of Divine Power</strong>, our church has witnessed salvation, supernatural healings, restored families, and trained men and women who have gone forth to impact society with integrity and Christian virtue.
            </p>

            <div className="p-4 rounded-xl bg-ivory-200 border-l-4 border-gold-500 text-obsidian-800 text-sm italic font-serif">
              &ldquo;Then Samuel took a stone and set it between Mizpah and Shen and called its name Ebenezer, saying, &apos;Thus far the Lord has helped us.&apos;&rdquo; &mdash; 1 Samuel 7:12
            </div>
          </div>

          {/* Image Right */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border-4 border-white h-96">
              <Image
                src="/images/brand/building.jpg"
                alt="First Baptist Church Jobele Sanctuary"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs p-3 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20">
                <p className="font-semibold text-gold-300">Sanctuary of Divine Power</p>
                <p className="text-[11px] text-ivory-200">P. O. Box 184, Jobele, Oyo State, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision Cards */}
      <section className="py-16 bg-ivory-200/60 border-y border-burgundy-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border-2 border-burgundy-700/20 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-700">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-burgundy-900">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-obsidian-700 leading-relaxed font-light">
                To proclaim the uncompromised Gospel of Jesus Christ, disciple believers in spiritual maturity, foster authentic Christian community, and demonstrate the tangible love and divine power of God through service to Jobele and the world.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border-2 border-navy-800/20 shadow-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-navy-950">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base text-obsidian-700 leading-relaxed font-light">
                To be a radiant, Christ-centered, multi-generational church family where lives are transformed by the Holy Spirit, families are fortified, and disciples are commissioned to make an enduring kingdom impact across Nigeria and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-gold-600 uppercase block mb-1 font-sans">
            Guiding Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
            Our Core Values
          </h2>
          <p className="text-sm text-obsidian-600 mt-2">
            The foundational biblical convictions that shape every ministry, service, and decision at FBC Jobele.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-subtle hover:shadow-card transition-shadow space-y-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${val.bg} flex items-center justify-center ${val.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-lg text-obsidian-950">
                  {val.title}
                </h4>
                <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. What We Believe (Baptist Heritage) */}
      <section className="py-20 bg-ivory-200/80 border-t border-burgundy-900/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-burgundy-700 uppercase block mb-1 font-sans">
              Doctrine & Confession
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-obsidian-950 tracking-tight">
              What We Believe
            </h2>
            <p className="text-sm text-obsidian-600 mt-2">
              Our faith is grounded in the historic Baptist confession and orthodox Christian truth.
            </p>
          </div>

          <div className="space-y-4">
            {baptistBeliefs.map((belief, idx) => (
              <div
                key={belief.title}
                className="p-6 rounded-xl bg-white border border-ivory-300 shadow-subtle flex items-start space-x-4"
              >
                <div className="p-2 rounded-lg bg-burgundy-50 text-burgundy-700 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-obsidian-950 mb-1">
                    {idx + 1}. {belief.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed font-light">
                    {belief.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leadership Banner */}
      {seniorLeader && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-burgundy-900 via-burgundy-950 to-navy-950 text-white p-8 sm:p-12 lg:p-14 shadow-elevated border-2 border-gold-500/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border-2 border-gold-400">
                <Image
                  src={seniorLeader.image}
                  alt={seniorLeader.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold tracking-widest text-gold-300 uppercase block font-sans">
                  Shepherd of the Flock
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-100">
                  {seniorLeader.name}
                </h3>
                <p className="text-sm font-semibold text-gold-400">
                  {seniorLeader.role}
                </p>
                <p className="text-sm text-ivory-200 leading-relaxed line-clamp-3">
                  {seniorLeader.bio}
                </p>

                <div className="pt-2">
                  <Link
                    href="/leadership"
                    className="inline-flex items-center text-sm font-bold text-gold-300 hover:text-white group"
                  >
                    <span>Meet Our Full Pastoral Leadership Team</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
