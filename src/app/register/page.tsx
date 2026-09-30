'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Shield,
  User,
  Mail,
  KeyRound,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthRole();
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Mirpur 10, Dhaka');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg(language === 'bn' ? 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(language === 'bn' ? 'শর্তাবলী মেনে নেওয়া বাধ্যতামূলক।' : 'You must accept the terms of service.');
      return;
    }

    setIsLoading(true);
    const res = register(name, email, password, location);
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020F0C] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-bangla relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0c4a45] to-accent flex items-center justify-center text-slate-950 font-black shadow-lg shadow-accent/20 group-hover:scale-105 transition">
            <MapPin className="w-6 h-6 text-slate-900 fill-slate-900" />
          </div>
        </Link>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'bn' ? 'সচেতন নাগরিক নিবন্ধন' : 'Citizen Registration'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'শহরের সমস্যা রিপোর্ট ও সমাধানে অংশ নিতে অ্যাকাউন্ট খুলুন'
              : 'Join NagarChitra to report issues and verify public resolutions'}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#051C17]/95 backdrop-blur-md border border-[#0f3d35] py-7 px-5 sm:px-8 rounded-3xl shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'বাসস্থান / এলাকা' : 'Residential Area'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="যেমন: মিরপুর ১০, ঢাকা"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিতকরণ' : 'Confirm'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#031512] border border-[#103d35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-accent focus:ring-accent"
              />
              <label htmlFor="terms">
                {language === 'bn' ? (
                  <>আমি নগরচিত্রের <Link href="/terms" className="text-accent underline">ব্যবহারের শর্তাবলী</Link> মেনে নিচ্ছি।</>
                ) : (
                  <>I agree to NagarChitra&apos;s <Link href="/terms" className="text-accent underline">Terms of Service</Link>.</>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{language === 'bn' ? 'নিবন্ধন সম্পন্ন করুন' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-3 border-t border-[#0b2b24] text-center text-xs text-slate-400">
            <span>
              {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <Link href="/login" className="text-accent hover:underline font-bold">
                {language === 'bn' ? 'লগইন করুন' : 'Login'}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
