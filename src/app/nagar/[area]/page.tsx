'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { DHAKA_AREAS } from '@/data/areas';
import { CivicMap } from '@/components/Map';
import { IssueCard } from '@/components/IssueCard';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowRight,
  BarChart,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function AreaPage() {
  const params = useParams();
  const { issues, getAreaSummary } = useIssues();
  const { t, language } = useLanguage();

  const areaSlug = (params?.area as string) || 'mirpur';
  const areaMeta = DHAKA_AREAS.find((a) => a.slug === areaSlug) || DHAKA_AREAS[0];
  const summary = getAreaSummary(areaSlug);

  // Issues in this area
  const areaIssues = issues.filter((i) => {
    const a = i.location.area.toLowerCase().replace(/[^a-z]/g, '');
    const norm = areaMeta.name.toLowerCase().replace(/[^a-z]/g, '');
    return a.includes(norm) || norm.includes(a);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Area Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {DHAKA_AREAS.map((a) => {
          const isActive = a.slug === areaMeta.slug;
          return (
            <Link
              key={a.slug}
              href={`/nagar/${a.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {language === 'bn' ? a.nameBn : a.name}
            </Link>
          );
        })}
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t('Civic Intelligence & Hotspot Overview', 'এলাকাভিত্তিক নাগরিক পর্যবেক্ষণ')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? areaMeta.nameBn : areaMeta.name}
            </h1>
            <p className="text-xs text-slate-500">
              {areaMeta.city} Metropolitan • {areaMeta.zone} • {areaMeta.wardList.length} Wards • Pop: {areaMeta.populationEstimate}
            </p>
          </div>

          <div className="bg-primary-50 border border-primary-200 p-4 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-primary block uppercase">
              {t('Resolution Rate', 'সমাধানের হার')}
            </span>
            <div className="text-3xl font-black text-primary">
              {summary.resolutionRate}%
            </div>
            <span className="text-[10px] text-slate-500">Based on verified closed issues</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {t('Total Reports', 'মোট রিপোর্ট')}
            </span>
            <span className="text-2xl font-black text-slate-900">{summary.total || areaIssues.length}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100">
            <span className="text-xs font-semibold text-amber-700 block mb-1">
              {t('In Progress', 'কাজ চলছে')}
            </span>
            <span className="text-2xl font-black text-amber-700">{summary.inProgressCount}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 block mb-1">
              {t('Resolved & Closed', 'সমাধান সম্পন্ন')}
            </span>
            <span className="text-2xl font-black text-emerald-700">{summary.resolvedCount}</span>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-100">
            <span className="text-xs font-semibold text-red-700 block mb-1">
              {t('Critical Hazards', 'জরুরি ঝুঁকি')}
            </span>
            <span className="text-2xl font-black text-red-700">{summary.criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Top Reported Problems Breakdown & Hotspots Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              <span>{t('Most Reported Problems in', 'সর্বাধিক রিপোর্টকৃত সমস্যাসমূহ')} {areaMeta.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t('Aggregated from citizen submissions over the past 30 days.', 'গত ৩০ দিনে নাগরিকদের দাখিলকৃত সমস্যার অনুপাত।')}
            </p>
          </div>

          <div className="space-y-4">
            {summary.topCategories.length > 0 ? (
              summary.topCategories.map((cat: any) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-slate-500">{cat.count} reports ({cat.percent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(12, cat.percent)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Road Damage</span>
                    <span className="text-slate-500">45%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[45%]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Illegal Waste Dumping</span>
                    <span className="text-slate-500">28%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[28%]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Drainage & Sewerage</span>
                    <span className="text-slate-500">18%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[18%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Focused Area Map */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{areaMeta.name} {t('Active Hotspots Map', 'হটস্পট ম্যাপ')}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {areaIssues.length} {t('pins located', 'টি পিন')}
            </span>
          </div>

          <div className="h-[280px] rounded-2xl overflow-hidden border border-slate-200">
            <CivicMap
              issues={areaIssues.length > 0 ? areaIssues : issues}
              center={[areaMeta.lat, areaMeta.lng]}
              zoom={13}
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* Recent Issues in this Area */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {t('Recent Reports in', 'সাম্প্রতিক সমস্যা:')} {areaMeta.name}
            </h3>
            <p className="text-xs text-slate-500">
              {t('View status, confirmed votes, and timeline.', 'অগ্রগতি ও সমাধান ট্র্যাক করুন।')}
            </p>
          </div>

          <Link
            href={`/explore?area=${areaMeta.slug}`}
            className="text-xs font-bold text-primary hover:text-primary-light flex items-center gap-1"
          >
            <span>{t('View on Full Map', 'পূর্ণাঙ্গ ম্যাপে দেখুন')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(areaIssues.length > 0 ? areaIssues : issues.slice(0, 3)).map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );
}
