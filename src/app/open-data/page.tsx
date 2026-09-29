'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Copy,
  Check,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  MoreVertical,
  Clock,
  Layers,
  MapPin,
  FileText,
  AlertTriangle,
  Users,
  Building2,
  Radio,
  Newspaper,
  BookOpen,
  ArrowRight,
  Sparkles,
  Shield,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export default function OpenDataPage() {
  const { issues, getStats } = useIssues();
  const { t, language } = useLanguage();

  // API Explorer states
  const [selectedEndpoint, setSelectedEndpoint] = useState<'issues' | 'issue_id' | 'areas' | 'statistics' | 'auth'>('issues');
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Table states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const stats = getStats();

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'id',
      'title',
      'location',
      'category',
      'severity',
      'status',
      'reported_at',
      'confirmations',
    ];

    const rows = issues.map((i) => [
      i.trackingNumber,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.location.area}, Dhaka"`,
      i.categoryName,
      i.severity,
      i.status,
      i.createdAt,
      i.communityConfirmations,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nagarchitra_public_issues_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(issues, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `nagarchitra_public_issues_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Endpoints config
  const endpoints = [
    {
      id: 'issues',
      method: 'GET',
      path: '/api/v1/public/issues',
      description: 'Get all public issues with filters',
      curl: `curl -X GET \\\n  https://api.nagarchitra.gov.bd/api/v1/public/issues \\\n  -H "Accept: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN"`,
      response: `{\n  "data": [\n    {\n      "id": "NC-2026-0412",\n      "title": "Road Damage",\n      "area": "Mirpur",\n      "status": "in_progress"\n    }\n  ]\n}`,
    },
    {
      id: 'issue_id',
      method: 'GET',
      path: '/api/v1/public/issues/{id}',
      description: 'Get issue details by ID',
      curl: `curl -X GET \\\n  https://api.nagarchitra.gov.bd/api/v1/public/issues/NC-2026-0412 \\\n  -H "Accept: application/json"`,
      response: `{\n  "id": "NC-2026-0412",\n  "title": "Road damage on Mirpur Road",\n  "location": "Mirpur 10, Dhaka",\n  "severity": "HIGH",\n  "status": "IN_PROGRESS",\n  "confirmations": 42\n}`,
    },
    {
      id: 'areas',
      method: 'GET',
      path: '/api/v1/areas',
      description: 'Get area statistics',
      curl: `curl -X GET \\\n  https://api.nagarchitra.gov.bd/api/v1/areas \\\n  -H "Accept: application/json"`,
      response: `{\n  "areas": [\n    {\n      "id": "mirpur",\n      "name": "Mirpur",\n      "total_issues": 184,\n      "resolution_rate": "52%"\n    }\n  ]\n}`,
    },
    {
      id: 'statistics',
      method: 'GET',
      path: '/api/v1/statistics',
      description: 'Get overall statistics',
      curl: `curl -X GET \\\n  https://api.nagarchitra.gov.bd/api/v1/statistics \\\n  -H "Accept: application/json"`,
      response: `{\n  "total_records": 1248,\n  "resolved": 327,\n  "in_progress": 214,\n  "critical": 86\n}`,
    },
    {
      id: 'auth',
      method: 'POST',
      path: '/api/v1/auth/login',
      description: 'Login and get access token',
      curl: `curl -X POST \\\n  https://api.nagarchitra.gov.bd/api/v1/auth/login \\\n  -H "Content-Type: application/json" \\\n  -d '{"api_key": "YOUR_API_KEY"}'`,
      response: `{\n  "token": "eyJhbGciOiJIUzI1NiIsIn...",\n  "expires_in": 3600\n}`,
    },
  ];

  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpoint) || endpoints[0];

  // Table rows
  const tableData = [
    {
      id: 'NC-2026-0412',
      title: 'Road damage on Mirpur Road',
      location: 'Mirpur, Dhaka',
      category: 'Road Damage',
      severity: 'High',
      sevColor: 'bg-red-50 text-red-600 border-red-200',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      reported: '2 days ago',
      updated: '1 hour ago',
      img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=80&q=80',
      link: '/issues/road-damage-mirpur-10-8f92',
    },
    {
      id: 'NC-2026-0397',
      title: 'Waterlogging at Dhanmondi 27',
      location: 'Dhanmondi, Dhaka',
      category: 'Waterlogging',
      severity: 'Critical',
      sevColor: 'bg-red-100 text-red-700 border-red-300 font-bold',
      status: 'Assigned',
      statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
      reported: '3 days ago',
      updated: '2 hours ago',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=80&q=80',
      link: '/issues/waterlogging-farmgate-bijoy-1e82',
    },
    {
      id: 'NC-2026-0351',
      title: 'Waste dumping near Hatirjheel',
      location: 'Tejgaon, Dhaka',
      category: 'Waste',
      severity: 'Medium',
      sevColor: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'Resolved',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
      reported: '4 days ago',
      updated: '1 day ago',
      img: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=80&q=80',
      link: '/issues/waste-dumping-dhanmondi-27-3b44',
    },
    {
      id: 'NC-2026-0365',
      title: 'Open manhole at Uttara Sector 3',
      location: 'Uttara, Dhaka',
      category: 'Safety',
      severity: 'High',
      sevColor: 'bg-red-50 text-red-600 border-red-200',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      reported: '5 days ago',
      updated: '3 hours ago',
      img: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=80&q=80',
      link: '/issues/open-manhole-mohammadpur-9a11',
    },
    {
      id: 'NC-2026-0332',
      title: 'Street light not working',
      location: 'Gulshan, Dhaka',
      category: 'Street Light',
      severity: 'Medium',
      sevColor: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'Under Review',
      statusColor: 'bg-sky-50 text-sky-700 border-sky-200 font-bold',
      reported: '6 days ago',
      updated: '5 hours ago',
      img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=80&q=80',
      link: '/issues/street-light-gulshan-1-6d20',
    },
  ];

  const filteredData = tableData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F8F9FA] text-slate-900 min-h-screen font-bangla">
      {/* 1. HERO SECTION (DEEP TEAL GRADIENT WITH BANGLADESH MAP & LATEST DATA SNAPSHOT) */}
      <section className="bg-gradient-to-b from-[#082621] via-[#061F1B] to-[#041512] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Hero Text (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#113831] border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase font-sans">
                <Database className="w-3.5 h-3.5 text-accent" />
                <span>CIVIC DATA PORTAL</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-bangla tracking-tight leading-tight">
                {t('Open Civic Data Portal', 'মুক্ত নাগরিক তথ্য ভাণ্ডার')}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300 font-bangla leading-relaxed max-w-xl">
                {t(
                  "Download civic issues, resolutions, geospatial data, and statistics for Dhaka city from NagarChitra's open repository.",
                  'নগরচিত্রের উন্মুক্ত তথ্যভাণ্ডার থেকে ডাউনলোড করুন ঢাকা শহরের নাগরিক সমস্যা, সমাধান, ভৌগোলিক তথ্য এবং ত্রিবিধ পরিসংখ্যান।'
                )}
              </p>

              {/* Download Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-accent/20 transition hover:scale-102 active:scale-98 font-bangla"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{t('Download CSV', 'CSV ডাউনলোড')}</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-xs transition hover:scale-102 active:scale-98 font-bangla"
                >
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('Download JSON', 'JSON ডাউনলোড')}</span>
                </button>
              </div>

              {/* Sub-banner pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-200 font-bangla">
                <span>🍃</span>
                <span>{t('Open for everyone - for research, journalism and public innovation', 'সবার জন্য উন্মুক্ত - গবেষণা, সাংবাদিকতা ও উদ্ভাবনের জন্য')}</span>
              </div>
            </div>

            {/* Center Bangladesh Map Visualization (3 cols) */}
            <div className="lg:col-span-3 relative flex items-center justify-center">
              <div className="relative w-full max-w-[280px] aspect-[3/4] flex items-center justify-center">
                {/* Glowing map silhouette vector */}
                <svg viewBox="0 0 300 380" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  {/* Accurate Bangladesh Boundary Shape */}
                  <path
                    d="M 115,25 Q 155,10 185,25 Q 210,40 195,70 Q 215,95 240,120 Q 260,160 230,200 Q 250,230 235,270 Q 220,310 180,335 Q 150,315 120,345 Q 85,325 65,285 Q 45,235 55,185 Q 35,145 55,105 Q 65,65 95,45 Z"
                    fill="#082C25"
                    stroke="#10B981"
                    strokeWidth="1.5"
                  />
                  {/* Subtle Grid Lines across territory */}
                  <line x1="75" y1="105" x2="215" y2="105" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <line x1="55" y1="185" x2="235" y2="185" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                  <line x1="75" y1="265" x2="215" y2="265" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" />

                  {/* Network Nodes & Dhaka Golden Hub */}
                  <circle cx="145" cy="180" r="10" fill="#F59E0B" opacity="0.3" className="animate-ping" />
                  <circle cx="145" cy="180" r="5" fill="#F59E0B" />
                  <text x="156" y="184" fill="#FBBF24" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    Dhaka
                  </text>

                  {/* Regional Nodes */}
                  <circle cx="125" cy="95" r="3.5" fill="#34D399" />
                  <line x1="145" y1="180" x2="125" y2="95" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />

                  <circle cx="205" cy="225" r="3.5" fill="#34D399" />
                  <line x1="145" y1="180" x2="205" y2="225" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />

                  <circle cx="90" cy="235" r="3.5" fill="#34D399" />
                  <line x1="145" y1="180" x2="90" y2="235" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />

                  <circle cx="210" cy="130" r="3" fill="#34D399" />
                  <line x1="145" y1="180" x2="210" y2="130" stroke="#10B981" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                </svg>

                {/* Overlaid stats badge on top-right of map */}
                <div className="absolute top-2 right-0 bg-[#07241F]/90 border border-emerald-500/40 backdrop-blur-md rounded-xl p-2 shadow-lg text-[10px] space-y-0.5 font-sans">
                  <div className="font-bold text-white">Bangladesh</div>
                  <div className="text-slate-300"><strong className="text-emerald-400">8</strong> Divisions</div>
                  <div className="text-slate-300"><strong className="text-emerald-400">64</strong> Districts</div>
                  <div className="text-slate-300"><strong className="text-emerald-400">4,500+</strong> Wards</div>
                </div>
              </div>
            </div>

            {/* Right: Latest Data Snapshot Card (4 cols) */}
            <div className="lg:col-span-4 bg-[#072520]/95 border border-emerald-500/30 rounded-3xl p-5 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5">
                <span className="text-xs font-bold text-white tracking-wide font-sans">Latest Data Snapshot</span>
                <span className="text-[10px] text-slate-400 font-sans">Apr 22, 2026 - 10:24 AM</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Donut Multi-Color Ring */}
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#38BDF8" strokeWidth="11" strokeDasharray="238.7" strokeDashoffset="0" fill="transparent" />
                    <circle cx="50" cy="50" r="38" stroke="#10B981" strokeWidth="11" strokeDasharray="238.7" strokeDashoffset="70" fill="transparent" />
                    <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="11" strokeDasharray="238.7" strokeDashoffset="125" fill="transparent" />
                    <circle cx="50" cy="50" r="38" stroke="#8B5CF6" strokeWidth="11" strokeDasharray="238.7" strokeDashoffset="170" fill="transparent" />
                    <circle cx="50" cy="50" r="38" stroke="#06B6D4" strokeWidth="11" strokeDasharray="238.7" strokeDashoffset="200" fill="transparent" />
                    <circle cx="50" cy="50" r="38" stroke="#64748B" strokeWidth="11" strokeDasharray="238.7" strokeDashoffset="220" fill="transparent" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-white font-sans leading-none">1,248</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-sans mt-0.5">Total Records</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 space-y-1 text-xs font-sans">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>Road Damage</span>
                    </span>
                    <span className="font-bold text-white text-[11px]">342</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Drainage</span>
                    </span>
                    <span className="font-bold text-white text-[11px]">218</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Waste</span>
                    </span>
                    <span className="font-bold text-white text-[11px]">176</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Street Light</span>
                    </span>
                    <span className="font-bold text-white text-[11px]">124</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span>Safety</span>
                    </span>
                    <span className="font-bold text-white text-[11px]">96</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      <span>Other</span>
                    </span>
                    <span className="font-bold text-white text-[11px]">92</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR ("Data at a glance") */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-6 font-sans">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Header Text */}
            <div className="space-y-0.5 col-span-2 md:col-span-1 pr-4">
              <h3 className="font-black text-slate-900 text-sm">Data at a glance</h3>
              <p className="text-xs text-slate-500">Live civic data from across Bangladesh</p>
            </div>

            {/* Stat 1 */}
            <div className="flex items-start gap-3 pl-4 pt-4 md:pt-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-slate-900 font-sans">1,248</div>
                <div className="text-[11px] text-slate-500 font-medium">Total Records</div>
                <div className="text-[10px] font-bold text-emerald-600">↑ 12% vs last 7 days</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-start gap-3 pl-4 pt-4 md:pt-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-slate-900 font-sans">42</div>
                <div className="text-[11px] text-slate-500 font-medium">Wards Covered</div>
                <div className="text-[10px] font-bold text-emerald-600">↑ 8% in selected areas</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-start gap-3 pl-4 pt-4 md:pt-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-slate-900 font-sans">318</div>
                <div className="text-[11px] text-slate-500 font-medium">Audit Events</div>
                <div className="text-[10px] font-bold text-emerald-600">↑ 25% last 30 days</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-start gap-3 pl-4 pt-4 md:pt-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base font-black text-slate-900 font-sans">Apr 22, 2026</div>
                <div className="text-[11px] text-slate-500 font-medium">Last Updated</div>
                <div className="text-[10px] font-bold text-emerald-600">10:24 AM Live</div>
              </div>
            </div>

            {/* Stat 5 */}
            <div className="flex items-start gap-3 pl-4 pt-4 md:pt-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-slate-900 font-sans">8 Divisions</div>
                <div className="text-[11px] text-slate-500 font-medium">Coverage</div>
                <div className="text-[10px] text-slate-400">64 Districts, 4,500+ Wards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED DATASETS (5 CARDS IN A ROW) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">Featured Datasets</h2>
            <p className="text-xs text-slate-500 font-sans">Explore key datasets from NagarChitra's civic data platform</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="text-xs font-bold text-primary hover:text-emerald-700 flex items-center gap-1 transition font-sans"
          >
            <span>View all datasets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5">
          {/* Card 1: Public Issues */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-36 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80"
                alt="Public Issues"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900 leading-snug font-sans">Public Issues</h3>
                <p className="text-xs text-slate-500 font-bangla">নাগরিক সমস্যা প্রতিবেদন</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 font-sans">
                  <div><strong>1,248</strong> records</div>
                  <div className="text-slate-400">Updated 2 hours ago</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1 font-sans">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-bold">GEOJSON</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">CSV</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">NDJSON</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 font-sans">
                  <Link
                    href="/explore"
                    className="flex-1 py-2 rounded-xl bg-[#092C26] hover:bg-[#11433B] text-white text-xs font-bold text-center transition"
                  >
                    View Dataset →
                  </Link>
                  <button
                    onClick={handleExportCSV}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Download CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Resolution Statistics */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-36 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80"
                alt="Resolution Statistics"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900 leading-snug font-sans">Resolution Statistics</h3>
                <p className="text-xs text-slate-500 font-bangla">সমাধান পরিসংখ্যান</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 font-sans">
                  <div><strong>892</strong> records</div>
                  <div className="text-slate-400">Updated 5 hours ago</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1 font-sans">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">CSV</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">JSON</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 font-sans">
                  <Link
                    href="/statistics"
                    className="flex-1 py-2 rounded-xl bg-[#092C26] hover:bg-[#11433B] text-white text-xs font-bold text-center transition"
                  >
                    View Dataset →
                  </Link>
                  <button
                    onClick={handleExportCSV}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Download CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Area Intelligence */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-36 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=80"
                alt="Area Intelligence"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900 leading-snug font-sans">Area Intelligence</h3>
                <p className="text-xs text-slate-500 font-bangla">এলাকা ভিত্তিক বিশ্লেষণ</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 font-sans">
                  <div><strong>54</strong> records</div>
                  <div className="text-slate-400">Updated 6 hours ago</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1 font-sans">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">CSV</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">JSON</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 font-sans">
                  <Link
                    href="/nagar/mirpur"
                    className="flex-1 py-2 rounded-xl bg-[#092C26] hover:bg-[#11433B] text-white text-xs font-bold text-center transition"
                  >
                    View Dataset →
                  </Link>
                  <button
                    onClick={handleExportCSV}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Download CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: SLA Performance */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-36 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"
                alt="SLA Performance"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900 leading-snug font-sans">SLA Performance</h3>
                <p className="text-xs text-slate-500 font-bangla">এসএলএ পরিসংখ্যান</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 font-sans">
                  <div><strong>327</strong> records</div>
                  <div className="text-slate-400">Updated 6 hours ago</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1 font-sans">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">CSV</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">JSON</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 font-sans">
                  <Link
                    href="/statistics"
                    className="flex-1 py-2 rounded-xl bg-[#092C26] hover:bg-[#11433B] text-white text-xs font-bold text-center transition"
                  >
                    View Dataset →
                  </Link>
                  <button
                    onClick={handleExportCSV}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Download CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Citizen Confirmations */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="h-36 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
                alt="Citizen Confirmations"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900 leading-snug font-sans">Citizen Confirmations</h3>
                <p className="text-xs text-slate-500 font-bangla">নাগরিক যাচাই তথ্য</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 font-sans">
                  <div><strong>456</strong> records</div>
                  <div className="text-slate-400">Updated 10 hours ago</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1 font-sans">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">CSV</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">JSON</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 font-sans">
                  <Link
                    href="/explore"
                    className="flex-1 py-2 rounded-xl bg-[#092C26] hover:bg-[#11433B] text-white text-xs font-bold text-center transition"
                  >
                    View Dataset →
                  </Link>
                  <button
                    onClick={handleExportCSV}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Download CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. API EXPLORER SECTION (INTERACTIVE REST API SANDBOX) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#0B2F2A] rounded-3xl border border-emerald-600/30 p-6 sm:p-8 text-white shadow-xl space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-accent flex items-center justify-center font-black">
              <Code2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans">API Explorer</h2>
              <p className="text-xs text-slate-300 font-sans">Integrate with our data using RESTful APIs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Nav Tabs (2 cols) */}
            <div className="lg:col-span-2 space-y-2 font-sans">
              {[
                { id: 'all', label: 'All Endpoints', icon: <Layers className="w-4 h-4" /> },
                { id: 'issues', label: 'Issues', icon: <FileText className="w-4 h-4" /> },
                { id: 'areas', label: 'Areas', icon: <MapPin className="w-4 h-4" /> },
                { id: 'statistics', label: 'Statistics', icon: <Table className="w-4 h-4" /> },
                { id: 'auth', label: 'Authentication', icon: <Shield className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id !== 'all') setSelectedEndpoint(tab.id as any);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    selectedEndpoint === tab.id || (tab.id === 'all' && selectedEndpoint === 'issues')
                      ? 'bg-[#134D44] text-[#7DF3D8] border border-emerald-400/40 shadow-xs'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Middle Endpoints List (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5 font-sans">
              {endpoints.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    selectedEndpoint === ep.id
                      ? 'bg-white text-slate-900 border-white shadow-md'
                      : 'bg-white/95 text-slate-900 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          ep.method === 'GET'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-slate-900">{ep.path}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(ep.path, ep.id);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-sans transition"
                      title="Copy Path"
                    >
                      {copiedKey === ep.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">{ep.description}</p>
                </div>
              ))}
            </div>

            {/* Right Terminal Sandbox (5 cols) */}
            <div className="lg:col-span-5 space-y-3 font-sans">
              {/* Terminal Container */}
              <div className="bg-[#051714] rounded-2xl border border-emerald-900/60 p-4 space-y-3 font-mono text-xs shadow-lg">
                <div className="flex items-center justify-between border-b border-emerald-900/80 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('request')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition ${
                        activeTab === 'request' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Request
                    </button>
                    <button
                      onClick={() => setActiveTab('response')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition ${
                        activeTab === 'response' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Response
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(currentEndpoint.curl, 'curl_box')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-accent font-sans transition"
                  >
                    {copiedKey === 'curl_box' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>

                <pre className="text-emerald-400 overflow-x-auto text-[11px] leading-relaxed p-1 bg-black/20 rounded-xl">
                  <code>{currentEndpoint.curl}</code>
                </pre>
              </div>

              {/* Sample Response Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 text-slate-900 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700 font-sans">Sample Response</span>
                  <button
                    onClick={() => handleCopy(currentEndpoint.response, 'resp_box')}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 font-sans transition"
                  >
                    {copiedKey === 'resp_box' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="text-slate-800 overflow-x-auto text-[11px] leading-relaxed p-1">
                  <code>{currentEndpoint.response}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PUBLIC ISSUES DATASET (INTERACTIVE DATA TABLE) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">Public Issues Dataset</h2>
            <p className="text-xs text-slate-500 font-sans">Browse and explore all civic issues with advanced filters and search</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-sans">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by location, category, or issue ID..."
                className="pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs w-64 sm:w-72 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
            </button>

            {/* Columns Button */}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Columns</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08221E] hover:bg-[#0E3530] text-white text-xs font-bold transition shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dataset Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reported</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {row.id}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap flex items-center gap-2.5">
                      <img src={row.img} alt={row.title} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200" />
                      <span>{row.title}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{row.location}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium whitespace-nowrap">{row.category}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${row.sevColor}`}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">{row.reported}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">{row.updated}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={row.link}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                        >
                          View
                        </Link>
                        <button className="p-1 rounded text-slate-400 hover:text-slate-700">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500 gap-3 font-sans">
            <span>Showing 1-5 of 1,248 records</span>

            <div className="flex items-center gap-1 font-sans">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition ${
                    currentPage === p ? 'bg-[#08221E] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold">
                250
              </button>
              <button className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM DUAL CARDS (Data Methodology & Use the Data) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card: Data Methodology & Provenance */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Data Methodology & Provenance</h3>
                  <p className="text-xs text-slate-500">Transparent data. Trusted source. Real impact.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Database className="w-3.5 h-3.5 text-primary" />
                    <span>Data Source</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Citizen reports, authority updates, verified by community & admin
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verification Process</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Community verification + authority validation + audit trail
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Update Cadence</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Real-time for new reports, Daily for statistics
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>License</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    CC BY 4.0<br />Free for public use
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/about/how-it-works"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#092C26] hover:bg-[#11433B] text-white text-xs font-bold transition shadow-xs"
              >
                <span>Read Full Methodology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Card: Use the Data */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-accent-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Use the Data</h3>
                  <p className="text-xs text-slate-500">Turn civic data into real-world impact</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Researchers</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Analyze trends, publish findings
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Newspaper className="w-3.5 h-3.5 text-blue-600" />
                    <span>Journalists</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Investigate, report, create awareness
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Code2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Developers</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Build tools, apps, innovations
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Communities</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Improve local neighborhoods
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Pack</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
