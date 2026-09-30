'use client';

import React, { useState } from 'react';
import { useIssues } from '@/context/IssueContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSocket } from '@/context/SocketContext';
import { Issue, IssueStatus } from '@/types';
import Link from 'next/link';
import { AccessDeniedCard } from '@/components/AccessDeniedCard';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Filter,
  FileCheck,
  Upload,
  Flame,
  Search,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { getStatusBadgeStyle, getSeverityBadge } from '@/components/IssueCard';

export default function AuthorityDashboardPage() {
  const { issues, updateIssueStatus } = useIssues();
  const { role, currentUser } = useAuthRole();
  const { t, language, formatNumber } = useLanguage();
  const { isConnected, onlineCount } = useSocket();

  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssueForAction, setSelectedIssueForAction] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>('IN_PROGRESS');
  const [actionNote, setActionNote] = useState('');
  const [assignedDept, setAssignedDept] = useState('Civil Engineering & Road Repair');
  const [assignedOfficer, setAssignedOfficer] = useState('Engr. Zahid Hasan');
  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
  );

  const criticalIssues = issues.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED');

  const filteredIssues = issues.filter((i) => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    if (filterDepartment !== 'ALL' && i.categoryName !== filterDepartment) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        i.title.toLowerCase().includes(q) ||
        i.trackingNumber.toLowerCase().includes(q) ||
        i.location.area.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForAction) return;

    updateIssueStatus(
      selectedIssueForAction.id,
      newStatus,
      actionNote.trim() || `Status updated to ${newStatus} by ${currentUser.name}`,
      newStatus === 'RESOLVED' ? proofUrl : undefined,
      assignedDept,
      assignedOfficer
    );

    setSelectedIssueForAction(null);
    setActionNote('');
  };

  if (role !== 'AUTHORITY' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return (
      <AccessDeniedCard
        requiredRole="AUTHORITY"
        portalName={language === 'bn' ? 'বিভাগীয় অপারেশন পোর্টাল' : 'Departmental Operations Portal'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#041411] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {t('Departmental Operations Portal', 'বিভাগীয় অপারেশন পোর্টাল')}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a2e27] border border-[#144b40] text-xs text-emerald-300">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="text-[11px] font-semibold">
                    {isConnected
                      ? language === 'bn'
                        ? `লাইভ সকেট · ${onlineCount} জন সক্রিয়`
                        : `Live Socket · ${onlineCount} Active`
                      : 'Connecting...'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-bangla text-white tracking-tight">
                {t('Authority Issue Management', 'কর্তৃপক্ষ ওয়ার্কস্পেস ও টাস্ক কিউ')}
              </h1>
              <p className="text-xs text-slate-300 font-bangla">
                লগইন আছেন: <strong className="text-white">{currentUser.name}</strong> ({currentUser.location})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-black text-xs font-bangla hover:bg-accent-400 transition shadow"
              >
                রোল ড্যাশবোর্ড হাব →
              </Link>
              <Link
                href="/open-data"
                className="px-4 py-2 rounded-xl border border-[#0f3b33] bg-[#041a16] text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Export CSV
              </Link>
            </div>
          </div>
        </div>

        {/* SLA & Queue KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 block mb-1 font-bangla">{t('Total Assigned', 'মোট অর্পিত')}</span>
            <div className="text-3xl font-black text-white font-bangla">{formatNumber(issues.length)}</div>
            <span className="text-[11px] text-slate-500 font-bangla mt-1 block">{t('Dhaka Zones 1-5', 'ঢাকা জোন ১-৫')}</span>
          </div>

          <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
            <span className="text-xs font-bold text-purple-400 block mb-1 font-bangla">{t('Under Review', 'পর্যালোচনাধীন')}</span>
            <div className="text-3xl font-black text-purple-300 font-bangla">
              {formatNumber(issues.filter((i) => i.status === 'UNDER_REVIEW' || i.status === 'SUBMITTED').length)}
            </div>
            <span className="text-[11px] text-slate-500 font-bangla mt-1 block">{t('Awaiting triage', 'যাচাই অপেক্ষমাণ')}</span>
          </div>

          <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl">
            <span className="text-xs font-bold text-amber-400 block mb-1 font-bangla">{t('In Progress', 'চলমান')}</span>
            <div className="text-3xl font-black text-amber-300 font-bangla">
              {formatNumber(issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length)}
            </div>
            <span className="text-[11px] text-slate-500 font-bangla mt-1 block">{t('Crews on site', 'মাঠে টিম নিয়োজিত')}</span>
          </div>

          <div className="bg-[#072520] border border-red-900/50 p-5 rounded-2xl">
            <span className="text-xs font-bold text-red-400 block mb-1 font-bangla flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              {t('Critical SLA Queue', 'জরুরি এসএলএ কিউ')}
            </span>
            <div className="text-3xl font-black text-red-400 font-bangla">{formatNumber(criticalIssues.length)}</div>
            <span className="text-[11px] text-red-400/80 font-bangla mt-1 block">&lt; ২৪ ঘণ্টা সময়সীমা</span>
          </div>

          <div className="bg-[#072520] border border-[#0f3b33] p-5 rounded-2xl col-span-2 md:col-span-1">
            <span className="text-xs font-bold text-emerald-400 block mb-1 font-bangla">{t('Resolved', 'সমাধানকৃত')}</span>
            <div className="text-3xl font-black text-emerald-300 font-bangla">
              {formatNumber(issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length)}
            </div>
            <span className="text-[11px] text-slate-500 font-bangla mt-1 block">{t('Proof uploaded', 'প্রমাণ আপলোড সম্পন্ন')}</span>
          </div>
        </div>

        {/* Critical Priority Queue */}
        {criticalIssues.length > 0 && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-red-300 flex items-center gap-2 font-bangla">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <span>{t('CRITICAL HAZARD QUEUE (Immediate Dispatch Required)', 'জরুরি বিপদ তালিকা')}</span>
              </h3>
              <span className="text-xs font-bold text-red-200 bg-red-900/60 px-3 py-1 rounded-full border border-red-700 font-bangla">
                {formatNumber(criticalIssues.length)} {language === 'bn' ? 'জরুরি সমস্যা' : 'Urgent Hazards'}
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
                        মারাত্মক ঝুঁকি (CRITICAL)
                      </span>
                      <span className="text-accent font-mono">#{issue.trackingNumber}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm font-bangla">{issue.titleBn || issue.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-bangla">📍 {issue.location.address}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#0f3b33]">
                    <span className="text-xs font-semibold text-slate-300 font-bangla">
                      👍 {formatNumber(issue.communityConfirmations)} নাগরিক সমর্থন
                    </span>
                    <button
                      onClick={() => {
                        setSelectedIssueForAction(issue);
                        setNewStatus(issue.status === 'IN_PROGRESS' ? 'RESOLVED' : 'IN_PROGRESS');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-accent text-slate-950 font-black text-xs hover:bg-accent-400 transition font-bangla"
                    >
                      পদক্ষেপ নিন →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Issue Management Table */}
        <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-lg text-white font-bangla">
                {t('Assigned Public Issues Queue', 'কার্যক্রম তালিকা')}
              </h3>
              <p className="text-xs text-slate-400 font-bangla">
                {t('Review reports, dispatch field engineers, and upload resolution proof.', 'রিপোর্ট যাচাই, ইঞ্জিনিয়ারদের দায়িত্ব অর্পণ ও সমাধানের প্রমাণ আপলোড।')}
              </p>
            </div>

            {/* Filter Status & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#041a16] border border-[#0f3b33] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs py-1.5 px-3 bg-[#041a16] border border-[#0f3b33] rounded-lg font-medium text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#041a16] border-y border-[#0f3b33] text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">ইস্যু ও আইডি</th>
                  <th className="px-4 py-3">এলাকা</th>
                  <th className="px-4 py-3">ক্যাটাগরি</th>
                  <th className="px-4 py-3">জরুরিতা</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3">এসএলএ</th>
                  <th className="px-4 py-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0b2f28]">
                {filteredIssues.map((issue) => {
                  const statusBadge = getStatusBadgeStyle(issue.status);
                  const severityBadge = getSeverityBadge(issue.severity);
                  return (
                    <tr key={issue.id} className="hover:bg-[#092e27] transition">
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/issues/${issue.id}`}
                          className="font-bold text-white hover:text-accent transition line-clamp-1 max-w-xs font-bangla"
                        >
                          {issue.titleBn || issue.title}
                        </Link>
                        <span className="font-mono text-[10px] text-accent block mt-0.5">
                          #{issue.trackingNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bangla text-slate-300">
                        {issue.location.area}, {issue.location.ward}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-bangla">
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
                            setNewStatus(
                              issue.status === 'ASSIGNED'
                                ? 'IN_PROGRESS'
                                : issue.status === 'IN_PROGRESS'
                                ? 'RESOLVED'
                                : 'IN_PROGRESS'
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-bangla transition shadow"
                        >
                          হালনাগাদ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Workflow Modal */}
        {selectedIssueForAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#072520] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#164e43] space-y-6 text-white">
              <div className="flex items-start justify-between border-b border-[#0f3b33] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-accent">
                    #{selectedIssueForAction.trackingNumber}
                  </span>
                  <h3 className="font-extrabold text-base text-white font-bangla">
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
                  <label className="font-bold text-slate-300 block">স্ট্যাটাস পরিবর্তন করুন:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                    className="w-full p-3 rounded-xl bg-[#041a16] border border-[#0f3b33] text-white font-bold"
                  >
                    <option value="UNDER_REVIEW">UNDER_REVIEW - প্রাথমিক পর্যালোচনা</option>
                    <option value="ASSIGNED">ASSIGNED - বিভাগীয় দলে প্রেরণ</option>
                    <option value="IN_PROGRESS">IN_PROGRESS - মাঠে কাজ চলমান</option>
                    <option value="RESOLVED">RESOLVED - কাজ সম্পন্ন (নাগরিক যাচাই শুরু হবে)</option>
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
                    <label className="font-bold text-slate-300 block">কর্মকর্তা:</label>
                    <input
                      type="text"
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#041a16] border border-[#0f3b33] text-white"
                    />
                  </div>
                </div>

                {newStatus === 'RESOLVED' && (
                  <div className="space-y-2 p-3 rounded-xl bg-[#051e19] border border-emerald-600/60">
                    <label className="font-bold text-emerald-300 block flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>সমাধানের প্রমাণ ছবি (AFTER Photo):</span>
                      </span>
                      <label className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 flex items-center gap-1">
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

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#0f3b33]">
                  <button
                    type="button"
                    onClick={() => setSelectedIssueForAction(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-accent text-slate-950 font-black hover:bg-accent-400 shadow-sm"
                  >
                    হালনাগাদ ও অডিট লগ সেভ করুন
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
