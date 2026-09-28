'use client';

import React, { useState } from 'react';
import { Issue } from '@/types';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthRole } from '@/context/AuthRoleContext';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationWidgetProps {
  issue: Issue;
}

export const VerificationWidget: React.FC<VerificationWidgetProps> = ({ issue }) => {
  const { voteResolution } = useIssues();
  const { t } = useLanguage();
  const { currentUser, role } = useAuthRole();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'slider' | 'sideBySide'>('sideBySide');

  const verifications = issue.citizenVerifications || {
    fixedCount: 0,
    stillExistsCount: 0,
    votes: [],
  };

  const totalVotes = verifications.fixedCount + verifications.stillExistsCount;
  const fixedPercent = totalVotes > 0 ? Math.round((verifications.fixedCount / totalVotes) * 100) : 0;
  const existsPercent = totalVotes > 0 ? 100 - fixedPercent : 0;

  const userExistingVote = verifications.votes?.find((v) => v.userId === currentUser.id)?.vote;

  const handleVote = (vote: 'FIXED' | 'STILL_EXISTS') => {
    voteResolution(issue.id, vote, comment.trim() || undefined);
    setComment('');
    if (vote === 'FIXED') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const beforePhoto = issue.media?.[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const afterPhoto = issue.resolutionMedia?.[0]?.url;

  const isResolvedOrInVerification =
    issue.status === 'RESOLVED' ||
    issue.status === 'CITIZEN_VERIFICATION' ||
    issue.status === 'CLOSED' ||
    issue.status === 'REOPENED';

  if (!isResolvedOrInVerification && !afterPhoto) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
        <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="font-bold text-slate-700 text-sm">
          {t('Citizen Verification Pending', 'নাগরিক যাচাই অপেক্ষমাণ')}
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {t(
            'Once the assigned city department completes work and uploads resolution proof, residents will be invited to inspect and vote here.',
            'দায়িত্বপ্রাপ্ত বিভাগ কাজ শেষ করে সমাধানের প্রমাণ ছবি আপলোড করলে স্থানীয় নাগরিকরা এখানে ভোট দিতে পারবেন।'
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/20 p-6 shadow-civic space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-extrabold uppercase tracking-wider mb-1">
            ⭐ {t('Signature Feature', 'সিগনেচার ফিচার')}
          </span>
          <h3 className="font-black text-slate-900 text-lg">
            {t('Citizen Verification & Before/After Proof', 'নাগরিক যাচাইকরণ ও কাজের সত্যতা পরীক্ষা')}
          </h3>
          <p className="text-xs text-slate-500">
            {t(
              'Authorities cannot close an issue on their own. Citizens must verify the fix on the ground.',
              'কর্তৃপক্ষ সমাধান চিহ্নিত করলেই শেষ নয়; স্থানীয় নাগরিকরা সত্যতা নিশ্চিত করলেই কেবল ইস্যু বন্ধ হবে।'
            )}
          </p>
        </div>

        {issue.status === 'REOPENED' ? (
          <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full border border-red-200 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            {t('Reopened by Residents', 'নাগরিক অসন্তোষে পুনরায় চালু')}
          </span>
        ) : issue.status === 'CLOSED' ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full border border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('Citizen-Confirmed Resolution', 'নাগরিক কর্তৃক অনুমোদিত ও নিষ্পত্তিকৃত')}
          </span>
        ) : (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
            {t('Voting Active', 'ভোট গ্রহণ চলমান')}
          </span>
        )}
      </div>

      {/* Before / After Photo Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {t('Ground Evidence Inspection', 'মাঠপর্যায়ের প্রমাণ তুলনা')}
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('sideBySide')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                activeTab === 'sideBySide' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Photo */}
          <div className="space-y-1.5">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={beforePhoto}
                alt="Before Problem"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/70 text-white font-bold text-xs tracking-wider uppercase">
                BEFORE (আগে)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Reported on {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* After Photo */}
          <div className="space-y-1.5">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50">
              {afterPhoto ? (
                <>
                  <img
                    src={afterPhoto}
                    alt="After Resolution"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-xs tracking-wider uppercase shadow">
                    AFTER (পরে - সমাধান প্রমাণ)
                  </span>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <span className="text-xs font-medium">Awaiting authority resolution image</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {issue.resolvedAt
                ? `Submitted by ${issue.assignedOfficer || 'Authority'} on ${new Date(
                    issue.resolvedAt
                  ).toLocaleDateString()}`
                : 'Pending upload'}
            </p>
          </div>
        </div>

        {issue.resolutionNote && (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900">
            <span className="font-bold block mb-0.5">📝 {t('Authority Note', 'কর্তৃপক্ষের বক্তব্য')}:</span>
            {issue.resolutionNote}
          </div>
        )}
      </div>

      {/* Voting Bar & Stats */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            {t('Resident Voting Result', 'নাগরিকদের মতামত ফলাফল')} ({totalVotes} {t('votes', 'ভোট')})
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-700">✓ {verifications.fixedCount} Fixed ({fixedPercent}%)</span>
            <span className="text-red-600">✕ {verifications.stillExistsCount} Still Exists ({existsPercent}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${totalVotes > 0 ? fixedPercent : 50}%` }}
          />
          <div
            className="bg-red-500 h-full transition-all duration-500"
            style={{ width: `${totalVotes > 0 ? existsPercent : 50}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500 italic">
          {t(
            'Rule: If local citizens submit 3 or more negative votes, this issue will be automatically reopened.',
            'নীতিমালা: ৩ বা ততোধিক নাগরিক যদি সমস্যাটি অমীমাংসিত জানান, এটি স্বয়ংক্রিয়ভাবে পুনরায় চালু (Reopen) হবে।'
          )}
        </p>
      </div>

      {/* Citizen Action Vote Section */}
      <div className="space-y-3 pt-2">
        <h4 className="font-bold text-slate-900 text-sm">
          {t('Have you personally checked this spot? Was it actually fixed?', 'আপনি কি স্থানটি দেখেছেন? সমস্যাটি কি সত্যিই ঠিক হয়েছে?')}
        </h4>

        {/* Feedback comment input */}
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(
              'Optional: Add specific notes about the current ground condition...',
              'মন্তব্য যোগ করুন: বর্তমান অবস্থা সম্পর্কে কোনো পর্যবেক্ষণ থাকলে লিখুন...'
            )}
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Vote Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleVote('FIXED')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
              userExistingVote === 'FIXED'
                ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t('YES, IT IS FIXED', 'হ্যাঁ, সমাধান হয়েছে')}</span>
          </button>

          <button
            onClick={() => handleVote('STILL_EXISTS')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
              userExistingVote === 'STILL_EXISTS'
                ? 'bg-red-700 text-white ring-4 ring-red-200'
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-md'
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>{t('NO, PROBLEM STILL EXISTS', 'না, সমস্যা এখনও আছে')}</span>
          </button>
        </div>

        {userExistingVote && (
          <p className="text-center text-xs font-semibold text-primary pt-1">
            ✓ You voted: <span className="uppercase font-bold">{userExistingVote.replace('_', ' ')}</span>
          </p>
        )}
      </div>

      {/* Community Comments / Verified Citizen Feedback */}
      {verifications.votes && verifications.votes.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 block">
            {t('Citizen Feedback Log', 'নাগরিকদের সরাসরি প্রতিক্রিয়া')}:
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {verifications.votes.map((v) => (
              <div
                key={v.id}
                className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-slate-800">{v.userName}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        v.vote === 'FIXED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {v.vote === 'FIXED' ? 'FIXED' : 'STILL EXISTS'}
                    </span>
                  </div>
                  {v.comment && <p className="text-slate-600">{v.comment}</p>}
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
