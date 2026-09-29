'use client';

import React, { useState } from 'react';
import { useIssues } from '@/context/IssueContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSocket } from '@/context/SocketContext';
import { ISSUE_CATEGORIES } from '@/data/categories';
import {
  Shield,
  Users,
  Layers,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  Activity,
  BarChart3,
  Search,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { issues, updateIssueStatus } = useIssues();
  const { role, setRole, currentUser } = useAuthRole();
  const { t, language, formatNumber } = useLanguage();
  const { isConnected, onlineCount } = useSocket();

  const [activeTab, setActiveTab] = useState<'issues' | 'users' | 'categories' | 'audit'>('issues');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample users list for admin review
  const [usersList] = useState([
    { id: 'u-1', name: 'Tanvir Hossain', email: 'tanvir@citizen.bd', role: 'CITIZEN', reports: 14, status: 'ACTIVE' },
    { id: 'u-2', name: 'Dr. Nusrat Jahan', email: 'nusrat@citizen.bd', role: 'CITIZEN', reports: 6, status: 'ACTIVE' },
    { id: 'u-auth-1', name: 'Engr. Mahbubur Rahman', email: 'm.rahman@dncc.gov.bd.demo', role: 'AUTHORITY', department: 'DNCC Zone 4', status: 'ACTIVE' },
    { id: 'u-mod-1', name: 'Civic Moderator Team', email: 'moderation@nagarchitra.org', role: 'MODERATOR', status: 'ACTIVE' },
  ]);

  const filteredIssues = issues.filter((i) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.trackingNumber.toLowerCase().includes(q) ||
        i.reportedBy.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#041411] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  ADMIN & MODERATION CONSOLE
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a2e27] border border-[#144b40] text-xs text-emerald-300">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="text-[11px] font-semibold">
                    {isConnected
                      ? language === 'bn'
                        ? `লাইভ সকেট · ${onlineCount} নাগরিক সক্রিয়`
                        : `Live Socket · ${onlineCount} Online`
                      : 'Connecting...'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-bangla text-white tracking-tight">
                {t('Platform Moderation & System Controls', 'প্ল্যাটফর্ম মডারেশন ও সিস্টেম নিয়ন্ত্রণ')}
              </h1>
              <p className="text-xs text-slate-300 font-bangla">
                {t(
                  'Moderate public submissions, audit role permissions, and maintain data integrity.',
                  'নাগরিক রিপোর্ট মডারেশন, রোল পারমিশন অডিট এবং তথ্যের সত্যতা নিশ্চিতকরণ।'
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard?role=admin"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs font-bangla transition shadow"
              >
                রোল ড্যাশবোর্ড হাব →
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#0f3b33] pb-3 overflow-x-auto">
          {[
            { id: 'issues', label: t('Issue Moderation', 'ইস্যু মডারেশন'), icon: FileCheck },
            { id: 'users', label: t('User & Authority Roles', 'ব্যবহারকারী ও রোল'), icon: Users },
            { id: 'categories', label: t('Categories & SLAs', 'ক্যাটাগরি ও এসএলএ'), icon: Layers },
            { id: 'audit', label: t('Master Audit Log', 'মাস্টার অডিট লগ'), icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-bangla transition whitespace-nowrap ${
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

        {/* TAB 1: Issue Moderation */}
        {activeTab === 'issues' && (
          <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-white font-bangla">
                  {t('Active Moderation Queue', 'সক্রিয় মডারেশন কিউ')} ({issues.length} {t('Issues', 'ইস্যু')})
                </h3>
                <span className="text-xs text-slate-400 font-bangla">
                  {t('Review for abuse, spam or duplication', 'অপব্যবহার, স্প্যাম বা ডুপ্লিকেট যাচাই')}
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#041a16] border border-[#0f3b33] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#041a16] border-y border-[#0f3b33] text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3">{t('Tracking ID', 'ট্র্যাকিং আইডি')}</th>
                    <th className="px-4 py-3">{t('Issue Title', 'সমস্যার শিরোনাম')}</th>
                    <th className="px-4 py-3">{t('Reported By', 'রিপোর্টার')}</th>
                    <th className="px-4 py-3">{t('Severity', 'গুরুত্ব')}</th>
                    <th className="px-4 py-3">{t('Current Status', 'বর্তমান অবস্থা')}</th>
                    <th className="px-4 py-3 text-right">{t('Moderation Actions', 'মডারেশন অ্যাকশন')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0b2f28]">
                  {filteredIssues.map((i) => (
                    <tr key={i.id} className="hover:bg-[#092e27] transition">
                      <td className="px-4 py-3 font-mono font-bold text-accent">
                        #{i.trackingNumber}
                      </td>
                      <td className="px-4 py-3 font-bold text-white max-w-xs truncate font-bangla">
                        <Link href={`/issues/${i.id}`} className="hover:text-accent transition">
                          {i.titleBn || i.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-bangla">{i.reportedBy.name}</td>
                      <td className="px-4 py-3 font-bold">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${i.severity === 'CRITICAL' ? 'bg-red-900/60 text-red-300' : 'bg-[#0b332b] text-emerald-300'}`}>
                          {i.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-[#041a16] border border-[#0f3b33] text-slate-200 text-[10px] font-bold">
                          {i.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() =>
                            updateIssueStatus(
                              i.id,
                              'VERIFIED',
                              'Approved by Platform Moderator as genuine civic defect.'
                            )
                          }
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded font-black text-xs font-bangla transition"
                        >
                          অনুমোদন
                        </button>
                        <button
                          onClick={() =>
                            updateIssueStatus(
                              i.id,
                              'REJECTED',
                              'Rejected by Moderator: Inappropriate or unverifiable submission.'
                            )
                          }
                          className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded font-bold text-xs font-bangla transition"
                        >
                          বাতিল
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: User Roles */}
        {activeTab === 'users' && (
          <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-base text-white font-bangla">
              নিবন্ধিত পারসোনা ও কর্মকর্তা তালিকা
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#041a16] border-y border-[#0f3b33] text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3">User Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Assigned Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0b2f28]">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#092e27] transition">
                      <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 font-bold border border-purple-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-400">{u.status}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-accent hover:underline font-bold">
                          Manage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Categories & SLA */}
        {activeTab === 'categories' && (
          <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-base text-white font-bangla">
              ক্যাটাগরি ও এসএলএ কনফিগারেশন
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ISSUE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-[#0f3b33] bg-[#051e19] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{cat.name}</span>
                    <span className="font-mono text-accent font-bold">{cat.slaDays}d SLA</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-bangla">{cat.nameBn}</p>
                  <span className="text-[10px] text-slate-500 block">{cat.group}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Master Audit Log */}
        {activeTab === 'audit' && (
          <div className="bg-[#072520] border border-[#0f3b33] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-base text-white font-bangla">
              মাস্টার রিয়েল-টাইম অডিট ট্রেইল
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {issues
                .flatMap((i) =>
                  i.timeline.map((t) => ({ ...t, trackingNumber: i.trackingNumber, title: i.titleBn || i.title }))
                )
                .slice(0, 10)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-[#041a16] border border-[#0f3b33] flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-accent font-bold">
                        #{entry.trackingNumber}
                      </span>
                      <span className="text-slate-300 font-bangla">{entry.title}:</span>
                      <span className="text-slate-400 font-bangla">{entry.noteBn || entry.note}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      দ্বারা {entry.changedBy} ({new Date(entry.createdAt).toLocaleTimeString()})
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
