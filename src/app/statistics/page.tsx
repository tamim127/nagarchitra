'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { CivicMap } from '@/components/Map';
import {
  Bell,
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Users,
  Filter,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  Settings,
  Share2,
  ChevronDown,
  BarChart2,
  PieChart,
  Home,
  Sliders,
  Database,
  Award,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';

export default function StatisticsPage() {
  const { issues } = useIssues();
  const { t, language, formatNumber } = useLanguage();

  // Active Sidebar Item
  const [activeSidebar, setActiveSidebar] = useState('dashboard');

  // Chart Tab: মোট রিপোর্ট | সমাধান হার | গড় সময়
  const [trendTab, setTrendTab] = useState<'reports' | 'resolution' | 'time'>('reports');

  // Table Search and Filters
  const [tableSearch, setTableSearch] = useState('');
  const [dateRange, setDateRange] = useState('01 Sep 2026 - 30 Sep 2026');
  const [selectedArea, setSelectedArea] = useState('ঢাকা মহানগরী (সকল এলাকা)');

  return (
    <div className="bg-[#F4F6F8] text-slate-900 min-h-screen font-bangla pb-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT SIDEBAR (2.5 cols) ================= */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-4">
              {/* Active Tab: ড্যাশবোর্ড */}
              <button
                onClick={() => setActiveSidebar('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSidebar === 'dashboard'
                    ? 'bg-[#EBF7F5] text-primary font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-primary" />
                <span>{t('Dashboard', 'ড্যাশবোর্ড')}</span>
              </button>

              {/* Section 1: মুখ্য প্যানেল */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block">
                  {t('Main Panel', 'মুখ্য প্যানেল')}
                </span>

                {[
                  { id: 'all_issues', label: t('All Issues', 'সমস্ত সমস্যা'), icon: '🚨' },
                  { id: 'category_analysis', label: t('Category Analysis', 'দলভিত্তিক বিশ্লেষণ'), icon: '🔀' },
                  { id: 'area_reports', label: t('Area Reports', 'এলাকা ভিত্তিক রিপোর্ট'), icon: '🏛️' },
                  { id: 'resolution_rate', label: t('Resolution Rate', 'সমাধানের হার'), icon: '🛠️' },
                  { id: 'time_analysis', label: t('Time Analysis', 'সময়ের বিশ্লেষণ'), icon: '⏱️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSidebar(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      activeSidebar === item.id
                        ? 'bg-slate-100 text-primary font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Section 2: ডাটা ও রিপোর্ট */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block">
                  {t('Data & Reports', 'ডাটা ও রিপোর্ট')}
                </span>

                <Link
                  href="/open-data"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Export Report', 'রিপোর্ট এক্সপোর্ট')}</span>
                </Link>

                <Link
                  href="/open-data"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  <Database className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Open Data (Beta)', 'ওপেন ডাটা (পরীক্ষামূলক)')}</span>
                </Link>
              </div>

              {/* Section 3: সেটিংস */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider block">
                  {t('Settings', 'সেটিংস')}
                </span>

                {[
                  { id: 'cat_manage', label: t('Category Management', 'ক্যাটাগরি ম্যানেজমেন্ট'), icon: <Sliders className="w-3.5 h-3.5 text-slate-400" /> },
                  { id: 'area_manage', label: t('Area Management', 'এলাকা ম্যানেজমেন্ট'), icon: <MapPin className="w-3.5 h-3.5 text-slate-400" /> },
                  { id: 'user_manage', label: t('User Management', 'ব্যবহারকারী ব্যবস্থাপনা'), icon: <Users className="w-3.5 h-3.5 text-slate-400" /> },
                  { id: 'system_settings', label: t('System Settings', 'সিস্টেম সেটিংস'), icon: <Settings className="w-3.5 h-3.5 text-slate-400" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSidebar(item.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Sidebar Illustration Card (স্মৃতিসৌধ ও জাতীয় অঙ্গীকার) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1C4E47] via-[#103D37] to-[#0A2925] p-4 text-white text-xs space-y-3 shadow-md border border-emerald-700/50">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                🍃
              </div>
              <p className="font-bold text-slate-100 leading-relaxed text-[11px] pr-2">
                একটি পরিচ্ছন্ন, নিরাপদ, স্মার্ট বাংলাদেশ গড়ার জন্য, আমরা সবাই একসাথে।
              </p>
              {/* National Monument (জাতীয় স্মৃতিসৌধ) Graphic Silhouette */}
              <div className="pt-2 flex justify-center opacity-40">
                <svg viewBox="0 0 160 80" className="w-full h-16 fill-current text-emerald-200">
                  {/* Central Towering Blades */}
                  <polygon points="80,0 76,70 84,70" />
                  <polygon points="72,20 67,70 77,70" />
                  <polygon points="88,20 83,70 93,70" />
                  <polygon points="62,35 56,70 68,70" />
                  <polygon points="98,35 92,70 104,70" />
                  <polygon points="52,48 45,70 58,70" />
                  <polygon points="108,48 102,70 115,70" />
                  <polygon points="40,58 32,70 48,70" />
                  <polygon points="120,58 112,70 128,70" />
                  {/* Base Platform and Trees */}
                  <rect x="10" y="70" width="140" height="4" rx="2" />
                  <circle cx="20" cy="65" r="7" />
                  <circle cx="30" cy="67" r="5" />
                  <circle cx="130" cy="67" r="5" />
                  <circle cx="140" cy="65" r="7" />
                </svg>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CONTENT AREA (9.5 cols) ================= */}
          <main className="lg:col-span-10 space-y-6">
            {/* Top Header Row */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <Link
                  href="/statistics"
                  className="text-[11px] font-bold text-slate-400 hover:text-primary transition inline-flex items-center gap-1"
                >
                  &lt; {t('Statistics Dashboard', 'পরিসংখ্যান ড্যাশবোর্ড')}
                </Link>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {t('NagarChitra - Citizen Insights', 'নগরচিত্র - সিটিজেন ইনসাইটস')}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {t('Summary of civic issues, resolutions and community engagement across areas', 'বিভিন্ন এলাকায় সমস্যা, সমাধান ও নাগরিক অংশগ্রহণের সারসংক্ষেপ')}
                </p>
              </div>

              {/* Date & Location Filters + Right Pill */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-sans">{dateRange}</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{t('Dhaka Metropolitan (All Areas)', selectedArea)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Right Green Info Card with Bangladesh outline & Skyline */}
                <div className="hidden xl:flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#E8F5F1] border border-emerald-200/80 text-emerald-950 relative overflow-hidden min-w-[230px]">
                  <div className="relative z-10 space-y-0.5">
                    <strong className="block text-xs font-bold text-[#0D3833]">{t('Data-driven Civic Engagement', 'তথ্যভিত্তিক নাগরিক অংশগ্রহণ')}</strong>
                    <span className="text-[10px] text-emerald-800 font-medium">{t('Builds a better city', 'গড়ে তোলে উন্নত নগর')}</span>
                  </div>
                  {/* Silhouette Skyline Graphic */}
                  <div className="relative w-16 h-10 shrink-0 opacity-40">
                    <svg viewBox="0 0 100 60" className="w-full h-full fill-emerald-800">
                      <polygon points="10,60 10,35 20,35 20,60" />
                      <polygon points="25,60 25,20 38,20 38,60" />
                      <polygon points="42,60 42,10 52,5 58,10 58,60" />
                      <polygon points="62,60 62,25 75,25 75,60" />
                      <polygon points="80,60 80,40 95,40 95,60" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. FIVE KPI METRIC CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {/* Card 1: মোট রিপোর্ট */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 text-base">
                  🚨
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-500 font-semibold block">{t('Total Reports', 'মোট রিপোর্ট')}</span>
                  <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(issues.length)}</div>
                  <span className="text-[10px] font-bold text-emerald-600 block">↑ 100% {t('Live Data', 'লাইভ ডেটা')}</span>
                </div>
              </div>

              {/* Card 2: সমাধান হয়েছে */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                  ✓
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-500 font-semibold block">{t('Resolved', 'সমাধান হয়েছে')}</span>
                  <div className="text-2xl font-black text-slate-900 font-sans">
                    {formatNumber(issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length)}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    {issues.length > 0
                      ? `${Math.round((issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length / issues.length) * 100)}%`
                      : '0%'}{' '}
                    {t('Resolution rate', 'সমাধান হার')}
                  </span>
                </div>
              </div>

              {/* Card 3: চলমান */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  ⏱️
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-500 font-semibold block">{t('In Progress', 'চলমান')}</span>
                  <div className="text-2xl font-black text-slate-900 font-sans">
                    {formatNumber(issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length)}
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 block">{t('Under operation', 'মাঠপর্যায়ে কাজ চলছে')}</span>
                </div>
              </div>

              {/* Card 4: গুরুতর (Critical) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  🔔
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-500 font-semibold block">{t('Critical', 'গুরুতর (Critical)')}</span>
                  <div className="text-2xl font-black text-slate-900 font-sans">
                    {formatNumber(issues.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length)}
                  </div>
                  <span className="text-[10px] font-bold text-red-600 block">{t('High Priority SLA', 'অগ্রাধিকার এসএলএ')}</span>
                </div>
              </div>

              {/* Card 5: নাগরিক যাচাই সম্পন্ন */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  👥
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-500 font-semibold block">{t('Citizen Verified', 'নাগরিক যাচাই')}</span>
                  <div className="text-2xl font-black text-slate-900 font-sans">
                    {formatNumber(issues.filter((i) => (i.citizenVerifications?.fixedCount || 0) > 0 || i.userConfirmed).length)}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 block">✓ {t('Ground Checked', 'মাঠপর্যায়ে পরীক্ষিত')}</span>
                </div>
              </div>
            </div>

            {/* 2. CHARTS ROW: TREND LINE WAVE + DONUT BREAKDOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Chart (8 cols): সমস্যার প্রবণতা (গত ৩০ দিন) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      {t('Issue Trends', 'সমস্যার প্রবণতা')} <span className="text-xs text-slate-400 font-normal">{t('(Last 30 Days)', '(গত ৩০ দিন)')}</span>
                    </span>
                  </div>

                  {/* Tabs: মোট রিপোর্ট | সমাধান হার | গড় সময় */}
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-bold">
                    <button
                      onClick={() => setTrendTab('reports')}
                      className={`px-3 py-1 rounded-md transition ${
                        trendTab === 'reports' ? 'bg-[#08221E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t('Total Reports', 'মোট রিপোর্ট')}
                    </button>
                    <button
                      onClick={() => setTrendTab('resolution')}
                      className={`px-3 py-1 rounded-md transition ${
                        trendTab === 'resolution' ? 'bg-[#08221E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t('Resolution Rate', 'সমাধান হার')}
                    </button>
                    <button
                      onClick={() => setTrendTab('time')}
                      className={`px-3 py-1 rounded-md transition ${
                        trendTab === 'time' ? 'bg-[#08221E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t('Avg. Time', 'গড় সময়')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* SVG Multi-Wave Chart (9 cols) */}
                  <div className="md:col-span-9 h-52 w-full relative pt-2">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y-Axis Grid Lines & Values */}
                      <g className="text-[10px] fill-slate-400 font-sans">
                        <line x1="25" y1="20" x2="495" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="24">200</text>

                        <line x1="25" y1="60" x2="495" y2="60" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="64">150</text>

                        <line x1="25" y1="100" x2="495" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="5" y="104">100</text>

                        <line x1="25" y1="140" x2="495" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="10" y="144">50</text>

                        <line x1="25" y1="180" x2="495" y2="180" stroke="#E2E8F0" strokeWidth="1" />
                        <text x="15" y="184">0</text>
                      </g>

                      {/* Wave 1: রাস্তা ও অবকাঠামো (Orange with Area Gradient) */}
                      <path
                        d="M25,115 C70,95 120,65 170,85 C220,105 270,60 320,70 C370,80 430,55 495,65 L495,180 L25,180 Z"
                        fill="url(#amberGrad)"
                      />
                      <path
                        d="M25,115 C70,95 120,65 170,85 C220,105 270,60 320,70 C370,80 430,55 495,65"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                      />

                      {/* Wave 2: পানি ও ড্রেনেজ (Blue/Cyan) */}
                      <path
                        d="M25,130 C75,110 130,90 180,105 C230,80 280,100 330,85 C390,70 440,80 495,80"
                        fill="none"
                        stroke="#0EA5E9"
                        strokeWidth="2.5"
                      />

                      {/* Wave 3: বর্জ্য ও পরিবেশ (Emerald) */}
                      <path
                        d="M25,145 C80,130 135,115 185,125 C235,100 285,110 335,105 C395,95 445,100 495,95"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                      />

                      {/* Wave 4: স্ট্রিট লাইট (Purple) */}
                      <path
                        d="M25,160 C80,150 135,140 185,145 C235,125 285,135 335,125 C395,120 445,115 495,120"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* X Axis Labels */}
                    <div className="flex justify-between pl-6 pr-1 text-[10px] text-slate-400 font-sans pt-1">
                      <span>1 Sep</span>
                      <span>5 Sep</span>
                      <span>10 Sep</span>
                      <span>15 Sep</span>
                      <span>20 Sep</span>
                      <span>25 Sep</span>
                      <span>30 Sep</span>
                    </div>
                  </div>

                  {/* Legend on Right (3 cols) */}
                  <div className="md:col-span-3 space-y-2.5 text-xs font-semibold pl-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
                      <span>{t('Roads & Infrastructure', 'রাস্তা ও অবকাঠামো')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-2xs" />
                      <span>{t('Water & Drainage', 'পানি ও ড্রেনেজ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                      <span>{t('Waste & Environment', 'বর্জ্য ও পরিবেশ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-2xs" />
                      <span>{t('Street Light', 'স্ট্রিট লাইট')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-2xs" />
                      <span>{t('Other', 'অন্যান্য')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Chart (4 cols): সমস্যার ধরন (Donut + Breakdown) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
                <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">
                  {t('Issue Type', 'সমস্যার ধরন')}
                </h3>

                <div className="flex items-center gap-4">
                  {/* Donut Multi-Color Ring */}
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="0" fill="transparent" />
                      <circle cx="50" cy="50" r="38" stroke="#0EA5E9" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="80" fill="transparent" />
                      <circle cx="50" cy="50" r="38" stroke="#10B981" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="135" fill="transparent" />
                      <circle cx="50" cy="50" r="38" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="175" fill="transparent" />
                      <circle cx="50" cy="50" r="38" stroke="#EC4899" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="205" fill="transparent" />
                      <circle cx="50" cy="50" r="38" stroke="#94A3B8" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="225" fill="transparent" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{t('Total Reports', 'মোট রিপোর্ট')}</span>
                      <span className="text-lg font-black text-slate-900 font-sans leading-none mt-0.5">{formatNumber('1,248')}</span>
                    </div>
                  </div>

                  {/* Category Breakdown Table */}
                  <div className="flex-1 space-y-2 text-xs font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>{t('Roads & Infrastructure', 'রাস্তা ও অবকাঠামো')}</span>
                      </span>
                      <span className="font-sans font-bold text-slate-900">{formatNumber('428')} <span className="text-[10px] text-slate-400 font-normal">34%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span>{t('Water & Drainage', 'পানি ও ড্রেনেজ')}</span>
                      </span>
                      <span className="font-sans font-bold text-slate-900">{formatNumber('276')} <span className="text-[10px] text-slate-400 font-normal">22%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{t('Waste & Environment', 'বর্জ্য ও পরিবেশ')}</span>
                      </span>
                      <span className="font-sans font-bold text-slate-900">{formatNumber('198')} <span className="text-[10px] text-slate-400 font-normal">16%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <span>{t('Street Light', 'স্ট্রিট লাইট')}</span>
                      </span>
                      <span className="font-sans font-bold text-slate-900">{formatNumber('156')} <span className="text-[10px] text-slate-400 font-normal">12%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                        <span>{t('Public Safety', 'নিরাপত্তা')}</span>
                      </span>
                      <span className="font-sans font-bold text-slate-900">{formatNumber('102')} <span className="text-[10px] text-slate-400 font-normal">8%</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span>{t('Other', 'অন্যান্য')}</span>
                      </span>
                      <span className="font-sans font-bold text-slate-900">{formatNumber('88')} <span className="text-[10px] text-slate-400 font-normal">7%</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. RECENT REPORTS TABLE + HOTSPOT HEATMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left (8 cols): সাম্প্রতিক রিপোর্টসমূহ */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <h3 className="font-black text-sm text-slate-900">
                    {t('Recent Reports', 'সাম্প্রতিক রিপোর্টসমূহ')}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder={t('Search by ID, area or keywords...', 'সমস্যা আইডি, এলাকা বা কীওয়ার্ড দিয়ে খুঁজুন...')}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bangla focus:outline-none focus:ring-1 focus:ring-primary w-52 sm:w-64"
                      />
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                      <Filter className="w-3 h-3 text-slate-500" />
                      <span>{t('Filter', 'ফিল্টার')}</span>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5">{t('Issue ID', 'সমস্যা আইডি')}</th>
                        <th className="px-3 py-2.5">{t('Issue Type', 'সমস্যার ধরন')}</th>
                        <th className="px-3 py-2.5">{t('Location / Area', 'স্থান / এলাকা')}</th>
                        <th className="px-3 py-2.5">{t('Severity', 'গুরুতরতা')}</th>
                        <th className="px-3 py-2.5">{t('Status', 'স্ট্যাটাস')}</th>
                        <th className="px-3 py-2.5">{t('Report Time', 'রিপোর্টের সময়')}</th>
                        <th className="px-3 py-2.5 text-right">{t('Action', 'অ্যাকশন')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {issues
                        .filter((i) => {
                          if (!tableSearch.trim()) return true;
                          const q = tableSearch.toLowerCase();
                          return (
                            i.title.toLowerCase().includes(q) ||
                            i.trackingNumber.toLowerCase().includes(q) ||
                            i.location.area.toLowerCase().includes(q) ||
                            i.categoryName.toLowerCase().includes(q)
                          );
                        })
                        .slice(0, 10)
                        .map((row) => {
                          const statusBg =
                            row.status === 'RESOLVED' || row.status === 'CLOSED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                              : row.status === 'IN_PROGRESS' || row.status === 'ASSIGNED'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : row.status === 'CITIZEN_VERIFICATION' || row.status === 'VERIFIED'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200';

                          const sevBg =
                            row.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-700 border-red-200 font-bold'
                              : row.severity === 'HIGH'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : row.severity === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200';

                          return (
                            <tr key={row.id} className="hover:bg-slate-50 transition">
                              <td className="px-3 py-2.5 font-sans font-bold text-slate-800 whitespace-nowrap flex items-center gap-2">
                                <img
                                  src={row.media[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=80&q=80'}
                                  alt={row.title}
                                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                                />
                                <span>{row.trackingNumber}</span>
                              </td>
                              <td className="px-3 py-2.5 font-bold text-slate-900 line-clamp-1 max-w-[200px]">{row.title}</td>
                              <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{row.location.area}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${sevBg}`}>
                                  {row.severity}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${statusBg}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-slate-500 font-bangla text-[11px] whitespace-nowrap">
                                {new Date(row.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </td>
                              <td className="px-3 py-2.5 text-right whitespace-nowrap">
                                <Link
                                  href={`/issues/${row.id}`}
                                  className="px-3 py-1 rounded-lg bg-[#0B3D3A] text-white font-bold text-[11px] hover:bg-[#145955] transition inline-flex items-center gap-1 shadow-2xs"
                                >
                                  <span>{t('Details', 'বিস্তারিত')}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right (4 cols): হটস্পট এলাকা (ম্যাপ) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-sm text-slate-900">{t('Hotspot Areas', 'হটস্পট এলাকা')}</h3>
                  <Link href="/explore" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                    <span>{t('View All', 'সম্পূর্ণ দেখুন')}</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Leaflet Heatmap / Density Map Container with Dhaka Hotspots */}
                <div className="h-[270px] rounded-2xl overflow-hidden border border-slate-200 relative">
                  <CivicMap issues={issues} zoom={11} center={[23.7925, 90.4078]} height="100%" hideLegend={true} />

                  {/* Heatmap intensity radial overlays & area labels matching mockup */}
                  <div className="absolute inset-0 pointer-events-none z-[400]">
                    {/* উত্তরা Hotspot */}
                    <div className="absolute top-[18%] left-[45%] flex items-center gap-1.5 -translate-x-1/2">
                      <div className="relative">
                        <div className="w-10 h-10 -ml-3 -mt-3 absolute rounded-full bg-red-500/40 blur-md animate-pulse" />
                        <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">{t('Uttara', 'উত্তরা')}</span>
                    </div>

                    {/* গুলশান Hotspot */}
                    <div className="absolute top-[38%] right-[18%] flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-12 h-12 -ml-3 -mt-3 absolute rounded-full bg-orange-500/35 blur-md" />
                        <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">{t('Gulshan', 'গুলশান')}</span>
                    </div>

                    {/* মিরপুর Hotspot */}
                    <div className="absolute top-[42%] left-[25%] flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-14 h-14 -ml-4 -mt-4 absolute rounded-full bg-red-600/40 blur-lg" />
                        <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">{t('Mirpur', 'মিরপুর')}</span>
                    </div>

                    {/* ধানমন্ডি Hotspot */}
                    <div className="absolute top-[60%] left-[30%] flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-16 h-16 -ml-5 -mt-5 absolute rounded-full bg-red-500/45 blur-lg animate-pulse" />
                        <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">{t('Dhanmondi', 'ধানমন্ডি')}</span>
                    </div>

                    {/* মোহাম্মদপুর Hotspot */}
                    <div className="absolute top-[68%] right-[32%] flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-10 h-10 -ml-2 -mt-2 absolute rounded-full bg-amber-500/35 blur-md" />
                        <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">{t('Mohammadpur', 'মোহাম্মদপুর')}</span>
                    </div>

                    {/* ফার্মগেট Hotspot */}
                    <div className="absolute top-[78%] right-[24%] flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-12 h-12 -ml-3 -mt-3 absolute rounded-full bg-sky-500/30 blur-md" />
                        <div className="w-3.5 h-3.5 rounded-full bg-sky-600 border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">{t('Farmgate', 'ফার্মগেট')}</span>
                    </div>
                  </div>

                  {/* Zoom Controls Buttons matching mockup */}
                  <div className="absolute bottom-3 right-3 z-[410] flex flex-col bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                    <button className="p-1 hover:bg-slate-50 text-slate-700 border-b border-slate-200">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 hover:bg-slate-50 text-slate-700">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Heatmap Intensity Legend matching mockup */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 px-2 pt-1 font-semibold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t('Low', 'কম')}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> {t('Medium', 'মাঝারি')}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> {t('High', 'বেশি')}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> {t('Very High', 'খুব বেশি')}</span>
                </div>
              </div>
            </div>

            {/* 4. BOTTOM AREA BANNER ("আপনার এলাকার সারসংক্ষেপ") */}
            <div className="bg-[#072522] text-white rounded-3xl p-6 sm:p-7 border border-emerald-600/30 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left Info */}
              <div className="flex items-start gap-4 z-10 max-w-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-accent flex items-center justify-center shrink-0 border border-amber-500/30 text-xl font-bold">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white leading-snug">
                    {t('Your Area Summary', 'আপনার এলাকার সারসংক্ষেপ')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t(
                      'In Mirpur area over the last 30 days, most reported issues are road damage (32%), followed by waterlogging (21%) and waste (15%).',
                      'মিরপুর এলাকায় গত ৩০ দিনে সবচেয়ে বেশি রিপোর্ট হয়েছে রাস্তা ক্ষতিগ্রস্ত (৩২%), তারপর জলাবদ্ধতা (২১%) এবং বর্জ্য (১৫%) সম্পর্কিত।'
                    )}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/nagar/mirpur"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-accent text-xs font-bold border border-accent/30 transition shadow-2xs"
                    >
                      <span>{t('View Area Details', 'এলাকা বিস্তারিত দেখুন')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Middle National Monument Graphic & Area Capsule */}
              <div className="flex items-center gap-4 z-10">
                {/* Vector silhouette of Smriti Soudho */}
                <div className="hidden sm:block opacity-60 w-20 h-16">
                  <svg viewBox="0 0 100 80" className="w-full h-full fill-emerald-400">
                    <polygon points="50,0 47,80 53,80" />
                    <polygon points="43,20 38,80 47,80" />
                    <polygon points="57,20 53,80 62,80" />
                    <polygon points="35,40 30,80 40,80" />
                    <polygon points="65,40 60,80 70,80" />
                  </svg>
                </div>

                <div className="p-3 bg-[#0A332E] border border-emerald-500/30 rounded-2xl text-center shrink-0 min-w-[130px]">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-black text-sm text-white">{t('Mirpur', 'মিরপুর')}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-semibold">{t('Dhaka Metropolitan', 'ঢাকা মহানগরী')}</span>
                </div>
              </div>

              {/* Right 4 Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 z-10 w-full lg:w-auto text-center font-sans">
                <div className="p-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xs">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('Total Reports', 'মোট রিপোর্ট')}</span>
                  <span className="text-lg font-black text-white block mt-0.5">{formatNumber('184')}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">↑ 12%</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xs">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('Resolution Rate', 'সমাধানের হার')}</span>
                  <span className="text-lg font-black text-white block mt-0.5">{formatNumber('52%')}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">↑ 20%</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xs">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('In Progress', 'চলমান')}</span>
                  <span className="text-lg font-black text-white block mt-0.5">{formatNumber('96')}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">↑ 8%</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xs">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('Critical', 'গুরুতর')}</span>
                  <span className="text-lg font-black text-white block mt-0.5">{formatNumber('36')}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">↑ 5%</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
