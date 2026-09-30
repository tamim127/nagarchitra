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
  const { role, setRole, currentUser, availableRoles } = useAuthRole();
  const { t, language, formatNumber } = useLanguage();
  const { isConnected, onlineCount } = useSocket();

  // Active dashboard tab matches current role or URL param
  const roleParam = searchParams.get('role');
  const activeRole: UserRole =
    roleParam === 'authority' ? 'AUTHORITY' : roleParam === 'admin' ? 'ADMIN' : role;

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

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const param = newRole === 'AUTHORITY' ? 'authority' : newRole === 'ADMIN' ? 'admin' : 'citizen';
    router.replace(`/dashboard?role=${param}`);
  };

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
    <div className="min-h-screen bg-[#041411] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================================= */}
        {/* TOP BAR: Role Selector & Real-time Status */}
        {/* ========================================================================= */}
        <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('Role-Based Intelligence Portal', 'রোল-ভিত্তিক ড্যাশবোর্ড পোর্টাল')}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a2e27] border border-[#144b40] text-xs text-emerald-300">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-semibold text-[11px]">
                    {isConnected
                      ? language === 'bn'
                        ? `সকেট লাইভ (${onlineCount} সক্রিয়)`
                        : `Socket Live (${onlineCount} Online)`
                      : 'Connecting...'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-bangla tracking-tight text-white">
                {activeRole === 'CITIZEN' && (language === 'bn' ? 'নাগরিক কন্ট্রোল সেন্টার' : 'Citizen Civic Hub')}
                {activeRole === 'AUTHORITY' && (language === 'bn' ? 'কর্তৃপক্ষ ওয়ার্কস্পেস ও টাস্ক কিউ' : 'Authority Operations Center')}
                {activeRole === 'ADMIN' && (language === 'bn' ? 'প্ল্যাটফর্ম মডারেশন ও সিস্টেম কন্ট্রোল' : 'Admin & Moderation Console')}
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl font-bangla leading-relaxed">
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

            {/* Persona Switcher Pill */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-[#041a16] p-1.5 rounded-2xl border border-[#0f3b33] flex items-center gap-1 shadow-inner">
                <button
                  onClick={() => handleRoleChange('CITIZEN')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-bangla transition-all ${
                    activeRole === 'CITIZEN'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-[#082b24]'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'bn' ? 'নাগরিক' : 'Citizen'}</span>
                </button>

                <button
                  onClick={() => handleRoleChange('AUTHORITY')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-bangla transition-all ${
                    activeRole === 'AUTHORITY'
                      ? 'bg-gradient-to-r from-amber-600 to-accent text-slate-950 font-black shadow-md shadow-amber-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-[#082b24]'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-900" />
                  <span>{language === 'bn' ? 'কর্তৃপক্ষ (DNCC)' : 'Authority'}</span>
                </button>

                <button
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-bangla transition-all ${
                    activeRole === 'ADMIN'
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-[#082b24]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-200" />
                  <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                </button>
              </div>

              {/* Current Persona Badge */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#092c26] border border-[#144b40]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/40"
                />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-white">{currentUser.name}</span>
                  <span className="text-[10px] text-accent font-bangla mt-0.5">
                    {currentUser.location}
                  </span>
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
              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-300 font-medium">
                    {t('My Submissions', 'আমার দাখিলকৃত রিপোর্ট')}
                  </span>
                  <div className="p-2 rounded-xl bg-[#0b332b] text-accent">
                    <FileCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white mt-2 font-bangla">
                  {formatNumber(displayedMyReports.length)}
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bangla">
                  <TrendingUp className="w-3 h-3" /> {t('Active in Mirpur & Dhaka', 'মিরপুর ও ঢাকা এলাকায় সক্রিয়')}
                </span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-300 font-medium">
                    {t('Issues Upvoted', 'নাগরিক সমর্থন ও ভোট')}
                  </span>
                  <div className="p-2 rounded-xl bg-[#0b332b] text-amber-400">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white mt-2 font-bangla">
                  {formatNumber(followedIssues.length || 8)}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block font-bangla">
                  {t('Community validation', 'কমিউনিটি যৌথ যাচাইকরণ')}
                </span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-300 font-medium">
                    {t('Civic Karma Score', 'নাগরিক কার্মা স্কোর')}
                  </span>
                  <div className="p-2 rounded-xl bg-[#0b332b] text-accent">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-accent mt-2 font-bangla">
                  {formatNumber(420)} <span className="text-sm font-normal text-slate-400">XP</span>
                </div>
                <span className="text-[11px] text-accent/80 mt-1 block font-bangla">
                  {t('Level 3 Civic Guardian', 'লেভেল ৩ সিটিজেন গার্ডিয়ান')}
                </span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl relative overflow-hidden group hover:border-accent/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bangla text-slate-300 font-medium">
                    {t('Pending Verifications', 'যাচাইয়ের অপেক্ষায়')}
                  </span>
                  <div className="p-2 rounded-xl bg-[#0b332b] text-cyan-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-cyan-300 mt-2 font-bangla">
                  {formatNumber(pendingVerifications.length)}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block font-bangla">
                  {t('Needs resident vote', 'নাগরিক ভোটের অপেক্ষায়')}
                </span>
              </div>
            </div>

            {/* Sub-tabs & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0f3b33] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCitizenTab('my_reports')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-bangla transition ${
                    citizenTab === 'my_reports'
                      ? 'bg-accent text-slate-950 font-black'
                      : 'bg-[#072520] text-slate-300 hover:text-white border border-[#0f3b33]'
                  }`}
                >
                  {t('My Complaints', 'আমার অভিযোগসমূহ')} ({displayedMyReports.length})
                </button>

                <button
                  onClick={() => setCitizenTab('followed')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-bangla transition ${
                    citizenTab === 'followed'
                      ? 'bg-accent text-slate-950 font-black'
                      : 'bg-[#072520] text-slate-300 hover:text-white border border-[#0f3b33]'
                  }`}
                >
                  {t('Followed & Supported', 'সমর্থিত সমস্যাসমূহ')} ({followedIssues.length})
                </button>

                <button
                  onClick={() => setCitizenTab('verifications')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-bangla transition ${
                    citizenTab === 'verifications'
                      ? 'bg-accent text-slate-950 font-black'
                      : 'bg-[#072520] text-slate-300 hover:text-white border border-[#0f3b33]'
                  }`}
                >
                  {t('Vote on Fixes', 'সমাধান যাচাই ভোট')} ({pendingVerifications.length})
                </button>
              </div>

              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-600 to-accent text-slate-950 font-extrabold text-xs font-bangla shadow-md hover:scale-105 transition"
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
                      className="bg-[#072520] border border-[#0f3b33] rounded-2xl p-5 hover:border-[#1a554a] transition space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={issue.media[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80'}
                            alt={issue.title}
                            className="w-20 h-20 rounded-xl object-cover ring-1 ring-[#0f3b33] shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] text-accent font-bold">
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
                              className="text-base font-bold text-white hover:text-accent transition line-clamp-1"
                            >
                              {issue.titleBn || issue.title}
                            </Link>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-bangla">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
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
                            <span className="text-xs font-bold text-accent font-mono">{issue.slaDays} {language === 'bn' ? 'দিন' : 'Days'}</span>
                          </div>
                          <Link
                            href={`/issues/${issue.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#0b332b] hover:bg-[#104439] text-xs font-bold text-emerald-300 border border-[#164e43] transition flex items-center gap-1 font-bangla"
                          >
                            <span>{t('View Progress', 'অগ্রগতি দেখুন')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* 4-Step Visual SLA Progress Bar */}
                      <div className="pt-3 border-t border-[#0b2f28]">
                        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bangla">
                          <div className={`p-2 rounded-xl transition ${step >= 1 ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold' : 'bg-[#041a16] text-slate-500'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 1 && <Check className="w-3 h-3 text-emerald-400" />}
                              <span>{t('1. Submitted', '১. রিপোর্ট জমা')}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl transition ${step >= 2 ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold' : 'bg-[#041a16] text-slate-500'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 2 && <Check className="w-3 h-3 text-emerald-400" />}
                              <span>{t('2. Assigned', '২. যাচাই ও বরাদ্দ')}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl transition ${step >= 3 ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold' : 'bg-[#041a16] text-slate-500'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 3 && <Activity className="w-3 h-3 text-amber-400 animate-pulse" />}
                              <span>{t('3. In Progress', '৩. কাজ চলমান')}</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-xl transition ${step >= 4 ? 'bg-teal-950/80 border border-teal-500/40 text-teal-300 font-bold' : 'bg-[#041a16] text-slate-500'}`}>
                            <div className="flex items-center justify-center gap-1">
                              {step >= 4 && <CheckCircle2 className="w-3 h-3 text-teal-400" />}
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
                    className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl space-y-3 hover:border-accent/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] text-accent font-bold">#{issue.trackingNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                        {issue.status}
                      </span>
                    </div>
                    <Link href={`/issues/${issue.id}`} className="font-bold text-white hover:text-accent transition block line-clamp-1">
                      {issue.titleBn || issue.title}
                    </Link>
                    <p className="text-xs text-slate-400 font-bangla line-clamp-2">{issue.description}</p>
                    <div className="pt-2 border-t border-[#0b2f28] flex items-center justify-between text-xs text-slate-400">
                      <span>👍 {formatNumber(issue.communityConfirmations)} নাগরিক সমর্থন</span>
                      <Link href={`/issues/${issue.id}`} className="text-accent hover:underline font-bangla">
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
                  <div className="text-center py-12 bg-[#072520] rounded-2xl border border-[#0f3b33] text-slate-400">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-50" />
                    <p className="font-bangla">বর্তমানে আপনার এলাকায় কোনো সমাধান যাচাইকরণের জন্য অপেক্ষমান নেই।</p>
                  </div>
                ) : (
                  pendingVerifications.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-[#072520] border border-cyan-800/60 rounded-2xl p-6 space-y-4 shadow-lg shadow-cyan-950/20"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold text-[10px] tracking-wider uppercase">
                            {t('Resident Voting Open', 'নাগরিক ভোটিং উন্মুক্ত')}
                          </span>
                          <h4 className="text-lg font-bold text-white mt-1.5">{issue.titleBn || issue.title}</h4>
                          <span className="text-xs text-slate-400 font-bangla">📍 {issue.location.address}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bangla block">কর্তৃপক্ষ:</span>
                          <span className="text-xs font-bold text-emerald-300">{issue.assignedDepartment || 'DNCC Engineering'}</span>
                        </div>
                      </div>

                      {/* Photo evidence: before and after */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 font-bangla">পূর্বে (রিপোর্টকালীন ছবি):</span>
                          <img
                            src={issue.media[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'}
                            alt="Before"
                            className="w-full h-36 rounded-xl object-cover border border-[#0f3b33]"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-emerald-400 font-bangla">বর্তমানে (কর্তৃপক্ষের সমাধান ছবি):</span>
                          <img
                            src={issue.resolutionMedia?.[0]?.url || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80'}
                            alt="After"
                            className="w-full h-36 rounded-xl object-cover border border-emerald-800/80"
                          />
                        </div>
                      </div>

                      {/* Voting Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#0f3b33]">
                        <span className="text-xs text-slate-300 font-bangla">
                          বর্তমান অবস্থা: <strong className="text-emerald-400">{formatNumber(issue.citizenVerifications?.fixedCount || 0)}</strong> জন বলেছেন ঠিক হয়েছে, <strong className="text-red-400">{formatNumber(issue.citizenVerifications?.stillExistsCount || 0)}</strong> জন বলেছেন সমস্যা রয়ে গেছে।
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => voteResolution(issue.id, 'STILL_EXISTS', 'Site verification: problem still exists.')}
                            className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 text-xs font-bold font-bangla transition"
                          >
                            ✕ সমস্যা এখনো রয়ে গেছে
                          </button>
                          <button
                            onClick={() => voteResolution(issue.id, 'FIXED', 'Site verification: verified fixed by resident.')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs font-bangla transition shadow"
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
              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-slate-400 font-medium">{t('Total Assigned', 'মোট অর্পিত টাস্ক')}</span>
                <div className="text-3xl font-black text-white mt-1 font-bangla">{formatNumber(issues.length)}</div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">ডিএনসিসি জোন ১-৫</span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-purple-400 font-medium">{t('Under Review', 'যাচাই অপেক্ষমাণ')}</span>
                <div className="text-3xl font-black text-purple-300 mt-1 font-bangla">
                  {formatNumber(issues.filter((i) => i.status === 'UNDER_REVIEW' || i.status === 'SUBMITTED').length)}
                </div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">ডেস্ক ট্রায়াজ প্রয়োজন</span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-amber-400 font-medium">{t('In Progress', 'মাঠে কাজ চলমান')}</span>
                <div className="text-3xl font-black text-amber-300 mt-1 font-bangla">
                  {formatNumber(issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length)}
                </div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">ইঞ্জিনিয়ারিং টিম নিয়োজিত</span>
              </div>

              <div className="bg-[#072520] border border-red-900/40 p-5 rounded-2xl relative overflow-hidden">
                <span className="text-xs font-bangla text-red-400 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  {t('Critical SLA Hazards', 'জরুরি এসএলএ কিউ')}
                </span>
                <div className="text-3xl font-black text-red-400 mt-1 font-bangla">
                  {formatNumber(criticalIssues.length)}
                </div>
                <span className="text-[11px] text-red-400/80 font-bangla mt-1 block">&lt; ২৪ ঘণ্টা সময়সীমা</span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl col-span-2 lg:col-span-1">
                <span className="text-xs font-bangla text-emerald-400 font-medium">{t('Resolved & Closed', 'সমাধানকৃত ও যাচাই')}</span>
                <div className="text-3xl font-black text-emerald-300 mt-1 font-bangla">
                  {formatNumber(issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length)}
                </div>
                <span className="text-[11px] text-slate-500 font-bangla mt-1 block">প্রমাণ আপলোড সম্পন্ন</span>
              </div>
            </div>

            {/* Critical Urgent Dispatch Banner */}
            {criticalIssues.length > 0 && (
              <div className="bg-red-950/40 border border-red-800/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-red-300 flex items-center gap-2 font-bangla">
                    <Flame className="w-5 h-5 text-red-500 animate-bounce" />
                    <span>{t('CRITICAL HAZARD QUEUE (Immediate Dispatch Required)', 'জরুরি বিপদ তালিকা (তাৎক্ষণিক টিম প্রেরণ বাধ্যতামূলক)')}</span>
                  </h3>
                  <span className="text-xs font-bold text-red-200 bg-red-900/60 px-3 py-1 rounded-full border border-red-700">
                    {formatNumber(criticalIssues.length)} {language === 'bn' ? 'জরুরি বিষয়' : 'Urgent Hazards'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criticalIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-[#061e1a] border border-red-800/50 p-4 rounded-2xl flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-red-400 flex items-center gap-1 font-bangla">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            মারাত্মক ঝুঁকি (Critical Hazard)
                          </span>
                          <span className="text-slate-400 font-mono">#{issue.trackingNumber}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm">{issue.titleBn || issue.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-bangla">📍 {issue.location.address}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#0f3b33]">
                        <span className="text-xs text-slate-400 font-bangla">
                          👍 {formatNumber(issue.communityConfirmations)} নাগরিক সমর্থন দিয়েছেন
                        </span>
                        <button
                          onClick={() => {
                            setSelectedIssueForAction(issue);
                            setActionStatus(issue.status === 'IN_PROGRESS' ? 'RESOLVED' : 'IN_PROGRESS');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-accent text-slate-950 font-black text-xs hover:bg-accent-400 transition font-bangla"
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
            <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white font-bangla">
                    {t('Assigned Public Issues Queue', 'বিভাগীয় কাজের তালিকা ও ওয়ার্ক-অর্ডার')}
                  </h3>
                  <p className="text-xs text-slate-400 font-bangla">
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
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-[#041a16] border border-[#0f3b33] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={authStatusFilter}
                    onChange={(e) => setAuthStatusFilter(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-[#041a16] border border-[#0f3b33] rounded-xl text-slate-200 font-medium focus:outline-none"
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
                  <thead className="bg-[#041a16] border-y border-[#0f3b33] text-slate-400 uppercase font-bold tracking-wider">
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
                  <tbody className="divide-y divide-[#0b2f28]">
                    {authorityFilteredIssues.map((issue) => {
                      const statusBadge = getStatusBadgeStyle(issue.status);
                      const severityBadge = getSeverityBadge(issue.severity);
                      return (
                        <tr key={issue.id} className="hover:bg-[#092e27] transition">
                          <td className="px-4 py-3.5">
                            <Link href={`/issues/${issue.id}`} className="font-bold text-white hover:text-accent transition line-clamp-1 max-w-xs font-bangla">
                              {issue.titleBn || issue.title}
                            </Link>
                            <span className="font-mono text-[10px] text-accent block mt-0.5">#{issue.trackingNumber}</span>
                          </td>
                          <td className="px-4 py-3.5 font-bangla text-slate-300">
                            {issue.location.area}, {issue.location.ward}
                          </td>
                          <td className="px-4 py-3.5 font-bangla text-slate-400">
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
                          <td className="px-4 py-3.5 text-slate-400 font-mono">
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
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-bangla transition shadow"
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
              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-slate-400">{t('Total System Issues', 'মোট নিবন্ধিত সমস্যা')}</span>
                <div className="text-3xl font-black text-white mt-1 font-bangla">{formatNumber(issues.length)}</div>
                <span className="text-[11px] text-emerald-400 font-bangla mt-1 block">১০০% পাবলিক ওপেন ডেটা</span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-slate-400">{t('Real-time Active Citizens', 'সক্রিয় অনলাইন নাগরিক')}</span>
                <div className="text-3xl font-black text-accent mt-1 font-bangla">{formatNumber(onlineCount)}</div>
                <span className="text-[11px] text-slate-400 font-bangla mt-1 block">সকেট.আইও লাইভ ব্রডকাস্ট</span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-slate-400">{t('Resolution Rate', 'গড় সমাধান হার')}</span>
                <div className="text-3xl font-black text-emerald-400 mt-1 font-bangla">{formatNumber(78)}%</div>
                <span className="text-[11px] text-slate-400 font-bangla mt-1 block">বিগত ৩০ দিনের পরিসংখ্যান</span>
              </div>

              <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
                <span className="text-xs font-bangla text-slate-400">{t('SLA Compliance Rate', 'এসএলএ সময়ানুবর্তিতা')}</span>
                <div className="text-3xl font-black text-purple-300 mt-1 font-bangla">{formatNumber(86)}%</div>
                <span className="text-[11px] text-slate-400 font-bangla mt-1 block">নির্ধারিত সময়ে গৃহীত পদক্ষেপ</span>
              </div>
            </div>

            {/* Admin Subtabs */}
            <div className="flex items-center gap-2 border-b border-[#0f3b33] pb-3">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-bangla transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#072520] text-slate-300 hover:text-white border border-[#0f3b33]'
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
              <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white font-bangla">
                    {t('Civic Moderation Queue', 'সক্রিয় মডারেশন কিউ')} ({issues.length} {language === 'bn' ? 'টি অভিযোগ' : 'Issues'})
                  </h3>
                  <span className="text-xs text-accent font-bangla">স্প্যাম ও ডুপ্লিকেট চেকার সক্রিয়</span>
                </div>

                <div className="space-y-3">
                  {issues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-[#051e19] border border-[#0f3b33] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-accent font-bold">#{issue.trackingNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#0b332b] text-emerald-300 border border-[#164e43]">
                            {issue.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm">{issue.titleBn || issue.title}</h4>
                        <p className="text-xs text-slate-400 font-bangla">📍 {issue.location.address} • রিপোর্ট করেছেন: {issue.reportedBy.name}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'VERIFIED', 'Verified by Civic Desk Admin')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs font-bangla transition"
                        >
                          ✓ অনুমোদন করুন
                        </button>
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'REJECTED', 'Marked as spam or inappropriate by admin')}
                          className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 font-bold text-xs font-bangla transition"
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
                  <div key={idx} className="bg-[#072520] border border-[#0f3b33] p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold text-white font-bangla">{dept.name}</h4>
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1 font-bangla">
                        <span>এসএলএ সমাধান হার</span>
                        <span className="font-bold text-accent">{dept.rate}%</span>
                      </div>
                      <div className="w-full bg-[#041a16] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full rounded-full" style={{ width: `${dept.rate}%` }} />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#0b2f28] flex justify-between text-xs text-slate-400 font-bangla">
                      <span>মোট নির্ধারিত অভিযোগ:</span>
                      <strong className="text-white">{dept.issues} টি</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADMIN TAB 3: Master Real-Time Audit Log */}
            {adminTab === 'audit' && (
              <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white font-bangla">
                    {t('Master Civic Audit Log', 'মাস্টার লাইভ অডিট ট্রেইল')}
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bangla">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    রিয়েল-টাইম সকেট সংযোগ সক্রিয়
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {issues.flatMap((i) => i.timeline.map((entry) => ({ ...entry, issueTitle: i.titleBn || i.title }))).slice(0, 10).map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#041a16] border border-[#0f3b33] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-[#0b332b] text-accent text-[10px] font-bold">
                          {log.newStatus}
                        </span>
                        <span className="text-slate-200 font-bangla">{log.issueTitle}:</span>
                        <span className="text-slate-400 font-bangla">{log.noteBn || log.note}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        দ্বারা: {log.changedBy} ({new Date(log.createdAt).toLocaleTimeString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN TAB 4: Users and Permissions */}
            {adminTab === 'users' && (
              <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-base text-white font-bangla">
                  {t('Role Permissions & Authorized Personnel', 'রোল পারমিশন ও অনুমোদিত কর্মকর্তাদের তালিকা')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableRoles.map((r) => (
                    <div key={r.role} className="p-4 rounded-2xl bg-[#051e19] border border-[#0f3b33] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{r.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent font-bold">
                          {r.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-bangla">{r.subtitle}</p>
                      <button
                        onClick={() => handleRoleChange(r.role)}
                        className="w-full mt-2 py-1.5 rounded-lg bg-[#0b332b] hover:bg-[#104439] text-xs font-bold text-accent transition"
                      >
                        {r.role === activeRole ? 'বর্তমান সক্রিয় রোল' : 'এই রোলে স্যুইচ করুন'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* AUTHORITY WORKFLOW ACTION MODAL */}
        {/* ========================================================================= */}
        {selectedIssueForAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#072520] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#164e43] shadow-2xl space-y-6 text-white">
              <div className="flex items-start justify-between border-b border-[#0f3b33] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-accent">#{selectedIssueForAction.trackingNumber}</span>
                  <h3 className="font-extrabold text-lg text-white font-bangla">
                    অ্যাকশন গ্রহণ: {selectedIssueForAction.titleBn || selectedIssueForAction.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIssueForAction(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleActionSubmit} className="space-y-4 font-bangla text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">পরবর্তী স্ট্যাটাস নির্বাচন করুন:</label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value as IssueStatus)}
                    className="w-full p-3 rounded-xl bg-[#041a16] border border-[#0f3b33] text-white font-bold"
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
                    <label className="font-bold text-slate-300 block">দায়িত্বপ্রাপ্ত বিভাগ:</label>
                    <input
                      type="text"
                      value={assignedDept}
                      onChange={(e) => setAssignedDept(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#041a16] border border-[#0f3b33] text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block">দায়িত্বপ্রাপ্ত কর্মকর্তা:</label>
                    <input
                      type="text"
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#041a16] border border-[#0f3b33] text-white"
                    />
                  </div>
                </div>

                {actionStatus === 'RESOLVED' && (
                  <div className="space-y-2 p-3 rounded-xl bg-[#051e19] border border-emerald-600/60">
                    <label className="font-bold text-emerald-300 block flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>সমাধানের প্রমাণ ছবি (AFTER Photo):</span>
                      </span>
                      <label className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 flex items-center gap-1">
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
                      className="w-full p-2 rounded-lg bg-[#041a16] border border-emerald-500/50 text-white font-mono text-[11px]"
                    />

                    {proofUrl && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden border border-emerald-600/40">
                        <img src={proofUrl} alt="Resolution Proof" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-2 text-[9px] bg-black/70 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          প্রমাণ প্রিভিউ
                        </span>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block">
                      এই ছবিটি নাগরিকরা দেখে ভোট দেবে সমাধান বাস্তবায়িত হয়েছে কি না।
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">কাজের বিবরণ / অফিসিয়াল নোট:</label>
                  <textarea
                    rows={3}
                    required
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="মাঠে পরিচালিত মেরামত কাজ, ব্যবহৃত সামগ্রী বা টিম নোট লিখুন..."
                    className="w-full p-3 rounded-xl bg-[#041a16] border border-[#0f3b33] text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#0f3b33]">
                  <button
                    type="button"
                    onClick={() => setSelectedIssueForAction(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-accent text-slate-950 font-black hover:bg-accent-400 shadow-md transition"
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
        <div className="min-h-screen bg-[#041411] flex items-center justify-center text-slate-300 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span>ড্যাশবোর্ড লোড হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <UnifiedRoleDashboardContent />
    </Suspense>
  );
}
