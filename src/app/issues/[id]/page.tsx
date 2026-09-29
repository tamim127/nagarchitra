'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { CivicMap } from '@/components/Map';
import { IssueStatus } from '@/types';
import Link from 'next/link';
import {
  MapPin,
  Share2,
  Bookmark,
  Calendar,
  User,
  Shield,
  Eye,
  Check,
  Send,
  Building2,
  Clock,
  Wrench,
  Copy,
  ChevronLeft,
  ChevronRight,
  Camera,
  Home,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Compass,
  Building,
  Route,
  FileCheck,
  Users,
} from 'lucide-react';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getIssueById, confirmIssue, followIssue, updateIssueStatus } = useIssues();
  const { t, language, formatNumber } = useLanguage();
  const { role, currentUser } = useAuthRole();

  const issueId = params?.id as string;
  const issue = getIssueById(issueId);

  // Gallery state
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Citizen feedback resolution form state
  const [feedbackVote, setFeedbackVote] = useState<string>('yes_full');
  const [feedbackComment, setFeedbackComment] = useState('মেরামত ভালো হয়েছে, তবে ড্রেনেজের দিকে নজর দেওয়া উচিত।');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Authority quick-action state
  const [authorityStatus, setAuthorityStatus] = useState<IssueStatus>('IN_PROGRESS');
  const [authorityNote, setAuthorityNote] = useState('');
  const [authorityProofUrl, setAuthorityProofUrl] = useState(
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
  );
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 font-bangla">
        <h2 className="text-2xl font-black text-slate-800">
          {t('Issue Not Found', 'ইস্যু খুঁজে পাওয়া যায়নি')}
        </h2>
        <p className="text-xs text-slate-500">
          {t('The requested issue report does not exist or has been removed.', 'অনুরোধকৃত রিপোর্ট সিস্টেমে নেই অথবা মুছে ফেলা হয়েছে।')} (#{issueId})
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold shadow"
        >
          <span>{t('Return to Map', 'ম্যাপে ফিরে যান')}</span>
        </Link>
      </div>
    );
  }

  // Gallery images (fallback to default set if none)
  const defaultGallery = [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      caption: language === 'bn' ? 'প্রধান ছবি - গভীর গর্ত ও জলাবদ্ধতা' : 'Main Photo - Pothole and waterlogging',
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
      caption: language === 'bn' ? 'ভাঙা অ্যাসফল্টের ধার ও খানাখন্দ' : 'Broken asphalt and road erosion',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      caption: language === 'bn' ? 'রাস্তার সম্পূর্ণ দৃশ্য ও যানজট' : 'Wide view showing traffic congestion',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      caption: language === 'bn' ? 'পানির গভীরতা পরিমাপ ও ঝুঁকি' : 'Water depth and hazard check',
    },
  ];

  const gallery = (issue.media && issue.media.length > 0) ? issue.media : defaultGallery;

  const handleCopyAddress = () => {
    const textToCopy = `${language === 'bn' ? (issue.location.addressBn || issue.location.address) : issue.location.address} (GPS: ${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleAuthorityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateIssueStatus(
      issue.id,
      authorityStatus,
      authorityNote.trim() || `Status updated to ${authorityStatus} by ${currentUser.name}`,
      authorityStatus === 'RESOLVED' ? authorityProofUrl : undefined,
      currentUser.role === 'AUTHORITY' ? (language === 'bn' ? 'সড়ক ও জনপথ বিভাগ' : 'Roads & Highways Department') : undefined,
      currentUser.name
    );
    setShowAuthorityModal(false);
    setAuthorityNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6 font-bangla text-slate-800">
      {/* 1. Breadcrumb Row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>{t('nav.home')}</span>
          </Link>
          <span className="text-slate-400">›</span>
          <Link href="/explore" className="text-slate-600 hover:text-slate-900 transition font-medium">
            {t('Issues', 'ইস্যুসমূহ')}
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-slate-500 font-medium font-mono">
            #{issue.trackingNumber}
          </span>
        </div>

        <div className="text-[#0d6e5a] font-medium text-xs hidden sm:block">
          {t('A cleaner, safer, more livable city', 'একটি পরিচ্ছন্ন, নিরাপদ, বাসযোগ্য নগরী')}
        </div>
      </div>

      {/* 2. Issue Title & Metadata Header Block */}
      <div className="space-y-2.5">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0d6e5a] text-white text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
          <span>
            {issue.status === 'SUBMITTED' ? t('Reported', 'রিপোর্টেড') : issue.status.replace('_', ' ')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {language === 'bn' && issue.titleBn ? issue.titleBn : issue.title}
        </h1>

        {/* Citizen Description */}
        <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
          {language === 'bn' && issue.descriptionBn ? issue.descriptionBn : issue.description}
        </p>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
            <Route className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' && issue.categoryNameBn ? issue.categoryNameBn : issue.categoryName}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' && issue.location.addressBn ? issue.location.addressBn : issue.location.address}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>
              {t('Reported:', 'রিপোর্ট করেছেন:')}{' '}
              {new Date(issue.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </span>

          {(role === 'AUTHORITY' || role === 'ADMIN') && (
            <button
              onClick={() => setShowAuthorityModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('Change Status', 'স্ট্যাটাস পরিবর্তন করুন')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Photos & Evidence */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {t('Photos & Evidence of Issue', 'সমস্যার ছবি ও প্রমাণ')}
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              {/* Main Photo Box */}
              <div className="relative flex-1 min-w-0 aspect-[16/11] sm:aspect-auto sm:min-h-[290px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                <img
                  src={gallery[activeImageIdx]?.url || gallery[0].url}
                  alt={gallery[activeImageIdx]?.caption || issue.title}
                  className="w-full h-full object-cover transition duration-300"
                />

                {/* Top-left pill */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1 z-10">
                  <span>{t('Main Photo', 'প্রধান ছবি')}</span>
                </div>

                {/* Bottom-right counter */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-sm text-white text-[11px] font-mono z-10">
                  {formatNumber(activeImageIdx + 1)} / {formatNumber(gallery.length)}
                </div>

                {/* Navigation arrows */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition z-10"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition z-10"
                  title="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails list */}
              <div className="flex sm:flex-col gap-2.5 w-full sm:w-28 md:w-36 lg:w-40 shrink-0 justify-between">
                {gallery.slice(1, 4).map((img, idx) => {
                  const actualIdx = idx + 1;
                  const isLastSlot = idx === 2;

                  return (
                    <div
                      key={img.id || actualIdx}
                      onClick={() => setActiveImageIdx(actualIdx)}
                      className={`relative flex-1 min-h-[76px] aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                        activeImageIdx === actualIdx ? 'border-[#0d6e5a] ring-2 ring-[#0d6e5a]/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Photo ${actualIdx}`}
                        className="w-full h-full object-cover"
                      />

                      {isLastSlot && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white text-[11px] font-semibold p-1 text-center">
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>{t('More Photos (4)', 'আরও ছবি (৪টি)')}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: Community Reactions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {t('Community Reactions on Issue', 'ইস্যুতে কমিউনিটি প্রতিক্রিয়া')}
            </h3>

            <div className="bg-[#f0f9f6] border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0c4a45] text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    I See This Too
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('24 other residents have seen this issue', 'এই সমস্যাটি আরও ২৪ জন বাসিন্দা দেখেছেন')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => confirmIssue(issue.id)}
                  className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition shrink-0"
                >
                  <Eye className="w-4 h-4 text-emerald-300" />
                  <span>{t('I see this too', 'আমি-ও দেখেছি')}</span>
                </button>

                <div className="flex items-center -space-x-2 overflow-hidden shrink-0">
                  <img
                    className="inline-block w-7 h-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Citizen 1"
                  />
                  <img
                    className="inline-block w-7 h-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Citizen 2"
                  />
                  <img
                    className="inline-block w-7 h-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Citizen 3"
                  />
                  <div className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-slate-700">
                    +{formatNumber(19)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Report Updates & Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {t('Report Updates & Timeline', 'রিপোর্টের আপডেট ও টাইমলাইন')}
              </h3>
              <button
                type="button"
                className="text-xs text-[#0d6e5a] font-bold hover:underline flex items-center gap-1"
              >
                <span>{t('View All Updates', 'সব আপডেট দেখুন')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vertical timeline items */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Report Submitted */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Send className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {t('Report Submitted', 'রিপোর্ট জমা দেওয়া হয়েছে')}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      12 Mar 2026, 09:45 AM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('Issue successfully registered in NagarChitra civic platform.', 'আপনার রিপোর্ট সফলভাবে জমা নেওয়া হয়েছে।')}
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{issue.reportedBy.name} ({t('Citizen', 'নাগরিক')})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Community Verification */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Users className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {t('Community Verification', 'কমিউনিটি ভেরিফিকেশন')}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      12 Mar 2026, 11:20 AM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatNumber(10)} {t('residents confirmed this problem in neighborhood.', 'জন বাসিন্দা এই সমস্যাটি নিশ্চিত করেছেন।')}
                  </p>
                </div>
              </div>

              {/* Step 3: Verifying */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Clock className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {t('Under Authority Review', 'যাচাই চলছে')}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      12 Mar 2026, 02:10 PM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('Zonal authorities are reviewing the report.', 'কর্তৃপক্ষ বিষয়টি পর্যালোচনা করছেন।')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Before / After & Citizen Feedback Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Before / After comparison */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900">
                  {t('Before & After', 'আগে এবং পরে (Before / After)')}
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                      {t('Before', 'আগে')}
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80"
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                      {t('After', 'পরে')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Citizen Feedback */}
              <div className="space-y-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {t('Your Feedback', 'আপনার মতামত')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('Has this issue been resolved?', 'সমস্যাটি সমাধান হয়েছে কি?')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setFeedbackVote('yes_full')}
                    className={`p-2 rounded-lg border font-bold text-center transition ${
                      feedbackVote === 'yes_full'
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t('Yes, fully resolved', 'হ্যাঁ, সম্পূর্ণ সমাধান হয়েছে')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackVote('realistic')}
                    className={`p-2 rounded-lg border font-bold text-center transition ${
                      feedbackVote === 'realistic'
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-amber-50/50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {t('Revised resolution completed', 'সংশোধিত সমাধান হয়েছে')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackVote('partial')}
                    className={`p-2 rounded-lg border font-bold text-center transition ${
                      feedbackVote === 'partial'
                        ? 'bg-orange-50 border-orange-300 text-orange-800'
                        : 'bg-orange-50/50 border-orange-200 text-orange-800 hover:bg-orange-100'
                    }`}
                  >
                    {t('Partially resolved', 'আংশিক সমাধান হয়েছে')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackVote('not_resolved')}
                    className={`p-2 rounded-lg border font-bold text-center transition ${
                      feedbackVote === 'not_resolved'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-rose-50/50 border-rose-200 text-rose-800 hover:bg-rose-100'
                    }`}
                  >
                    {t('No, problem persists', 'না, এখনও সমস্যা রয়েছে')}
                  </button>
                </div>

                {/* Textarea */}
                <div className="space-y-1">
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder={t('Comments (optional)', 'মন্তব্য (ঐচ্ছিক)')}
                    maxLength={250}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700 text-slate-700"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{formatNumber(feedbackComment.length)}/{formatNumber(250)}</span>
                    {feedbackSubmitted && (
                      <span className="text-emerald-600 font-bold">
                        {t('Feedback submitted!', '✓ মতামত জমা হয়েছে!')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSubmitted(true);
                    setTimeout(() => setFeedbackSubmitted(false), 3000);
                  }}
                  className="w-full bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold py-2 rounded-xl transition shadow-sm"
                >
                  {t('Submit Feedback', 'মতামত জমা দিন')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Status */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  {t('Current Status', 'বর্তমান অবস্থা')}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {issue.status === 'SUBMITTED' ? t('Reported', 'রিপোর্টেড') : issue.status.replace('_', ' ')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Awaiting inspection and authority assignment', 'সমস্যাটি যাচাইয়ের জন্য অপেক্ষায় আছে')}
                </p>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="pt-2">
              <div className="relative flex items-center justify-between text-center">
                <div className="absolute top-2 left-3 right-3 h-0.5 bg-slate-200 -z-0" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 mt-1.5">
                    {t('Reported', 'রিপোর্টেড')}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">
                    {t('Verify', 'যাচাই')}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">
                    {t('Assign', 'অ্যাসাইন')}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">
                    {t('Resolve', 'সমাধান')}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">
                    {t('Verified', 'ভেরিফায়েড')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => followIssue(issue.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition shadow-sm ${
                  issue.followedByUser
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-slate-950" />
                <span>{t('Follow Issue', 'ফলো করুন')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: issue.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(language === 'bn' ? 'রিপোর্ট লিঙ্ক কপি করা হয়েছে!' : 'Report link copied!');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('Share', 'শেয়ার')}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Incident Location & Map */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0d6e5a]" />
                <span>{t('Incident Location', 'ঘটনার অবস্থান')}</span>
              </h3>
              <Link
                href="/explore"
                className="text-xs text-[#0d6e5a] font-bold hover:underline flex items-center gap-0.5"
              >
                <span>{t('View on large map', 'বড় মানচিত্রে দেখুন')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Map Preview */}
            <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative">
              <CivicMap
                issues={[issue]}
                center={[issue.location.latitude, issue.location.longitude]}
                zoom={14}
                height="100%"
                interactive={true}
                hideLegend={true}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>{t('Report Location', 'রিপোর্টের স্থান')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>{t('Buffer Zone', 'বাফার এলাকা')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{t('Fault Area', 'ফল্ট এরিয়া')}</span>
              </span>
            </div>

            {/* Coordinates & Copy */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 font-semibold">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>{issue.location.latitude.toFixed(4)}° N, {issue.location.longitude.toFixed(4)}° E</span>
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-medium transition"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAddress ? t('Copied!', 'কপি হয়েছে!') : t('Copy Address', 'ঠিকানা কপি করুন')}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Issue Details Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100">
              {t('Issue Details', 'ইস্যু বিবরণ')}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('Issue ID', 'ইস্যু আইডি')}</span>
                <span className="font-bold text-slate-900 font-mono">
                  {issue.trackingNumber}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('Department', 'বিভাগ')}</span>
                <span className="font-bold text-slate-900">
                  {issue.assignedDepartment || (language === 'bn' ? 'সড়ক ও জনপথ বিভাগ' : 'Roads & Highways Department')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('Location', 'অবস্থান')}</span>
                <span className="font-bold text-slate-900">
                  {language === 'bn' && issue.location.addressBn ? issue.location.addressBn : issue.location.address}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('Category', 'শ্রেণি')}</span>
                <span className="font-bold text-slate-900">
                  {language === 'bn' && issue.categoryNameBn ? issue.categoryNameBn : issue.categoryName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('Severity', 'গুরুত্ব')}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                  {issue.severity}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('Reporter Name', 'রিপোর্টারের নাম')}</span>
                <span className="font-bold text-slate-900">
                  {issue.reportedBy.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">{t('Contact', 'যোগাযোগ')}</span>
                <span className="font-mono text-slate-700">
                  tuhin@email.com
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Privacy & Protection */}
          <div className="bg-[#f0f9f6] rounded-2xl border border-teal-100/80 p-4 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0d6e5a] text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-extrabold text-slate-900 text-xs">
                {t('Privacy & Data Protection', 'গোপনীয়তা ও নিরাপত্তা')}
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                {t('For sensitive cases, precise coordinates are masked for public safety.', 'ব্যক্তিগত ও সংবেদনশীল লোকেশনের ক্ষেত্রে সুনির্দিষ্ট অবস্থান জনসম্মুখে দেখানো হয় না।')}
              </p>
              <Link
                href="/privacy"
                className="text-[11px] text-[#0d6e5a] font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <span>{t('View our Privacy Policy', 'আমাদের গোপনীয়তা নীতি দেখুন')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 5: Area Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              {t('Area Summary', 'এলাকার সারাংশ')} ({issue.location.area})
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center pt-1">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  {t('Total Issues', 'মোট সমস্যা')}
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  {formatNumber(184)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>12%</span>
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  {t('Resolved', 'সমাধান হয়েছে')}
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  {formatNumber(92)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>18%</span>
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  {t('Active Issues', 'সক্রিয় সমস্যা')}
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  {formatNumber(37)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>5%</span>
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  {t('Avg. Resolution', 'গড় সমাধান')}
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  {formatNumber(5)} {t('Days', 'দিন')}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingDown className="w-2.5 h-2.5" />
                  <span>23%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Quick-Action Modal */}
      {showAuthorityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-bangla">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('Authority Status Update', 'কর্তৃপক্ষ স্ট্যাটাস পরিবর্তন')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Logged in:', 'লগইন আছেন:')} {currentUser.name} ({currentUser.role})
                </p>
              </div>
              <button
                onClick={() => setShowAuthorityModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthorityUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {t('Select New Status:', 'নতুন স্ট্যাটাস নির্বাচন করুন:')}
                </label>
                <select
                  value={authorityStatus}
                  onChange={(e) => setAuthorityStatus(e.target.value as IssueStatus)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW ({t('Under Review', 'যাচাই চলছে')})</option>
                  <option value="VERIFIED">VERIFIED ({t('Verified', 'যাচাইকৃত')})</option>
                  <option value="ASSIGNED">ASSIGNED ({t('Assigned', 'অ্যাসাইন্ড')})</option>
                  <option value="IN_PROGRESS">IN_PROGRESS ({t('In Progress', 'কাজ চলছে')})</option>
                  <option value="RESOLVED">RESOLVED ({t('Resolved', 'সমাধান হয়েছে')})</option>
                  <option value="CLOSED">CLOSED ({t('Closed', 'নিষ্পত্তিকৃত')})</option>
                </select>
              </div>

              {authorityStatus === 'RESOLVED' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {t('Resolution Proof Photo URL:', 'সমাধানের প্রমাণ ফটো (পরে - After Image URL):')}
                  </label>
                  <input
                    type="text"
                    value={authorityProofUrl}
                    onChange={(e) => setAuthorityProofUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {t('Official Audit Note:', 'অফিসিয়াল অডিট নোট:')}
                </label>
                <textarea
                  rows={3}
                  required
                  value={authorityNote}
                  onChange={(e) => setAuthorityNote(e.target.value)}
                  placeholder={t('e.g., Road repaired and macadam sealed.', 'যেমন: গর্তটি মেরামত ও পিচ ঢালাই সম্পন্ন হয়েছে।')}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthorityModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 shadow"
                >
                  {t('Save Status', 'স্ট্যাটাস সেভ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
