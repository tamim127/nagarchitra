'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  Shield,
  ThumbsUp,
  FileCheck,
  Building2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface FaqItem {
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    questionBn: 'আমি কীভাবে একটি নাগরিক সমস্যা রিপোর্ট করব?',
    questionEn: 'How do I submit a civic issue report?',
    answerBn: 'রিপোর্ট পেজে গিয়ে সমস্যার ক্যাটাগরি বেছে নিন, ম্যাপে সঠিক অবস্থান চিহ্নিত করুন, ছবি আপলোড করুন এবং বিস্তারিত বিবরণ দিয়ে সাবমিট করুন। আপনার রিপোর্টটি তাৎক্ষণিকভাবে সিস্টেমে নিবন্ধিত হবে এবং একটি ইউনিক ট্র্যাকিং নম্বর পাবে।',
    answerEn: 'Go to the Report page, select the problem category, pinpoint the location on the interactive map, upload photos, provide a description, and submit. Your report will be instantly registered with a unique tracking number.',
    category: 'reporting',
  },
  {
    questionBn: 'আমার ব্যক্তিগত পরিচয় কি অন্য নাগরিক বা কর্তৃপক্ষ দেখতে পাবে?',
    questionEn: 'Will my personal identity be visible to the public or authorities?',
    answerBn: 'না। নগরচিত্রে ব্যবহারকারীর গোপনীয়তা শতভাগ সুরক্ষিত। জনসাধারণের তালিকায় বা ডেটা এক্সপোর্টে আপনার ফোন নম্বর, ইমেইল বা সংবেদনশীল মেটাডাটা সম্পূর্ণ গোপন রাখা হয়।',
    answerEn: 'No. NagarChitra strictly adheres to Privacy by Design. Your phone number, email, and sensitive EXIF camera identifiers are kept private and masked in public listings and open datasets.',
    category: 'privacy',
  },
  {
    questionBn: 'নাগরিক যাচাইকরণ (Citizen Verification) কীভাবে কাজ করে?',
    questionEn: 'How does Citizen Verification work?',
    answerBn: 'কর্তৃপক্ষ কোনো সমস্যা "সমাধান হয়েছে" বলে মার্ক করলে ৭ দিনের জন্য নাগরিক ভোটিং উইন্ডো চালু হয়। স্থানীয় নাগরিকরা সাইটে গিয়ে "সমাধান সঠিক" অথবা "এখনও সমস্যা আছে" ভোট দিতে পারেন। যদি অধিকাংশ নাগরিক এখনও সমস্যা থাকার পক্ষে ভোট দেন, তবে সিস্টেম স্বয়ংক্রিয়ভাবে সমস্যাটিকে "REOPENED" স্ট্যাটাসে ফিরিয়ে দেয়।',
    answerEn: 'When municipal authorities submit a fix, a mandatory 7-day citizen verification voting period opens. Local residents vote whether the fix is genuine or if the defect still persists. If the community disputes the fix, the system automatically reopens the ticket.',
    category: 'verification',
  },
  {
    questionBn: 'জরুরি সমস্যার ক্ষেত্রে কত দ্রুত ব্যবস্থা নেওয়া হয় (SLA)?',
    questionEn: 'What are the response timeframes (SLA) for emergency issues?',
    answerBn: 'চরম জরুরি সমস্যা (যেমন: খোলা ম্যানহোল, ঝুলন্ত বিদ্যুৎ তার) ২৪ ঘণ্টার মধ্যে জরুরি রেসপন্স টিমের নজরে আনা হয়। সাধারণ সড়ক মেরামতের এসএলএ ৩-৫ দিন এবং মাঝারি পরিবেশগত সমস্যার ক্ষেত্রে ৭ দিন নির্ধারিত।',
    answerEn: 'Critical hazards (such as open manholes or live exposed wires) have a 24-hour priority response SLA. Standard road repairs have a 3-5 day SLA, while minor environmental cleanups operate under a 7-day window.',
    category: 'sla',
  },
  {
    questionBn: 'আমি কি অন্য নাগরিকের রিপোর্টে সমর্থন বা কনফার্ম করতে পারব?',
    questionEn: 'Can I confirm or upvote issues reported by other neighbors?',
    answerBn: 'হ্যাঁ! এক্সপ্লোর ম্যাপ বা ইস্যু বিস্তারিত পেজে গিয়ে "আমিও দেখেছি" বা "কনফার্ম করুন" বাটনে ক্লিক করলে রিপোর্টের গুরুত্ব বৃদ্ধি পায় এবং সংশ্লিষ্ট কর্তৃপক্ষ অগ্রাধিকারের ভিত্তিতে কাজ করতে পারে।',
    answerEn: 'Yes! On the Explore Map or Issue Detail page, click the "Confirm Issue" button. Multiple confirmations push the issue higher in priority queues for city maintenance crews.',
    category: 'community',
  },
];

export default function HowItWorksPage() {
  const { t, language } = useLanguage();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [faqFilter, setFaqFilter] = useState('ALL');

  const filteredFaqs = FAQS.filter((f) => {
    if (faqFilter === 'ALL') return true;
    return f.category === faqFilter;
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen font-bangla pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#072B24] via-[#0A3D34] to-[#041A16] text-white py-14 md:py-20 border-b border-[#0F473D]">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src="/images/report_hero_civic.jpg"
            alt="Civic Technology"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to Home', 'হোমে ফিরে যান')}</span>
          </Link>

          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Civic Transparency Engine', 'নাগরিক স্বচ্ছতা ও কার্যপদ্ধতি')}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {language === 'bn' ? (
                <>
                  নগরচিত্র কীভাবে কাজ করে? <br />
                  <span className="text-[#F2B84B]">রিপোর্ট থেকে সমাধান — সম্পূর্ণ স্বচ্ছতা</span>
                </>
              ) : (
                <>
                  How NagarChitra Works <br />
                  <span className="text-[#F2B84B]">From Citizen Report to Verified Resolution</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {language === 'bn'
                ? 'একটি আধুনিক স্মার্ট নগরী গড়ে তুলতে নাগরিক অংশগ্রহণ ও কর্তৃপক্ষের দায়বদ্ধতা নিশ্চিত করার জন্য নগরচিত্র তৈরি করেছে ৫ ধাপের ডিজিটাল পর্যবেক্ষণ ব্যবস্থা।'
                : 'A 5-step civic technology framework ensuring citizen oversight, municipal accountability, and crowdsourced verification for every reported defect.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. FIVE-STEP LIFECYCLE WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '১',
              stepEn: '1',
              title: 'সমস্যা রিপোর্ট',
              titleEn: 'Report Issue',
              desc: 'ছবি ও জিপিএস সহ সমস্যা সাবমিট করুন',
              descEn: 'Submit photo evidence with GPS',
              icon: Camera,
              color: 'bg-emerald-600',
            },
            {
              step: '২',
              stepEn: '2',
              title: 'কমিউনিটি সমর্থন',
              titleEn: 'Community Upvote',
              desc: 'এলাকাবাসীর অনুমোদন ও সত্যতা নিশ্চিতকরণ',
              descEn: 'Nearby residents verify & confirm',
              icon: ThumbsUp,
              color: 'bg-blue-600',
            },
            {
              step: '৩',
              stepEn: '3',
              title: 'কর্তৃপক্ষকে প্রেরণ',
              titleEn: 'Authority Dispatch',
              desc: 'সংশ্লিষ্ট বিভাগে অটো ওয়ার্ক-অর্ডার প্রেরণ',
              descEn: 'Auto-routed to DNCC/WASA/DESCO',
              icon: Building2,
              color: 'bg-amber-600',
            },
            {
              step: '৪',
              stepEn: '4',
              title: 'নাগরিক যাচাইকরণ',
              titleEn: 'Citizen Verification',
              desc: 'মেরামত শেষে ৭ দিনের গণভোট উইন্ডো',
              descEn: '7-day ground truth voting period',
              icon: FileCheck,
              color: 'bg-purple-600',
            },
            {
              step: '৫',
              stepEn: '5',
              title: 'স্থায়ী সমাপ্তি',
              titleEn: 'Permanent Closure',
              desc: 'জনগণের ভোটে সন্তোষজনক ক্লোজার',
              descEn: 'Closed upon majority community pass',
              icon: CheckCircle2,
              color: 'bg-teal-600',
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      ধাপ {language === 'bn' ? item.step : item.stepEn}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${item.color} text-white flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                      {language === 'bn' ? item.title : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {language === 'bn' ? item.desc : item.descEn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SLA STANDARDS BY DEPARTMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">
            {t('Service Level Agreements', 'সেবার মান ও সময়সীমা')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'bn' ? 'কোন সমস্যার সমাধানে কত সময় বরাদ্দ?' : 'Standard Resolution Timelines (SLA)'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'নাগরিক সেবা দ্রুত নিশ্চিত করতে সিটি কর্পোরেশন ও সেবা সংস্থাগুলোর জন্য নির্ধারিত সময়সীমা।'
              : 'Official response time commitments benchmarked against issue severity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              sev: 'CRITICAL',
              labelBn: 'চরম জরুরি (Critical)',
              labelEn: 'Critical Emergency',
              sla: '২৪ ঘণ্টা',
              slaEn: '24 Hours',
              descBn: 'খোলা ম্যানহোল, ঝুলন্ত বিদ্যুৎ তার, বড় সড়ক ধস',
              descEn: 'Open manholes, live wires, dangerous sinkholes',
              badge: 'bg-rose-50 text-rose-800 border-rose-200',
              icon: Zap,
            },
            {
              sev: 'HIGH',
              labelBn: 'জরুরি (High)',
              labelEn: 'High Priority',
              sla: '৩ দিন',
              slaEn: '3 Days',
              descBn: 'প্রধান সড়কে গভীর গর্ত, ড্রেনেজ উপচে পড়া, জলাবদ্ধতা',
              descEn: 'Major road potholes, sewer overflow, waterlogging',
              badge: 'bg-orange-50 text-orange-800 border-orange-200',
              icon: AlertTriangle,
            },
            {
              sev: 'MEDIUM',
              labelBn: 'মাঝারি (Medium)',
              labelEn: 'Medium Priority',
              sla: '৭ দিন',
              slaEn: '7 Days',
              descBn: 'রাস্তার নষ্ট বাতি, উপচে পড়া ডাস্টবিন, ফুটপাথ খানাখন্দ',
              descEn: 'Broken street lamps, overflowing bins, sidewalk damage',
              badge: 'bg-amber-50 text-amber-800 border-amber-200',
              icon: Clock,
            },
            {
              sev: 'LOW',
              labelBn: 'স্বাভাবিক (Low)',
              labelEn: 'Standard Priority',
              sla: '১০ দিন',
              slaEn: '10 Days',
              descBn: 'পার্কের পরিচ্ছন্নতা, মরা ডাল ছাঁটাই, গ্রাফিতি অপসারণ',
              descEn: 'Public park maintenance, tree pruning, civic signage',
              badge: 'bg-slate-100 text-slate-800 border-slate-200',
              icon: CheckCircle2,
            },
          ].map((item, i) => {
            const IconC = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${item.badge}`}>
                    {language === 'bn' ? item.labelBn : item.labelEn}
                  </span>
                  <IconC className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-sans">
                  {language === 'bn' ? item.sla : item.slaEn}
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  {language === 'bn' ? item.descBn : item.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">
            {t('Help Center & FAQs', 'হেল্প সেন্টার ও সাধারণ প্রশ্ন')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'নগরচিত্র ব্যবহার ও সমাধান প্রক্রিয়া সম্পর্কে সাধারণ প্রশ্নের উত্তর।'
              : 'Everything you need to know about using NagarChitra.'}
          </p>
        </div>

        {/* FAQ Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          {[
            { id: 'ALL', labelBn: 'সব প্রশ্ন', labelEn: 'All FAQs' },
            { id: 'reporting', labelBn: 'রিপোর্টিং', labelEn: 'Reporting' },
            { id: 'verification', labelBn: 'যাচাইকরণ', labelEn: 'Verification' },
            { id: 'privacy', labelBn: 'গোপনীয়তা', labelEn: 'Privacy' },
            { id: 'sla', labelBn: 'সময়সীমা (SLA)', labelEn: 'SLA' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFaqFilter(pill.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition text-xs ${
                faqFilter === pill.id
                  ? 'bg-[#0c4a45] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {language === 'bn' ? pill.labelBn : pill.labelEn}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIdx === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <span className="font-extrabold text-sm text-slate-900">
                    {language === 'bn' ? faq.questionBn : faq.questionEn}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {language === 'bn' ? faq.answerBn : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-r from-[#072B24] to-[#0A3D34] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'bn' ? 'আপনার এলাকায় কোনো সমস্যা রয়েছে?' : 'Notice a defect in your neighborhood?'}
            </h3>
            <p className="text-xs text-emerald-200/90 max-w-md">
              {language === 'bn'
                ? 'এখনই একটি ছবি তুলে রিপোর্ট দাখিল করুন। আপনার সচেতনতাই তৈরি করবে সুন্দর ঢাকা।'
                : 'Capture photo evidence, report in 60 seconds, and track official repair work.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/report"
              className="px-6 py-3 rounded-2xl bg-[#F2B84B] hover:bg-[#E0A436] text-slate-950 font-black text-xs shadow-md transition"
            >
              {t('Report Issue Now', 'এখনই রিপোর্ট করুন')}
            </Link>
            <Link
              href="/explore"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition"
            >
              {t('Explore Map', 'ম্যাপ দেখুন')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
