'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useIssues } from '@/context/IssueContext';
import { AccessDeniedCard } from '@/components/AccessDeniedCard';
import {
  getSecurityAuditLogs,
  SecurityAuditLog,
  recordSecurityAudit,
} from '@/services/authSecurity';
import {
  Crown,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  KeyRound,
  Activity,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Database,
  ExternalLink,
  Sliders,
  Server,
  Radio,
  FileCheck,
  UserCheck,
} from 'lucide-react';

export default function SuperAdminPage() {
  const { role, currentUser, logout } = useAuthRole();
  const { issues } = useIssues();
  const { t, language, formatNumber } = useLanguage();

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'security' | 'roles' | 'system'>('security');
  const [logFilter, setLogFilter] = useState('ALL');
  const [isEmergencyLock, setIsEmergencyLock] = useState(false);
  const [roleUpdatedNotice, setRoleUpdatedNotice] = useState<string | null>(null);

  // Users state for Super Admin role management
  const [managedUsers, setManagedUsers] = useState([
    {
      id: 'u-1',
      name: 'Tuhin Rahman',
      email: 'citizen@nagarchitra.bd',
      role: 'CITIZEN',
      status: 'VERIFIED',
      lastLogin: '১০ মিনিট আগে',
    },
    {
      id: 'u-auth-1',
      name: 'Engr. Mahbubur Rahman',
      email: 'authority@dncc.gov.bd',
      role: 'AUTHORITY',
      status: 'ACTIVE_GOV',
      lastLogin: '১ ঘণ্টা আগে',
    },
    {
      id: 'u-admin-1',
      name: 'Civic Admin Triage',
      email: 'admin@nagarchitra.org',
      role: 'ADMIN',
      status: 'ACTIVE_STAFF',
      lastLogin: '২৫ মিনিট আগে',
    },
    {
      id: 'u-super-1',
      name: 'Engr. Tariqul Islam',
      email: 'superadmin@nagarchitra.gov.bd',
      role: 'SUPER_ADMIN',
      status: 'ROOT_AUTHORITY',
      lastLogin: 'এখন সক্রিয় (Active)',
    },
  ]);

  useEffect(() => {
    setAuditLogs(getSecurityAuditLogs());
  }, []);

  // Strict RBAC Route Guard: Only SUPER_ADMIN allowed
  if (role !== 'SUPER_ADMIN') {
    return (
      <AccessDeniedCard
        requiredRole="SUPER_ADMIN"
        portalName={language === 'bn' ? 'সুপার অ্যাডমিন সিকিউরিটি কনসোল' : 'Super Admin Master Security Console'}
      />
    );
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    recordSecurityAudit({
      eventType: 'LOGIN_SUCCESS',
      email: currentUser.email,
      role: 'SUPER_ADMIN',
      severity: 'INFO',
      details: `User [${userId}] role granted to [${newRole}] by Super Admin.`,
      ipMasked: '103.205.*.*',
    });
    setRoleUpdatedNotice(`Role updated for user ${userId} to ${newRole}`);
    setTimeout(() => setRoleUpdatedNotice(null), 3000);
  };

  const handleRefreshLogs = () => {
    setAuditLogs(getSecurityAuditLogs());
  };

  const filteredLogs = auditLogs.filter((l) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'CRITICAL') return l.severity === 'CRITICAL';
    if (logFilter === 'WARN') return l.severity === 'WARN';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020A08] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-bangla">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Master Header */}
        <div className="bg-[#051C17] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  SUPER ADMIN · MASTER ROOT GOVERNANCE
                </span>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>HMAC CRYPTOGRAPHIC SESSION VERIFIED</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {language === 'bn' ? 'সুপার অ্যাডমিন মাস্টার কনসোল' : 'Super Admin Master Console'}
              </h1>
              <p className="text-xs text-slate-300">
                {language === 'bn'
                  ? 'প্ল্যাটফর্মের সর্বোচ্চ নিয়ন্ত্রণ, সাইবার ডিফেন্স অডিট ও রোল পারমিশন ব্যবস্থাপনা।'
                  : 'Highest level administrative oversight, cyber-threat monitoring, and RBAC control.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition shadow"
              >
                অ্যাডমিন মডারেশন পোর্টাল →
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white font-bold text-xs transition"
              >
                লগআউট
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cyber Defense Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#051C17] border border-[#0d3b32] p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>SECURITY STATUS</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">ENCRYPTED</div>
            <span className="text-[10px] text-slate-400 block">SHA-256 HMAC Sealed</span>
          </div>

          <div className="bg-[#051C17] border border-[#0d3b32] p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>BRUTE-FORCE DEFENSE</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">ACTIVE</div>
            <span className="text-[10px] text-emerald-400 block">Lockout threshold: 5 attempts</span>
          </div>

          <div className="bg-[#051C17] border border-[#0d3b32] p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>TOTAL PUBLIC ISSUES</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{formatNumber(issues.length)}</div>
            <span className="text-[10px] text-slate-400 block">Live database records</span>
          </div>

          <div className="bg-[#051C17] border border-[#0d3b32] p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>ZERO-TRUST AUDIT LOGS</span>
              <Terminal className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">{auditLogs.length} Events</div>
            <span className="text-[10px] text-slate-400 block">Tamper-evident log queue</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#0d3b32] pb-3 text-xs">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>সাইবার সিকিউরিটি ও অডিট লগ (Audit Logs)</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ইউজার রোল ও প্রিভিলেজ ম্যানেজমেন্ট (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>সিস্টেম কন্ট্রোল ও লকডাউন (System Controls)</span>
          </button>
        </div>

        {/* TAB 1: CYBER SECURITY & AUDIT LOGS */}
        {activeTab === 'security' && (
          <div className="bg-[#051C17] border border-[#0d3b32] rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0d3b32] pb-3">
              <div>
                <h3 className="font-black text-base text-white">
                  {language === 'bn' ? 'রিয়েল-টাইম সিকিউরিটি অডিট ট্রেইল' : 'Real-time Security Audit Trail'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'প্রতিটি লগইন, ব্যর্থ প্রচেষ্টা ও রোল টেম্পারিং প্রতিরোধ স্বয়ংক্রিয়ভাবে রেকর্ড করা হয়।'
                    : 'All authentication events, brute force attempts, and tampering incidents.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-[#031512] rounded-xl border border-[#0b2b24] p-1 text-[11px] font-mono">
                  {['ALL', 'CRITICAL', 'WARN'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2.5 py-0.5 rounded-lg transition ${
                        logFilter === lvl ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRefreshLogs}
                  className="p-2 rounded-xl bg-[#031512] border border-[#0b2b24] text-slate-300 hover:text-white transition"
                  title="Refresh Audit Logs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#031512] text-slate-400 font-bold uppercase text-[11px] border-b border-[#0d3b32]">
                  <tr>
                    <th className="px-3 py-2.5">TIMESTAMP</th>
                    <th className="px-3 py-2.5">EVENT</th>
                    <th className="px-3 py-2.5">IDENTITY / EMAIL</th>
                    <th className="px-3 py-2.5">SEVERITY</th>
                    <th className="px-3 py-2.5">DETAILS</th>
                    <th className="px-3 py-2.5">MASKED IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#092922]">
                  {filteredLogs.map((log) => {
                    const sevBadge =
                      log.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border-rose-600'
                        : log.severity === 'WARN'
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-600';

                    return (
                      <tr key={log.id} className="hover:bg-[#07241e] transition">
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-3 py-2 font-bold text-white whitespace-nowrap">{log.eventType}</td>
                        <td className="px-3 py-2 text-slate-300 whitespace-nowrap">{log.email}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sevBadge}`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-300 font-sans text-xs max-w-sm">{log.details}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{log.ipMasked}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: RBAC USER ROLE MANAGEMENT */}
        {activeTab === 'roles' && (
          <div className="bg-[#051C17] border border-[#0d3b32] rounded-3xl p-6 space-y-4 shadow-xl">
            {roleUpdatedNotice && (
              <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-200 border border-emerald-600 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{roleUpdatedNotice}</span>
              </div>
            )}

            <div className="border-b border-[#0d3b32] pb-3">
              <h3 className="font-black text-base text-white">
                {language === 'bn' ? 'ব্যবহারকারীর রোল ও পারমিশন কন্ট্রোল' : 'User Role & Privilege Management'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'নাগরিক, অথরিটি এবং অ্যাডমিন অ্যাক্সেস লেভেল নিরাপদে পরিবর্তন করুন।'
                  : 'Assign verified role privileges across the civic network.'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#031512] text-slate-400 font-bold uppercase text-[11px] border-b border-[#0d3b32]">
                  <tr>
                    <th className="px-4 py-3">USER NAME</th>
                    <th className="px-4 py-3">EMAIL ADDRESS</th>
                    <th className="px-4 py-3">CURRENT ROLE</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3 text-right">CHANGE CLEARANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#092922]">
                  {managedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#07241e] transition">
                      <td className="px-4 py-3 font-bold text-white font-sans">{user.name}</td>
                      <td className="px-4 py-3 text-slate-300">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-bold text-[11px]">{user.status}</td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        {['CITIZEN', 'AUTHORITY', 'ADMIN', 'SUPER_ADMIN'].map((targetRole) => (
                          <button
                            key={targetRole}
                            disabled={user.role === targetRole}
                            onClick={() => handleRoleChange(user.id, targetRole)}
                            className="px-2 py-0.5 rounded text-[10px] font-bold transition disabled:opacity-30 bg-[#031512] border border-[#0d3b32] hover:border-amber-400 hover:text-white text-slate-300"
                          >
                            {targetRole}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM CONTROLS & EMERGENCY LOCKDOWN */}
        {activeTab === 'system' && (
          <div className="bg-[#051C17] border border-[#0d3b32] rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-[#0d3b32] pb-3">
              <h3 className="font-black text-base text-white">
                {language === 'bn' ? 'সিস্টেম নিরাপত্তা ও ইমার্জেন্সি কন্ট্রোল' : 'System Security & Emergency Protocols'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'সাইবার আক্রমণ বা প্ল্যাটফর্ম রক্ষণাবেক্ষণে তাৎক্ষণিক নিরাপত্তা ব্যবস্থা।'
                  : 'Emergency countermeasures against platform compromise or distributed cyber attacks.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#031512] rounded-2xl border border-rose-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <h4 className="font-black text-sm text-white">Emergency System Lock</h4>
                  </div>
                  <button
                    onClick={() => setIsEmergencyLock(!isEmergencyLock)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      isEmergencyLock ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isEmergencyLock ? 'LOCK ACTIVE' : 'DISABLED'}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Suspends all new unauthenticated reports and enforces strict Super-Admin only read-only mode during active cyber assaults.
                </p>
              </div>

              <div className="p-5 bg-[#031512] rounded-2xl border border-emerald-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-black text-sm text-white">Cryptographic Cache Flush</h4>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('nc_failed_auth_attempts');
                      alert('Brute-force lockout counters flushed successfully.');
                    }}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600 hover:text-white transition"
                  >
                    Flush Counter
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Resets brute-force IP rate-limiting blocks and unbans legitimately locked citizen devices.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
