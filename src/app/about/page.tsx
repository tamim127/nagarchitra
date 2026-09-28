'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Compass,
  Play,
  FileEdit,
  Search,
  Check,
  X,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  BarChart2,
  Database,
  Building2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-[#F8F9FA] text-slate-900 min-h-screen font-bangla pb-16">
      {/* 1. HERO SECTION (PANORAMIC SKYLINE & FLYOVER BANNER) */}
      <section className="relative overflow-hidden bg-slate-100 border-b border-slate-200">
        {/* Background Image with Daylight Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=2000&q=80"
            alt="City Flyover and Skyline"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle light gradient on left to guarantee crisp text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20" />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-20 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-5 max-w-3xl">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-sky-200 text-[#0284C7] text-xs font-bold uppercase tracking-wider font-sans">
                <span>ABOUT NAGARCHITRA</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#072B24] leading-tight tracking-tight">
                একটি সচেতন নাগরিক সমাজের
                <span className="block mt-1">
                  জন্য, একটি <span className="text-amber-500">স্মার্ট নগরীর পথে</span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
                নগরচিত্র হলো বাংলাদেশের নাগরিকদের জন্য একটি ডিজিটাল প্ল্যাটফর্ম, যেখানে আপনি শহরের বিভিন্ন সমস্যা রিপোর্ট করতে, যাচাই করতে এবং সমাধানের অগ্রগতি ট্র্যাক করতে পারেন।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B3D3A] hover:bg-[#14534F] text-white font-bold text-sm shadow-md transition hover:scale-102"
                >
                  <Compass className="w-4 h-4 text-accent" />
                  <span>কিভাবে কাজ করে?</span>
                </a>

                <button
                  onClick={() => alert('ভিডিও ডেমো শীঘ্রই উন্মুক্ত হবে!')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm shadow-xs transition hover:scale-102"
                >
                  <Play className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                  <span>ভিডিও দেখুন</span>
                </button>
              </div>
            </div>

            {/* Right Side Chalk Quote & Floating Card (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-end gap-6 relative">
              {/* Handwritten style callout */}
              <div className="hidden xl:flex flex-col items-center transform -rotate-6 select-none mr-12 text-[#0A3D36]">
                <span className="text-base font-black tracking-wider drop-shadow-xs">
                  পরিবর্তনের
                </span>
                <span className="text-xl font-black text-amber-600 drop-shadow-xs">
                  অংশীদার হোন
                </span>
                <svg viewBox="0 0 50 30" className="w-10 h-6 text-amber-600 fill-none stroke-current stroke-2 mt-1">
                  <path d="M10,5 Q30,15 40,25" />
                  <polyline points="32,25 40,25 38,17" />
                </svg>
              </div>

              {/* Floating Goal Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-xl max-w-[320px] text-slate-900 space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                    🍃
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">নগরচিত্রের লক্ষ্য</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                  “প্রত্যেক নাগরিকের কণ্ঠস্বরকে শহরের উন্নয়নে কাজে লাগানো।”
                </p>

                {/* Silhouette Graphic Watermark */}
                <div className="pt-2 opacity-15 flex justify-end">
                  <svg viewBox="0 0 100 40" className="w-24 h-10 fill-current text-emerald-950">
                    <polygon points="50,0 45,40 55,40" />
                    <polygon points="40,15 35,40 45,40" />
                    <polygon points="60,15 55,40 65,40" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT (TWO COLUMNS: 6-STEP WORKFLOW ON LEFT, MISSION & FEATURES ON RIGHT) */}
      <section id="how-it-works" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: 6 STEP WORKFLOW (8 cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                আমাদের সম্পর্কে
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                কিভাবে কাজ করে নগরচিত্র?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                নগরচিত্র একটি সহজ, স্বচ্ছ এবং অংশগ্রহণমূলক প্রক্রিয়ার মাধ্যমে শহরের সমস্যাগুলোকে সমাধানের দিকে এগিয়ে নিয়ে যায়। নিচে প্ল্যাটফর্মটির মূল ধাপগুলো দেখানো হলো:
              </p>
            </div>

            {/* 6 Step Cards */}
            <div className="space-y-4">
              {/* Step 01 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition">
                <div className="flex items-start gap-4 max-w-xl">
                  {/* Step Number Badge */}
                  <div className="w-10 h-10 rounded-full bg-[#E8F7F4] text-[#0A3D36] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 font-sans">
                    01
                  </div>
                  {/* Step Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  {/* Text */}
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      সমস্যা রিপোর্ট করুন
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      সমস্যার ধরন নির্ধারণ করুন, লোকেশন পিন করুন, ছবি/ভিডিও যুক্ত করুন এবং বিস্তারিত তথ্য দিন।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  {/* Graphic Thumbnail: Mobile phone with map */}
                  <div className="w-28 h-18 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=240&q=80"
                      alt="Mobile Report"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Step 02 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition">
                <div className="flex items-start gap-4 max-w-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E8F7F4] text-[#0A3D36] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 font-sans">
                    02
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      কমিউনিটি যাচাই
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      আপনার পরিচিত বা এলাকার অন্য নাগরিকরা "আমি এটি দেখেছি" বাটনের মাধ্যমে সমস্যাটি নিশ্চিত করতে পারেন।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  {/* Graphic: Community avatars with checkmark */}
                  <div className="w-28 h-18 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-center gap-1.5 shrink-0 px-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-300 ring-2 ring-white flex items-center justify-center text-[10px] font-bold">👤</div>
                      <div className="w-7 h-7 rounded-full bg-slate-400 ring-2 ring-white flex items-center justify-center text-[10px] font-bold">👤</div>
                      <div className="w-7 h-7 rounded-full bg-emerald-600 ring-2 ring-white flex items-center justify-center text-white text-[11px] font-bold">✓</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 03 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition">
                <div className="flex items-start gap-4 max-w-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E8F7F4] text-[#0A3D36] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 font-sans">
                    03
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      বৈধতা যাচাই ও বিভাগ নির্ধারণ
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      নগরচিত্রের টিম রিপোর্টটি যাচাই করে, সঠিক বিভাগে পাঠায় এবং প্রাসঙ্গিক তথ্য সংযুক্ত করে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  {/* Graphic: Desk officer reviewing ticket */}
                  <div className="w-28 h-18 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=240&q=80"
                      alt="Triage Officer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Step 04 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition">
                <div className="flex items-start gap-4 max-w-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E8F7F4] text-[#0A3D36] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 font-sans">
                    04
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      কাজ শুরু ও সমাধান
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      দায়িত্বপ্রাপ্ত কর্তৃপক্ষ কাজ শুরু করে এবং সমাধান হলে আগে ও পরের ছবি আপলোড করে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  {/* Graphic: Split Before / After image */}
                  <div className="w-28 h-18 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0 relative flex">
                    <div className="w-1/2 h-full relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=120&q=80"
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 left-0.5 bg-black/70 text-[8px] text-white px-1 rounded font-sans">Before</span>
                    </div>
                    <div className="w-1/2 h-full relative overflow-hidden border-l border-white">
                      <img
                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80"
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-emerald-700/80 text-[8px] text-white px-1 rounded font-sans">After</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 05 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition">
                <div className="flex items-start gap-4 max-w-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E8F7F4] text-[#0A3D36] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 font-sans">
                    05
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      নাগরিক যাচাই
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      সমাধান হয়েছে কিনা তা এলাকার নাগরিকরা যাচাই করেন। প্রয়োজনে সমস্যা পুনরায় খোলা হয়।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  {/* Graphic: 3 verification options */}
                  <div className="w-32 py-1.5 px-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] space-y-1 shrink-0 font-bangla">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>সম্পূর্ণ ঠিক হয়েছে</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>আংশিক ঠিক হয়েছে</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>এখনও সমস্যা আছে</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 06 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition">
                <div className="flex items-start gap-4 max-w-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E8F7F4] text-[#0A3D36] font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 font-sans">
                    06
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      সমস্যা বন্ধ
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      নাগরিকদের নিশ্চিতকরণের পর সমস্যাটি চূড়ান্তভাবে বন্ধ হয় এবং তথ্যটি পাবলিক ডাটাবেজে সংরক্ষিত থাকে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  {/* Graphic: Success Pill Badge */}
                  <div className="px-4 py-2.5 rounded-2xl bg-[#0B3D3A] text-white flex items-center gap-2 shadow-sm shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold font-bangla">সমাধান সম্পন্ন</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: MISSION & CORE FEATURES (4 cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. আমাদের মিশন কার্ড */}
            <div className="bg-[#EAF6F3] border border-emerald-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <span>🍃</span>
                <span>আমাদের মিশন</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                একটি স্বচ্ছ, জবাবদিহিমূলক ও বাসযোগ্য বাংলাদেশ গড়া।
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                নাগরিকদের প্রত্যক্ষ অংশগ্রহণের মাধ্যমে শহরের সমস্যাগুলো দৃশ্যমান করা, সমাধানের প্রক্রিয়াকে স্বচ্ছ রাখা এবং দায়িত্বশীল কর্তৃপক্ষের কাজকে আরও কার্যকর করা — এটাই নগরচিত্রের প্রতিশ্রুতি।
              </p>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/90 rounded-2xl p-3 border border-emerald-200/60 shadow-2xs">
                  <div className="text-xl font-black text-slate-900 font-sans">1,248</div>
                  <div className="text-[11px] text-slate-500 font-medium">মোট রিপোর্ট</div>
                </div>

                <div className="bg-white/90 rounded-2xl p-3 border border-emerald-200/60 shadow-2xs">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xl font-black font-sans">327</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">সমাধানকৃত</div>
                </div>

                <div className="bg-white/90 rounded-2xl p-3 border border-emerald-200/60 shadow-2xs">
                  <div className="flex items-center gap-1 text-amber-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-xl font-black font-sans">214</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">চলমান</div>
                </div>

                <div className="bg-white/90 rounded-2xl p-3 border border-emerald-200/60 shadow-2xs">
                  <div className="flex items-center gap-1 text-red-600">
                    <Flame className="w-4 h-4" />
                    <span className="text-xl font-black font-sans">86</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">জরুরি (Critical)</div>
                </div>
              </div>

              {/* Link */}
              <div className="pt-2">
                <Link
                  href="/statistics"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-emerald-800 transition"
                >
                  <span>আরও জানুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. আমাদের মূল বৈশিষ্ট্য কার্ড */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
              <h3 className="font-black text-base text-slate-900">
                আমাদের মূল বৈশিষ্ট্য
              </h3>

              <div className="space-y-3">
                {/* Feature 1 */}
                <Link
                  href="/explore"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">ইন্টারেক্টিভ মানচিত্র</h4>
                      <p className="text-[11px] text-slate-400">লাইভ ম্যাপ, ফিল্টার, ক্লাস্টার</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </Link>

                {/* Feature 2 */}
                <Link
                  href="/statistics"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">সেরা ড্যাশবোর্ড</h4>
                      <p className="text-[11px] text-slate-400">এলাকা ভিত্তিক বিশ্লেষণ ও পরিসংখ্যান</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </Link>

                {/* Feature 3 */}
                <Link
                  href="/open-data"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">ওপেন ডাটা (পরবর্তী পর্যায়)</h4>
                      <p className="text-[11px] text-slate-400">CSV / JSON ডাউনলোড</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </Link>

                {/* Feature 4 */}
                <Link
                  href="/authority"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">এজেন্সি ড্যাশবোর্ড</h4>
                      <p className="text-[11px] text-slate-400">কর্তৃপক্ষের জন্য অপারেশন প্যানেল</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
