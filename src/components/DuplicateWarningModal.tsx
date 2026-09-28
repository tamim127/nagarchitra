'use client';

import React from 'react';
import { Issue } from '@/types';
import Link from 'next/link';
import { AlertCircle, MapPin, ThumbsUp, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DuplicateWarningModalProps {
  nearbyDuplicates: { issue: Issue; distanceMeters: number }[];
  onDismiss: () => void;
  onProceedAnyway: () => void;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
  nearbyDuplicates,
  onDismiss,
  onProceedAnyway,
}) => {
  const { t } = useLanguage();

  if (nearbyDuplicates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {t('Similar Reports Found Nearby', 'নিকটস্থ এলাকায় সদৃশ রিপোর্ট পাওয়া গেছে')}
              </h3>
              <p className="text-xs text-slate-500">
                {t(
                  'Avoid submitting duplicates. You can boost priority by confirming existing reports.',
                  'পুনরাবৃত্তি এড়াতে বিদ্যমান রিপোর্টে "নিশ্চিত" ভোট দিয়ে গুরুত্ব বাড়ান।'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of nearby issues */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {nearbyDuplicates.map(({ issue, distanceMeters }) => (
            <div
              key={issue.id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition text-xs space-y-2"
            >
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span className="flex items-center gap-1 text-primary font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{distanceMeters}m away</span>
                </span>
                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {issue.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{issue.title}</h4>
              <p className="text-slate-600 line-clamp-1">{issue.location.address}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                  <span>{issue.communityConfirmations} people confirmed</span>
                </span>

                <Link
                  href={`/issues/${issue.id}`}
                  target="_blank"
                  className="font-bold text-primary hover:text-primary-light flex items-center gap-1"
                >
                  <span>{t('View & Upvote', 'দেখুন ও ভোট দিন')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onProceedAnyway}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition"
          >
            {t('This is a Different Problem', 'এটি ভিন্ন সমস্যা, রিপোর্ট চালিয়ে যান')}
          </button>

          <button
            onClick={onDismiss}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-light shadow-sm transition"
          >
            {t('Cancel Report', 'রিপোর্ট বাতিল করুন')}
          </button>
        </div>
      </div>
    </div>
  );
};
