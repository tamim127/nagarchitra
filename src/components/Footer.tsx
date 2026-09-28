'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-lg">
                <span className="text-accent">ন</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Nagar<span className="text-accent">Chitra</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'A citizen-driven civic intelligence and public issue resolution tracking platform for Bangladesh. Turning complaints into auditable actions.',
                'বাংলাদেশের প্রথম নাগরিক-চালিত সমস্যা নিরসন ও জবাবদিহিতা প্ল্যাটফর্ম। অভিযোগকে রূপান্তর করুন কার্যকর পদক্ষেপে।'
              )}
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                {t('Independent Civic-Tech Initiative', 'স্বাধীন নাগরিক উদ্যোগ')}
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              {t('Civic Modules', 'নাগরিক সেবা')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-white transition">
                  {t('Explore Civic Map', 'ইন্টারেক্টিভ ঢাকা ম্যাপ')}
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition">
                  {t('Report a Problem', 'সমস্যার রিপোর্ট জমা')}
                </Link>
              </li>
              <li>
                <Link href="/nagar/mirpur" className="hover:text-white transition">
                  {t('Mirpur Area Pulse', 'মিরপুর এলাকা মেট্রিক্স')}
                </Link>
              </li>
              <li>
                <Link href="/nagar/dhanmondi" className="hover:text-white transition">
                  {t('Dhanmondi Area Pulse', 'ধানমন্ডি এলাকা মেট্রিক্স')}
                </Link>
              </li>
              <li>
                <Link href="/authority" className="hover:text-white transition">
                  {t('Authority Operations', 'কর্তৃপক্ষ ওয়ার্কস্পেস')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Open Data & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              {t('Transparency & Data', 'স্বচ্ছতা ও মুক্ত তথ্য')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/open-data" className="hover:text-white transition">
                  {t('Open Civic Datasets (CSV/JSON)', 'মুক্ত নাগরিক ডেটাসেট')}
                </Link>
              </li>
              <li>
                <Link href="/about/data-methodology" className="hover:text-white transition">
                  {t('Data Verification Methodology', 'তথ্য যাচাই পদ্ধতি')}
                </Link>
              </li>
              <li>
                <Link href="/about/how-it-works" className="hover:text-white transition">
                  {t('10-Stage Lifecycle Workflow', '১০ ধাপের সমস্যা সমাধান চক্র')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  {t('Moderation & Integrity', 'মডারেশন ও অডিট লগ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Pledge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              {t('Civic Principle', 'নাগরিক অঙ্গীকার')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {t(
                'Evidence over accusation. Verified resolution by residents before closing. Built to assist city corporations with actionable ground data.',
                'অনুমানের বদলে তথ্যপ্রমাণ। বন্ধ করার পূর্বে স্থানীয় নাগরিকদের মতামত গ্রহণ। নগর প্রশাসনকে মাঠপর্যায়ের সুনির্দিষ্ট তথ্যে সহায়তা।'
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>for Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 NagarChitra (নগরচিত্র) BD. Prototype release for civic demonstration.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition">
              Terms of Use
            </Link>
            <Link href="/about/data-methodology" className="hover:text-slate-400 transition">
              Methodology
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
