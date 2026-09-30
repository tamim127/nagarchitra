'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { UserRole } from '@/types';
import {
  Shield,
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  Crown,
  Sparkles,
  AlertCircle,
  Clock,
  MapPin,
} from 'lucide-react';

const PRESET_ACCOUNTS = [
  {
    role: 'CITIZEN' as UserRole,
    labelBn: 'নাগরিক',
    labelEn: 'Citizen',
    email: 'citizen@nagarchitra.bd',
    password: 'Citizen@2026!',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    icon: User,
    descBn: 'নাগরিক সমস্যা রিপোর্ট ও যাচাইকরণ',
    descEn: 'Public reporting & civic verification',
  },
  {
    role: 'AUTHORITY' as UserRole,
    labelBn: 'কর্তৃপক্ষ / কর্মকর্তা',
    labelEn: 'Authority Officer',
    email: 'authority@dncc.gov.bd',
    password: 'DhakaZone4@2026!',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    icon: Building2,
    descBn: 'ওয়ার্ক-অর্ডার, মেরামত ও সমাধান প্রমাণ',
    descEn: 'Zonal engineering & resolution dispatch',
  },
  {
    role: 'ADMIN' as UserRole,
    labelBn: 'অ্যাডমিনিস্ট্রেটর',
    labelEn: 'System Admin',
    email: 'admin@nagarchitra.org',
    password: 'AdminPass@2026!',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    icon: Shield,
    descBn: 'মডারেশন, স্প্যাম ফিল্টারিং ও অডিট',
    descEn: 'Content moderation & triage management',
  },
  {
    role: 'SUPER_ADMIN' as UserRole,
    labelBn: 'সুপার অ্যাডমিন',
    labelEn: 'Super Admin (Root)',
    email: 'superadmin@nagarchitra.gov.bd',
    password: 'SuperAdmin@Dhaka#2026!',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    icon: Crown,
    descBn: 'সম্পূর্ণ সিস্টেম ও সাইবার নিরাপত্তা নিয়ন্ত্রণ',
    descEn: 'Master cryptographic root governance',
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthRole();
  const { t, language } = useLanguage();

  const redirectUrl = searchParams.get('redirect');

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('CITIZEN');
  const [email, setEmail] = useState('citizen@nagarchitra.bd');
  const [password, setPassword] = useState('Citizen@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRoleTab(role);
    const found = PRESET_ACCOUNTS.find((a) => a.role === role);
    if (found) {
      setEmail(found.email);
      setPassword(found.password);
    }
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = login(email, password, activeRoleTab);
    setIsLoading(false);

    if (res.success) {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (activeRoleTab === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else if (activeRoleTab === 'ADMIN') {
        router.push('/admin');
      } else if (activeRoleTab === 'AUTHORITY') {
        router.push('/authority');
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed');
      if (res.isLocked) {
        setIsLocked(true);
        setRemainingMinutes(res.remainingMinutes || 15);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020F0C] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-bangla relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        {/* Brand Icon */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0c4a45] to-accent flex items-center justify-center text-slate-950 font-black shadow-lg shadow-accent/20 group-hover:scale-105 transition">
            <MapPin className="w-6 h-6 text-slate-900 fill-slate-900" />
          </div>
        </Link>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'bn' ? 'সুরক্ষিত লগইন পোর্টাল' : 'Secure Authentication Portal'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'ক্রিপ্টোগ্রাফিক টোকেন ও সাইবার সিকিউরিটি দ্বারা সুরক্ষিত'
              : 'Cryptographically sealed session with RBAC access control'}
          </p>
        </div>

        {/* Security Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span>256-BIT ENCRYPTED · HMAC SIGNED</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-[#051C17]/95 backdrop-blur-md border border-[#0f3d35] py-7 px-5 sm:px-8 rounded-3xl shadow-2xl space-y-6">
          {/* Role Selection Tabs */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'bn' ? 'অ্যাক্সেস রোল নির্বাচন করুন:' : 'Select Login Role Clearance:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_ACCOUNTS.map((account) => {
                const isSelected = activeRoleTab === account.role;
                const IconC = account.icon;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleRoleTabChange(account.role)}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0A2E26] border-accent text-white shadow-sm ring-1 ring-accent/40'
                        : 'bg-[#031512] border-[#0a2923] text-slate-400 hover:text-white hover:bg-[#07241e]'
                    }`}
                  >
                    <IconC className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-extrabold leading-tight">
                      {language === 'bn' ? account.labelBn : account.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick preset credentials helper */}
          <div className="p-3 bg-[#031512] rounded-2xl border border-[#0b2b24] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">
                {language === 'bn' ? 'স্বয়ংক্রিয় প্রিসেট অ্যাকাউন্ট:' : 'Auto-Filled Test Account:'}
              </span>
              <span className="font-bold text-slate-200 text-[11px] font-mono">{email}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold font-mono">
              Ready
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {language === 'bn' ? 'প্রবেশাধিকার ব্যর্থ' : 'Authentication Denied'}
                </span>
                <p className="text-[11px] leading-snug">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'অ্যাকাউন্ট ইমেইল' : 'Account Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'গোপন পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-400 text-slate-950 font-black text-xs transition shadow-md shadow-accent/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>
                {language === 'bn'
                  ? `${activeRoleTab === 'SUPER_ADMIN' ? 'সুপার অ্যাডমিন হিসেবে ' : ''}লগইন করুন`
                  : `Authenticate as ${activeRoleTab}`}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </button>
          </form>

          {/* Bottom Register & Security Footer */}
          <div className="pt-4 border-t border-[#0b2b24] flex items-center justify-between text-xs text-slate-400">
            <span>
              {language === 'bn' ? 'অ্যাকাউন্ট নেই?' : 'No account?'}{' '}
              <Link href="/register" className="text-accent hover:underline font-bold">
                {language === 'bn' ? 'নাগরিক নিবন্ধন' : 'Register as Citizen'}
              </Link>
            </span>

            <Link href="/" className="hover:text-white transition">
              {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020F0C] flex items-center justify-center text-slate-300 text-sm">
          <span>Loading secure portal...</span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
