'use client';

import React, { useState } from 'react';
import { useIssues } from '@/context/IssueContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { ISSUE_CATEGORIES } from '@/data/categories';
import { DHAKA_AREAS } from '@/data/areas';
import {
  Shield,
  Users,
  Layers,
  MapPin,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { issues, updateIssueStatus } = useIssues();
  const { role, setRole, currentUser } = useAuthRole();
  const { t, language, formatNumber } = useLanguage();

  const [activeTab, setActiveTab] = useState<'issues' | 'users' | 'categories' | 'audit'>('issues');

  // Sample users list for admin review
  const [usersList] = useState([
    { id: 'u-1', name: 'Tanvir Hossain', email: 'tanvir@citizen.bd', role: 'CITIZEN', reports: 14, status: 'ACTIVE' },
    { id: 'u-2', name: 'Dr. Nusrat Jahan', email: 'nusrat@citizen.bd', role: 'CITIZEN', reports: 6, status: 'ACTIVE' },
    { id: 'u-auth-1', name: 'Engr. Mahbubur Rahman', email: 'm.rahman@dncc.gov.bd.demo', role: 'AUTHORITY', department: 'DNCC Zone 4', status: 'ACTIVE' },
    { id: 'u-mod-1', name: 'Civic Moderator Team', email: 'moderation@nagarchitra.org', role: 'MODERATOR', status: 'ACTIVE' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              System Administration
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
              ADMIN CONSOLE
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('Platform Moderation & System Controls', 'প্ল্যাটফর্ম মডারেশন ও সিস্টেম নিয়ন্ত্রণ')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('Moderate public submissions, audit role permissions, and maintain data integrity.', 'নাগরিক রিপোর্ট মডারেশন, রোল পারমিশন অডিট এবং তথ্যের সত্যতা নিশ্চিতকরণ।')}
          </p>
        </div>

        {role !== 'ADMIN' && (
          <button
            onClick={() => setRole('ADMIN')}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow"
          >
            {t('Switch to Admin Persona', 'অ্যাডমিন মোডে যান')}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'issues', label: t('Issue Moderation', 'ইস্যু মডারেশন'), icon: FileCheck },
          { id: 'users', label: t('User & Authority Roles', 'ব্যবহারকারী ও রোল'), icon: Users },
          { id: 'categories', label: t('Categories & SLAs', 'ক্যাটাগরি ও এসএলএ'), icon: Layers },
          { id: 'audit', label: t('Master Audit Log', 'মাস্টার অডিট লগ'), icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              {t('Active Moderation Queue', 'সক্রিয় মডারেশন কিউ')} ({issues.length} {t('Issues', 'ইস্যু')})
            </h3>
            <span className="text-xs text-slate-500">{t('Review for abuse, spam or duplication', 'অপব্যবহার, স্প্যাম বা ডুপ্লিকেট যাচাই')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">{t('Tracking ID', 'ট্র্যাকিং আইডি')}</th>
                  <th className="px-4 py-3">{t('Issue Title', 'সমস্যার শিরোনাম')}</th>
                  <th className="px-4 py-3">{t('Reported By', 'রিপোর্টার')}</th>
                  <th className="px-4 py-3">{t('Severity', 'গুরুত্ব')}</th>
                  <th className="px-4 py-3">{t('Current Status', 'বর্তমান অবস্থা')}</th>
                  <th className="px-4 py-3 text-right">{t('Moderation Actions', 'মডারেশন অ্যাকশন')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-600">
                      #{i.trackingNumber}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 max-w-xs truncate">
                      {i.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{i.reportedBy.name}</td>
                    <td className="px-4 py-3 font-bold">{i.severity}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
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
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() =>
                          updateIssueStatus(
                            i.id,
                            'REJECTED',
                            'Rejected by Moderator: Inappropriate or unverifiable submission.'
                          )
                        }
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-bold"
                      >
                        Reject
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Registered Personas & Authority Directory
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{u.status}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-slate-400 hover:text-slate-700 font-bold">
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Civic Categories & SLA Target Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ISSUE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{cat.name}</span>
                  <span className="font-mono text-primary font-bold">{cat.slaDays}d SLA</span>
                </div>
                <p className="text-slate-500 text-[11px]">{cat.nameBn}</p>
                <span className="text-[10px] text-slate-400 block">{cat.group}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Master Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Immutable Audit Trail Across All Dhaka Issues
          </h3>

          <div className="space-y-3">
            {issues
              .flatMap((i) =>
                i.timeline.map((t) => ({ ...t, trackingNumber: i.trackingNumber, title: i.title }))
              )
              .slice(0, 10)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-mono font-bold text-primary mr-2">
                      #{entry.trackingNumber}
                    </span>
                    <span className="font-bold text-slate-900">{entry.changedBy}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600">{entry.note}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
