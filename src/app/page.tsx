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
  const { t, language, formatNumber } = useLanguage();
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
            alt="NagarChitra Bangladesh - Smart City & Civic Action Platform"
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
                  {t('hero.badge')}
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-bangla tracking-tight leading-[1.15] text-white drop-shadow-md">
                  {t('hero.titleLine1')}
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-bangla tracking-tight leading-[1.15] text-accent drop-shadow-md">
                  {t('hero.titleLine2')}
                </h1>
              </div>

              {/* Subtitle */}
              <p className="font-bangla text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl drop-shadow">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/report"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-slate-950 font-bangla font-black text-sm hover:bg-accent-hover transition shadow-lg shadow-accent/25 hover:shadow-accent/40 group active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>{t('hero.reportCta')}</span>
                </Link>

                <Link
                  href="/explore"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bangla font-bold text-sm border border-white/25 backdrop-blur-md transition group active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{t('hero.mapCta')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Bottom Feature Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-bangla text-slate-200">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span>{t('hero.tag1')}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>{t('hero.tag2')}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <Building className="w-3.5 h-3.5 text-accent" />
                  <span>{t('hero.tag3')}</span>
                </span>
              </div>
            </div>

            {/* Right Card: Find Your Area */}
            <div className="lg:col-span-5 flex flex-col items-end space-y-4">
              <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/40 text-slate-900 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bangla font-black text-base text-slate-900 leading-tight">
                        {t('hero.findAreaTitle')}
                      </h3>
                      <p className="text-[11px] font-bangla text-slate-500">
                        {t('hero.findAreaSubtitle')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t('hero.liveBadge')}
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
                    placeholder={t('hero.searchPlaceholder')}
                    className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition shadow-sm"
                    title={t('Search', 'খুঁজুন')}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Area Pills */}
                <div>
                  <span className="block text-[11px] font-bangla font-semibold text-slate-400 mb-2">
                    {t('hero.popularAreas')}
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-bangla">
                    {[
                      { name: 'ঢাকা', nameEn: 'Dhaka', slug: 'mirpur' },
                      { name: 'মিরপুর', nameEn: 'Mirpur', slug: 'mirpur' },
                      { name: 'ধানমন্ডি', nameEn: 'Dhanmondi', slug: 'dhanmondi' },
                      { name: 'উত্তরা', nameEn: 'Uttara', slug: 'uttara' },
                      { name: 'চট্টগ্রাম', nameEn: 'Chattogram', slug: 'chattogram' },
                      { name: 'সিলেট', nameEn: 'Sylhet', slug: 'sylhet' },
                    ].map((city) => (
                      <Link
                        key={city.name}
                        href={`/explore?q=${encodeURIComponent(city.name)}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-primary hover:text-white transition text-xs font-semibold text-slate-700 shadow-xs"
                      >
                        {language === 'bn' ? city.name : city.nameEn}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Trust metric strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bangla text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('hero.trustBadge')}
                  </span>
                  <span className="text-slate-400">{t('hero.divisions')}</span>
                </div>
              </div>

              {/* Slogan */}
              <div className="pr-4 text-right">
                <span className="font-bangla text-accent/90 text-sm tracking-wide italic font-medium drop-shadow">
                  {t('hero.sloganHandwritten')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING LIVE STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-civic p-4 sm:p-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          {/* Header Tag */}
          <div className="flex items-center gap-3 pr-4 border-r-0 lg:border-r border-slate-200 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-bangla font-black text-sm text-slate-900 block leading-tight">
                {t('stats.latestUpdate')}
              </span>
              <span className="font-bangla text-[11px] text-slate-400 block">
                {t('stats.summarySubtitle')}
              </span>
            </div>
          </div>

          {/* Metric 1: Total Reports */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {formatNumber(stats.total)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                  ↑ 12%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                {t('stats.totalReports')}
              </span>
            </div>
          </div>

          {/* Metric 2: Resolved */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {formatNumber(327)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                  ↑ 8%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                {t('stats.resolved')}
              </span>
            </div>
          </div>

          {/* Metric 3: In Progress */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {formatNumber(214)}
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                  ↑ 5%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                {t('stats.inProgress')}
              </span>
            </div>
          </div>

          {/* Metric 4: Critical */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {formatNumber(86)}
                </span>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                  ↑ 2%
                </span>
              </div>
              <span className="font-bangla text-xs text-slate-500 font-semibold block mt-0.5">
                {t('stats.critical')}
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
                {t('stats.hotspot')}
              </span>
              <span className="font-bangla font-black text-xs text-slate-900 group-hover:text-primary transition">
                {language === 'bn' ? 'মিরপুর ১০' : 'Mirpur 10'}{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  ({t('stats.hotspotMost')})
                </span>
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </section>

      {/* 3. LIVE CITY MAP (3-COLUMN LAYOUT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Header with Map/Satellite and Fullscreen toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bangla font-black text-slate-900 tracking-tight">
                {t('map.liveCityMap')}
              </h2>
              <p className="text-xs font-bangla text-slate-500">
                {t('map.subtitle')}
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
                {t('map.mapView')}
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`px-3 py-1 rounded-full transition ${
                  mapMode === 'satellite'
                    ? 'bg-[#08221E] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('map.satelliteView')}
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
          {/* Left Column: Filter Panel */}
          <div className="lg:col-span-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-4 font-bangla text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-black text-slate-900 text-sm">{t('map.filterTitle')}</span>
              <button
                onClick={() => {
                  setSelectedType(['roads']);
                  setSelectedStatus(['reported']);
                  setSelectedSeverity(['critical']);
                }}
                className="text-[11px] text-slate-500 hover:text-primary flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('map.reset')}</span>
              </button>
            </div>

            {/* Issue Type */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 block mb-1">{t('map.issueType')}</span>
              {[
                { id: 'roads', labelKey: 'map.roads' },
                { id: 'drainage', labelKey: 'map.drainage' },
                { id: 'waste', labelKey: 'map.waste' },
                { id: 'light', labelKey: 'map.light' },
                { id: 'manhole', labelKey: 'map.manhole' },
                { id: 'wire', labelKey: 'map.wire' },
                { id: 'traffic', labelKey: 'map.traffic' },
                { id: 'other', labelKey: 'map.other' },
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
                  <span>{t(item.labelKey)}</span>
                </label>
              ))}
            </div>

            {/* Status */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">{t('map.status')}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>{t('map.reported')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>{t('map.verifying')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{t('map.inProgress')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>{t('map.resolved')}</span>
                </div>
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">{t('map.severity')}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>{t('map.critical')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>{t('map.high')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span>{t('map.medium')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{t('map.low')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(language === 'bn' ? 'ফিল্টার প্রয়োগ করা হয়েছে!' : 'Filters applied successfully!')}
              className="w-full py-2 bg-primary text-white rounded-xl font-black text-xs hover:bg-primary-light transition shadow-sm"
            >
              {t('map.applyFilter')}
            </button>
          </div>

          {/* Center Column: Interactive Map */}
          <div className="lg:col-span-6 h-[460px] rounded-2xl overflow-hidden border border-slate-200 relative">
            <CivicMap issues={issues} height="100%" />
          </div>

          {/* Right Column: Nearby Issues List */}
          <div className="lg:col-span-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between font-bangla space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                <span className="font-black text-slate-900 text-sm">{t('map.nearbyIssues')}</span>
                <span className="text-[11px] text-slate-400 font-sans">Dhaka</span>
              </div>

              {/* Vertical Issue Rows */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'waterlogging-farmgate-bijoy-1e82',
                    title: language === 'bn' ? 'জলাবদ্ধতা' : 'Waterlogging',
                    area: language === 'bn' ? 'মিরপুর ১০ • ২২০ মিটার' : 'Mirpur 10 • 220 m',
                    badge: t('map.critical'),
                    badgeColor: 'bg-red-100 text-red-700',
                    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'waste-dumping-dhanmondi-27-3b44',
                    title: language === 'bn' ? 'আবর্জনা অপসারণ' : 'Waste Dumping',
                    area: language === 'bn' ? 'মিরপুর ১১ • ৪৫০ মিটার' : 'Mirpur 11 • 450 m',
                    badge: t('map.high'),
                    badgeColor: 'bg-orange-100 text-orange-700',
                    img: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'street-light-gulshan-1-6d20',
                    title: language === 'bn' ? 'স্ট্রিট লাইট' : 'Street Light',
                    area: language === 'bn' ? 'মিরপুর ১২ • ৬৮০ মিটার' : 'Mirpur 12 • 680 m',
                    badge: t('map.medium'),
                    badgeColor: 'bg-yellow-100 text-yellow-800',
                    img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'road-damage-mirpur-10-8f92',
                    title: language === 'bn' ? 'রোড ড্যামেজ' : 'Road Damage',
                    area: language === 'bn' ? 'মিরপুর ১০ • ৯০০ মিটার' : 'Mirpur 10 • 900 m',
                    badge: t('map.inProgress'),
                    badgeColor: 'bg-blue-100 text-blue-700',
                    img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    id: 'open-manhole-mohammadpur-9a11',
                    title: language === 'bn' ? 'খোলা ম্যানহোল' : 'Open Manhole',
                    area: language === 'bn' ? 'মিরপুর ১ • ১.২ কিমি' : 'Mirpur 1 • 1.2 km',
                    badge: t('map.verifying'),
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
                        <span className="font-bold text-xs text-slate-900 group-hover:text-primary transition truncate">
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
              <span>{t('map.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RECENT REPORTS + AREA PULSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Recent Reports */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bangla font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>📄</span>
                  <span>{t('recent.title')}</span>
                </h2>
                <p className="text-xs font-bangla text-slate-500">
                  {t('recent.subtitle')}
                </p>
              </div>

              <Link
                href="/explore"
                className="text-xs font-bangla font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>{t('recent.viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                      alt={t('recent.roadDamage')}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600 text-white font-bangla font-black text-[10px]">
                      {t('map.critical')}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">{t('recent.roadDamage')}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{language === 'bn' ? 'মিরপুর ১০, ঢাকা' : 'Mirpur 10, Dhaka'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 {t('recent.twoHoursAgo')} • 💬 {formatNumber(12)}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {t('recent.verifying')}
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
                      alt={t('recent.waterlogging')}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-blue-600 text-white font-bangla font-black text-[10px]">
                      {t('map.inProgress')}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">{t('recent.waterlogging')}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{language === 'bn' ? 'ধানমন্ডি ২৭, ঢাকা' : 'Dhanmondi 27, Dhaka'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 {t('recent.threeHoursAgo')} • 💬 {formatNumber(8)}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {t('map.inProgress')}
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                      alt={t('recent.streetLight')}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bangla font-black text-[10px]">
                      {t('map.resolved')}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">{t('recent.streetLight')}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{language === 'bn' ? 'উত্তরা সেক্টর ৩, ঢাকা' : 'Uttara Sector 3, Dhaka'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 {t('recent.oneDayAgo')} • 💬 {formatNumber(15)}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                    {t('recent.waitingVerification')}
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-civic transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80"
                      alt={t('recent.waste')}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-orange-600 text-white font-bangla font-black text-[10px]">
                      {t('map.high')}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 font-bangla">
                    <h3 className="font-black text-sm text-slate-900">{t('recent.waste')}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{language === 'bn' ? 'মোহাম্মদপুর রিং রোড, ঢাকা' : 'Mohammadpur Ring Road, Dhaka'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">🕒 {t('recent.oneDayAgo')} • 💬 {formatNumber(9)}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <span className="inline-block text-[11px] font-bangla font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {t('recent.details')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Area Pulse */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 font-bangla">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-primary text-base">📍</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('pulse.title')}</h3>
                  <span className="font-bold text-primary text-sm">{t('pulse.mirpur')}</span>
                </div>
              </div>
              <Link
                href="/nagar/mirpur"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>{t('pulse.details')}</span>
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
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t('pulse.totalReports')}</span>
                  <span className="text-xl font-black text-slate-900 font-sans">{formatNumber(184)}</span>
                  <span className="text-[10px] text-emerald-600 font-bold font-sans">↑ 18%</span>
                </div>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>{t('pulse.road')}</span>
                </span>
                <span className="text-slate-500 font-sans">{formatNumber(48)}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[48%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{t('pulse.drainage')}</span>
                </span>
                <span className="text-slate-500 font-sans">{formatNumber(32)}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[32%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t('pulse.waste')}</span>
                </span>
                <span className="text-slate-500 font-sans">{formatNumber(28)}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[28%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>{t('pulse.streetLight')}</span>
                </span>
                <span className="text-slate-500 font-sans">{formatNumber(21)}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full w-[21%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{t('pulse.other')}</span>
                </span>
                <span className="text-slate-500 font-sans">{formatNumber(55)}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-[55%]" />
              </div>
            </div>

            {/* Bottom Success Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('pulse.resolvedBanner')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MOBILE APP PROMOTION BANNER + 4 FEATURE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Mobile App Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200/50 rounded-3xl p-6 sm:p-7 border border-emerald-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden font-bangla">
            <div className="space-y-2 z-10">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {t('app.title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('app.subtitle')}
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="flex items-center gap-3 pt-4 z-10">
              <button
                onClick={() => alert(language === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ শিগগিরই প্লে-স্টোরে আসছে!' : 'Android app coming soon to Google Play!')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-sans font-bold hover:bg-black transition shadow"
              >
                <span>{t('app.playStore')}</span>
              </button>

              <button
                onClick={() => alert(language === 'bn' ? 'আইওএস অ্যাপ শিগগিরই অ্যাপ স্টোরে আসছে!' : 'iOS app coming soon to App Store!')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-sans font-bold hover:bg-black transition shadow"
              >
                <span>{t('app.appStore')}</span>
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

          {/* 4 Feature Pillars */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5 items-stretch">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">{t('app.pillar1Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{t('app.pillar1Sub')}</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">{t('app.pillar2Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{t('app.pillar2Sub')}</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">{t('app.pillar3Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{t('app.pillar3Sub')}</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 font-bangla">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">{t('app.pillar4Title')}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{t('app.pillar4Sub')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
