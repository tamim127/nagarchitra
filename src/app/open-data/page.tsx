'use client';

import React, { useState } from 'react';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Database,
  Download,
  FileCode,
  Table,
  CheckCircle2,
  ExternalLink,
  Code2,
  Share2,
} from 'lucide-react';

export default function OpenDataPage() {
  const { issues, getStats } = useIssues();
  const { t } = useLanguage();
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'json'>('csv');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const stats = getStats();

  const handleExportCSV = () => {
    const headers = [
      'tracking_number',
      'title',
      'category',
      'severity',
      'status',
      'area',
      'ward',
      'latitude',
      'longitude',
      'confirmations',
      'created_at',
    ];

    const rows = issues.map((i) => [
      i.trackingNumber,
      `"${i.title.replace(/"/g, '""')}"`,
      i.categoryName,
      i.severity,
      i.status,
      i.location.area,
      i.location.ward,
      i.location.latitude,
      i.location.longitude,
      i.communityConfirmations,
      i.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nagarchitra_civic_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const sanitized = issues.map((i) => ({
      trackingNumber: i.trackingNumber,
      title: i.title,
      category: i.categoryName,
      severity: i.severity,
      status: i.status,
      area: i.location.area,
      ward: i.location.ward,
      coordinates: {
        lat: i.location.latitude,
        lng: i.location.longitude,
      },
      confirmations: i.communityConfirmations,
      verifications: {
        fixedCount: i.citizenVerifications?.fixedCount || 0,
        stillExistsCount: i.citizenVerifications?.stillExistsCount || 0,
      },
      createdAt: i.createdAt,
      resolvedAt: i.resolvedAt,
    }));

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sanitized, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `nagarchitra_civic_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (endpoint: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${endpoint}`);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-4">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold border border-white/20">
            <Database className="w-3.5 h-3.5" />
            <span>Open Civic Intelligence Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('Open Civic Data Portal', 'মুক্ত নাগরিক তথ্য ভাণ্ডার')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {t(
              'Public infrastructure data belongs to everyone. NagarChitra provides machine-readable datasets for researchers, journalists, urban planners, and civic developers.',
              'নগরীর রাস্তা, ড্রেনেজ ও বর্জ্য সংক্রান্ত তথ্য উন্মুক্ত রাখা হয়েছে যাতে গবেষক, সাংবাদিক ও নাগরিক সমাজ নির্দ্বিধায় ডেটা বিশ্লেষণ করতে পারেন।'
            )}
          </p>
        </div>

        {/* Quick Download Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-slate-900 font-bold text-xs hover:bg-accent-hover transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{t('Download CSV Dataset', 'CSV ডাউনলোড')}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
          >
            <FileCode className="w-4 h-4 text-accent" />
            <span>{t('Download JSON Format', 'JSON ডাউনলোড')}</span>
          </button>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Database className="w-96 h-96" />
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">Records Available</span>
          <div className="text-2xl font-black text-slate-900">{issues.length}</div>
          <span className="text-[11px] text-slate-400">Total geo-tagged records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">Wards Represented</span>
          <div className="text-2xl font-black text-slate-900">12 Wards</div>
          <span className="text-[11px] text-slate-400">DNCC & DSCC zones</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">Audit Events</span>
          <div className="text-2xl font-black text-slate-900">
            {issues.reduce((acc, i) => acc + i.timeline.length, 0)}
          </div>
          <span className="text-[11px] text-slate-400">Recorded status logs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">License</span>
          <div className="text-lg font-black text-primary">ODbL / CC BY 4.0</div>
          <span className="text-[11px] text-slate-400">Free for public reuse</span>
        </div>
      </div>

      {/* Public API Endpoints Reference */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <h3 className="font-extrabold text-base text-slate-900">
            {t('REST API Endpoints for Civic Developers', 'সিভিক ডেভেলপার ও গবেষক এপিআই')}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Query live Dhaka civic data directly in your applications or analysis notebooks.
        </p>

        <div className="space-y-3 font-mono text-xs">
          {[
            {
              method: 'GET',
              path: '/api/public/issues',
              desc: 'Returns geo-coded public complaints with category, severity, and status',
            },
            {
              method: 'GET',
              path: '/api/public/statistics',
              desc: 'Aggregated resolution rates, SLA adherence, and Dhaka citywide counts',
            },
            {
              method: 'GET',
              path: '/api/public/areas/mirpur',
              desc: 'Neighborhood-level breakdown and ward statistics for Mirpur',
            },
          ].map((api) => (
            <div
              key={api.path}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {api.method}
                </span>
                <span className="font-bold text-slate-800">{api.path}</span>
                <span className="text-slate-400 text-[11px] hidden md:inline">— {api.desc}</span>
              </div>
              <button
                onClick={() => copyToClipboard(api.path)}
                className="text-xs text-primary font-bold hover:underline shrink-0 text-left sm:text-right"
              >
                {copiedEndpoint === api.path ? '✓ Copied URL' : 'Copy Endpoint'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 pb-0 flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-900">
            {t('Sample Records Preview', 'উন্মুক্ত নাগরিক তথ্য সারণি')}
          </h3>
          <span className="text-xs text-slate-500 font-mono">Showing {issues.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-4 py-3.5">Problem</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Area</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Confirmed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {issues.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-3.5 font-bold text-slate-700">#{i.trackingNumber}</td>
                  <td className="px-4 py-3.5 font-sans font-medium text-slate-900 max-w-xs truncate">
                    {i.title}
                  </td>
                  <td className="px-4 py-3.5 font-sans text-slate-600">{i.categoryName}</td>
                  <td className="px-4 py-3.5 font-sans text-slate-700">{i.location.area}</td>
                  <td className="px-4 py-3.5 font-sans font-bold">{i.severity}</td>
                  <td className="px-4 py-3.5 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {i.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">{i.communityConfirmations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
