'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { ISSUE_CATEGORIES } from '@/data/categories';
import { DHAKA_AREAS } from '@/data/areas';
import { IssueCategory, IssueSeverity } from '@/types';
import { LocationPicker } from '@/components/Map';
import { DuplicateWarningModal } from '@/components/DuplicateWarningModal';
import {
  MapPin,
  Camera,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  FileText,
  Crosshair,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
];

export default function ReportPage() {
  const router = useRouter();
  const { addIssue, findNearbyDuplicates } = useIssues();
  const { t, language } = useLanguage();

  const [step, setStep] = useState(1);

  // Form Fields
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>(null);
  const [latitude, setLatitude] = useState(23.8071);
  const [longitude, setLongitude] = useState(90.3686);
  const [address, setAddress] = useState('Mirpur 10 Circle, Ward 10');
  const [area, setArea] = useState('Mirpur');
  const [ward, setWard] = useState('Ward 10');
  const [photos, setPhotos] = useState<string[]>([SAMPLE_PRESET_PHOTOS[0]]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('HIGH');

  // Duplicate warning modal state
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [bypassDuplicateCheck, setBypassDuplicateCheck] = useState(false);

  // Quick preset area selection
  const handleSelectAreaPreset = (areaSlug: string) => {
    const found = DHAKA_AREAS.find((a) => a.slug === areaSlug);
    if (found) {
      setArea(found.name);
      setLatitude(found.lat);
      setLongitude(found.lng);
      setAddress(`${found.name}, Main Road`);
      setWard(found.wardList[0] || 'Ward 1');
    }
  };

  // Check duplicate before step 3
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
      alert('Please fill out all required fields.');
      return;
    }

    const created = addIssue({
      title,
      description,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    router.push(`/issues/${created.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Wizard Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            {t('STEP', 'ধাপ')} {step} {t('OF 5', 'এর ৫')}
          </span>
          <span className="text-primary font-bold">
            {step === 1 && t('Choose Category', 'সমস্যার ধরন বাছাই')}
            {step === 2 && t('Pin Location', 'অবস্থান চিহ্নিতকরণ')}
            {step === 3 && t('Upload Evidence', 'ছবি ও প্রমাণ যোগ')}
            {step === 4 && t('Describe Issue', 'বিস্তারিত বিবরণ')}
            {step === 5 && t('Review & Submit', 'পর্যালোচনা ও দাখিল')}
          </span>
        </div>

        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: What is the problem? */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('What is the problem?', 'সমস্যাটি কী ধরনের?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t(
                'Select the category that best describes the civic defect you want to report.',
                'আপনি যে সমস্যাটি রিপোর্ট করতে চান তার সঠিক ক্যাটাগরি নির্বাচন করুন।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {ISSUE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSeverity(cat.defaultSeverity);
                    if (!title) {
                      setTitle(language === 'bn' ? cat.nameBn : cat.name);
                    }
                  }}
                  className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-primary bg-primary-50 ring-2 ring-primary/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ●
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {language === 'bn' ? cat.nameBn : cat.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      {cat.group} • SLA: {cat.slaDays} days
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-1">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              disabled={!selectedCategory}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition shadow-sm"
            >
              <span>{t('Continue to Location', 'পরবর্তী: অবস্থান নির্বাচন')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Where is it? */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Where is the problem located?', 'সমস্যাটি কোথায় অবস্থিত?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t(
                'Drag the pin to the exact road spot or select a Dhaka neighborhood.',
                'ম্যাপের পিন টেনে নির্দিষ্ট রাস্তায় বসান অথবা এলাকা সিলেক্ট করুন।'
              )}
            </p>
          </div>

          {/* Quick Area Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600">
              {t('Quick Presets', 'দ্রুত এলাকা নির্বাচন')}:
            </span>
            <div className="flex flex-wrap gap-2">
              {DHAKA_AREAS.map((a) => (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => handleSelectAreaPreset(a.slug)}
                  className={`text-xs px-3 py-1 rounded-lg border font-semibold transition ${
                    area.toLowerCase().includes(a.name.toLowerCase())
                      ? 'bg-primary text-white border-primary'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {language === 'bn' ? a.nameBn : a.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Draggable Leaflet Map */}
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onChangeLocation={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
            height="300px"
          />

          {/* Address and Ward Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {t('Road / Landmark Address', 'রাস্তা / ল্যান্ডমার্কের নাম')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Mirpur 10 roundabout, Ward 10"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {t('Area & Ward', 'ওয়ার্ড / এলাকা')}
              </label>
              <input
                type="text"
                value={`${area}, ${ward}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setArea(parts[0]?.trim() || area);
                  setWard(parts[1]?.trim() || ward);
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Back', 'পূর্ববর্তী')}</span>
            </button>

            <button
              type="button"
              onClick={handleNextFromLocation}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light transition shadow-sm"
            >
              <span>{t('Continue to Evidence', 'পরবর্তী: প্রমাণ যোগ')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Evidence (Upload Photo) */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Upload Photo Evidence', 'সমস্যার ছবি ও প্রমাণ')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t(
                'Clear photographs speed up authority verification. Maximum 5 photos.',
                'স্পষ্ট ছবি যুক্ত করলে সংশ্লিষ্ট বিভাগ দ্রুত সমস্যা শনাক্ত ও সমাধান করতে পারে।'
              )}
            </p>
          </div>

          {/* Photo Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photoUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
              >
                <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1.5 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                  Photo #{idx + 1}
                </span>
              </div>
            ))}

            {photos.length < 5 && (
              <div className="border-2 border-dashed border-slate-300 rounded-xl aspect-video flex flex-col items-center justify-center p-4 text-center hover:border-primary transition cursor-pointer bg-slate-50/50">
                <Camera className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">Add Camera/Photo</span>
                <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
              </div>
            )}
          </div>

          {/* Preset Demo Photos Helper */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-600 block">
              {t('Demo Simulation: Pick sample Dhaka civic photo', 'ডেমো নমুনা ছবি নির্বাচন করুন')}:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESET_PHOTOS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSamplePhoto(url)}
                  className="relative w-16 h-12 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-primary transition"
                >
                  <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Back', 'পূর্ববর্তী')}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light transition shadow-sm"
            >
              <span>{t('Continue to Description', 'পরবর্তী: বিবরণ')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Tell us what happened */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Describe the Issue', 'সমস্যার বিস্তারিত বিবরণ')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t(
                'Explain how long it has existed, the hazards it poses, and landmarks.',
                'সমস্যাটি কতদিন ধরে আছে এবং এর কারণে কী ধরনের বিঘ্ন ঘটছে তা সংক্ষেপে লিখুন।'
              )}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {t('Title of the Problem', 'সমস্যার শিরোনাম')} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken asphalt and deep crater at Mirpur 10 roundabout"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {t('Tell us what happened...', 'কী ঘটেছে বিস্তারিত লিখুন...')} *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give details about vehicle risk, pedestrians affected, or emergency hazards..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Back', 'পূর্ববর্তী')}</span>
            </button>

            <button
              type="button"
              disabled={!title.trim() || !description.trim()}
              onClick={() => setStep(5)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 hover:bg-primary-light transition shadow-sm"
            >
              <span>{t('Continue to Severity', 'পরবর্তী: ঝুঁকির মাত্রা')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Severity & Final Submit */}
      {step === 5 && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in"
        >
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('Select Severity Level', 'ঝুঁকির মাত্রা নির্ধারণ')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t(
                'Critical issues trigger priority notifications for city engineering teams.',
                'জরুরি সমস্যাসমূহ সরাসরি স্পেশাল অ্যালার্ট ও অগ্রাধিকার তালিকায় যোগ হয়।'
              )}
            </p>
          </div>

          {/* Severity Radio Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: 'LOW' as IssueSeverity,
                label: 'Low',
                desc: 'Cosmetic or minor inconvenience',
                badge: 'bg-slate-100 text-slate-700',
              },
              {
                id: 'MEDIUM' as IssueSeverity,
                label: 'Medium',
                desc: 'Disrupts normal pedestrian walk',
                badge: 'bg-yellow-100 text-yellow-800',
              },
              {
                id: 'HIGH' as IssueSeverity,
                label: 'High',
                desc: 'Vehicle damage or traffic stall',
                badge: 'bg-orange-100 text-orange-800',
              },
              {
                id: 'CRITICAL' as IssueSeverity,
                label: 'Critical',
                desc: 'Immediate threat to human life',
                badge: 'bg-red-100 text-red-800',
              },
            ].map((sev) => {
              const isSelected = severity === sev.id;
              return (
                <button
                  key={sev.id}
                  type="button"
                  onClick={() => setSeverity(sev.id)}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary-50 ring-2 ring-primary/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${sev.badge}`}>
                      {sev.label}
                    </span>
                    {sev.id === 'CRITICAL' && (
                      <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{sev.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Summary Preview Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block">
              {t('Summary of Your Report', 'রিপোর্টের সারসংক্ষেপ')}:
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="font-semibold text-slate-500">Category:</span>{' '}
                {selectedCategory?.name}
              </div>
              <div>
                <span className="font-semibold text-slate-500">Location:</span> {address}
              </div>
              <div>
                <span className="font-semibold text-slate-500">Severity:</span> {severity}
              </div>
              <div>
                <span className="font-semibold text-slate-500">Photos:</span> {photos.length} attached
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Back', 'পূর্ববর্তী')}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-black text-sm hover:bg-primary-light transition shadow-md"
            >
              <span>{t('Submit Public Report', 'রিপোর্ট জমা দিন')}</span>
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </button>
          </div>
        </form>
      )}

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
