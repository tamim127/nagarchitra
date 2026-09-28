'use client';

import React from 'react';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { IssueCard } from '@/components/IssueCard';
import {
  Award,
  CheckCircle2,
  Eye,
  Shield,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  ThumbsUp,
  User,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, role } = useAuthRole();
  const { issues } = useIssues();
  const { t, language } = useLanguage();

  const userReports = issues.filter((i) => i.reportedBy.id === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-primary/10 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary border border-primary-200">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{currentUser.location}</span>
                <span>•</span>
                <Calendar className="w-3.5 h-3.5" />
                <span>Citizen since {currentUser.joinedDate}</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Civic Impact Score
            </span>
            <div className="text-3xl font-black text-primary flex items-center justify-center sm:justify-end gap-1">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>{currentUser.stats.impactScore}</span>
            </div>
            <span className="text-[10px] text-slate-500">Points earned from verified contributions</span>
          </div>
        </div>

        {/* Contribution Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">
              {t('Reports Submitted', 'দাখিলকৃত রিপোর্ট')}
            </span>
            <span className="text-2xl font-black text-slate-900">
              {userReports.length > 0 ? userReports.length : currentUser.stats.reportsCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">
              {t('Issues Verified', 'যাচাইকৃত সমস্যা')}
            </span>
            <span className="text-2xl font-black text-slate-900">
              {currentUser.stats.verifiedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 block mb-0.5">
              {t('Resolved Fixes', 'সমাধানকৃত কাজ')}
            </span>
            <span className="text-2xl font-black text-emerald-700">
              {currentUser.stats.resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Civic Badges Section (Not aggressive gamification, civic recognition) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <span>{t('Civic Badges & Recognition', 'নাগরিক স্বীকৃতি ও সম্মাননা')}</span>
          </h3>
          <p className="text-xs text-slate-500">
            Earned through factual reporting and constructive community verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentUser.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900">
                  {language === 'bn' ? badge.nameBn : badge.name}
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">{badge.description}</p>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Unlocked {badge.unlockedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User's Submitted Issues */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>{t('Your Reported Issues', 'আপনার দাখিলকৃত সমস্যাসমূহ')}</span>
        </h3>

        {userReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userReports.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No issues reported yet by this profile. Tap "Report Issue" to submit your first report.
          </div>
        )}
      </div>
    </div>
  );
}
