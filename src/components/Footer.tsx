'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  ArrowRight,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#061F1B] text-slate-300 pt-14 pb-8 border-t border-[#0F352F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-slate-950 font-black shadow-md">
                <MapPin className="w-4 h-4 fill-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-bangla font-black text-xl leading-none text-white tracking-tight">
                  নগরচিত্র
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-accent/90">
                  NagarChitra
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              See the Problem. Report the Problem. Track the Change.
              <br />
              <span className="font-bangla text-slate-400">
                নাগরিক সমস্যার উন্মুক্ত ট্র্যাকিং ও সমাধানের নির্ভরযোগ্য প্ল্যাটফর্ম।
              </span>
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1 text-slate-400">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#0E2E29] flex items-center justify-center hover:text-white hover:bg-accent hover:text-slate-900 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#0E2E29] flex items-center justify-center hover:text-white hover:bg-accent hover:text-slate-900 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#0E2E29] flex items-center justify-center hover:text-white hover:bg-accent hover:text-slate-900 transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#0E2E29] flex items-center justify-center hover:text-white hover:bg-accent hover:text-slate-900 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bangla font-bold text-sm text-white">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2 text-xs font-bangla text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition">হোম</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition">ম্যাপ</Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition">রিপোর্ট করুন</Link>
              </li>
              <li>
                <Link href="/nagar/mirpur" className="hover:text-white transition">এলাকা</Link>
              </li>
              <li>
                <Link href="/authority" className="hover:text-white transition">পরিসংখ্যান</Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bangla font-bold text-sm text-white">সাহায্য</h4>
            <ul className="space-y-2 text-xs font-bangla text-slate-400">
              <li>
                <Link href="/about/how-it-works" className="hover:text-white transition">FAQ</Link>
              </li>
              <li>
                <Link href="/about/data-methodology" className="hover:text-white transition">ব্যবহারবিধি</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">গোপনীয়তার নীতি</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">যোগাযোগ</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe & BD Map Graphic */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bangla font-bold text-sm text-white">
              নিউজলেটার সাবস্ক্রাইব করুন
            </h4>
            <p className="text-xs font-bangla text-slate-400">
              আপডেটেড পেতে আপনার ইমেইল দিন
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full bg-[#0D2E29] border border-[#16423B] px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent font-bangla"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-accent text-slate-950 font-bold hover:bg-accent-hover transition flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-accent font-bangla block">
                ✓ ধন্যবাদ! সাবস্ক্রিপশন সম্পন্ন হয়েছে।
              </span>
            )}

            {/* Bangladesh Map Mini-Graphic Accent */}
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 rounded-lg bg-[#0C2A25] border border-[#17433B] flex items-center justify-center p-1.5">
                <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-500 fill-current opacity-80">
                  <path d="M45,15 Q55,10 65,18 Q75,25 72,38 Q68,48 78,58 Q85,68 75,80 Q65,92 50,88 Q35,85 28,72 Q20,60 25,45 Q30,30 45,15 Z" />
                  <circle cx="52" cy="50" r="14" className="text-red-500 fill-current" />
                </svg>
              </div>
              <span className="text-[11px] font-bangla text-slate-400">
                একটি রূপরেখা <br />
                <strong className="text-white">বাংলাদেশের জন্য</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#0F352F] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 NagarChitra. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-semibold text-slate-300">
              <button
                onClick={() => setLanguage('en')}
                className={`hover:text-white ${language === 'en' ? 'text-accent font-bold' : ''}`}
              >
                EN
              </button>
              <span>|</span>
              <button
                onClick={() => setLanguage('bn')}
                className={`font-bangla hover:text-white ${language === 'bn' ? 'text-accent font-bold' : ''}`}
              >
                বাংলা
              </button>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>for Bangladesh</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
