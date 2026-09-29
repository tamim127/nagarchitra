'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { DHAKA_AREAS } from '@/data/areas';
import { CivicMap } from '@/components/Map';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  AlertTriangle,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Car,
  Waves,
  Trash2,
  Lightbulb,
  HelpCircle,
  Users,
  Building,
  Check,
} from 'lucide-react';

export default function AreaPage() {
  const params = useParams();
  const { issues, getAreaSummary } = useIssues();
  const { t, language, formatNumber } = useLanguage();

  const areaSlug = (params?.area as string) || 'mirpur';
  const areaMeta = DHAKA_AREAS.find((a) => a.slug === areaSlug) || DHAKA_AREAS[0];
  const summary = getAreaSummary(areaSlug);

  // Search & filter states within the map
  const [mapSearch, setMapSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  // Filter issues for this area
  const areaIssues = issues.filter((i) => {
    const a = i.location.area.toLowerCase().replace(/[^a-z]/g, '');
    const norm = areaMeta.name.toLowerCase().replace(/[^a-z]/g, '');
    return a.includes(norm) || norm.includes(a);
  });

  const areaDisplayName = language === 'bn' ? areaMeta.nameBn : areaMeta.name;

  return (
    <div className="bg-[#F8F9FA] text-slate-900 pb-16 space-y-8 font-bangla">
      {/* 1. AREA HERO BANNER */}
      <section className="relative overflow-hidden bg-[#072421] text-white py-12 md:py-16 border-b border-[#0F3832]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1584463699042-308f237bf309?auto=format&fit=crop&w=1920&q=80"
            alt="Dhaka Skyline"
            className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#072421]/95 via-[#072421]/80 to-[#072421]/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold backdrop-blur-md">
                <span>🏛️</span>
                <span>{t('Civic Intelligence Platform for Dhaka Division', 'ঢাকা বিভাগের সিটি ইন্টেলিজেন্স প্ল্যাটফর্ম')}</span>
              </div>

              {/* Title & Location */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {areaDisplayName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'bn'
                      ? `${areaMeta.zone} • ${areaMeta.district} জেলা • ${areaMeta.division} বিভাগ`
                      : `${areaMeta.zone} • ${areaMeta.name} District • ${areaMeta.division} Division`}
                  </span>
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {language === 'bn'
                  ? `${areaMeta.nameBn} এলাকার নাগরিকদের একত্রিত প্রচেষ্টায়, একটি সুন্দর, নিরাপদ ও পরিষ্কার নগর গড়ে তোলার লক্ষ্যে নগরচিত্রে যুক্ত হন।`
                  : `Join NagarChitra to collaborate with residents of ${areaMeta.name} to build a cleaner, safer, and more livable city.`}
              </p>

              {/* Area Sub-wards */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {[
                  language === 'bn' ? `${areaMeta.nameBn} ১০` : `${areaMeta.name} 10`,
                  language === 'bn' ? `${areaMeta.nameBn} ২` : `${areaMeta.name} 2`,
                  language === 'bn' ? `${areaMeta.nameBn} ১১` : `${areaMeta.name} 11`,
                  language === 'bn' ? `${areaMeta.nameBn} ১২` : `${areaMeta.name} 12`,
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMapSearch(item)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-sm transition"
                  >
                    {item}
                  </button>
                ))}
                <Link
                  href="/explore"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition flex items-center gap-1"
                >
                  <span>{t('View More', 'আরও দেখুন')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right Health Index Gauge Card */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="bg-[#0A2E2A]/90 border border-emerald-500/20 backdrop-blur-md rounded-3xl p-6 sm:p-7 text-center shadow-2xl relative w-full max-w-xs space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">{t('Area Health Index', 'এলাকা স্বাস্থ্য সূচক')}</span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-sans flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t('+12% Improvement', '+12% উন্নতি')}
                  </span>
                </div>

                {/* Circular Gauge Ring */}
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#123D37"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10B981"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="80.38"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white font-sans tracking-tight">
                      68%
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold block -mt-0.5">
                      {t('Resolved', 'সমাধান হয়েছে')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {t('Over 65+ problems resolved in last 30 days in this area', 'গত ৩০ দিনে এই এলাকায় ৬৫+ সমস্যার সমাধান রেকর্ড করা হয়েছে')}
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-white cursor-pointer transition">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('How is this score calculated?', 'কিভাবে এই স্কোর গণনা করা হয়?')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY STATS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Stats Grid */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-tight">
                    {t('Area Summary', 'এলাকার সারসংক্ষেপ')}
                  </h3>
                  <span className="text-[11px] text-slate-400 block">
                    {language === 'bn' ? `${areaMeta.nameBn} এলাকার সাম্প্রতিক সার্বিক চিত্র` : `Recent overview of ${areaMeta.name}`}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {areaMeta.city}
              </span>
            </div>

            {/* 4 KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
              {/* Stat 1 */}
              <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('stats.totalReports')}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(487)}</div>
                <span className="text-[10px] text-emerald-600 font-bold block font-sans">
                  ↑ 12% ({t('last 30 days', 'গত ৩০ দিনে')})
                </span>
              </div>

              {/* Stat 2 */}
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('stats.resolved')}</span>
                </div>
                <div className="text-2xl font-black text-emerald-700 font-sans">{formatNumber(327)}</div>
                <span className="text-[10px] text-emerald-600 font-bold block font-sans">
                  ↑ 18%
                </span>
              </div>

              {/* Stat 3 */}
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-blue-800 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('stats.inProgress')}</span>
                </div>
                <div className="text-2xl font-black text-blue-700 font-sans">{formatNumber(132)}</div>
                <span className="text-[10px] text-blue-600 font-bold block font-sans">
                  ↑ 7%
                </span>
              </div>

              {/* Stat 4 */}
              <div className="p-3 bg-red-50/50 rounded-2xl border border-red-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-red-800 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>{t('status.critical')}</span>
                </div>
                <div className="text-2xl font-black text-red-700 font-sans">{formatNumber(28)}</div>
                <span className="text-[10px] text-red-600 font-bold block font-sans">
                  ↓ 5%
                </span>
              </div>
            </div>
          </div>

          {/* Right Top Problems Box */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">
                {t('Most Reported Problems', 'সর্বাধিক রিপোর্টকৃত সমস্যা')}
              </h3>
              <Link
                href="/explore"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>{t('View More', 'আরও দেখুন')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Horizontal Categories Row */}
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <span className="text-base mb-1">🚗</span>
                <span className="text-[10px] text-slate-600 block font-semibold leading-tight">
                  {t('Roads & Footpaths', 'রাস্তা/ফুটপাত')}
                </span>
                <span className="text-xs font-black text-slate-900 font-sans mt-0.5">28%</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <span className="text-base mb-1">🌊</span>
                <span className="text-[10px] text-slate-600 block font-semibold leading-tight">
                  {t('Drainage', 'ড্রেনেজ')}
                </span>
                <span className="text-xs font-black text-slate-900 font-sans mt-0.5">20%</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <span className="text-base mb-1">🗑️</span>
                <span className="text-[10px] text-slate-600 block font-semibold leading-tight">
                  {t('Waste', 'আবর্জনা')}
                </span>
                <span className="text-xs font-black text-slate-900 font-sans mt-0.5">16%</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <span className="text-base mb-1">💡</span>
                <span className="text-[10px] text-slate-600 block font-semibold leading-tight">
                  {t('Street Light', 'স্ট্রিট লাইট')}
                </span>
                <span className="text-xs font-black text-slate-900 font-sans mt-0.5">12%</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <span className="text-base mb-1">💧</span>
                <span className="text-[10px] text-slate-600 block font-semibold leading-tight">
                  {t('Other', 'অন্যান্য')}
                </span>
                <span className="text-xs font-black text-slate-900 font-sans mt-0.5">24%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AREA PULSE + MAP + ACTIVITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Panel 1: Area Pulse */}
          <div className="lg:col-span-3 bg-[#0B3D3A] text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
                <span className="text-base">📊</span>
                <div>
                  <h3 className="font-black text-sm text-white leading-tight">{t('pulse.title')}</h3>
                  <span className="text-[11px] text-slate-300 block">
                    {language === 'bn' ? `${areaMeta.nameBn} বিভিন্ন শ্রেণীর সমস্যার বর্তমান চিত্র` : `Current breakdown of issues in ${areaMeta.name}`}
                  </span>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#105751" strokeWidth="9" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#F2B84B" strokeWidth="9"
                    strokeDasharray="238.7" strokeDashoffset="160"
                    fill="transparent"
                  />
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#3B82F6" strokeWidth="9"
                    strokeDasharray="238.7" strokeDashoffset="190"
                    fill="transparent"
                  />
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#10B981" strokeWidth="9"
                    strokeDasharray="238.7" strokeDashoffset="210"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">{t('Total Issues', 'মোট সমস্যা')}</span>
                  <span className="text-xl font-black text-white font-sans">{formatNumber(487)}</span>
                </div>
              </div>

              {/* List with Counts */}
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span>{t('Roads & Footpaths', 'রাস্তা/ফুটপাত')}</span>
                  </span>
                  <span className="font-sans font-bold">{formatNumber(136)} <span className="text-[10px] text-emerald-400 font-normal">↑ 12%</span></span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>{t('Drainage / Waterlogging', 'ড্রেনেজ/জলাবদ্ধতা')}</span>
                  </span>
                  <span className="font-sans font-bold">{formatNumber(97)} <span className="text-[10px] text-emerald-400 font-normal">↑ 8%</span></span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>{t('Waste', 'আবর্জনা')}</span>
                  </span>
                  <span className="font-sans font-bold">{formatNumber(78)} <span className="text-[10px] text-emerald-400 font-normal">↑ 5%</span></span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span>{t('Street Light', 'স্ট্রিট লাইট')}</span>
                  </span>
                  <span className="font-sans font-bold">{formatNumber(58)} <span className="text-[10px] text-emerald-400 font-normal">↑ 14%</span></span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>{t('Other', 'অন্যান্য')}</span>
                  </span>
                  <span className="font-sans font-bold">{formatNumber(118)} <span className="text-[10px] text-emerald-400 font-normal">↑ 6%</span></span>
                </div>
              </div>
            </div>

            <Link
              href="/explore"
              className="text-center py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-accent transition flex items-center justify-center gap-1"
            >
              <span>{t('View Details', 'বিস্তারিত দেখুন')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Panel 2: Interactive Area Map */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3">
            {/* Map Top Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder={t('Search in this area...', 'এই এলাকায় খুঁজুন...')}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bangla focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="ALL">{t('cat.all')}</option>
                <option value="road">{t('recent.roadDamage')}</option>
                <option value="water">{t('recent.waterlogging')}</option>
                <option value="waste">{t('recent.waste')}</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="ALL">{t('All Statuses', 'সব স্ট্যাটাস')}</option>
                <option value="in_progress">{t('map.inProgress')}</option>
                <option value="resolved">{t('map.resolved')}</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="ALL">{t('All Severities', 'সব গুরুত্ব')}</option>
                <option value="critical">{t('map.critical')}</option>
                <option value="high">{t('map.high')}</option>
              </select>
            </div>

            {/* Map View */}
            <div className="h-[340px] rounded-2xl overflow-hidden border border-slate-200 relative">
              <CivicMap
                issues={areaIssues.length > 0 ? areaIssues : issues}
                center={[areaMeta.lat, areaMeta.lng]}
                zoom={14}
                height="100%"
              />
            </div>

            {/* Bottom Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 px-1 pt-1 font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> {t('map.critical')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> {t('map.high')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {t('map.medium')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {t('map.low')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> {t('map.resolved')}</span>
            </div>
          </div>

          {/* Panel 3: Recent Activity */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h3 className="font-black text-sm text-slate-900">{t('Recent Activity', 'সাম্প্রতিক কার্যক্রম')}</h3>
                <Link href="/explore" className="text-xs text-primary font-bold hover:underline">
                  {t('View All', 'সব দেখুন')} ➔
                </Link>
              </div>

              {/* Vertical Activity Timeline */}
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span>🚗</span>
                      <span>{t('Road Damage Report', 'রাস্তা ক্ষতিগ্রস্তের রিপোর্ট')}</span>
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                      {t('New', 'নতুন')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{areaDisplayName} • {t('recent.twoHoursAgo')}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span>👥</span>
                      <span>{t('Community Verification', 'কমিউনিটি যাচাই')}</span>
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800">
                      {t('Verifying', 'যাচাই হচ্ছে')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{areaDisplayName} • {t('recent.threeHoursAgo')}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span>👷</span>
                      <span>{t('Department Assigned', 'বিভাগে বরাদ্দ')}</span>
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">
                      {t('map.inProgress')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{areaDisplayName} • 4 {t('hours ago', 'ঘণ্টা আগে')}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span>🛠️</span>
                      <span>{t('Work Started', 'কাজ শুরু হয়েছে')}</span>
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">
                      {t('map.inProgress')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{areaDisplayName} • 5 {t('hours ago', 'ঘণ্টা আগে')}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] font-bold text-center">
              ✓ {t('12 new verifications completed today in this area', 'আজ এই এলাকায় ১২টি নতুন যাচাই সম্পন্ন')}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#082823] text-white rounded-3xl p-6 sm:p-8 border border-emerald-600/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start gap-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {language === 'bn' ? `${areaMeta.nameBn}-এর কি কোনো সমস্যা দেখেছেন?` : `Spotted a civic issue in ${areaMeta.name}?`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {t(
                  'Submit a report to help make your neighborhood cleaner, safer, and better.',
                  'একটি রিপোর্ট করুন, আপনার এলাকাকে আরও নিরাপদ ও সুন্দর করে গড়ে তুলতে সাহায্য করুন।'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full md:w-auto">
            <Link
              href="/report"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>+ {t('hero.reportCta')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="space-y-1 text-xs text-slate-300 hidden xl:block">
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {t('Upload clear hazard photos', 'ছবি আপলোড করুন')}</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {t('Identify precise location', 'লোকেশন চিহ্নিত করুন')}</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {t('Automated resolution tracking', 'অগ্রগতি স্বয়ংক্রিয় ট্র্যাক করুন')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
