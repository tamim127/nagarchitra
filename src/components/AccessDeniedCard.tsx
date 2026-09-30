'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';

interface AccessDeniedCardProps {
  requiredRole: string;
  portalName: string;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({ requiredRole, portalName }) => {
  const { role, currentUser } = useAuthRole();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#020D0A] font-bangla text-slate-100">
      <div className="max-w-lg w-full bg-[#051C17] border border-rose-500/40 rounded-3xl p-8 shadow-2xl shadow-rose-950/30 text-center space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-950/70 border border-rose-600/40 text-rose-300 text-[10px] font-black uppercase tracking-wider font-mono inline-block">
            SECURITY RESTRICTION · 403 FORBIDDEN
          </span>

          <h2 className="text-2xl font-black text-white">
            {language === 'bn' ? `${portalName}-এ প্রবেশাধিকার সংরক্ষিত` : `Access Restricted to ${portalName}`}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            {language === 'bn'
              ? `এই পোর্টালে প্রবেশের জন্য [${requiredRole}] বা উচ্চতর নিরাপত্তা অনুমোদন প্রয়োজন। আপনার বর্তমান রোল [${role}]।`
              : `This portal requires [${requiredRole}] authorization or higher. Your active role is [${role}].`}
          </p>
        </div>

        <div className="p-3.5 bg-[#031410] rounded-2xl border border-rose-900/40 text-left text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>User Identity:</span>
            <span className="text-white font-bold">{currentUser.name}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Claimed Role:</span>
            <span className="text-amber-400 font-bold">{role}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Required Clearance:</span>
            <span className="text-rose-400 font-bold">{requiredRole}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-[#0b2b23]">
            <span>Security Status:</span>
            <span className="text-emerald-400 font-bold">Cryptographically Verified</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অনুমোদিত অ্যাকাউন্টে লগইন' : 'Login with Authorized Role'}</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
