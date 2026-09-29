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
  const { t, language } = useLanguage();
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
        <h2 className="text-2xl font-black text-slate-800">ইস্যু খুঁজে পাওয়া যায়নি</h2>
        <p className="text-xs text-slate-500">
          অনুরোধকৃত রিপোর্ট (#{issueId}) সিস্টেমে নেই অথবা মুছে ফেলা হয়েছে।
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold shadow"
        >
          <span>ম্যাপে ফিরে যান</span>
        </Link>
      </div>
    );
  }

  // Gallery images (fallback to default set if none)
  const defaultGallery = [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      caption: 'প্রধান ছবি - গভীর গর্ত ও জলাবদ্ধতা',
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
      caption: 'ভাঙা অ্যাসফল্টের ধার ও খানাখন্দ',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      caption: 'রাস্তার সম্পূর্ণ দৃশ্য ও যানজট',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      caption: 'পানির গভীরতা পরিমাপ ও ঝুঁকি',
    },
  ];

  const gallery = (issue.media && issue.media.length > 0) ? issue.media : defaultGallery;

  const handleCopyAddress = () => {
    const textToCopy = `${issue.location.addressBn || issue.location.address} (জিপিএস: ${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)})`;
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
      currentUser.role === 'AUTHORITY' ? 'সড়ক ও জনপথ বিভাগ' : undefined,
      currentUser.name
    );
    setShowAuthorityModal(false);
    setAuthorityNote('');
  };

  // Convert numbers to Bengali
  const toBn = (num: number | string) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6 font-bangla text-slate-800">
      {/* 1. Breadcrumb Row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>হোম</span>
          </Link>
          <span className="text-slate-400">›</span>
          <Link href="/explore" className="text-slate-600 hover:text-slate-900 transition font-medium">
            ইস্যুসমূহ
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-slate-500 font-medium">
            রিপোর্ট #{issue.trackingNumber}
          </span>
        </div>

        <div className="text-[#0d6e5a] font-medium text-xs hidden sm:block">
          একটি পরিচ্ছন্ন, নিরাপদ, বাসযোগ্য নগরী
        </div>
      </div>

      {/* 2. Issue Title & Metadata Header Block */}
      <div className="space-y-2.5">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0d6e5a] text-white text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
          <span>রিপোর্টেড</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {issue.titleBn || issue.title}
        </h1>

        {/* Citizen Description */}
        <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
          {issue.descriptionBn || issue.description}
        </p>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
            <Route className="w-3.5 h-3.5 text-slate-600" />
            <span>রাস্তা</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{issue.location.addressBn || issue.location.address}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>রিপোর্ট করেছেন: ১২ মার্চ ২০২৬, ০৯:৪৫ পূর্বাহ্ণ</span>
          </span>

          {(role === 'AUTHORITY' || role === 'ADMIN') && (
            <button
              onClick={() => setShowAuthorityModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>স্ট্যাটাস পরিবর্তন করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Gallery, Community Reaction, Timeline, Resolution & Feedback */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: সমস্যার ছবি ও প্রমাণ */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              সমস্যার ছবি ও প্রমাণ
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
                  <span>প্রধান ছবি</span>
                </div>

                {/* Bottom-right counter */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-sm text-white text-[11px] font-mono z-10">
                  {activeImageIdx + 1} / {gallery.length}
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

                      {/* 3rd thumbnail overlay: আরও ছবি (৪টি) */}
                      {isLastSlot && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white text-[11px] font-semibold p-1 text-center">
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>আরও ছবি (৪টি)</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: ইস্যুতে কমিউনিটি প্রতিক্রিয়া */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              ইস্যুতে কমিউনিটি প্রতিক্রিয়া
            </h3>

            <div className="bg-[#f0f9f6] border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left citizen info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0c4a45] text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    I See This Too
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    এই সমস্যাটি আরও ২৪ জন বাসিন্দা দেখেছেন
                  </p>
                </div>
              </div>

              {/* Right CTA button & avatar stack */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => confirmIssue(issue.id)}
                  className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition shrink-0"
                >
                  <Eye className="w-4 h-4 text-emerald-300" />
                  <span>আমি-ও দেখেছি</span>
                </button>

                {/* Overlapping avatars */}
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
                  <img
                    className="inline-block w-7 h-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                    alt="Citizen 4"
                  />
                  <div className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-slate-700">
                    +১৯
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: রিপোর্টের আপডেট ও টাইমলাইন */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                রিপোর্টের আপডেট ও টাইমলাইন
              </h3>
              <button
                type="button"
                className="text-xs text-[#0d6e5a] font-bold hover:underline flex items-center gap-1"
              >
                <span>সব আপডেট দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vertical timeline items */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: রিপোর্ট জমা দেওয়া হয়েছে */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Send className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      রিপোর্ট জমা দেওয়া হয়েছে
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ১২ মার্চ ২০২৬, ০৯:৪৫ পূর্বাহ্ণ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    আপনার রিপোর্ট সফলভাবে জমা নেওয়া হয়েছে। ইস্যু আইডি: NC-2026-0412
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>Tuhin Rahman (নাগরিক)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: কমিউনিটি ভেরিফিকেশন */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Users className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      কমিউনিটি ভেরিফিকেশন
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ১২ মার্চ ২০২৬, ১১:২০ পূর্বাহ্ণ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    ১০ জন বাসিন্দা এই সমস্যাটি নিশ্চিত করেছেন।
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span>কমিউনিটি</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: যাচাই চলছে */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Clock className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      যাচাই চলছে
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ১২ মার্চ ২০২৬, ০২:১০ অপরাহ্ন
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    কর্তৃপক্ষ বিষয়টি পর্যালোচনা করছেন।
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>সিটি কর্পোরেশন</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: অ্যাসাইনমেন্ট */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <FileCheck className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      অ্যাসাইনমেন্ট
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ১৩ মার্চ ২০২৬, ১০:১৫ পূর্বাহ্ণ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    সমস্যাটি সড়ক ও জনপথ বিভাগ-এ পাঠানো হয়েছে।
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      <Building className="w-3 h-3 text-purple-600" />
                      <span>সিটি কর্পোরেশন</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 5: সমাধান হয়েছে */}
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#134e4a] text-white flex items-center justify-center ring-4 ring-white shadow-sm">
                  <Wrench className="w-2.5 h-2.5" />
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      সমাধান হয়েছে
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ১৫ মার্চ ২০২৬, ০১:৩০ অপরাহ্ন
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    গর্তটি মেরামত করা হয়েছে। দয়া করে আগে-পরের ছবি দেখুন।
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                      <Building className="w-3 h-3 text-teal-700" />
                      <span>সড়ক ও জনপথ বিভাগ</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: আগে এবং পরে (Before / After) & আপনার মতামত */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Before / After comparison */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900">
                  আগে এবং পরে (Before / After)
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Before Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                      alt="Before Repair"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                      আগে
                    </span>
                  </div>

                  {/* After Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80"
                      alt="After Repair"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                      পরে
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Citizen Resolution Feedback Form */}
              <div className="space-y-2.5">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    আপনার মতামত
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    সমস্যাটি সমাধান হয়েছে কি?
                  </p>
                </div>

                {/* 2x2 grid of options */}
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
                    হ্যাঁ, সম্পূর্ণ সমাধান হয়েছে
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
                    সংশোধিত সমাধান হয়েছে
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
                    আংশিক সমাধান হয়েছে
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
                    না, এখনও সমস্যা রয়েছে
                  </button>
                </div>

                {/* Textarea */}
                <div className="space-y-1">
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="মন্তব্য (ঐচ্ছিক)"
                    maxLength={250}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700 text-slate-700"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{toBn(feedbackComment.length)}/২৫০</span>
                    {feedbackSubmitted && (
                      <span className="text-emerald-600 font-bold">✓ মতামত জমা হয়েছে!</span>
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
                  মতামত জমা দিন
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Status, Map, Details, Privacy, Area Summary, Related Issues */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: বর্তমান অবস্থা */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  বর্তমান অবস্থা
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  রিপোর্টেড
                </h3>
                <p className="text-xs text-slate-500">
                  সমস্যাটি যাচাইয়ের জন্য অপেক্ষায় আছে
                </p>
              </div>
            </div>

            {/* Horizontal Stepper Progress */}
            <div className="pt-2">
              <div className="relative flex items-center justify-between text-center">
                {/* Horizontal line */}
                <div className="absolute top-2 left-3 right-3 h-0.5 bg-slate-200 -z-0" />
                
                {/* Step 1: রিপোর্টেড (Active) */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 mt-1.5">রিপোর্টেড</span>
                </div>

                {/* Step 2: যাচাই */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">যাচাই</span>
                </div>

                {/* Step 3: অ্যাসাইন */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">অ্যাসাইন</span>
                </div>

                {/* Step 4: সমাধান */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">সমাধান</span>
                </div>

                {/* Step 5: ভেরিফায়েড */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 mt-1.5">ভেরিফায়েড</span>
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
                <span>ফলো করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: issue.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('রিপোর্ট লিঙ্ক কপি করা হয়েছে!');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>শেয়ার</span>
              </button>
            </div>
          </div>

          {/* Card 2: ঘটনার অবস্থান & Map */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <span>( ঘটনার অবস্থান</span>
              </h3>
              <Link
                href="/explore"
                className="text-xs text-[#0d6e5a] font-bold hover:underline flex items-center gap-0.5"
              >
                <span>বড় মানচিত্রে দেখুন</span>
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
                <span>রিপোর্টের স্থান</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>বাফার এলাকা</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>ফল্ট এরিয়া</span>
              </span>
            </div>

            {/* Coordinates & Copy */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 font-semibold">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>২৩.৮০৬১° N, ৯০.৩৬১৫° E</span>
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-medium transition"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAddress ? 'কপি হয়েছে!' : 'ঠিকানা কপি করুন'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: ইস্যু বিবরণ */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100">
              ইস্যু বিবরণ
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">ইস্যু আইডি</span>
                <span className="font-bold text-slate-900 font-mono">
                  {issue.trackingNumber}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">বিভাগ</span>
                <span className="font-bold text-slate-900">
                  {issue.assignedDepartment || 'সড়ক ও জনপথ বিভাগ'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">অবস্থান</span>
                <span className="font-bold text-slate-900">
                  {issue.location.addressBn || issue.location.address}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">শ্রেণি</span>
                <span className="font-bold text-slate-900">
                  {issue.categoryName === 'Road Damage' ? 'রাস্তায় গর্ত / ভাঙাচোরা' : issue.categoryName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">গুরুত্ব</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                  উচ্চ
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">রিপোর্টারের নাম</span>
                <span className="font-bold text-slate-900">
                  {issue.reportedBy.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">যোগাযোগ</span>
                <span className="font-mono text-slate-700">
                  tuhin@email.com
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: গোপনীয়তা ও নিরাপত্তা */}
          <div className="bg-[#f0f9f6] rounded-2xl border border-teal-100/80 p-4 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0d6e5a] text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-extrabold text-slate-900 text-xs">
                গোপনীয়তা ও নিরাপত্তা
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                ব্যক্তিগত ও সংবেদনশীল লোকেশনের ক্ষেত্রে সুনির্দিষ্ট অবস্থান জনসম্মুখে দেখানো হয় না।
              </p>
              <Link
                href="/privacy"
                className="text-[11px] text-[#0d6e5a] font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <span>আমাদের গোপনীয়তা নীতি দেখুন</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 5: এলাকার সারাংশ (Mirpur) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              এলাকার সারাংশ (Mirpur)
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center pt-1">
              {/* Stat 1 */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  মোট সমস্যা
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  184
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>12%</span>
                </span>
              </div>

              {/* Stat 2 */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  সমাধান হয়েছে
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  92
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>18%</span>
                </span>
              </div>

              {/* Stat 3 */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  সক্রিয় সমস্যা
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  37
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>5%</span>
                </span>
              </div>

              {/* Stat 4 */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium block">
                  গড় সমাধান
                </span>
                <span className="text-base font-black text-slate-900 block font-mono">
                  5 দিন
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 font-mono">
                  <TrendingDown className="w-2.5 h-2.5" />
                  <span>23%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 6: সংশ্লিষ্ট ইস্যু */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              সংশ্লিষ্ট ইস্যু
            </h3>

            <div className="space-y-3">
              {/* Item 1 */}
              <Link
                href="/issues/water-logging-kazipara-4c81"
                className="flex items-center gap-2.5 group hover:bg-slate-50 p-1.5 rounded-xl transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80"
                  alt="Water Logging"
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0d6e5a] transition truncate">
                    মিরপুর ১০ - জলাবদ্ধতা সমস্যা
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NC-2026-0287 • ৪ দিন আগে
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                  রিপোর্টেড
                </span>
              </Link>

              {/* Item 2 */}
              <Link
                href="/issues/broken-footpath-shewrapara-5d19"
                className="flex items-center gap-2.5 group hover:bg-slate-50 p-1.5 rounded-xl transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=120&q=80"
                  alt="Broken Footpath"
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0d6e5a] transition truncate">
                    মিরপুর ১০ - ভাঙা ফুটপাত
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NC-2026-0365 • ৩ দিন আগে
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  সমাধান হয়েছে
                </span>
              </Link>

              {/* Item 3 */}
              <Link
                href="/issues/drainage-blockage-mirpur-11-2a09"
                className="flex items-center gap-2.5 group hover:bg-slate-50 p-1.5 rounded-xl transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1584463699042-308f237bf309?auto=format&fit=crop&w=120&q=80"
                  alt="Drainage Blockage"
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0d6e5a] transition truncate">
                    মিরপুর ১১ - ড্রেনেজ সমস্যা
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    NC-2026-0221 • ৬ দিন আগে
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold shrink-0">
                  অ্যাসাইন্ড
                </span>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                href="/explore"
                className="text-xs text-[#0d6e5a] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>সব ইস্যু দেখুন</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Quick-Action Modal (for AUTHORITY/ADMIN role) */}
      {showAuthorityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-bangla">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  কর্তৃপক্ষ স্ট্যাটাস পরিবর্তন
                </h3>
                <p className="text-xs text-slate-500">
                  লগইন আছেন: {currentUser.name} ({currentUser.role})
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
                  নতুন স্ট্যাটাস নির্বাচন করুন:
                </label>
                <select
                  value={authorityStatus}
                  onChange={(e) => setAuthorityStatus(e.target.value as IssueStatus)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW (যাচাই চলছে)</option>
                  <option value="VERIFIED">VERIFIED (যাচাইকৃত)</option>
                  <option value="ASSIGNED">ASSIGNED (অ্যাসাইন্ড)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (কাজ চলছে)</option>
                  <option value="RESOLVED">RESOLVED (সমাধান হয়েছে)</option>
                  <option value="CLOSED">CLOSED (নিষ্পত্তিকৃত)</option>
                </select>
              </div>

              {authorityStatus === 'RESOLVED' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    সমাধানের প্রমাণ ফটো (পরে - After Image URL):
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
                  অফিসিয়াল অডিট নোট:
                </label>
                <textarea
                  rows={3}
                  required
                  value={authorityNote}
                  onChange={(e) => setAuthorityNote(e.target.value)}
                  placeholder="যেমন: গর্তটি মেরামত ও পিচ ঢালাই সম্পন্ন হয়েছে।"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthorityModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 shadow"
                >
                  স্ট্যাটাস সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
