'use client';

import React from 'react';
import Link from 'next/link';
import { Issue, IssueStatus, IssueSeverity } from '@/types';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin,
  ThumbsUp,
  Clock,
  AlertTriangle,
  Building,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  compact?: boolean;
}

export const getStatusBadgeStyle = (status: IssueStatus) => {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'UNDER_REVIEW':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'VERIFIED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ASSIGNED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'IN_PROGRESS':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'RESOLVED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'CITIZEN_VERIFICATION':
      return 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold';
    case 'CLOSED':
      return 'bg-green-100 text-green-800 border-green-300 font-bold';
    case 'REOPENED':
      return 'bg-red-50 text-red-700 border-red-300 font-bold';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getSeverityBadge = (severity: IssueSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        labelBn: 'জরুরি',
        className: 'bg-red-100 text-red-700 border-red-200 font-bold',
      };
    case 'HIGH':
      return {
        label: 'HIGH',
        labelBn: 'উচ্চ',
        className: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
      };
    case 'MEDIUM':
      return {
        label: 'MEDIUM',
        labelBn: 'মাঝারি',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200 font-medium',
      };
    case 'LOW':
      return {
        label: 'LOW',
        labelBn: 'সাধারণ',
        className: 'bg-slate-100 text-slate-600 border-slate-200 font-normal',
      };
  }
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, compact = false }) => {
  const { confirmIssue } = useIssues();
  const { t, language, formatNumber } = useLanguage();
  const statusBadge = getStatusBadgeStyle(issue.status);
  const severityBadge = getSeverityBadge(issue.severity);
  const isCritical = issue.severity === 'CRITICAL' && issue.status !== 'CLOSED';

  const getStatusText = (status: IssueStatus) => {
    if (language === 'bn') {
      switch (status) {
        case 'SUBMITTED': return 'রিপোর্টকৃত';
        case 'UNDER_REVIEW': return 'পর্যালোচনাধীন';
        case 'VERIFIED': return 'যাচাইকৃত';
        case 'ASSIGNED': return 'বরাদ্দকৃত';
        case 'IN_PROGRESS': return 'চলমান';
        case 'RESOLVED': return 'সমাধান হয়েছে';
        case 'CITIZEN_VERIFICATION': return 'যাচাই অপেক্ষমাণ';
        case 'CLOSED': return 'নিষ্পত্তিকৃত';
        case 'REOPENED': return 'পুনরায় খোলা';
        default: return status;
      }
    }
    return status.replace('_', ' ');
  };

  const thumbnailUrl =
    issue.media?.[0]?.url ||
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      className={`group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-civic transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isCritical ? 'ring-1 ring-red-400/50' : ''
      }`}
    >
      <div>
        {/* Card Header & Thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={thumbnailUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm font-bold ${statusBadge}`}
            >
              {getStatusText(issue.status)}
            </span>

            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${severityBadge.className} flex items-center gap-1`}
            >
              {isCritical && <Flame className="w-3 h-3 text-red-600 animate-pulse" />}
              {language === 'bn' ? severityBadge.labelBn : severityBadge.label}
            </span>
          </div>

          {/* Bottom Overlay on Image: Location & Category */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-semibold truncate drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>
                {language === 'bn' ? (issue.location.areaBn || issue.location.area) : issue.location.area},{' '}
                {language === 'bn' ? (issue.location.wardBn || issue.location.ward) : issue.location.ward}
              </span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-slate-200">
              {language === 'bn' && issue.categoryNameBn ? issue.categoryNameBn : issue.categoryName}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5 font-bangla">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>#{issue.trackingNumber}</span>
            <span>
              {new Date(issue.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>

          <Link href={`/issues/${issue.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug">
              {language === 'bn' && issue.titleBn ? issue.titleBn : issue.title}
            </h3>
          </Link>

          {!compact && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {language === 'bn' && issue.descriptionBn ? issue.descriptionBn : issue.description}
            </p>
          )}

          {/* Authority tag if assigned */}
          {issue.assignedDepartment && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Building className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">
                {language === 'bn' ? (issue.assignedDepartmentBn || issue.assignedDepartment) : issue.assignedDepartment}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Upvote & View CTA */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 font-bangla">
        <button
          onClick={(e) => {
            e.preventDefault();
            confirmIssue(issue.id);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
            issue.userConfirmed
              ? 'bg-primary-100 text-primary-900 font-bold border border-primary-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title={t('Confirm you have seen this issue', 'সমস্যাটি প্রত্যক্ষ করেছেন নিশ্চিত করুন')}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${issue.userConfirmed ? 'fill-primary text-primary' : ''}`} />
          <span>{formatNumber(issue.communityConfirmations)}</span>
          <span className="hidden sm:inline text-[10px] text-slate-500">
            {t('Confirmed', 'নিশ্চিত')}
          </span>
        </button>

        <Link
          href={`/issues/${issue.id}`}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-light transition group/btn"
        >
          <span>{t('View Detail', 'বিস্তারিত')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
