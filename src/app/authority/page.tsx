'use client';

import React, { useState } from 'react';
import { useIssues } from '@/context/IssueContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { Issue, IssueStatus, IssueSeverity } from '@/types';
import Link from 'next/link';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Filter,
  FileCheck,
  Upload,
  Flame,
} from 'lucide-react';
import { getStatusBadgeStyle, getSeverityBadge } from '@/components/IssueCard';

export default function AuthorityDashboardPage() {
  const { issues, updateIssueStatus } = useIssues();
  const { role, setRole, currentUser } = useAuthRole();
  const { t, language } = useLanguage();

  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            {t(
              'Prototype Authority Workspace: Demonstrating departmental workflow, SLA monitoring, and resolution verification before official city integration.',
              'কর্তৃপক্ষ ওয়ার্কস্পেস ডেমো: বিভাগীয় কার্যক্রম, এসএলএ মনিটরিং ও সমাধান যাচাই প্রদর্শনের জন্য প্রস্তুত।'
            )}
          </span>
        </div>
        {role !== 'AUTHORITY' && (
          <button
            onClick={() => setRole('AUTHORITY')}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition"
          >
            Switch to Authority Persona
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {t('Departmental Operations Portal', 'বিভাগীয় অপারেশন পোর্টাল')}
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('Authority Issue Management', 'কর্তৃপক্ষ ওয়ার্কস্পেস ও টাস্ক কিউ')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <span className="font-bold text-slate-800">{currentUser.name}</span> ({currentUser.location})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/open-data"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Export CSV Dataset
          </Link>
        </div>
      </div>

      {/* SLA & Queue KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">Total Assigned</span>
          <div className="text-3xl font-black text-slate-900">{issues.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Dhaka Zones 1-5</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-purple-700 block mb-1">Under Review</span>
          <div className="text-3xl font-black text-purple-700">
            {issues.filter((i) => i.status === 'UNDER_REVIEW' || i.status === 'SUBMITTED').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting triage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-amber-600 block mb-1">In Progress</span>
          <div className="text-3xl font-black text-amber-600">
            {issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Crews on site</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-red-600 block mb-1">Critical SLA Queue</span>
          <div className="text-3xl font-black text-red-600">{criticalIssues.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">&lt; 24h deadline</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <span className="text-xs font-bold text-emerald-600 block mb-1">Resolved</span>
          <div className="text-3xl font-black text-emerald-600">
            {issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Proof uploaded</span>
        </div>
      </div>

      {/* Critical Priority Queue */}
      {criticalIssues.length > 0 && (
        <div className="bg-red-50/70 border border-red-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-red-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600 animate-pulse" />
              <span>{t('CRITICAL HAZARD QUEUE (Immediate Dispatch Required)', 'জরুরি বিপদ তালিকা')}</span>
            </h3>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
              {criticalIssues.length} Urgent Hazards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      CRITICAL RISK
                    </span>
                    <span className="text-slate-400 font-mono">#{issue.trackingNumber}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{issue.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">📍 {issue.location.address}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">
                    👍 {issue.communityConfirmations} citizens confirmed
                  </span>
                  <button
                    onClick={() => {
                      setSelectedIssueForAction(issue);
                      setNewStatus(issue.status === 'IN_PROGRESS' ? 'RESOLVED' : 'IN_PROGRESS');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-light transition"
                  >
                    Act on Issue →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Issue Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 pb-0 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-lg text-slate-900">
              {t('Assigned Public Issues Queue', 'কার্যক্রম তালিকা')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('Review reports, dispatch field engineers, and upload resolution proof.', 'রিপোর্ট যাচাই, ইঞ্জিনিয়ারদের দায়িত্ব অর্পণ ও সমাধানের প্রমাণ আপলোড।')}
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CITIZEN_VERIFICATION">CITIZEN_VERIFICATION</option>
              <option value="CLOSED">CLOSED</option>
              <option value="REOPENED">REOPENED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Issue & ID</th>
                <th className="px-4 py-3.5">Location / Area</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">SLA Target</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => {
                const statusBadge = getStatusBadgeStyle(issue.status);
                const severityBadge = getSeverityBadge(issue.severity);
                return (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <Link
                        href={`/issues/${issue.id}`}
                        className="font-bold text-slate-900 hover:text-primary transition line-clamp-1 max-w-xs"
                      >
                        {issue.title}
                      </Link>
                      <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                        #{issue.trackingNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700 whitespace-nowrap">
                      {issue.location.area}, {issue.location.ward}
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                      {issue.categoryName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadge.className}`}
                      >
                        {severityBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}
                      >
                        {issue.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap font-mono">
                      {issue.slaDays} Days
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
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
                        className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary-light transition shadow-sm"
                      >
                        Update Status
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">
                  #{selectedIssueForAction.trackingNumber}
                </span>
                <h3 className="font-extrabold text-base text-slate-900">
                  Workflow Action: {selectedIssueForAction.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIssueForAction(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Next Status:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW - Initial triage</option>
                  <option value="VERIFIED">VERIFIED - Approved by desk</option>
                  <option value="ASSIGNED">ASSIGNED - Dispatch to department</option>
                  <option value="IN_PROGRESS">IN_PROGRESS - Work crew mobilized</option>
                  <option value="RESOLVED">
                    RESOLVED - Work done (Triggers Citizen Verification)
                  </option>
                  <option value="CLOSED">CLOSED - Permanently closed</option>
                  <option value="REJECTED">REJECTED - Invalid or duplicate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Department:</label>
                  <input
                    type="text"
                    value={assignedDept}
                    onChange={(e) => setAssignedDept(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Assignee Officer:</label>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {newStatus === 'RESOLVED' && (
                <div className="space-y-1.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Resolution Evidence Photo (AFTER image):</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 bg-white"
                  />
                  <span className="text-[10px] text-emerald-700 block">
                    Citizens will inspect this proof and vote whether the issue is fixed.
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Action Note / Work Order Log:
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Detail actions taken, materials used, or crew assignment notes..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedIssueForAction(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-light shadow-sm"
                >
                  Save & Log Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
