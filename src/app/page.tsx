'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { CivicMap } from '@/components/Map';
import {
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  PhoneCall,
  Flame,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  Building,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Smartphone,
  Eye,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { issues, getStats } = useIssues();
  const { t, language } = useLanguage();
  const stats = getStats();

  // Search in hero
  const [heroSearch, setHeroSearch] = useState('');

  // Map Filter State
  const [selectedType, setSelectedType] = useState<string[]>(['roads']);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['reported', 'in_progress']);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>(['critical', 'high']);
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');

  const toggleType = (type: string) => {
    setSelectedType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="bg-[#F8F9FA] text-slate-900 pb-16 space-y-12">
      {/* 1. HERO SECTION WITH CUSTOM GENERATED DHAKA CIVIC PANORAMA */}
      <section className="relative min-h-[600px] lg:min-h-[660px] flex items-center overflow-hidden bg-[#051815] text-white">
        {/* Background Visual Asset */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <img
            src="/images/dhaka_civic_hero.jpg"
            alt="নগরচিত্র বাংলাদেশ - স্মার্ট সিটি ও নাগরিক সমাধান প্ল্যাটফর্ম"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.12]"
          />

          {/* Cinematic Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#051815]/95 via-[#051815]/85 to-[#051815]/45 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#051815] via-[#051815]/75 to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 border border-accent/40 backdrop-blur-md shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-accent font-sans">
                  A CIVIC INTELLIGENCE PLATFORM FOR BANGLADESH
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-bangla tracking-tight leading-[1.15] text-white drop-shadow-md">
                  আপনার শহরকে
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-bangla tracking-tight leading-[1.15] text-accent drop-shadow-md">
                  আরও বাসযোগ্য করুন
                </h1>
              </div>

              {/* Subtitle */}
              <p className="font-bangla text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl drop-shadow">
                সমস্যা দেখুন, রিপোর্ট করুন, পরিবর্তনকে অনুসরণ করুন। একসাথে আমরা গড়ে তুলতে পারি একটি পরিচ্ছন্ন, নিরাপদ ও বাসযোগ্য বাংলাদেশ।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/report"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-slate-950 font-bangla font-black text-sm hover:bg-accent-hover transition shadow-lg shadow-accent/25 hover:shadow-accent/40 group active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>সমস্যা রিপোর্ট করুন</span>
                </Link>

                <Link
                  href="/explore"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bangla font-bold text-sm border border-white/25 backdrop-blur-md transition group active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>ম্যাপ দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Bottom Feature Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-bangla text-slate-200">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span>জনগণের অংশগ্রহণ</span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>স্বচ্ছতা ও জবাবদিহিতা</span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <Building className="w-3.5 h-3.5 text-accent" />
                  <span>স্মার্ট সিটি, স্মার্ট বাংলাদেশ</span>
                </span>
              </div>
            </div>

            {/* Right Card: আপনার এলাকা খুঁজুন */}
            <div className="lg:col-span-5 flex flex-col items-end space-y-4">
              <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/40 text-slate-900 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bangla font-black text-base text-slate-900 leading-tight">
                        আপনার এলাকা খুঁজুন
                      </h3>
                      <p className="text-[11px] font-bangla text-slate-500">
                        ওয়ার্ড বা এলাকার নাগরিক রিপোর্ট দেখুন
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    লাইভ
                  </span>
                </div>

                {/* Search Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (heroSearch.trim()) {
                      window.location.href = `/explore?q=${encodeURIComponent(heroSearch.trim())}`;
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="জেলা, উপজেলা বা এলাকা লিখুন (যেমন: মিরপুর ১০)"
                    className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition shadow-sm"
                    title="খুঁজুন"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Area Pills */}
                <div>
                  <span className="block text-[11px] font-bangla font-semibold text-slate-400 mb-2">
                    জনপ্রিয় এলাকা ও শহর:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-bangla">
                    {[
                      { name: 'ঢাকা', slug: 'mirpur' },
                      { name: 'মিরপুর', slug: 'mirpur' },
                      { name: 'ধানমন্ডি', slug: 'dhanmondi' },
                      { name: 'উত্তরা', slug: 'uttara' },
                      { name: 'চট্টগ্রাম', slug: 'chattogram' },
                      { name: 'সিলেট', slug: 'sylhet' },
                    ].map((city) => (
                      <Link
                        key={city.name}
                        href={`/explore?q=${encodeURIComponent(city.name)}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-primary hover:text-white transition text-xs font-semibold text-slate-700 shadow-xs"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Trust metric strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bangla text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ২৪/৭ নাগরিক নজরদারি
                  </span>
                  <span className="text-slate-400">৮টি বিভাগে সক্রিয়</span>
                </div>
              </div>

              {/* Handwritten style Bangla slogan */}
              <div className="pr-4 text-right">
                <span className="font-bangla text-accent/90 text-sm tracking-wide italic font-medium drop-shadow">
                  একসাথে আরও ভালো বাংলাদেশ ✨
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING LIVE STATS BAR ("সর্বশেষ আপডেট") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-civic p-4 sm:p-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          {/* Header Tag */}
          <div className="flex items-center gap-3 pr-4 border-r-0 lg:border-r border-slate-200 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-bangla font-black text-sm text-slate-900 block leading-tight">
                সর্বশেষ আপডেট
              </span>
              <span className="font-bangla text-[11px] text-slate-400 block">
                আজ পর্যন্ত সারসংক্ষেপ মোট রিপোর্ট
              </span>
            </div>
          </div>

          {/* Metric 1: মোট রিপোর্ট */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {stats.total.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                  ↑ 12%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                মোট রিপোর্ট
              </span>
            </div>
          </div>

          {/* Metric 2: সমাধান হয়েছে */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  327
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                  ↑ 8%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                সমাধান হয়েছে
              </span>
            </div>
          </div>

          {/* Metric 3: চলমান */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  214
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                  ↑ 5%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                চলমান
              </span>
            </div>
          </div>

          {/* Metric 4: জরুরি */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  86
                </span>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                  ↑ 2%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                জরুরি
              </span>
            </div>
          </div>

          {/* Today's Hotspot card with image thumbnail */}
          <Link
            href="/nagar/mirpur"
            className="flex items-center gap-3 p-2 pr-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-200/80 shrink-0 group"
          >
            <img
              src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=120&q=80"
              alt="Mirpur Hotspot"
              className="w-12 h-10 rounded-lg object-cover"
            />
            <div>
              <span className="text-[10px] font-bangla text-slate-500 font-bold block uppercase">
                আজকের হটস্পট
              </span>
              <span className="font-bangla font-black text-xs text-slate-900 group-hover:text-primary transition">
                মিরপুর ১০ <span className="text-[10px] text-slate-500 font-normal">(সর্বাধিক রিপোর্ট)</span>
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </section>

      {/* 3. LIVE CITY MAP (3-COLUMN LAYOUT MATCHING MOCKUP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Header with Map/Satellite and Fullscreen toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bangla font-black text-slate-900 tracking-tight">
                লাইভ সিটি ম্যাপ
              </h2>
              <p className="text-xs font-bangla text-slate-500">
                ঢাকা শহরের বিভিন্ন এলাকার সমস্যাগুলোর মানচিত্রে দেখুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 text-xs font-bangla font-bold">
              <button
                onClick={() => setMapMode('map')}
                className={`px-3 py-1 rounded-full transition ${
                  mapMode === 'map'
                    ? 'bg-[#08221E] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ম্যাপ
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`px-3 py-1 rounded-full transition ${
                  mapMode === 'satellite'
                    ? 'bg-[#08221E] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                স্যাটেলাইট
              </button>
            </div>

            <Link
              href="/explore"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              title="Fullscreen"
            >
              <span className="text-sm">⛶</span>
            </Link>
          </div>
        </div>

        {/* 3-Column Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Filter Panel (~220px / 3 cols) */}
          <div className="lg:col-span-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-4 font-bangla text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-black text-slate-900 text-sm">ফিল্টার করুন</span>
              <button
                onClick={() => {
                  setSelectedType(['roads']);
                  setSelectedStatus(['reported']);
                  setSelectedSeverity(['critical']);
                }}
                className="text-[11px] text-slate-500 hover:text-primary flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট</span>
              </button>
            </div>

            {/* সমস্যার ধরন */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 block mb-1">সমস্যার ধরন</span>
              {[
                { id: 'roads', label: 'রোডস' },
                { id: 'drainage', label: 'ড্রেনেজ/জলাবদ্ধতা' },
                { id: 'waste', label: 'আবর্জনা/ময়লা' },
                { id: 'light', label: 'স্ট্রিট লাইট' },
                { id: 'manhole', label: 'খোলা ম্যানহোল' },
                { id: 'wire', label: 'বিদ্যুৎ লাইন' },
                { id: 'traffic', label: 'ট্রাফিক সিগন্যাল' },
                { id: 'other', label: 'অন্যান্য' },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary text-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedType.includes(item.id)}
                    onChange={() => toggleType(item.id)}
                    className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* অবস্থা */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">অবস্থা</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>রিপোর্টেড</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>যাচাই চলছে</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>চলমান</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>সমাধান হয়েছে</span>
                </div>
              </div>
            </div>

            {/* গুরুত্বের মাত্রা */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">গুরুত্বের মাত্রা</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>জরুরি</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>উচ্চ</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span>মধ্যম</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>নিম্ন</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('ফিল্টার প্রয়োগ করা হয়েছে!')}
              className="w-full py-2 bg-primary text-white rounded-xl font-black text-xs hover:bg-primary-light transition shadow-sm"
            >
              ফিল্টার প্রয়োগ করুন
            </button>
          </div>

          {/* Center Column: Interactive Map (6 cols) */}
          <div className="lg:col-span-6 h-[460px] rounded-2xl overflow-hidden border border-slate-200 relative">
            <CivicMap issues={issues} height="100%" />
          </div>

          {/* Right Column: কাছাকাছি সমস্যা (Nearby Issues List) (3 cols) */}
          <div className="lg:col-span-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between font-bangla space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                <span className="font-black text-slate-900 text-sm">কাছাকাছি সমস্যা</span>
                <span className="text-[11px] text-slate-400 font-sans">Dhaka</span>
              </div>

              {/* Vertical Issue Rows */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'waterlogging-farmgate-bijoy-1e82',
                    title: 'Waterlogging',
                    area: 'Mirpur 10 • 220 m',
                    badge: 'জরুরি',
                    badgeColor: 'bg-red-100 text-red-700',
                    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'waste-dumping-dhanmondi-27-3b44',
                    title: 'Waste Dumping',
                    area: 'Mirpur 11 • 450 m',
                    badge: 'উচ্চ',
                    badgeColor: 'bg-orange-100 text-orange-700',
                    img: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'street-light-gulshan-1-6d20',
                    title: 'Street Light',
                    area: 'Mirpur 12 • 680 m',
                    badge: 'মধ্যম',
                    badgeColor: 'bg-yellow-100 text-yellow-800',
                    img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'road-damage-mirpur-10-8f92',
                    title: 'Road Damage',
                    area: 'Mirpur 10 • 900 m',
                    badge: 'চলমান',
                    badgeColor: 'bg-blue-100 text-blue-700',
                    img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'open-manhole-mohammadpur-9a11',
                    title: 'Open Manhole',
                    area: 'Mirpur 1 • 1.2 km',
                    badge: 'যাচাই চলছে',
                    badgeColor: 'bg-cyan-100 text-cyan-800',
                    img: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=100&q=80',
                  },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={`/issues/${item.id}`}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-slate-100 transition border border-slate-200/80 group"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-primary transition truncate font-sans">
                          {item.title}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded shrink-0 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        📍 {item.area}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/explore"
              className="text-center font-bold text-xs text-primary hover:underline flex items-center justify-center gap-1 pt-1"
            >
              <span>সব দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RECENT REPORTS ("সাম্প্রতিক রিপোর্ট") + AREA PULSE ("এলাকা পালস - মিরপুর") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: সাম্প্রতিক রিপোর্ট (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bangla font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>📄</span>
                  <span>সাম্প্রতিক রিপোর্ট</span>
                </h2>
                <p className="text-xs font-bangla text-slate-500">
                  সর্বশেষ যুক্ত হওয়া সমস্যাগুলো দেখুন
                </p>
              </div>

              <Link
                href="/explore"
                className="text-xs font-bangla font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>সব দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: রোড ড্যামেজ */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                      alt="রোড ড্যামেজ"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600 text-white font-bangla font-black text-[10px]">
                      জরুরি
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">রোড ড্যামেজ</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>মিরপুর ১০, ঢাকা</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 ২ ঘণ্টা আগে • 💬 12</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    যাচাই চলছে
                  </span>
                </div>
              </div>

              {/* Card 2: জলাবদ্ধতা */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
                      alt="জলাবদ্ধতা"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-blue-600 text-white font-bangla font-black text-[10px]">
                      চলমান
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">জলাবদ্ধতা</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>ধানমন্ডি ২৭, ঢাকা</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 ৩ ঘণ্টা আগে • 💬 8</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    চলমান
                  </span>
                </div>
              </div>

              {/* Card 3: স্ট্রিট লাইট (সমাধান হয়েছে) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                      alt="স্ট্রিট লাইট"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bangla font-black text-[10px]">
                      সমাধান হয়েছে
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">স্ট্রিট লাইট</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>উত্তরা সেক্টর ৩, ঢাকা</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 ১ দিন আগে • 💬 15</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                    নাগরিক ভেরিফিকেশন অপেক্ষমাণ
                  </span>
                </div>
              </div>

              {/* Card 4: আবর্জনা */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80"
                      alt="আবর্জনা"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-orange-600 text-white font-bangla font-black text-[10px]">
                      উচ্চ
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">আবর্জনা</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>মোহাম্মদপুর রিং রোড, ঢাকা</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 ১ দিন আগে • 💬 9</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    বিস্তারিত
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: এলাকা পালস - মিরপুর (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 font-bangla">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-primary text-base">📍</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">এলাকা পালস</h3>
                  <span className="font-bold text-primary text-sm">মিরপুর</span>
                </div>
              </div>
              <Link
                href="/nagar/mirpur"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>বিস্তারিত</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Donut progress ring */}
            <div className="flex flex-col items-center justify-center p-3">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#0B3D3A"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="75"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">মোট রিপোর্ট</span>
                  <span className="text-xl font-black text-slate-900 font-sans">184</span>
                  <span className="text-[10px] text-emerald-600 font-bold font-sans">↑ 18%</span>
                </div>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>রোড</span>
                </span>
                <span className="text-slate-500 font-sans">48</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[48%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>ড্রেনেজ</span>
                </span>
                <span className="text-slate-500 font-sans">32</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[32%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>আবর্জনা</span>
                </span>
                <span className="text-slate-500 font-sans">28</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[28%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>স্ট্রিট লাইট</span>
                </span>
                <span className="text-slate-500 font-sans">21</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full w-[21%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>অন্যান্য</span>
                </span>
                <span className="text-slate-500 font-sans">55</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-[55%]" />
              </div>
            </div>

            {/* Bottom Success Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>এই এলাকার সমাধান হয়েছে ৭২ টি সমস্যা এই মাসে</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MOBILE APP PROMOTION BANNER + 4 FEATURE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Mobile App Banner (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200/50 rounded-3xl p-6 sm:p-7 border border-emerald-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden font-bangla">
            <div className="space-y-2 z-10">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                মোবাইলে সহজেই রিপোর্ট করুন
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                অ্যান্ড্রয়েড ও আইওএস অ্যাপ খুব শিগগিরই আসছে, ততদিন ওয়েবই ব্যবহার করুন।
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="flex items-center gap-3 pt-4 z-10">
              <button
                onClick={() => alert('অ্যান্ড্রয়েড অ্যাপ শিগগিরই প্লে-স্টোরে আসছে!')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-sans font-bold hover:bg-black transition shadow"
              >
                <span>Google Play</span>
              </button>

              <button
                onClick={() => alert('আইওএস অ্যাপ শিগগিরই অ্যাপ স্টোরে আসছে!')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-sans font-bold hover:bg-black transition shadow"
              >
                <span>App Store</span>
              </button>
            </div>

            {/* Phone Hand Mockup Graphic */}
            <div className="absolute -right-4 -bottom-6 w-44 sm:w-52 opacity-90 pointer-events-none drop-shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80"
                alt="Mobile App"
                className="w-full rounded-2xl rotate-6 border-4 border-white shadow-2xl"
              />
            </div>
          </div>

          {/* 4 Feature Pillars (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5 items-stretch">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">দ্রুত রিপোর্ট</h4>
                <p className="text-[11px] text-slate-500 mt-1">কয়েক সেকেন্ডে রিপোর্ট করুন</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">রিয়েল-টাইম আপডেট</h4>
                <p className="text-[11px] text-slate-500 mt-1">আপনার রিপোর্টের অগ্রগতি দেখুন</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">কমিউনিটি ভেরিফিকেশন</h4>
                <p className="text-[11px] text-slate-500 mt-1">ভুয়া রোধে, একসাথে নিশ্চিত করুন</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">স্বচ্ছতা ও জবাবদিহিতা</h4>
                <p className="text-[11px] text-slate-500 mt-1">প্রতিটি কাজের ইতিহাস দেখুন</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
