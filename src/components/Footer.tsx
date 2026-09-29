'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin,
  Facebook,
  Youtube,
  Linkedin,
  ArrowRight,
  Heart,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      className="relative bg-[#02130F] text-slate-300 font-bangla overflow-hidden border-t border-[#0D3830]/60"
      aria-label="Footer"
    >
      {/* Background Image: Authentic Bangladeshi Civic Skyline Panorama */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/footer_bg.png"
          alt="NagarChitra civic skyline panorama"
          className="w-full h-full object-cover object-bottom filter brightness-[0.88] contrast-[1.08]"
        />

        {/* Subtle Dark Gradient Overlay for Maximum Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02130F]/92 via-[#031A15]/75 to-[#02130F]/30 z-1" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#010A08] to-transparent z-1" />
      </div>

      {/* SECTION 1 — MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* COLUMN 1 — BRAND (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B84B] rounded-lg"
              aria-label="NagarChitra Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2B84B] to-[#D49826] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#F2B84B]/20 group-hover:scale-105 transition-transform duration-200">
                <MapPin className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-bangla font-black text-2xl leading-none text-white tracking-tight">
                  {language === 'bn' ? 'নগরচিত্র' : 'NagarChitra'}
                </span>
                <span className="text-[10px] tracking-[0.24em] uppercase font-bold text-[#F2B84B] mt-1 font-sans">
                  NAGARCHITRA
                </span>
              </div>
            </Link>

            <h3 className="font-bangla font-bold text-base sm:text-lg text-white leading-snug">
              {t('footer.tagline')}
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed font-bangla max-w-sm">
              {t('footer.desc')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2" aria-label="Social media">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#F2B84B] hover:border-[#F2B84B] hover:-translate-y-0.5 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B84B]"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#F2B84B] hover:border-[#F2B84B] hover:-translate-y-0.5 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B84B]"
              >
                <span className="text-xs font-bold font-sans">𝕏</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#F2B84B] hover:border-[#F2B84B] hover:-translate-y-0.5 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B84B]"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-[#F2B84B] hover:border-[#F2B84B] hover:-translate-y-0.5 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B84B]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COLUMN 2 — দ্রুত লিংক (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bangla font-semibold text-white text-base tracking-wide">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm font-bangla text-slate-300">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('nav.home')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('nav.explore')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.report')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/nagar/mirpur"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('nav.areas')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/statistics"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('nav.statistics')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/open-data"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('nav.openData')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about/how-it-works"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.helpCenter')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — তথ্য ও সহায়তা (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bangla font-semibold text-white text-base tracking-wide">
              {t('footer.infoSupport')}
            </h4>
            <ul className="space-y-2.5 text-sm font-bangla text-slate-300">
              <li>
                <Link
                  href="/about/how-it-works"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.faq')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about/data-methodology"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.terms')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.privacy')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.contact')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about/how-it-works"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.reportingGuide')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about/data-methodology"
                  className="inline-flex items-center gap-1.5 hover:text-[#F2B84B] hover:translate-x-1 transition-all duration-200 focus-visible:outline-none focus-visible:text-[#F2B84B]"
                >
                  <span className="text-emerald-500 text-xs">›</span>
                  <span>{t('footer.methodology')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — STAY CONNECTED (Civic Update Card) (4 cols) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-[#092620]/85 border border-[#164D42]/80 p-6 space-y-4 shadow-xl shadow-black/30 backdrop-blur-md">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#6EE7B7] text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#F2B84B]" />
                  <span>{t('footer.newsletterBadge')}</span>
                </div>
                <h4 className="font-bangla font-bold text-white text-base sm:text-lg leading-snug">
                  {t('footer.newsletterHeader')}
                </h4>
                <p className="text-xs text-slate-400 font-bangla leading-relaxed">
                  {t('footer.newsletterSub')}
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('footer.emailPlaceholder')}
                      className="w-full bg-[#051B16] border border-[#17483E] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F2B84B] focus:ring-1 focus:ring-[#F2B84B] transition-all font-bangla"
                      aria-label="Email Address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F2B84B] hover:bg-[#E0A436] text-slate-950 font-bangla font-bold text-xs transition-all duration-200 shadow-md shadow-amber-500/20 group active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>{t('footer.subscribeBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>

                {subscribed ? (
                  <span className="text-[11px] text-emerald-400 font-bangla flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('footer.subscribeSuccess')}
                  </span>
                ) : (
                  <p className="text-[11px] text-slate-500 font-bangla flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/80" />
                    {t('footer.privacyReassurance')}
                  </p>
                )}
              </form>

              <div className="pt-3 border-t border-[#123E35]/60 flex items-center justify-between text-xs text-slate-400 font-bangla">
                <span className="text-slate-300 font-medium">{t('footer.localNewsTag')}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {t('24/7 Live', '২৪/৭ লাইভ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — CIVIC SIGNATURE AREA (Over the Real Bangladeshi Skyline Panorama) */}
      <div className="relative pt-12 pb-16 sm:pb-20 lg:pb-24 overflow-hidden select-none z-10">
        {/* Cinematic Watermark Typography over the Skyline */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <div className="relative inline-block">
            {/* Large Bengali/English Word "নগরচিত্র" */}
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] font-black font-bangla tracking-wider leading-none select-none bg-gradient-to-b from-white/40 via-teal-100/20 to-transparent bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              {language === 'bn' ? 'নগরচিত্র' : 'NagarChitra'}
            </h2>

            {/* Subtle Pin Motif above the 'ত্র' */}
            <div className="absolute top-1 sm:top-2 md:top-3 right-0 sm:right-1 md:right-3 transform translate-x-2 -translate-y-2 opacity-75 pointer-events-none">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#F2B84B] flex items-center justify-center shadow-lg shadow-amber-500/40">
                <div className="w-1.5 h-1.5 rounded-full bg-[#051815]" />
              </div>
            </div>
          </div>

          {/* Signature Tagline */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-bangla font-semibold text-emerald-200/90 tracking-widest flex items-center justify-center gap-2 sm:gap-4 flex-wrap drop-shadow-md">
            <span className="text-emerald-400/50 hidden sm:inline">—</span>
            <span>{t('Our City', 'সবার শহর')}</span>
            <span className="text-emerald-400/60">|</span>
            <span>{t('Our Participation', 'সবার অংশগ্রহণ')}</span>
            <span className="text-emerald-400/60">|</span>
            <span>{t('Our NagarChitra', 'সবার নগরচিত্র')}</span>
            <span className="text-emerald-400/50 hidden sm:inline">—</span>
          </div>
        </div>
      </div>

      {/* SECTION 3 — FOOTER META BAR */}
      <div className="border-t border-[#0D3830]/80 bg-[#010A08]/90 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bangla">
          {/* Left: Copyright */}
          <p className="order-2 sm:order-1 text-center sm:text-left text-slate-400">
            {t('footer.copyright')}
          </p>

          {/* Center: Language Switcher */}
          <div className="order-1 sm:order-2 flex items-center gap-2 font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`hover:text-white transition-colors duration-150 ${
                language === 'bn' ? 'text-[#F2B84B] font-bold' : 'text-slate-400'
              }`}
              aria-label="বাংলা ভাষায় পরিবর্তন করুন"
            >
              বাংলা
            </button>
            <span className="text-slate-600 font-normal">|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`hover:text-white transition-colors duration-150 font-sans ${
                language === 'en' ? 'text-[#F2B84B] font-bold' : 'text-slate-400'
              }`}
              aria-label="Switch to English"
            >
              English
            </button>
          </div>

          {/* Right: Built with Love */}
          <div className="order-3 flex items-center gap-1.5 text-slate-400 text-center sm:text-right">
            <span>{t('footer.builtWith')}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block animate-pulse" aria-hidden="true" />
            <span className="font-medium text-slate-300">{t('footer.forBangladesh')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};




