'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIssues } from '@/context/IssueContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSocket } from '@/context/SocketContext';
import { UserRole, Issue, IssueStatus, IssueSeverity } from '@/types';
import {
  User,
  Building2,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Flame,
  PlusCircle,
  Eye,
  Filter,
  Search,
  Upload,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileCheck,
  ThumbsUp,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Wrench,
  BarChart3,
  Calendar,
  Check,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { getStatusBadgeStyle, getSeverityBadge } from '@/components/IssueCard';

function UnifiedRoleDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { issues, updateIssueStatus, confirmIssue, voteResolution } = useIssues();
  const { role, currentUser, isAuthenticated } = useAuthRole();
  const { t, language, formatNumber } = useLanguage();
  const { isConnected, onlineCount } = useSocket();

  // Active dashboard view defaults to citizen, or authority/admin if user holds authorization
  const roleParam = searchParams.get('role');
  const activeRole: UserRole =
    roleParam === 'authority' && (role === 'AUTHORITY' || role === 'ADMIN' || role === 'SUPER_ADMIN')
      ? 'AUTHORITY'
      : roleParam === 'admin' && (role === 'ADMIN' || role === 'SUPER_ADMIN')
      ? 'ADMIN'
      : 'CITIZEN';

  // CITIZEN DASHBOARD STATE
  const [citizenTab, setCitizenTab] = useState<'my_reports' | 'followed' | 'verifications'>('my_reports');

  // AUTHORITY DASHBOARD STATE
  const [authDeptFilter, setAuthDeptFilter] = useState('ALL');
  const [authStatusFilter, setAuthStatusFilter] = useState('ALL');
  const [authSearchQuery, setAuthSearchQuery] = useState('');
  const [selectedIssueForAction, setSelectedIssueForAction] = useState<Issue | null>(null);
  const [actionStatus, setActionStatus] = useState<IssueStatus>('IN_PROGRESS');
  const [actionNote, setActionNote] = useState('');
  const [assignedDept, setAssignedDept] = useState('Civil Engineering & Road Repair');
  const [assignedOfficer, setAssignedOfficer] = useState('Engr. Zahid Hasan');
  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
  );

  // ADMIN DASHBOARD STATE
  const [adminTab, setAdminTab] = useState<'moderation' | 'departments' | 'audit' | 'users'>('moderation');
  const [moderationSearch, setModerationSearch] = useState('');

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForAction) return;

    updateIssueStatus(
      selectedIssueForAction.id,
      actionStatus,
      actionNote.trim() || `Status updated to ${actionStatus} by ${currentUser.name}`,
      actionStatus === 'RESOLVED' ? proofUrl : undefined,
      assignedDept,
      assignedOfficer
    );

    setSelectedIssueForAction(null);
    setActionNote('');
  };

  // Filtered issues for Authority
  const criticalIssues = issues.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED');
  const authorityFilteredIssues = issues.filter((issue) => {
    if (authStatusFilter !== 'ALL' && issue.status !== authStatusFilter) return false;
    if (authDeptFilter !== 'ALL' && issue.categoryName !== authDeptFilter) return false;
    if (authSearchQuery.trim()) {
      const q = authSearchQuery.toLowerCase();
      const match =
        issue.title.toLowerCase().includes(q) ||
        issue.trackingNumber.toLowerCase().includes(q) ||
        issue.location.area.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered issues for Citizen
  const myReports = issues.filter((i) => i.reportedBy.id === currentUser.id || i.reportedBy.name === currentUser.name);
  // fallback if user has no direct reports in mock, show initial reports
  const displayedMyReports = myReports.length > 0 ? myReports : issues.slice(0, 3);
  const followedIssues = issues.filter((i) => i.followedByUser || i.userConfirmed);
  const pendingVerifications = issues.filter((i) => i.status === 'CITIZEN_VERIFICATION' || i.status === 'RESOLVED');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================================= */}
        {/* TOP BAR: Role Selector & Real-time Status */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition relative overflow-hidden">
          {/* Subtle background decorative warmth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {t('Role-Based Intelligence Portal', 'রোল-ভিত্তিক ড্যাশবোর্ড পোর্টাল')}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-semibold text-[11px]">
                    {isConnected
                      ? language === 'bn'
                        ? `সকেট লাইভ (${onlineCount} সক্রিয়)`
                        : `Socket Live (${onlineCount} Online)`
                      : 'Connecting...'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-bangla tracking-tight text-slate-900">
                {activeRole === 'CITIZEN' && (language === 'bn' ? 'নাগরিক কন্ট্রোল সেন্টার' : 'Citizen Civic Hub')}
                {activeRole === 'AUTHORITY' && (language === 'bn' ? 'কর্তৃপক্ষ ওয়ার্কস্পেস ও টাস্ক কিউ' : 'Authority Operations Center')}
                {activeRole === 'ADMIN' && (language === 'bn' ? 'প্ল্যাটফর্ম মডারেশন ও সিস্টেম কন্ট্রোল' : 'Admin & Moderation Console')}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl font-bangla leading-relaxed">
                {activeRole === 'CITIZEN' &&
                  t(
                    'Track your submitted complaints, verify neighborhood resolutions, earn civic karma badges, and view SLA progress in real time.',
                    'আপনার দাখিলকৃত অভিযোগ ট্র্যাকিং, আশেপাশের কাজের সমাধান যাচাইকরণ, নাগরিক কার্মা ও এসএলএ পর্যবেক্ষণ করুন।'
                  )}
                {activeRole === 'AUTHORITY' &&
                  t(
                    'Official municipal desk for DNCC, WASA, and DESCO. Review public reports, mobilize field crews, and upload verifiable proof of resolution.',
                    'ডিএনসিসি, ওয়াসা ও ডেসকো-এর বিভাগীয় ডেস্ক। নাগরিক রিপোর্ট যাচাই, ফিল্ড টিম নিয়োজিতকরণ এবং সমাধানের প্রমাণ আপলোড করুন।'
                  )}
                {activeRole === 'ADMIN' &&
                  t(
                    'High-level civic triage, duplicate complaint consolidation, department SLA compliance rankings, and master real-time audit logs.',
                    'উচ্চপর্যায়ের অভিযোগ মডারেশন, ডুপ্লিকেট মার্জিং, সিটি কর্পোরেশন ও ওয়াসার এসএলএ পারফরম্যান্স ও লাইভ অডিট ট্রেইল।'
                  )}
              </p>
            </div>

            {/* Authenticated Clearance and Portal Gateway */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              {role === 'SUPER_ADMIN' && (
                <Link
                  href="/super-admin"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] transition"
                >
                  <span className="text-sm">👑</span>
                  <span>{language === 'bn' ? 'সুপার অ্যাডমিন কনসোল' : 'Super Admin Console'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              )}

              {role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-purple-600/20 hover:scale-[1.02] transition"
                >
                  <Shield className="w-4 h-4 text-purple-200" />
                  <span>{language === 'bn' ? 'অ্যাডমিন মডারেশন পোর্টাল' : 'Admin Moderation Portal'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              )}

              {role === 'AUTHORITY' && (
                <Link
                  href="/authority"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition"
                >
                  <Building2 className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'bn' ? 'কর্তৃপক্ষ ওয়ার্কস্পেস' : 'Authority Operations Desk'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              )}

              {/* Current Authenticated Profile Badge */}
              <div className="flex items-center gap-3 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
                />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-sm font-black text-slate-900">{currentUser.name}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {role === 'SUPER_ADMIN' ? '👑 SUPER ADMIN' : role === 'ADMIN' ? '🛡️ ADMIN' : role === 'AUTHORITY' ? '🏢 AUTHORITY' : '🇧🇩 CITIZEN'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bangla hidden sm:inline">
                      {currentUser.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROLE VIEW 1: CITIZEN CIVIC DASHBOARD */}
        {/* ========================================================================= */}
        {activeRole === 'CITIZEN' && (
          <div className="space-y-8 animate-fade-in">
            {/* Citizen Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-300 hover:shadow-md transition shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-600 font-bold">
                    {t('My Submissions', 'আমার দাখিলকৃত রিপোর্ট')}
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <FileCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2 font-bangla">
                  {formatNumber(displayedMyReports.length)}
                </div>
                <span className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-bangla font-semibold">
                  <TrendingUp className="w-3 h-3" /> {t('Active in Mirpur & Dhaka', 'মিরপুর ও ঢাকা এলাকায় সক্রিয়')}
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-600 font-bold">
                    {t('Issues Upvoted', 'নাগরিক সমর্থন ও ভোট')}
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2 font-bangla">
                  {formatNumber(followedIssues.length || 8)}
                </div>
                <span className="text-[11px] text-blue-700 mt-1 block font-bangla font-semibold">
                  {t('Community validation', 'কমিউনিটি যৌথ যাচাইকরণ')}
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-300 hover:shadow-md transition shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-600 font-bold">
                    {t('Civic Karma Score', 'নাগরিক কার্মা স্কোর')}
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2 font-bangla">
                  {formatNumber(420)} <span className="text-sm font-semibold text-slate-500">XP</span>
                </div>
                <span className="text-[11px] text-amber-700 mt-1 block font-bangla font-semibold">
                  {t('Level 3 Civic Guardian', 'লেভেল ৩ সিটিজেন গার্ডিয়ান')}
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl relative overflow-hidden group hover:border-purple-300 hover:shadow-md transition shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-600 font-bold">
                    {t('Pending Verifications', 'যাচাইয়ের অপেক্ষায়')}
                  </span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2 font-bangla">
                  {formatNumber(pendingVerifications.length)}
                </div>
                <span className="text-[11px] text-purple-700 mt-1 block font-bangla font-semibold">
                  {t('Needs resident vote', 'নাগরিক ভোটের অপেক্ষায়')}
                </span>
              </div>
            </div>

            {/* Sub-tabs & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/60 flex flex-wrap items-center gap-1">
                <button
                  onClick={() => setCitizenTab('my_reports')}
                  className={`px-4 py-2 rounded-xl text-xs font-bangla transition ${
                    citizenTab === 'my_reports'
                      ? 'bg-white text-slate-900 font-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60'
                  }`}
                >
                  {t('My Complaints', 'আমার অভিযোগসমূহ')} ({displayedMyReports.length})
                </button>

                <button
                  onClick={() => setCitizenTab('followed')}
                  className={`px-4 py-2 rounded-xl text-xs font-bangla transition ${
                    citizenTab === 'followed'
                      ? 'bg-white text-slate-900 font-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60'
                  }`}
                >
                  {t('Followed & Supported', 'সমর্থিত সমস্যাসমূহ')} ({followedIssues.length})
                </button>

                <button
                  onClick={() => setCitizenTab('verifications')}
                  className={`px-4 py-2 rounded-xl text-xs font-bangla transition ${
                    citizenTab === 'verifications'
                      ? 'bg-white text-slate-900 font-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60'
                  }`}
                >
                  {t('Vote on Fixes', 'সমাধান যাচাই ভোট')} ({pendingVerifications.length})
                </button>
              </div>

              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs font-bangla shadow-md shadow-emerald-600/20 hover:shadow-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('Submit New Report', 'নতুন অভিযোগ দাখিল করুন')}</span>
              </Link>
            </div>

            {/* TAB CONTENT: My Reports with Status Step Tracker */}
            {citizenTab === 'my_reports' && (
              <div className="space-y-4">
                {displayedMyReports.map((issue) => {
                  const statusBadge = getStatusBadgeStyle(issue.status);
                  const severityBadge = getSeverityBadge(issue.severity);

                  // Calculate step (1: Submitted, 2: Under Review/Assigned, 3: In Progress, 4: Verification/Closed)
                  let step = 1;
                  if (issue.status === 'UNDER_REVIEW' || issue.status === 'VERIFIED' || issue.status === 'ASSIGNED') step = 2;
                  if (issue.status === 'IN_PROGRESS') step = 3;
                  if (issue.status === 'CITIZEN_VERIFICATION' || issue.status === 'RESOLVED' || issue.status === 'CLOSED') step = 4;

                  return (
                    <div
                      key={issue.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={issue.media[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80'}
                            alt={issue.title}
                            className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 shadow-inner"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                #{issue.trackingNumber}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadge.className}`}>
                                {language === 'bn' ? severityBadge.labelBn : severityBadge.label}
                              </span>
                              <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                                {issue.status.replace('_', ' ')}
                              </span>
                            </div>
                            <Link
                              href={`/issues/${issue.id}`}
                              className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-1"
                            >
                              {issue.titleBn || issue.title}
                            </Link>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bangla">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                {issue.location.area}, {issue.location.ward}
                              </span>
                              <span>•</span>
                              <span>{issue.categoryName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center md:flex-col items-end gap-2 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bangla">{t('SLA Target', 'এসএলএ নির্ধারিত সময়')}</span>
                            <span className="text-xs font-bold text-emerald-700 font-mono">{issue.slaDays} {language === 'bn' ? 'দিন' : 'Days'}</span>
                          </div>
                          <Link
                            href={`/issues/${issue.id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition flex items-center gap-1 font-bangla shadow-sm"
                          >
                            <span>{t('View Progress', 'অগ্রগতি দেখুন')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* 4-Step Visual SLA Progress Bar */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bangla">
                          <div className={`p-2 rounded-xl transition ${step >= 1 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 1 && <Check className="w-3 h-3 text-emerald-600" />}
                              <span>{t('1. Submitted', '১. রিপোর্ট জমা')}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl transition ${step >= 2 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 2 && <Check className="w-3 h-3 text-emerald-600" />}
                              <span>{t('2. Assigned', '২. যাচাই ও বরাদ্দ')}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl transition ${step === 3 ? 'bg-amber-50 border border-amber-300 text-amber-800 font-bold' : step > 3 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step === 3 && <Activity className="w-3 h-3 text-amber-600 animate-pulse" />}
                              {step > 3 && <Check className="w-3 h-3 text-emerald-600" />}
                              <span>{t('3. In Progress', '৩. কাজ চলমান')}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl transition ${step >= 4 ? 'bg-teal-50 border border-teal-200 text-teal-800 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 4 && <CheckCircle2 className="w-3 h-3 text-teal-600" />}
                              <span>{t('4. Resolution Vote', '৪. সমাধান যাচাই')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: Followed & Upvoted */}
            {citizenTab === 'followed' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followedIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white border border-slate-200/90 p-5 rounded-2xl space-y-3 hover:shadow-md hover:border-slate-300 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs text-slate-700 font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        #{issue.trackingNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                    <Link href={`/issues/${issue.id}`} className="font-bold text-slate-900 hover:text-emerald-700 transition block line-clamp-1">
                      {issue.titleBn || issue.title}
                    </Link>
                    <p className="text-xs text-slate-600 font-bangla line-clamp-2">{issue.description}</p>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bangla">
                      <span>👍 {formatNumber(issue.communityConfirmations)} নাগরিক সমর্থন</span>
                      <Link href={`/issues/${issue.id}`} className="text-emerald-700 hover:text-emerald-800 font-bold">
                        বিস্তারিত দেখুন →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Resolution Verification Voting */}
            {citizenTab === 'verifications' && (
              <div className="space-y-4">
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/90 text-slate-500 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
                    <p className="font-bangla font-semibold">বর্তমানে আপনার এলাকায় কোনো সমাধান যাচাইকরণের জন্য অপেক্ষমান নেই।</p>
                  </div>
                ) : (
                  pendingVerifications.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-white border border-cyan-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold text-[10px] tracking-wider uppercase">
                            {t('Resident Voting Open', 'নাগরিক ভোটিং উন্মুক্ত')}
                          </span>
                          <h4 className="text-lg font-black text-slate-900 mt-1.5">{issue.titleBn || issue.title}</h4>
                          <span className="text-xs text-slate-500 font-bangla">📍 {issue.location.address}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bangla block">কর্তৃপক্ষ:</span>
                          <span className="text-xs font-bold text-emerald-700">{issue.assignedDepartment || 'DNCC Engineering'}</span>
                        </div>
                      </div>

                      {/* Photo evidence: before and after */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 font-bangla">পূর্বে (রিপোর্টকালীন ছবি):</span>
                          <img
                            src={issue.media[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'}
                            alt="Before"
                            className="w-full h-36 rounded-xl object-cover border border-slate-200 shadow-inner"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-emerald-700 font-bangla">বর্তমানে (কর্তৃপক্ষের সমাধান ছবি):</span>
                          <img
                            src={issue.resolutionMedia?.[0]?.url || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80'}
                            alt="After"
                            className="w-full h-36 rounded-xl object-cover border border-emerald-300 ring-2 ring-emerald-500/20 shadow-inner"
                          />
                        </div>
                      </div>

                      {/* Voting Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-600 font-bangla">
                          বর্তমান অবস্থা: <strong className="text-emerald-700">{formatNumber(issue.citizenVerifications?.fixedCount || 0)}</strong> জন বলেছেন ঠিক হয়েছে, <strong className="text-rose-600">{formatNumber(issue.citizenVerifications?.stillExistsCount || 0)}</strong> জন বলেছেন সমস্যা রয়ে গেছে।
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => voteResolution(issue.id, 'STILL_EXISTS', 'Site verification: problem still exists.')}
                            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold font-bangla transition shadow-sm"
                          >
                            ✕ সমস্যা এখনো রয়ে গেছে
                          </button>
                          <button
                            onClick={() => voteResolution(issue.id, 'FIXED', 'Site verification: verified fixed by resident.')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs font-bangla transition shadow-md shadow-emerald-600/20"
                          >
                            ✓ হ্যাঁ, পুরোপুরি সমাধান হয়েছে
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE VIEW 2: AUTHORITY OPERATIONS DESK */}
        {/* ========================================================================= */}
        {activeRole === 'AUTHORITY' && (
          <div className="space-y-8 animate-fade-in">
            {/* Authority Metric Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-slate-500 font-bold">{t('Total Assigned', 'মোট অর্পিত টাস্ক')}</span>
                <div className="text-3xl font-black text-slate-900 mt-1 font-bangla">{formatNumber(issues.length)}</div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">ডিএনসিসি জোন ১-৫</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-purple-700 font-bold">{t('Under Review', 'যাচাই অপেক্ষমাণ')}</span>
                <div className="text-3xl font-black text-purple-900 mt-1 font-bangla">
                  {formatNumber(issues.filter((i) => i.status === 'UNDER_REVIEW' || i.status === 'SUBMITTED').length)}
                </div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">ডেস্ক ট্রায়াজ প্রয়োজন</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-amber-700 font-bold">{t('In Progress', 'মাঠে কাজ চলমান')}</span>
                <div className="text-3xl font-black text-amber-900 mt-1 font-bangla">
                  {formatNumber(issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length)}
                </div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">ইঞ্জিনিয়ারিং টিম নিয়োজিত</span>
              </div>

              <div className="bg-white border border-red-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden">
                <span className="text-xs font-bangla text-red-700 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  {t('Critical SLA Hazards', 'জরুরি এসএলএ কিউ')}
                </span>
                <div className="text-3xl font-black text-red-600 mt-1 font-bangla">
                  {formatNumber(criticalIssues.length)}
                </div>
                <span className="text-[11px] text-red-600 font-bangla mt-1 block font-semibold">&lt; ২৪ ঘণ্টা সময়সীমা</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl col-span-2 lg:col-span-1 shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-emerald-700 font-bold">{t('Resolved & Closed', 'সমাধানকৃত ও যাচাই')}</span>
                <div className="text-3xl font-black text-emerald-800 mt-1 font-bangla">
                  {formatNumber(issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length)}
                </div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">প্রমাণ আপলোড সম্পন্ন</span>
              </div>
            </div>

            {/* Critical Urgent Dispatch Banner */}
            {criticalIssues.length > 0 && (
              <div className="bg-red-50/80 border border-red-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-red-900 flex items-center gap-2 font-bangla">
                    <Flame className="w-5 h-5 text-red-600 animate-bounce" />
                    <span>{t('CRITICAL HAZARD QUEUE (Immediate Dispatch Required)', 'জরুরি বিপদ তালিকা (তাৎক্ষণিক টিম প্রেরণ বাধ্যতামূলক)')}</span>
                  </h3>
                  <span className="text-xs font-bold text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                    {formatNumber(criticalIssues.length)} {language === 'bn' ? 'জরুরি বিষয়' : 'Urgent Hazards'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criticalIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-white border border-red-200 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-red-600 flex items-center gap-1 font-bangla">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            মারাত্মক ঝুঁকি (Critical Hazard)
                          </span>
                          <span className="text-slate-500 font-mono font-bold">#{issue.trackingNumber}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{issue.titleBn || issue.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 font-bangla">📍 {issue.location.address}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-bangla">
                          👍 {formatNumber(issue.communityConfirmations)} নাগরিক সমর্থন দিয়েছেন
                        </span>
                        <button
                          onClick={() => {
                            setSelectedIssueForAction(issue);
                            setActionStatus(issue.status === 'IN_PROGRESS' ? 'RESOLVED' : 'IN_PROGRESS');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition font-bangla shadow-sm"
                        >
                          পদক্ষেপ নিন →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Department Filter & Search Controls */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-bangla">
                    {t('Assigned Public Issues Queue', 'বিভাগীয় কাজের তালিকা ও ওয়ার্ক-অর্ডার')}
                  </h3>
                  <p className="text-xs text-slate-500 font-bangla">
                    {t('Review reports, dispatch field engineers, and upload resolution proof.', 'রিপোর্ট যাচাই, ইঞ্জিনিয়ারদের দায়িত্ব অর্পণ ও সমাধানের প্রমাণ আপলোড।')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={t('Search issues...', 'আইডি বা এলাকা খুঁজুন...')}
                      value={authSearchQuery}
                      onChange={(e) => setAuthSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={authStatusFilter}
                    onChange={(e) => setAuthStatusFilter(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="ALL">All Statuses (সকল স্ট্যাটাস)</option>
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CITIZEN_VERIFICATION">CITIZEN_VERIFICATION</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ইস্যু ও ট্র্যাকিং আইডি</th>
                      <th className="px-4 py-3">এলাকা ও জোন</th>
                      <th className="px-4 py-3">বিভাগ</th>
                      <th className="px-4 py-3">জরুরিতা</th>
                      <th className="px-4 py-3">বর্তমান অবস্থা</th>
                      <th className="px-4 py-3">এসএলএ</th>
                      <th className="px-4 py-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {authorityFilteredIssues.map((issue) => {
                      const statusBadge = getStatusBadgeStyle(issue.status);
                      const severityBadge = getSeverityBadge(issue.severity);
                      return (
                        <tr key={issue.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3.5">
                            <Link href={`/issues/${issue.id}`} className="font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-1 max-w-xs font-bangla">
                              {issue.titleBn || issue.title}
                            </Link>
                            <span className="font-mono text-[10px] text-emerald-700 font-bold block mt-0.5">#{issue.trackingNumber}</span>
                          </td>
                          <td className="px-4 py-3.5 font-bangla text-slate-600">
                            {issue.location.area}, {issue.location.ward}
                          </td>
                          <td className="px-4 py-3.5 font-bangla text-slate-500">
                            {issue.categoryName}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadge.className}`}>
                              {language === 'bn' ? severityBadge.labelBn : severityBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                              {issue.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 font-mono">
                            {issue.slaDays} Days
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedIssueForAction(issue);
                                setActionStatus(
                                  issue.status === 'ASSIGNED'
                                    ? 'IN_PROGRESS'
                                    : issue.status === 'IN_PROGRESS'
                                    ? 'RESOLVED'
                                    : 'IN_PROGRESS'
                                );
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-bangla transition shadow-sm"
                            >
                              হালনাগাদ করুন
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE VIEW 3: ADMIN & MODERATION CONSOLE */}
        {/* ========================================================================= */}
        {activeRole === 'ADMIN' && (
          <div className="space-y-8 animate-fade-in">
            {/* Admin Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-slate-500 font-bold">{t('Total System Issues', 'মোট নিবন্ধিত সমস্যা')}</span>
                <div className="text-3xl font-black text-slate-900 mt-1 font-bangla">{formatNumber(issues.length)}</div>
                <span className="text-[11px] text-emerald-700 font-bangla mt-1 block font-semibold">১০০% পাবলিক ওপেন ডেটা</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-slate-500 font-bold">{t('Real-time Active Citizens', 'সক্রিয় অনলাইন নাগরিক')}</span>
                <div className="text-3xl font-black text-blue-700 mt-1 font-bangla">{formatNumber(onlineCount)}</div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">সকেট.আইও লাইভ ব্রডকাস্ট</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-slate-500 font-bold">{t('Resolution Rate', 'গড় সমাধান হার')}</span>
                <div className="text-3xl font-black text-emerald-700 mt-1 font-bangla">{formatNumber(78)}%</div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">বিগত ৩০ দিনের পরিসংখ্যান</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-xs font-bangla text-slate-500 font-bold">{t('SLA Compliance Rate', 'এসএলএ সময়ানুবর্তিতা')}</span>
                <div className="text-3xl font-black text-purple-700 mt-1 font-bangla">{formatNumber(86)}%</div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">নির্ধারিত সময়ে গৃহীত পদক্ষেপ</span>
              </div>
            </div>

            {/* Admin Subtabs */}
            <div className="bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/60 flex flex-wrap items-center gap-1.5">
              {[
                { id: 'moderation', label: t('Issue Triage & Verification', 'ইস্যু ট্রায়াজ ও যাচাই'), icon: FileCheck },
                { id: 'departments', label: t('Department Scorecards', 'বিভাগীয় পারফরম্যান্স'), icon: BarChart3 },
                { id: 'audit', label: t('Master Audit Trail', 'মাস্টার লাইভ অডিট লগ'), icon: Activity },
                { id: 'users', label: t('Role Permissions', 'ব্যবহারকারী ও রোল ম্যানেজমেন্ট'), icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bangla transition ${
                      isActive
                        ? 'bg-purple-600 text-white font-black shadow-md'
                        : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ADMIN TAB 1: Moderation Queue */}
            {adminTab === 'moderation' && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 font-bangla">
                    {t('Civic Moderation Queue', 'সক্রিয় মডারেশন কিউ')} ({issues.length} {language === 'bn' ? 'টি অভিযোগ' : 'Issues'})
                  </h3>
                  <span className="text-xs text-emerald-700 font-bangla font-semibold">স্প্যাম ও ডুপ্লিকেট চেকার সক্রিয়</span>
                </div>

                <div className="space-y-3">
                  {issues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                            #{issue.trackingNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                            {issue.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{issue.titleBn || issue.title}</h4>
                        <p className="text-xs text-slate-500 font-bangla">📍 {issue.location.address} • রিপোর্ট করেছেন: {issue.reportedBy.name}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'VERIFIED', 'Verified by Civic Desk Admin')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-bangla transition shadow-sm"
                        >
                          ✓ অনুমোদন করুন
                        </button>
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'REJECTED', 'Marked as spam or inappropriate by admin')}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs font-bangla transition"
                        >
                          ✕ বাতিল / স্প্যাম
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN TAB 2: Department Scorecards */}
            {adminTab === 'departments' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'ঢাকা উত্তর সিটি কর্পোরেশন (DNCC)', rate: 88, issues: 42, color: 'emerald' },
                  { name: 'ঢাকা ওয়াসা (DWASA Drainage)', rate: 72, issues: 31, color: 'amber' },
                  { name: 'ডেসকো (DESCO Streetlight/Power)', rate: 94, issues: 19, color: 'cyan' },
                ].map((dept, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 p-6 rounded-2xl space-y-4 shadow-sm">
                    <h4 className="font-bold text-slate-900 font-bangla">{dept.name}</h4>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-bangla">
                        <span>এসএলএ সমাধান হার</span>
                        <span className="font-bold text-emerald-700">{dept.rate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${dept.rate}%` }} />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-bangla">
                      <span>মোট নির্ধারিত অভিযোগ:</span>
                      <strong className="text-slate-900 font-bold">{dept.issues} টি</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADMIN TAB 3: Master Real-Time Audit Log */}
            {adminTab === 'audit' && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 font-bangla">
                    {t('Master Civic Audit Log', 'মাস্টার লাইভ অডিট ট্রেইল')}
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bangla font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    রিয়েল-টাইম সকেট সংযোগ সক্রিয়
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {issues.flatMap((i) => i.timeline.map((entry) => ({ ...entry, issueTitle: i.titleBn || i.title }))).slice(0, 10).map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          {log.newStatus}
                        </span>
                        <span className="text-slate-900 font-bold font-bangla">{log.issueTitle}:</span>
                        <span className="text-slate-600 font-bangla">{log.noteBn || log.note}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        দ্বারা: {log.changedBy} ({new Date(log.createdAt).toLocaleTimeString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN TAB 4: Users and Permissions */}
            {adminTab === 'users' && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 font-bangla">
                    {t('Role-Based Access Control (RBAC)', 'রোল পারমিশন ও ক্রিপ্টোগ্রাফিক সুরক্ষা')}
                  </h3>
                  <Link
                    href="/super-admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold font-bangla hover:bg-amber-100 transition shadow-sm"
                  >
                    <span>👑 {language === 'bn' ? 'সুপার অ্যাডমিন কনসোল' : 'Super Admin Console'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-bangla">নাগরিক (Citizen)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        CITIZEN
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bangla">
                      পাবলিক রিপোর্ট সাবমিট, আপভোট, রেজল্যুশন ভোট ও নিজস্ব প্রোফাইল।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-bangla">কর্তৃপক্ষ (Authority)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold border border-teal-200">
                        AUTHORITY
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bangla">
                      DNCC/WASA ওয়ার্ক অর্ডার, ফিল্ড টিম নিয়োগ ও সমাধান প্রমাণ আপলোড।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-bangla">সিস্টেম অ্যাডমিন (Admin)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold border border-purple-200">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-bangla">
                      অভিযোগ ট্রায়াজ, স্প্যাম ফিল্টারিং, এসএলএ মনিটরিং ও সিস্টেম অডিট।
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* AUTHORITY WORKFLOW ACTION MODAL */}
        {/* ========================================================================= */}
        {selectedIssueForAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 text-slate-900">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    #{selectedIssueForAction.trackingNumber}
                  </span>
                  <h3 className="font-black text-lg text-slate-900 font-bangla mt-1">
                    অ্যাকশন গ্রহণ: {selectedIssueForAction.titleBn || selectedIssueForAction.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIssueForAction(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleActionSubmit} className="space-y-4 font-bangla text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">পরবর্তী স্ট্যাটাস নির্বাচন করুন:</label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value as IssueStatus)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="UNDER_REVIEW">UNDER_REVIEW - প্রাথমিক যাচাই</option>
                    <option value="ASSIGNED">ASSIGNED - বিভাগীয় দলে প্রেরণ</option>
                    <option value="IN_PROGRESS">IN_PROGRESS - মাঠে কাজ চলমান</option>
                    <option value="RESOLVED">RESOLVED - কাজ সমাপ্ত (নাগরিক যাচাই শুরু হবে)</option>
                    <option value="CLOSED">CLOSED - চূড়ান্তভাবে সমাপ্ত</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">দায়িত্বপ্রাপ্ত বিভাগ:</label>
                    <input
                      type="text"
                      value={assignedDept}
                      onChange={(e) => setAssignedDept(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">দায়িত্বপ্রাপ্ত কর্মকর্তা:</label>
                    <input
                      type="text"
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {actionStatus === 'RESOLVED' && (
                  <div className="space-y-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <label className="font-bold text-emerald-900 block flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>সমাধানের প্রমাণ ছবি (AFTER Photo):</span>
                      </span>
                      <label className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 flex items-center gap-1 font-bold">
                        <Camera className="w-3 h-3" />
                        <span>ছবি আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setProofUrl(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </label>

                    <input
                      type="text"
                      required
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="ইমেজ URL অথবা উপরের বাটন থেকে ডিভাইস ফাইল সিলেক্ট করুন"
                      className="w-full p-2 rounded-lg bg-white border border-emerald-300 text-slate-900 font-mono text-[11px] focus:outline-none"
                    />

                    {proofUrl && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-emerald-300 shadow-inner">
                        <img src={proofUrl} alt="Resolution Proof" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-2 text-[9px] bg-slate-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          প্রমাণ প্রিভিউ
                        </span>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-500 block">
                      এই ছবিটি নাগরিকরা দেখে ভোট দেবে সমাধান বাস্তবায়িত হয়েছে কি না।
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">কাজের বিবরণ / অফিসিয়াল নোট:</label>
                  <textarea
                    rows={3}
                    required
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="মাঠে পরিচালিত মেরামত কাজ, ব্যবহৃত সামগ্রী বা টিম নোট লিখুন..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedIssueForAction(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-600/20 transition"
                  >
                    হালনাগাদ ও লাইভ ব্রডকাস্ট করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnifiedRoleDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-600 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span>ড্যাশবোর্ড লোড হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <UnifiedRoleDashboardContent />
    </Suspense>
  );
}
