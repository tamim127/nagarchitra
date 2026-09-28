'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import { CivicMap } from '@/components/Map';
import { IssueTimeline } from '@/components/IssueTimeline';
import { VerificationWidget } from '@/components/VerificationWidget';
import { getStatusBadgeStyle, getSeverityBadge } from '@/components/IssueCard';
import { IssueStatus } from '@/types';
import Link from 'next/link';
import {
  MapPin,
  ThumbsUp,
  Share2,
  Bookmark,
  Building,
  Calendar,
  User,
  ArrowLeft,
  Flame,
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getIssueById, confirmIssue, followIssue, updateIssueStatus } = useIssues();
  const { t, language } = useLanguage();
  const { role, currentUser } = useAuthRole();

  const issueId = params?.id as string;
  const issue = getIssueById(issueId);

  // Authority quick-action state
  const [authorityStatus, setAuthorityStatus] = useState<IssueStatus>('IN_PROGRESS');
  const [authorityNote, setAuthorityNote] = useState('');
  const [authorityProofUrl, setAuthorityProofUrl] = useState(
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
  );
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Issue Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested civic issue (#{issueId}) does not exist or has been removed.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Map</span>
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadgeStyle(issue.status);
  const severityBadge = getSeverityBadge(issue.severity);
  const isCritical = issue.severity === 'CRITICAL' && issue.status !== 'CLOSED';

  const handleAuthorityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateIssueStatus(
      issue.id,
      authorityStatus,
      authorityNote.trim() || `Status updated to ${authorityStatus} by ${currentUser.name}`,
      authorityStatus === 'RESOLVED' ? authorityProofUrl : undefined,
      currentUser.role === 'AUTHORITY' ? 'Zone Engineering & Works' : undefined,
      currentUser.name
    );
    setShowAuthorityModal(false);
    setAuthorityNote('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/explore"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Map', 'ম্যাপে ফিরে যান')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: issue.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Issue link copied to clipboard!');
              }
            }}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Share Issue"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => followIssue(issue.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              issue.followedByUser
                ? 'bg-primary-50 border-primary text-primary'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${issue.followedByUser ? 'fill-primary' : ''}`} />
            <span>{issue.followedByUser ? t('Following', 'অনুসরণ করছেন') : t('Follow', 'অনুসরণ')}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              #{issue.trackingNumber}
            </span>
            <span
              className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold ${statusBadge}`}
            >
              {issue.status.replace('_', ' ')}
            </span>
            <span
              className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${severityBadge.className}`}
            >
              {isCritical && <Flame className="w-3 h-3 text-red-600 animate-pulse" />}
              {severityBadge.label}
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Reported on {new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          {language === 'bn' && issue.titleBn ? issue.titleBn : issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600 pt-1">
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{issue.location.address}, {issue.location.area} ({issue.location.ward})</span>
          </span>

          <span className="flex items-center gap-1">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Reported by {issue.reportedBy.name}</span>
          </span>

          {issue.assignedAuthority && (
            <span className="flex items-center gap-1 text-primary font-semibold">
              <Building className="w-4 h-4 shrink-0" />
              <span>{issue.assignedAuthority}</span>
            </span>
          )}
        </div>

        {/* Community Confirmation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => confirmIssue(issue.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                issue.userConfirmed
                  ? 'bg-primary text-white shadow-primary/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${issue.userConfirmed ? 'fill-accent text-accent' : ''}`} />
              <span>{t('I See This Too', 'আমিও এটি প্রত্যক্ষ করেছি')}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">
                {issue.communityConfirmations}
              </span>
            </button>
            <span className="text-xs text-slate-500 hidden sm:inline">
              {issue.communityConfirmations} {t('citizens confirmed this issue on site', 'নাগরিক এই সমস্যার সত্যতা নিশ্চিত করেছেন')}
            </span>
          </div>

          {/* Authority Quick-Action button for review demo */}
          {(role === 'AUTHORITY' || role === 'ADMIN') && (
            <button
              onClick={() => setShowAuthorityModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-sm transition"
            >
              <Shield className="w-4 h-4" />
              <span>{t('Authority Action: Update Status', 'কর্তৃপক্ষ একশন: স্ট্যাটাস আপডেট')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Evidence & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Evidence Gallery & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              {t('Photo Evidence', 'প্রমাণ ফটো গ্যালারি')}
            </h3>

            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={issue.media?.[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
                  {issue.media?.[0]?.caption || 'Original evidence photo submitted by citizen'}
                </span>
              </div>

              {issue.media && issue.media.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {issue.media.slice(1).map((m) => (
                    <div
                      key={m.id}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200"
                    >
                      <img src={m.url} alt={m.caption} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">
                {t('Citizen Statement', 'নাগরিক বিবরণী')}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {language === 'bn' && issue.descriptionBn ? issue.descriptionBn : issue.description}
              </p>
            </div>
          </div>

          {/* SIGNATURE CITIZEN VERIFICATION WIDGET */}
          <VerificationWidget issue={issue} />

          {/* Full 10-Stage Lifecycle & Audit Timeline */}
          <IssueTimeline issue={issue} />
        </div>

        {/* Right 1 Col: Mini Map & Operational Metadata */}
        <div className="space-y-6">
          {/* Location Map Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t('Geographic Location', 'ভৌগোলিক অবস্থান')}</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {issue.location.latitude.toFixed(4)}, {issue.location.longitude.toFixed(4)}
              </span>
            </div>

            <div className="h-48 rounded-xl overflow-hidden border border-slate-200">
              <CivicMap
                issues={[issue]}
                center={[issue.location.latitude, issue.location.longitude]}
                zoom={15}
                height="100%"
                interactive={false}
              />
            </div>

            <div className="text-xs space-y-1 text-slate-600 pt-1">
              <p className="font-bold text-slate-800">{issue.location.address}</p>
              <p>Area: {issue.location.area} • Ward: {issue.location.ward}</p>
              <p>City: Dhaka • Division: Dhaka</p>
            </div>
          </div>

          {/* SLA & Department Assignment Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary" />
              <span>{t('Authority & SLA Info', 'কর্তৃপক্ষ ও এসএলএ ট্র্যাকার')}</span>
            </h3>

            <div className="space-y-2 text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Assigned Authority
                </span>
                <p className="font-bold text-slate-900">
                  {issue.assignedAuthority || 'Dhaka North City Corporation (DNCC)'}
                </p>
              </div>

              {issue.assignedDepartment && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Responsible Department
                  </span>
                  <p className="font-bold text-slate-900">{issue.assignedDepartment}</p>
                </div>
              )}

              {issue.assignedOfficer && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Designated Field Officer
                  </span>
                  <p className="font-bold text-slate-900">{issue.assignedOfficer}</p>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Service Level Agreement (SLA)
                  </span>
                  <span className="font-bold text-slate-900">{issue.slaDays} Days Target</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ON TRACK
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Quick-Action Modal (Allows reviewing status change in demo) */}
      {showAuthorityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('Authority Status Update', 'কর্তৃপক্ষ স্ট্যাটাস পরিবর্তন')}
                </h3>
                <p className="text-xs text-slate-500">
                  Logged as {currentUser.name} ({currentUser.role})
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
                  New Lifecycle Status:
                </label>
                <select
                  value={authorityStatus}
                  onChange={(e) => setAuthorityStatus(e.target.value as IssueStatus)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED (Opens Citizen Verification)</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              {authorityStatus === 'RESOLVED' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Resolution Proof Photo (After Image URL):
                  </label>
                  <input
                    type="text"
                    value={authorityProofUrl}
                    onChange={(e) => setAuthorityProofUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                  <span className="text-[10px] text-slate-500">
                    This photo will be compared against citizen before-image.
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Official Audit Note / Action Taken:
                </label>
                <textarea
                  rows={3}
                  required
                  value={authorityNote}
                  onChange={(e) => setAuthorityNote(e.target.value)}
                  placeholder="e.g. Dispatched asphalt truck and completed patch work at 2:00 PM."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthorityModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light shadow"
                >
                  Commit Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
