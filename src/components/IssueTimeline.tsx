'use client';

import React from 'react';
import { Issue, IssueStatus, StatusHistoryEntry } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  UserCheck,
  Wrench,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface IssueTimelineProps {
  issue: Issue;
}

const LIFECYCLE_STEPS: { status: IssueStatus; label: string; labelBn: string }[] = [
  { status: 'SUBMITTED', label: 'Reported', labelBn: 'রিপোর্ট দাখিল' },
  { status: 'VERIFIED', label: 'Verified', labelBn: 'যাচাইকৃত' },
  { status: 'ASSIGNED', label: 'Assigned', labelBn: 'দায়িত্ব অর্পণ' },
  { status: 'IN_PROGRESS', label: 'Work Started', labelBn: 'কাজ চলমান' },
  { status: 'RESOLVED', label: 'Marked Resolved', labelBn: 'সমাধান সম্পন্ন' },
  { status: 'CITIZEN_VERIFICATION', label: 'Citizen Review', labelBn: 'নাগরিক যাচাই' },
  { status: 'CLOSED', label: 'Closed', labelBn: 'নিষ্পত্তিকৃত' },
];

const getStepIndex = (status: IssueStatus): number => {
  switch (status) {
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      return 0;
    case 'VERIFIED':
      return 1;
    case 'ASSIGNED':
      return 2;
    case 'IN_PROGRESS':
      return 3;
    case 'RESOLVED':
      return 4;
    case 'CITIZEN_VERIFICATION':
      return 5;
    case 'CLOSED':
      return 6;
    case 'REOPENED':
      return 3; // Reopened sends it back to work started
    default:
      return 0;
  }
};

export const IssueTimeline: React.FC<IssueTimelineProps> = ({ issue }) => {
  const { t, language } = useLanguage();
  const currentStepIdx = getStepIndex(issue.status);
  const isReopened = issue.status === 'REOPENED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>{t('Lifecycle & Audit Timeline', 'সমস্যা সমাধানের জীবনচক্র ও অডিট লগ')}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'Every status transition is signed, timestamped, and publicly verifiable.',
              'প্রতিটি স্ট্যাটাস পরিবর্তন ডিজিটালভাবে সংরক্ষিত ও সর্বজনীন যাচাইযোগ্য।'
            )}
          </p>
        </div>

        {isReopened && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            {t('Reopened by Citizens', 'নাগরিকদের মতামতে পুনরায় চালু')}
          </span>
        )}
      </div>

      {/* Horizontal Lifecycle Stepper */}
      <div className="hidden md:block overflow-x-auto pb-2">
        <div className="flex items-center justify-between min-w-[620px] relative">
          {/* Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
          <div
            className={`absolute top-4 left-6 h-0.5 transition-all duration-500 -z-0 ${
              isReopened ? 'bg-red-500' : 'bg-primary'
            }`}
            style={{
              width: `${(currentStepIdx / (LIFECYCLE_STEPS.length - 1)) * 92}%`,
            }}
          />

          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;

            return (
              <div key={step.status} className="flex flex-col items-center text-center z-10 px-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-white shadow-sm ring-4 ring-white'
                      : isCurrent
                      ? isReopened
                        ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-md'
                        : 'bg-primary text-white ring-4 ring-primary-100 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-300 ring-4 ring-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 max-w-[85px] leading-tight ${
                    isCurrent
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {language === 'bn' ? step.labelBn : step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological Audit Log (Vertical List) */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t('Recorded Audit Events', 'নথিবদ্ধ কার্যক্রম বিবরণ')}
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {issue.timeline.map((entry: StatusHistoryEntry, index: number) => {
            const isFirst = index === 0;
            return (
              <div key={entry.id} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white transition ${
                    isFirst ? 'bg-primary ring-4 ring-primary-100' : 'bg-slate-400'
                  }`}
                />

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 hover:bg-slate-50 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {entry.changedBy}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                        {entry.changedByRole}
                      </span>
                      {entry.department && (
                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                          • {entry.department}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(entry.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {language === 'bn' && entry.noteBn ? entry.noteBn : entry.note}
                  </p>

                  {/* Resolution proof thumbnail if attached */}
                  {entry.evidenceUrl && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60">
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                        📷 {t('Resolution Proof Attached', 'সমাধানের প্রমাণ ছবি সংযোজিত')}:
                      </span>
                      <img
                        src={entry.evidenceUrl}
                        alt="Resolution proof"
                        className="w-32 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
