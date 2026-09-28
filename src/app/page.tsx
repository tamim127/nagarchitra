'use client';

import React from 'react';
import Link from 'next/link';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { CivicMap } from '@/components/Map';
import { IssueCard } from '@/components/IssueCard';
import { DHAKA_AREAS } from '@/data/areas';
import {
  MapPin,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const { issues, getStats } = useIssues();
  const { t, language } = useLanguage();
  const stats = getStats();

  const recentIssues = issues.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-background to-background pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('Civic Intelligence for Bangladesh', 'বাংলাদেশের নাগরিক বুদ্ধিমত্তা ও পর্যবেক্ষণ প্ল্যাটফর্ম')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            {t('MAKE YOUR CITY', 'আপনার শহরকে')} <span className="text-primary underline decoration-accent decoration-wavy decoration-2">VISIBLE</span>.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {t(
              'Report public problems. Track what happens next. Hold authorities accountable with resident verification before an issue can close.',
              'এলাকার সমস্যা রিপোর্ট করুন। প্রতিটি পদক্ষেপের অগ্রগতি দেখুন। নাগরিক সন্তুষ্টির পরই কেবল সমস্যা সমাধান সম্পন্ন হবে।'
            )}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/report"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:bg-primary-light hover:shadow-xl transition-all"
            >
              <PlusCircle className="w-5 h-5 text-accent" />
              <span>{t('Report a Problem', 'সমস্যার রিপোর্ট করুন')}</span>
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-slate-800 text-base font-bold border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span>{t('Explore Live Map', 'লাইভ ম্যাপ দেখুন')}</span>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B3D3A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      </section>

      {/* Live City Snapshot (Dhaka Today) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t('Live Civic Snapshot', 'লাইভ ঢাকা পর্যবেক্ষণ')}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Today in Dhaka', 'আজকের ঢাকা পরিসংখ্যান')}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {t('Live synced from citizen logs', 'নাগরিক ডাটাবেজ থেকে রিয়েলটাইম তথ্য')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-civic-card">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {t('Total Reports', 'মোট রিপোর্ট')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.total}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Dhaka Metropolitan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-civic-card">
            <span className="text-xs font-semibold text-amber-600 block mb-1">
              {t('In Progress', 'কাজ চলমান')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              {stats.inProgress}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Work orders active</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-civic-card">
            <span className="text-xs font-semibold text-emerald-600 block mb-1">
              {t('Resolved', 'সমাধানকৃত')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {stats.resolved}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">With proof photos</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-civic-card">
            <span className="text-xs font-semibold text-red-600 block mb-1">
              {t('Critical Priority', 'জরুরি অগ্রাধিকার')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              {stats.critical}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Immediate safety risk</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-civic-card col-span-2 md:col-span-1">
            <span className="text-xs font-semibold text-primary block mb-1">
              {t('Citizen Confirmed', 'নাগরিক সার্টিফাইড')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              {stats.citizenConfirmed}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Voted YES by residents</span>
          </div>
        </div>
      </section>

      {/* Explore Your Area Chips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {t('Explore Your Neighborhood', 'আপনার এলাকা নির্বাচন করুন')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('See area-level resolution rates, top pain points, and active work orders.', 'নির্দিষ্ট এলাকার সমাধান হার ও চলমান কাজগুলো পর্যালোচনা করুন।')}
              </p>
            </div>
            <Link
              href="/explore"
              className="text-xs font-bold text-primary hover:text-primary-light flex items-center gap-1"
            >
              <span>{t('View All Areas on Map', 'ম্যাপে সব এলাকা')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {DHAKA_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/nagar/${area.slug}`}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-primary hover:border-primary hover:text-white transition duration-200 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-white transition-colors">
                  {language === 'bn' ? area.nameBn : area.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 group-hover:bg-primary-dark group-hover:text-slate-200 font-mono transition-colors">
                  {area.zone.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section (Hero Feature) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t('Civic Geospatial Map', 'লাইভ জিওস্পেশিয়াল ম্যাপ')}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Interactive Dhaka Issue Tracker', 'ঢাকার সমস্যা ও সমাধান পর্যবেক্ষণ')}
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-light bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100"
          >
            <span>{t('Open Fullscreen Map & Filters', 'ফুলস্ক্রিন ম্যাপ ও ফিল্টার')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Map Container */}
        <div className="h-[460px] w-full rounded-2xl overflow-hidden shadow-civic border border-slate-200">
          <CivicMap issues={issues} height="460px" />
        </div>
      </section>

      {/* Recent Issues Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Recent Public Reports', 'সাম্প্রতিক নাগরিক রিপোর্ট')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('Verified issues submitted by residents across Dhaka wards.', 'ঢাকার বিভিন্ন ওয়ার্ড থেকে জমা হওয়া যাচাইকৃত সমস্যা।')}
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-primary hover:text-primary-light flex items-center gap-1"
          >
            <span>{t('View All', 'সব দেখুন')} ({issues.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      {/* How It Works: The 10-Stage Lifecycle Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {t('Accountability By Design', 'স্বচ্ছতা ও জবাবদিহিতা')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('How NagarChitra Works', 'নগরচিত্র কীভাবে কাজ করে?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {t(
                'Unlike social media posts that vanish, NagarChitra turns complaints into a structured 10-stage civic pipeline with photo evidence at every milestone.',
                'সামাজিক যোগাযোগ মাধ্যমের হারিয়ে যাওয়া পোস্টের বদলে নগরচিত্র প্রতিটি রিপোর্টকে ডিজিটাল পাইপলাইনে ট্র্যাক করে এবং সমাধানের বাস্তব প্রমাণ দাবি করে।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-primary-light">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-accent text-slate-900 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="font-bold text-base text-white">
                {t('Report & Evidence', 'রিপোর্ট ও প্রমাণ')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  'Pin location, take photo, select severity. Automatic duplicate detection prevents clutter.',
                  'ম্যাপে পিন করুন, ছবি দিন। অটোমেটিক ডুপ্লিকেট চেকার একই রিপোর্টের পুনরাবৃত্তি রোধ করে।'
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-accent flex items-center justify-center font-black text-lg border border-white/20">
                2
              </div>
              <h4 className="font-bold text-base text-white">
                {t('Community Verification', 'কমিউনিটি যাচাই')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  'Locals tap "I See This Too". Multiple confirmations boost priority for city authorities.',
                  'প্রতিবেশীরা "আমিও দেখেছি" ভোট দেন। গণস্বীকৃতি রিপোর্টের গুরুত্ব বহুগুণ বাড়িয়ে দেয়।'
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-accent flex items-center justify-center font-black text-lg border border-white/20">
                3
              </div>
              <h4 className="font-bold text-base text-white">
                {t('Authority Action', 'কর্তৃপক্ষের পদক্ষেপে কাজ')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  'DNCC/WASA department assigned, crews start repair, and official resolution photo uploaded.',
                  'দায়িত্বপ্রাপ্ত বিভাগ কাজ শুরু করে এবং মেরামতের পর "আফটার ফটো" আপলোড করে সমাধান জানায়।'
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center font-black text-lg">
                4
              </div>
              <h4 className="font-bold text-base text-white">
                {t('Citizen Certification', 'নাগরিক সার্টিফাই')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t(
                  'Residents vote [Yes, Fixed] or [No, Still Exists]. If rejected, the issue automatically reopens!',
                  'নাগরিকরা কাজের সত্যতা নিশ্চিত করলেই ইস্যু ক্লোজড হবে। অসত্য হলে স্বয়ংক্রিয়ভাবে পুনরায় চালু হবে।'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
