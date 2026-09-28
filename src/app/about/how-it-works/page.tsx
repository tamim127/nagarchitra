'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, MapPin, Users } from 'lucide-react';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Architecture & Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('How NagarChitra Works', 'নগরচিত্রের কর্মপদ্ধতি ও ধাপসমূহ')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          NagarChitra replaces unorganized public complaints with an accountable 10-stage civic workflow where every transition is auditable and citizens verify real-world resolution.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            step: '01',
            title: 'Citizen Reporting & Proximity Duplicate Check',
            desc: 'A citizen spots an infrastructure defect (road damage, clogged sewer, broken street light), takes a photo, and drops a pin on the map. The system immediately checks a 600m radius for existing reports to eliminate duplicates.',
          },
          {
            step: '02',
            title: 'Community Verification ("I See This Too")',
            desc: 'Nearby neighbors and commuters confirm the report with one tap. Multiple community confirmations elevate priority on the authority dashboard without mob voting.',
          },
          {
            step: '03',
            title: 'Authority Triage & Department Assignment',
            desc: 'The report is assigned to the designated city division (e.g. DNCC Zone 4 Engineering). A work order number and designated field engineer are recorded in the immutable audit log.',
          },
          {
            step: '04',
            title: 'Work In Progress & Resolution Proof',
            desc: 'Engineering teams complete physical repairs on site and must upload a clear "AFTER" photo evidence with timestamp. The issue transitions to CITIZEN_VERIFICATION.',
          },
          {
            step: '05',
            title: 'Signature Citizen Verification (The Safeguard)',
            desc: 'Authority resolution does NOT close an issue. A 7-day citizen voting period opens. Local residents vote [YES, FIXED] or [NO, STILL EXISTS]. If residents report the defect still exists, the issue is automatically REOPENED.',
          },
          {
            step: '06',
            title: 'Open Data & Public Transparency',
            desc: 'All resolution times, SLA adherence, and problem hotspot metrics are exported into public open datasets for researchers and civic watchdogs.',
          },
        ].map((item) => (
          <div
            key={item.step}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary font-black text-lg flex items-center justify-center shrink-0">
              {item.step}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
