'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { DHAKA_AREAS } from '@/data/areas';
import { IssueCategory, IssueSeverity } from '@/types';
import { LocationPicker, CivicMap } from '@/components/Map';
import { DuplicateWarningModal } from '@/components/DuplicateWarningModal';
import Link from 'next/link';
import {
  MapPin,
  Camera,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Crosshair,
  X,
  Search,
  LayoutGrid,
  Shield,
  Lightbulb,
  Route,
  Droplets,
  Trash2,
  CircleDot,
  Zap,
  Sparkles,
  Trees,
  Building2,
  Wind,
  Bus,
  MoreHorizontal,
  Home,
  Check,
  Building,
  Clock,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CategoryItem {
  id: string;
  title: string;
  count: number;
  subtitle: string;
  icon: any;
  color: string;
  group: 'Infrastructure' | 'Environment' | 'Public Safety' | 'Water & Drainage' | 'Other';
  defaultSeverity: IssueSeverity;
  slaDays: number;
  assignedDept: string;
}

const REPORT_CATEGORIES: CategoryItem[] = [
  {
    id: 'road-damage',
    title: 'রাস্তা ও ফুটপাত',
    count: 128,
    subtitle: 'রাস্তা ভাঙা, ফুটপাথ ক্ষতিগ্রস্ত, রাস্তার বাধা, ট্রাফিক সিগন্যাল সমস্যাদি',
    icon: Route,
    color: 'bg-[#0c4a45] text-white',
    group: 'Infrastructure',
    defaultSeverity: 'HIGH',
    slaDays: 5,
    assignedDept: 'সড়ক ও জনপথ বিভাগ',
  },
  {
    id: 'water-drainage',
    title: 'পানি ও ড্রেনেজ',
    count: 87,
    subtitle: 'জলাবদ্ধতা, ড্রেনেজ জট, পানি নিষ্কাশন সমস্যা, নালা পরিষ্কার',
    icon: Droplets,
    color: 'bg-blue-500 text-white',
    group: 'Water & Drainage',
    defaultSeverity: 'HIGH',
    slaDays: 3,
    assignedDept: 'ঢাকা ওয়াসা ও ড্রেনেজ বিভাগ',
  },
  {
    id: 'waste-management',
    title: 'বর্জ্য ব্যবস্থাপনা',
    count: 64,
    subtitle: 'আবর্জনা ফেলা, ডাস্টবিন অবহেলা, বর্জ্য অপসারণ সংকট',
    icon: Trash2,
    color: 'bg-teal-500 text-white',
    group: 'Environment',
    defaultSeverity: 'MEDIUM',
    slaDays: 2,
    assignedDept: 'বর্জ্য ব্যবস্থাপনা বিভাগ (সিটি কর্পোরেশন)',
  },
  {
    id: 'open-manhole',
    title: 'খোলা ম্যানহোল',
    count: 42,
    subtitle: 'খোলা ম্যানহোল, ঢাকনা ভাঙা, নিরাপত্তা ঝুঁকি',
    icon: CircleDot,
    color: 'bg-amber-700 text-white',
    group: 'Infrastructure',
    defaultSeverity: 'CRITICAL',
    slaDays: 1,
    assignedDept: 'সিটি কর্পোরেশন অঞ্চল প্রকৌশল',
  },
  {
    id: 'electricity-wires',
    title: 'বিদ্যুৎ সংযোগ ও তার',
    count: 36,
    subtitle: 'খোলা তার, বিপজ্জনক সংযোগ, বিদ্যুৎ সমস্যা',
    icon: Zap,
    color: 'bg-amber-400 text-slate-900',
    group: 'Public Safety',
    defaultSeverity: 'CRITICAL',
    slaDays: 1,
    assignedDept: 'ডেসকো / ডিপিডিসি জরুরি টিম',
  },
  {
    id: 'street-light',
    title: 'রাস্তার বাতি',
    count: 28,
    subtitle: 'বাতি নষ্ট, জ্বলে না, নতুন বাতি প্রয়োজন',
    icon: Lightbulb,
    color: 'bg-purple-600 text-white',
    group: 'Infrastructure',
    defaultSeverity: 'MEDIUM',
    slaDays: 4,
    assignedDept: 'বিদ্যুৎ ও স্ট্রিট লাইট শাখা',
  },
  {
    id: 'sanitation-toilet',
    title: 'স্যানিটেশন ও পাবলিক টয়লেট',
    count: 21,
    subtitle: 'টয়লেট নষ্ট, পরিষ্কার নয়, নতুন টয়লেট প্রয়োজন',
    icon: Sparkles,
    color: 'bg-cyan-600 text-white',
    group: 'Environment',
    defaultSeverity: 'MEDIUM',
    slaDays: 3,
    assignedDept: 'পাবলিক হেলথ ও স্যানিটেশন শাখা',
  },
  {
    id: 'parks-greenery',
    title: 'উদ্যান ও সবুজায়ন',
    count: 18,
    subtitle: 'গাছ কাটা, পার্কের রক্ষণাবেক্ষণ, পরিচ্ছন্নতা',
    icon: Trees,
    color: 'bg-emerald-700 text-white',
    group: 'Environment',
    defaultSeverity: 'LOW',
    slaDays: 7,
    assignedDept: 'পরিবেশ ও উদ্যান বিভাগ',
  },
  {
    id: 'gov-infrastructure',
    title: 'সরকারি ভবন ও অবকাঠামো',
    count: 15,
    subtitle: 'স্কুল, হাসপাতাল, সরকারি ভবনের ক্ষতি বা সমস্যা',
    icon: Building2,
    color: 'bg-slate-700 text-white',
    group: 'Infrastructure',
    defaultSeverity: 'MEDIUM',
    slaDays: 10,
    assignedDept: 'গণপূর্ত অধিদপ্তর (PWD)',
  },
  {
    id: 'environment-pollution',
    title: 'পরিবেশ দূষণ',
    count: 12,
    subtitle: 'বায়ু দূষণ, শব্দ দূষণ, পানি দূষণ, ধোঁয়া',
    icon: Wind,
    color: 'bg-emerald-600 text-white',
    group: 'Environment',
    defaultSeverity: 'HIGH',
    slaDays: 5,
    assignedDept: 'পরিবেশ অধিদপ্তর ও নাগরিক সুরক্ষা',
  },
  {
    id: 'traffic-transport',
    title: 'ট্রাফিক ও পরিবহন',
    count: 10,
    subtitle: 'ট্রাফিক জ্যাম, সিগন্যাল সমস্যা, বাস/রাস্তার সমস্যা',
    icon: Bus,
    color: 'bg-indigo-700 text-white',
    group: 'Public Safety',
    defaultSeverity: 'HIGH',
    slaDays: 3,
    assignedDept: 'ডিএমপি ট্রাফিক বিভাগ ও বিআরটিএ',
  },
  {
    id: 'others',
    title: 'অন্যান্য',
    count: 8,
    subtitle: 'উপরে উল্লেখিত কোনো ক্যাটাগরির সাথে মিলছে না',
    icon: MoreHorizontal,
    color: 'bg-slate-500 text-white',
    group: 'Other',
    defaultSeverity: 'MEDIUM',
    slaDays: 7,
    assignedDept: 'সাধারণ নাগরিক সেবা ও তথ্য সেল',
  },
];

const SAMPLE_PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
];

export default function ReportPage() {
  const router = useRouter();
  const { addIssue, findNearbyDuplicates } = useIssues();
  const { t, language } = useLanguage();

  const [step, setStep] = useState(1);

  // Form Fields
  const [selectedCatId, setSelectedCatId] = useState<string>('road-damage');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [latitude, setLatitude] = useState(23.8061);
  const [longitude, setLongitude] = useState(90.3615);
  const [address, setAddress] = useState('মিরপুর ১০, ঢাকা');
  const [area, setArea] = useState('Mirpur');
  const [ward, setWard] = useState('১০ নং ওয়ার্ড');
  const [photos, setPhotos] = useState<string[]>([SAMPLE_PRESET_PHOTOS[0]]);
  const [title, setTitle] = useState('মিরপুর ১০ - রাস্তায় বড় গর্ত');
  const [description, setDescription] = useState(
    'মিরপুর ১০ নম্বর প্রধান সড়কের আগে বড় একটি গর্ত তৈরি হয়েছে। গত কয়েকদিন ধরে এখানে চলাচল ঝুঁকিপূর্ণ হয়ে পড়েছে। দয়া করে দ্রুত ব্যবস্থা নেওয়া হোক।'
  );
  const [severity, setSeverity] = useState<IssueSeverity>('HIGH');
  const [pledgeAccepted, setPledgeAccepted] = useState(true);

  // Duplicate warning modal state
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [bypassDuplicateCheck, setBypassDuplicateCheck] = useState(false);

  const selectedCategory =
    REPORT_CATEGORIES.find((c) => c.id === selectedCatId) || REPORT_CATEGORIES[0];

  // Filter categories by query
  const filteredCategories = REPORT_CATEGORIES.filter((c) =>
    categorySearchQuery.trim() === ''
      ? true
      : c.title.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Quick preset area selection
  const handleSelectAreaPreset = (areaSlug: string) => {
    const found = DHAKA_AREAS.find((a) => a.slug === areaSlug);
    if (found) {
      setArea(found.name);
      setLatitude(found.lat);
      setLongitude(found.lng);
      setAddress(`${found.nameBn || found.name}, ঢাকা`);
      setWard(found.wardList[0] || '১০ নং ওয়ার্ড');
    }
  };

  const handleNextFromLocation = () => {
    if (!bypassDuplicateCheck && selectedCategory) {
      const duplicates = findNearbyDuplicates(latitude, longitude, selectedCategory.id, 650);
      if (duplicates.length > 0) {
        setDuplicateMatches(duplicates);
        setShowDuplicateModal(true);
        return;
      }
    }
    setStep(3);
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!photos.includes(url) && photos.length < 5) {
      setPhotos([...photos, url]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !title.trim() || !description.trim()) {
      alert('দয়া করে শিরোনাম এবং বিবরণ পূরণ করুন।');
      return;
    }

    const created = addIssue({
      title,
      description,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.title,
      categoryGroup: selectedCategory.group,
      severity,
      latitude,
      longitude,
      address,
      area,
      ward,
      photos: photos.length > 0 ? photos : [SAMPLE_PRESET_PHOTOS[0]],
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    router.push(`/issues/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-bangla text-slate-800">
      {/* 1. Header Banner with City Illustration & Stepper */}
      {/* 1. Header Banner with City Illustration & Stepper */}
      <div className="relative bg-gradient-to-b from-[#EBF5F3]/80 via-[#F0F8F6] to-[#F8FAFC] border-b border-slate-200/80 pt-6 pb-8 overflow-hidden">
        {/* Dhaka Civic Illustration Panorama Backdrop on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 max-w-lg pointer-events-none opacity-20 lg:opacity-25 hidden md:block overflow-hidden">
          <img
            src="/images/report_hero_civic.jpg"
            alt="নাগরিক সেবা ও শহর উন্নয়ন চিত্র"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0F8F6] via-[#F0F8F6]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#EBF5F3]/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          {/* Top back link and step indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition font-medium"
            >
              <span>← হোমে ফিরে যান</span>
            </Link>

            {/* Stepper Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1 shrink-0 ${
                  step === 1
                    ? 'bg-[#0c4a45] text-white font-bold shadow-sm'
                    : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>1</span>
                <span>ক্যাটাগরি</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1 shrink-0 ${
                  step === 2
                    ? 'bg-[#0c4a45] text-white font-bold shadow-sm'
                    : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>2</span>
                <span>লোকেশন</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1 shrink-0 ${
                  step === 3
                    ? 'bg-[#0c4a45] text-white font-bold shadow-sm'
                    : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>3</span>
                <span>ছবি ও বিবরণ</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1 shrink-0 ${
                  step === 4
                    ? 'bg-[#0c4a45] text-white font-bold shadow-sm'
                    : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>4</span>
                <span>গুরুত্বর মাত্রা</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(5)}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1 shrink-0 ${
                  step === 5
                    ? 'bg-[#0c4a45] text-white font-bold shadow-sm'
                    : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>5</span>
                <span>জমা দিন</span>
              </button>
            </div>
          </div>

          {/* Heading with floating impact card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1.5 max-w-2xl">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                সমস্যা রিপোর্ট করুন
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {step === 1 && 'কোন ধরনের সমস্যার রিপোর্ট করতে চান?'}
                {step === 2 && 'সমস্যার অবস্থান কোথায়?'}
                {step === 3 && 'ছবি ও বিস্তারিত বিবরণ যোগ করুন'}
                {step === 4 && 'সমস্যার গুরুত্বের মাত্রা নির্বাচন করুন'}
                {step === 5 && 'রিপোর্ট পর্যালোচনা ও চূড়ান্ত দাখিল'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step === 1 &&
                  'নিচে আপনার সমস্যার ধরন নির্বাচন করুন। সঠিক ক্যাটাগরি নির্বাচন করলে দ্রুত সমাধান পেতে সাহায্য করবে।'}
                {step === 2 &&
                  'ম্যাপে পিন বসান অথবা আপনার এলাকার নাম নির্বাচন করুন। সঠিক অবস্থান সিটি কর্পোরেশনকে দ্রুত ঘটনাস্থলে পৌঁছাতে সাহায্য করে।'}
                {step === 3 &&
                  'সমস্যার পরিষ্কার ছবি ও সঠিক বিবরণ সংশ্লিষ্ট কর্তৃপক্ষের দ্রুত সমাধানের জন্য অত্যন্ত অপরিহার্য।'}
                {step === 4 &&
                  'জরুরি ও বিপজ্জনক সমস্যা সরাসরি বিশেষ অ্যালার্ট হিসেবে সিটি কর্পোরেশনে অগ্রাধিকার পায়।'}
                {step === 5 &&
                  'আপনার প্রদত্ত তথ্যগুলো যাচাই করে নিশ্চিত করুন।'}
              </p>
            </div>

            {/* Visual Civic Card with Generated Artwork */}
            <div className="hidden lg:flex items-center gap-3.5 bg-white/95 backdrop-blur-md border border-emerald-200/70 rounded-2xl p-2.5 shadow-md shadow-emerald-950/5 shrink-0 hover:shadow-lg transition">
              <div className="relative w-36 h-24 rounded-xl overflow-hidden shrink-0 border border-emerald-100 shadow-inner group">
                <img
                  src="/images/report_hero_civic.jpg"
                  alt="নাগরিক রিপোর্ট ঢাকা"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white tracking-wide">
                  স্মার্ট সিটি ঢাকা
                </span>
              </div>
              <div className="space-y-1 pr-1 text-left max-w-[190px]">
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>সিটি মনিটরিং</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  আপনার ১টি রিপোর্ট পরিবর্তন করবে শহর!
                </h4>
                <p className="text-[10px] text-slate-500 leading-tight">
                  সরাসরি সংশ্লিষ্ট সিটি কর্পোরেশন ও ওয়ার্ড অফিসে পৌঁছে যায়।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SECTION: Step Content Wizard (~68% width) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ================= STEP 1: CATEGORY SELECTION ================= */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      placeholder="ক্যাটাগরি খুঁজুন (যেমন: রাস্তা, পানি, বর্জ্য...)"
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0c4a45] shadow-sm text-slate-800"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setCategorySearchQuery('')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-sm transition shrink-0"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>সমস্ত ক্যাটাগরি</span>
                  </button>
                </div>

                {/* 3 Columns x 4 Rows Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCatId === cat.id;
                    const IconComponent = cat.icon;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCatId(cat.id);
                          setSeverity(cat.defaultSeverity);
                          if (!title || title.startsWith('মিরপুর ১০')) {
                            setTitle(`মিরপুর ১০ - ${cat.title} সমস্যা`);
                          }
                        }}
                        className={`group p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-full relative ${
                          isSelected
                            ? 'border-[#0c4a45] bg-[#f0f9f6] ring-1 ring-[#0c4a45]/40 shadow-sm'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color} shadow-sm`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>

                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                              {cat.count}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#0c4a45] transition">
                              {cat.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                              {cat.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center justify-end text-slate-400 group-hover:text-[#0c4a45] transition">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Bar: Privacy Shield & Next Step Button */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900 block">গোপনীয়তা ও নিরাপত্তা</span>
                      <span className="text-[11px] text-slate-500">
                        আপনার ব্যক্তিগত তথ্য সুরক্ষিত থাকবে। প্রয়োজনীয় ক্ষেত্র ছাড়া আপনার ঠিকানা প্রকাশ করা হবে না।
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition shrink-0"
                  >
                    <span>পরবর্তী ধাপ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: LOCATION PICKER ================= */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    সমস্যার অবস্থান নির্বাচন করুন
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ম্যাপে পিন টেনে নির্দিষ্ট অবস্থান নিশ্চিত করুন অথবা এলাকার নাম সিলেক্ট করুন।
                  </p>
                </div>

                {/* Quick Area Presets */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    ঢাকা মেট্রো এলাকা নির্বাচন (Presets):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DHAKA_AREAS.slice(0, 8).map((a) => (
                      <button
                        key={a.slug}
                        type="button"
                        onClick={() => handleSelectAreaPreset(a.slug)}
                        className={`text-xs px-3 py-1 rounded-xl border font-semibold transition ${
                          area.toLowerCase().includes(a.name.toLowerCase())
                            ? 'bg-[#0c4a45] text-white border-[#0c4a45]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {a.nameBn || a.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Map Picker */}
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onChangeLocation={(lat, lng) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                    height="320px"
                  />
                </div>

                {/* Address & Ward Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      রাস্তা বা ল্যান্ডমার্কের নাম *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="যেমন: মিরপুর ১০ গোলচত্বর প্রধান সড়ক"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0c4a45]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      এলাকা ও ওয়ার্ড *
                    </label>
                    <input
                      type="text"
                      value={`${area}, ${ward}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setArea(parts[0]?.trim() || area);
                        setWard(parts[1]?.trim() || ward);
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0c4a45]"
                    />
                  </div>
                </div>

                {/* GPS Coordinates Bar */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Crosshair className="w-3.5 h-3.5 text-[#0c4a45]" />
                    <span>জিপিএস: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">✓ জিপিএস লকড</span>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextFromLocation}
                    className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <span>পরবর্তী: ছবি ও বিবরণ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PHOTOS & DESCRIPTION ================= */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    ছবি ও বিস্তারিত বিবরণ যোগ করুন
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    সমস্যার ছবি ও বিবরণ যত স্পষ্ট হবে, সংশ্লিষ্ট কর্তৃপক্ষ তত দ্রুত ব্যবস্থা নিতে পারবে।
                  </p>
                </div>

                {/* Photo Previews */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    সমস্যার ছবি (সর্বোচ্চ ৫টি):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {photos.map((photoUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
                      >
                        <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                          ছবি #{idx + 1}
                        </span>
                      </div>
                    ))}

                    {photos.length < 5 && (
                      <div
                        onClick={() => handleAddSamplePhoto(SAMPLE_PRESET_PHOTOS[photos.length % SAMPLE_PRESET_PHOTOS.length])}
                        className="border-2 border-dashed border-slate-300 rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-3 text-center hover:border-[#0c4a45] transition cursor-pointer bg-slate-50/50"
                      >
                        <Camera className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700">ছবি যুক্ত করুন</span>
                        <span className="text-[10px] text-slate-400">ক্লিক করে নমুনা ছবি দিন</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Demo Presets Helper */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    দ্রুত ডেমো ছবি যোগ করতে ক্লিক করুন:
                  </span>
                  <div className="flex gap-2">
                    {SAMPLE_PRESET_PHOTOS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSamplePhoto(url)}
                        className="w-14 h-11 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-[#0c4a45] transition"
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title & Description Fields */}
                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      সমস্যার শিরোনাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="যেমন: মিরপুর ১০ নম্বর প্রধান সড়কে বড় গর্ত"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0c4a45]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      কী ঘটেছে বিস্তারিত লিখুন *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="সমস্যাটির বর্তমান অবস্থা, কতদিন ধরে চলছে এবং কী ধরনের ঝুঁকি তৈরি করছে তা লিখুন..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0c4a45]"
                    />
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <span>পরবর্তী: গুরুত্বর মাত্রা</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 4: SEVERITY LEVEL ================= */}
            {step === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    সমস্যার গুরুত্বের মাত্রা নির্বাচন করুন
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    সঠিক গুরুত্ব নির্ধারণ করলে সংশ্লিষ্ট বিভাগ অগ্রাধিকার ভিত্তিতে ব্যবস্থা নেবে।
                  </p>
                </div>

                {/* 4 Severity Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'LOW' as IssueSeverity,
                      label: 'স্বাভাবিক (Low)',
                      desc: 'সাধারণ বা ছোটখাটো অসুবিধা, স্বাভাবিক চলাচল সচল',
                      sla: 'এসএলএ: ১০ দিন',
                      badge: 'bg-slate-100 text-slate-800',
                    },
                    {
                      id: 'MEDIUM' as IssueSeverity,
                      label: 'মাঝারি (Medium)',
                      desc: 'নাগরিক চলাচলে বিঘ্ন ঘটছে, দ্রুত নজর দেওয়া দরকার',
                      sla: 'এসএলএ: ৭ দিন',
                      badge: 'bg-amber-100 text-amber-800',
                    },
                    {
                      id: 'HIGH' as IssueSeverity,
                      label: 'জরুরি (High)',
                      desc: 'যানবাহনের ক্ষতি বা দুর্ঘটনার বড় ঝুঁকি তৈরি হয়েছে',
                      sla: 'এসএলএ: ৩ দিন',
                      badge: 'bg-orange-100 text-orange-800',
                    },
                    {
                      id: 'CRITICAL' as IssueSeverity,
                      label: 'চরম জরুরি (Critical)',
                      desc: 'মানুষের জীবন ও নিরাপত্তার জন্য তাৎক্ষণিক মারাত্মক হুমকি',
                      sla: 'এসএলএ: ২৪ ঘণ্টা (Priority Alert)',
                      badge: 'bg-rose-100 text-rose-800',
                    },
                  ].map((sev) => {
                    const isSelected = severity === sev.id;

                    return (
                      <div
                        key={sev.id}
                        onClick={() => setSeverity(sev.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0c4a45] bg-[#f0f9f6] ring-1 ring-[#0c4a45]/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${sev.badge}`}>
                              {sev.label}
                            </span>
                            {sev.id === 'CRITICAL' && (
                              <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{sev.desc}</p>
                        </div>

                        <span className="text-[10px] font-bold text-slate-400 font-mono mt-3 block">
                          {sev.sla}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Responsible Department Preview Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0c4a45] text-white flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      অ্যাসাইন্ড বিভাগ
                    </span>
                    <p className="font-bold text-slate-900">
                      {selectedCategory.assignedDept}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      আপনার রিপোর্টটি স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট বিভাগে ফরওয়ার্ড করা হবে।
                    </p>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
                  >
                    <span>পরবর্তী: চূড়ান্ত দাখিল</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 5: REVIEW & FINAL SUBMIT ================= */}
            {step === 5 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">
                    রিপোর্ট পর্যালোচনা ও চূড়ান্ত দাখিল
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    প্রদত্ত তথ্যাদি যাচাই করুন এবং নিশ্চিত করে রিপোর্ট জমা দিন।
                  </p>
                </div>

                {/* Full Summary Box */}
                <div className="bg-[#f0f9f6] rounded-2xl p-5 border border-teal-100 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        সমস্যার শিরোনাম
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {title}
                      </h4>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#0c4a45] text-white text-xs font-bold shrink-0">
                      {selectedCategory.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200/60">
                    {description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">অবস্থান</span>
                      <span className="font-bold text-slate-800">{address}</span>
                    </div>

                    <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">গুরুত্ব</span>
                      <span className="font-bold text-orange-700">{severity}</span>
                    </div>

                    <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">সংযুক্ত ছবি</span>
                      <span className="font-bold text-slate-800">{photos.length} টি ছবি</span>
                    </div>
                  </div>

                  {/* Photo Thumbs */}
                  <div className="flex gap-2 overflow-x-auto pt-1">
                    {photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="Evidence"
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    ))}
                  </div>
                </div>

                {/* Citizen Pledge */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="pledge"
                    checked={pledgeAccepted}
                    onChange={(e) => setPledgeAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#0c4a45] focus:ring-[#0c4a45]"
                  />
                  <label htmlFor="pledge" className="text-xs text-slate-600 cursor-pointer">
                    আমি নিশ্চিত করছি যে উল্লিখিত তথ্য ও প্রমাণ সত্য এবং বাস্তব জনস্বার্থে রিপোর্টটি দাখিল করা হচ্ছে।
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!pledgeAccepted}
                    className="bg-[#0c4a45] hover:bg-[#083531] text-white text-xs font-extrabold px-8 py-3 rounded-xl flex items-center gap-2 shadow-md transition disabled:opacity-50"
                  >
                    <span>রিপোর্ট জমা দিন</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT SIDEBAR: Location preview, Quick Help & City Banner (~32% width) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: লোকেশন নির্বাচন */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0c4a45]" />
                  <span>লোকেশন নির্বাচন</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ম্যাপে পিন করুন অথবা ঠিকানা লিখে খুঁজুন
                </p>
              </div>

              {/* Mini Map with Green Circular Buffer Preview */}
              <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative">
                <CivicMap
                  issues={[]}
                  center={[latitude, longitude]}
                  zoom={13}
                  height="100%"
                  interactive={false}
                  hideLegend={true}
                />

                {/* Center Radar / Target Circle Graphic like screenshot */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-emerald-500/30 bg-emerald-500/10 animate-pulse flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-emerald-500/40 bg-emerald-500/15 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-[#0c4a45] ring-4 ring-white shadow-md flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Search Bar */}
              <div className="relative pt-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ঠিকানা, এলাকা বা ওয়ার্ড লিখুন..."
                  className="w-full text-xs pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0c4a45] text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => handleSelectAreaPreset('mirpur')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0c4a45]"
                  title="Locate me"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: দ্রুত সহায়তা (Checklist) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900">
                  দ্রুত সহায়তা
                </h4>
              </div>

              <ul className="space-y-2 text-[11px] text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>সঠিক ক্যাটাগরি নির্বাচন করুন</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ফটো সম্ভব পরিষ্কার ছবি আপলোড করুন</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>সমস্যার বিস্তারিত বিবরণ দিন</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>লোকেশন সঠিকভাবে পিন করুন</span>
                </li>
              </ul>
            </div>

            {/* Card 3: একসাথে গড়ি একটি পরিচ্ছন্ন ও নিরাপদ নগরী */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4 shadow-sm flex items-center gap-3">
              <div className="text-xl shrink-0">🌱</div>
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">একসাথে গড়ি</span>
                <span className="text-[11px] text-emerald-800">একটি পরিচ্ছন্ন ও নিরাপদ নগরী</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      {showDuplicateModal && (
        <DuplicateWarningModal
          nearbyDuplicates={duplicateMatches}
          onDismiss={() => setShowDuplicateModal(false)}
          onProceedAnyway={() => {
            setBypassDuplicateCheck(true);
            setShowDuplicateModal(false);
            setStep(3);
          }}
        />
      )}
    </div>
  );
}
