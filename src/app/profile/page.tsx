'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { CivicMap } from '@/components/Map';
import {
  MapPin,
  Calendar,
  Edit3,
  TrendingUp,
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  Star,
  Flame,
  ChevronRight,
  Shield,
  Award,
  MessageSquare,
  ThumbsUp,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, role } = useAuthRole();
  const { t, language, formatNumber } = useLanguage();

  // Active filter tab for reports
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'verifying' | 'in_progress' | 'resolved'>('all');
  const [selectedArea, setSelectedArea] = useState('Mirpur 10');

  // Reports data matching mockup
  const reports = [
    {
      id: 'NC-2026-0112',
      title: 'মিরপুর ১০ - রাস্তায় বড় গর্ত',
      location: 'Mirpur 10, Dhaka',
      category: 'রাস্তা ও ফুটপাত',
      status: 'সমাধানাধীন',
      statusType: 'in_progress',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      time: '২ দিন আগে',
      img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=120&q=80',
      link: '/issues/road-damage-mirpur-10-8f92',
      currentStep: 2, // 1: reported, 2: verifying, 3: in_progress, 4: resolved
    },
    {
      id: 'NC-2026-0108',
      title: 'ধানমন্ডি ২৭ - পানি জমে থাকে',
      location: 'Dhanmondi, Dhaka',
      category: 'ড্রেনেজ ও পানি নিষ্কাশন',
      status: 'সমাধান হয়েছে',
      statusType: 'resolved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      time: '৫ দিন আগে',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
      link: '/issues/waterlogging-farmgate-bijoy-1e82',
      currentStep: 4,
    },
    {
      id: 'NC-2026-0104',
      title: 'উত্তরা ৩ - খোলা ম্যানহোল',
      location: 'Uttara, Dhaka',
      category: 'নিরাপত্তা',
      status: 'জরুরি',
      statusType: 'critical',
      statusColor: 'bg-red-50 text-red-700 border-red-200 font-bold',
      isCritical: true,
      time: '১ সপ্তাহ আগে',
      img: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=120&q=80',
      link: '/issues/open-manhole-mohammadpur-9a11',
      currentStep: 1,
    },
    {
      id: 'NC-2026-0098',
      title: 'মোহাম্মদপুর - বর্জ্য ফেলা',
      location: 'Mohammadpur, Dhaka',
      category: 'বর্জ্য ব্যবস্থাপনা',
      status: 'সমাধান হয়েছে',
      statusType: 'resolved',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      time: '১ সপ্তাহ আগে',
      img: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=120&q=80',
      link: '/issues/waste-dumping-dhanmondi-27-3b44',
      currentStep: 4,
    },
    {
      id: 'NC-2026-0087',
      title: 'গুলশান ১ - উন্মুক্ত বৈদ্যুতিক তার',
      location: 'Gulshan, Dhaka',
      category: 'বিদ্যুৎ ও সেবা',
      status: 'যাচাই চলছে',
      statusType: 'verifying',
      statusColor: 'bg-purple-50 text-purple-800 border-purple-200',
      time: '১০ দিন আগে',
      img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=120&q=80',
      link: '/issues/street-light-gulshan-1-6d20',
      currentStep: 2,
    },
  ];

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'submitted') return r.currentStep === 1;
    if (activeTab === 'verifying') return r.statusType === 'verifying';
    if (activeTab === 'in_progress') return r.statusType === 'in_progress';
    if (activeTab === 'resolved') return r.statusType === 'resolved';
    return true;
  });

  return (
    <div className="bg-[#F8F9FA] text-slate-900 min-h-screen font-bangla pb-16">
      {/* 1. PROFILE HERO BANNER (PANORAMIC HATIRJHEEL LAKE & SKYLINE) */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-200">
        {/* Background Image: Dhaka Lake / Skyline */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80"
            alt="Dhaka Skyline Lake"
            className="w-full h-full object-cover opacity-50 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041E19]/95 via-[#062620]/80 to-[#031512]/60" />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: User Avatar & Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-2xl">
              {/* Avatar with Verified Badge */}
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-400 shadow-xl"
                />
                {/* Verified Cyan Checkmark badge at bottom-right */}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cyan-500 border-2 border-[#041E19] flex items-center justify-center text-white text-xs font-bold shadow-md">
                  ✓
                </div>
              </div>

              {/* User Bio & Meta */}
              <div className="space-y-2 text-white">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentUser.name}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
                    সিটিজেন
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{currentUser.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>নিবন্ধিত: ০১ মার্চ ২০২৬</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed max-w-md font-medium">
                  শহরকে আরও সুন্দর ও বাসযোগ্য করতে নাগরিক উদ্যোগে সক্রিয় থাকতে চাই।
                </p>

                {/* Edit Profile Button */}
                <div className="pt-1">
                  <button className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-xs transition">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>প্রোফাইল সম্পাদনা</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Civic Impact Score & Handwritten Callout */}
            <div className="flex items-center gap-6 self-start lg:self-center">
              {/* Civic Impact Score Card */}
              <div className="bg-[#072B24]/90 border border-emerald-500/30 rounded-3xl p-5 backdrop-blur-md shadow-2xl text-white space-y-2 min-w-[200px]">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                    🍃
                  </div>
                  <span>Civic Impact Score</span>
                </div>

                <div className="flex items-baseline gap-2 pt-1 font-sans">
                  <span className="text-3xl font-black text-white">420</span>
                  <span className="text-xs font-bold text-emerald-400">↑ +12%</span>
                </div>

                <div className="text-[10px] text-slate-400 font-sans">
                  Last 30 days
                </div>
              </div>

              {/* Handwritten chalk script callout */}
              <div className="hidden xl:flex flex-col text-right transform -rotate-3 text-white select-none">
                <span className="text-lg font-black tracking-wide drop-shadow-md text-slate-100">
                  পরিবর্তনের
                </span>
                <span className="text-xl font-black text-accent drop-shadow-md">
                  সাক্ষী হোন
                </span>
                <span className="text-sm font-black text-emerald-300 drop-shadow-md">
                  নাগরিক
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5 METRIC CARDS ROW */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: মোট রিপোর্ট */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">{t('Total Reports', 'মোট রিপোর্ট')}</span>
              <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(12)}</div>
              <span className="text-[10px] font-bold text-emerald-600 font-sans">+2 {t('New', 'নতুন')}</span>
            </div>
          </div>

          {/* Card 2: যাচাই করা রিপোর্ট */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">{t('Verified Reports', 'যাচাই করা রিপোর্ট')}</span>
              <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(8)}</div>
              <span className="text-[10px] font-bold text-slate-500 font-sans">{formatNumber('67%')}</span>
            </div>
          </div>

          {/* Card 3: সমাধানাধীন */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">{t('In Progress', 'সমাধানাধীন')}</span>
              <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(3)}</div>
              <span className="text-[10px] font-bold text-amber-600 font-sans">{formatNumber('25%')}</span>
            </div>
          </div>

          {/* Card 4: সমাধান হয়েছে */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">{t('Resolved', 'সমাধান হয়েছে')}</span>
              <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(6)}</div>
              <span className="text-[10px] font-bold text-emerald-600 font-sans">{formatNumber('50%')}</span>
            </div>
          </div>

          {/* Card 5: কমিউনিটি রেটিং */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex items-center gap-3.5 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">{t('Community Rating', 'কমিউনিটি রেটিং')}</span>
              <div className="text-2xl font-black text-slate-900 font-sans">{formatNumber(4)}</div>
              <span className="text-[10px] font-bold text-emerald-600 font-sans">+2 {t('New', 'নতুন')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT (TWO COLUMNS: MY REPORTS ON LEFT, ACHIEVEMENTS & MAP ON RIGHT) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: MY REPORTS (8 cols) ================= */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{t('My Reports', 'আমার রিপোর্টসমূহ')}</h2>
                  <p className="text-xs text-slate-500">{t('View your submitted reports and track their current progress status.', 'আপনার করা রিপোর্টগুলো এখানে দেখতে পারবেন এবং তাদের বর্তমান অবস্থা ট্র্যাক করতে পারবেন।')}</p>
                </div>
              </div>

              <Link href="/explore" className="text-xs font-bold text-primary hover:text-emerald-700 transition flex items-center gap-1 shrink-0">
                <span>{t('View All', 'সব দেখুন')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-sans">
              {[
                { id: 'all', label: t('All (12)', 'সব (১২)') },
                { id: 'submitted', label: t('Submitted (3)', 'জমা হয়েছে (৩)') },
                { id: 'verifying', label: t('Verifying (2)', 'যাচাই চলছে (২)') },
                { id: 'in_progress', label: t('In Progress (3)', 'সমাধানাধীন (৩)') },
                { id: 'resolved', label: t('Resolved (4)', 'সমাধান হয়েছে (৪)') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-[#0B3D3A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4 pt-2">
              {filteredReports.map((report) => (
                <Link
                  key={report.id}
                  href={report.link}
                  className="block p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition bg-white space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={report.img}
                        alt={report.title}
                        className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-primary transition">
                          {t(report.title)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{t(report.location)}</span>
                          </span>
                          <span>•</span>
                          <span>🏷️ {t(report.category)}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold">
                          {report.id}
                        </div>
                      </div>
                    </div>

                    {/* Right: Badge, Time & Arrow */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] ${report.statusColor}`}>
                          {report.isCritical && <Flame className="w-3 h-3 text-red-600 fill-red-600" />}
                          <span>{t(report.status)}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {t(report.time)}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                    </div>
                  </div>

                  {/* 4-Step Mini Lifecycle Stepper */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between max-w-md mx-auto text-[10px] font-sans text-slate-400">
                    {/* Step 1: রিপোর্ট */}
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white">✓</span>
                      <span>{t('Report', 'রিপোর্ট')}</span>
                    </div>

                    <div className={`h-0.5 flex-1 mx-2 ${report.currentStep >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                    {/* Step 2: যাচাই */}
                    <div className={`flex items-center gap-1 ${report.currentStep >= 2 ? 'text-emerald-700 font-bold' : ''}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${report.currentStep >= 2 ? (report.currentStep === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-300'}`} />
                      <span>{t('Verifying', 'যাচাই')}</span>
                    </div>

                    <div className={`h-0.5 flex-1 mx-2 ${report.currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                    {/* Step 3: সমাধানাধীন */}
                    <div className={`flex items-center gap-1 ${report.currentStep >= 3 ? 'text-emerald-700 font-bold' : ''}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${report.currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{t('In Progress', 'সমাধানাধীন')}</span>
                    </div>

                    <div className={`h-0.5 flex-1 mx-2 ${report.currentStep >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                    {/* Step 4: সমাধান */}
                    <div className={`flex items-center gap-1 ${report.currentStep >= 4 ? 'text-emerald-700 font-bold' : ''}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${report.currentStep >= 4 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{t('Resolved', 'সমাধান')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: ACHIEVEMENTS & MAP (4 cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. আমার অর্জন (Achievements / Badges) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    🏆
                  </div>
                  <h3 className="font-black text-sm text-slate-900">{t('My Achievements', 'আমার অর্জন')}</h3>
                </div>
                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                  <span>{t('View All', 'সব দেখুন')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2x2 Badges Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Badge 1 */}
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">{t('Active Citizen', 'সচেতন নাগরিক')}</h4>
                    <span className="text-[10px] text-slate-500 font-sans">{formatNumber('10+')}{' '}{t('Reports', 'রিপোর্ট')}</span>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-200/60 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">{t('Community Hero', 'কমিউনিটি হিরো')}</h4>
                    <span className="text-[10px] text-slate-500 font-sans">{formatNumber('5+')}{' '}{t('Verifications', 'যাচাই')}</span>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Star className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">{t('Voice of Change', 'পরিবর্তনের কণ্ঠস্বর')}</h4>
                    <span className="text-[10px] text-slate-500 font-sans">{formatNumber('3+')}{' '}{t('Resolutions', 'সমাধান')}</span>
                  </div>
                </div>

                {/* Badge 4 */}
                <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">{t('Civic Contributor', 'নাগরিক অংশগ্রহণকারী')}</h4>
                    <span className="text-[10px] text-slate-500 font-sans">{formatNumber('10+')}{' '}{t('Comments', 'কমেন্ট')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. আমার কার্যক্রমের এলাকা (Activity Area Map) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-sm text-slate-900">{t('My Activity Area', 'আমার কার্যক্রমের এলাকা')}</h3>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                  <span>{t(selectedArea)}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* Leaflet Map with Mirpur 10 target circle */}
              <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 relative">
                <CivicMap
                  issues={[]}
                  center={[23.8067, 90.3683]}
                  zoom={13}
                  height="100%"
                  hideLegend={true}
                />

                {/* Mirpur 10 Radar Circle Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[400]">
                  <div className="relative flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 animate-ping" />
                    <div className="w-16 h-16 rounded-full bg-emerald-500/25 border border-emerald-500/60 absolute" />
                    <div className="w-5 h-5 rounded-full bg-primary border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold absolute">
                      📍
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Mini Stats Under Map */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans pt-1">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('Area Reports', 'এই এলাকায় রিপোর্ট')}</span>
                  <span className="text-sm font-black text-slate-900">{formatNumber(5)}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('Resolved', 'সমাধান হয়েছে')}</span>
                  <span className="text-sm font-black text-emerald-600">{formatNumber(3)}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('In Progress', 'সমাধানাধীন')}</span>
                  <span className="text-sm font-black text-amber-600">{formatNumber(1)}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bangla block">{t('Verifying', 'যাচাই চলছে')}</span>
                  <span className="text-sm font-black text-purple-600">{formatNumber(1)}</span>
                </div>
              </div>
            </div>

            {/* 3. Green Callout Card ("আরও ভালো শহর গড়তে আপনার মতামত গুরুত্বপূর্ণ") */}
            <div className="bg-[#082C26] text-white rounded-3xl p-6 border border-emerald-600/30 shadow-lg relative overflow-hidden space-y-4">
              <div className="flex items-center gap-3 z-10 relative">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
                  🍃
                </div>
                <div>
                  <h3 className="font-black text-sm text-white leading-snug">
                    {t('To build a better city', 'আরও ভালো শহর গড়তে')}
                    <span className="block">{t('Your voice matters', 'আপনার মতামত গুরুত্বপূর্ণ')}</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed z-10 relative">
                {t('Noticed any civic problem? Report it and be a catalyst for change.', 'নতুন কোনো সমস্যা দেখছেন? রিপোর্ট করুন, এবং পরিবর্তনের অংশ হন।')}
              </p>

              <div className="pt-1 z-10 relative">
                <Link
                  href="/report"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent hover:bg-accent-400 text-slate-950 text-xs font-black shadow-md transition"
                >
                  <span>{t('Report an Issue', 'রিপোর্ট করুন')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Watermark Skyline Graphic */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                <svg viewBox="0 0 120 70" className="w-32 h-20 fill-white">
                  <polygon points="10,70 10,35 25,35 25,70" />
                  <polygon points="30,70 30,20 45,20 45,70" />
                  <polygon points="50,70 50,10 65,10 65,70" />
                  <polygon points="70,70 70,25 85,25 85,70" />
                  <polygon points="90,70 90,40 105,40 105,70" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
