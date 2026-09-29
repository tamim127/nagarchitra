'use client';

import React from 'react';
import Link from 'next/link';
import { useSocket } from '@/context/SocketContext';
import { useLanguage } from '@/context/LanguageContext';
import { Radio, X, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const RealtimeToast: React.FC = () => {
  const { lastAlert, clearAlert } = useSocket();
  const { language } = useLanguage();

  if (!lastAlert) return null;

  const isBn = language === 'bn';
  const title = isBn ? lastAlert.titleBn : lastAlert.title;
  const message = isBn ? lastAlert.messageBn : lastAlert.message;

  const getIcon = () => {
    switch (lastAlert.type) {
      case 'NEW_ISSUE':
        return <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'STATUS_CHANGE':
        return <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />;
      case 'VOTE':
        return <Radio className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-accent shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#072520]/95 backdrop-blur-md border border-[#1b5e52] text-white p-4 rounded-xl shadow-2xl shadow-black/60 relative overflow-hidden">
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-teal-400 to-accent animate-pulse" />

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#0e3b33] border border-[#1b5e52]">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                {isBn ? 'সরাসরি আপডেট' : 'Real-time Live'}
              </span>
              <span className="text-[10px] text-slate-400 ml-auto">
                {lastAlert.timestamp}
              </span>
            </div>

            <h4 className="font-bold text-sm text-white line-clamp-1">
              {title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
              {message}
            </p>

            {lastAlert.issueId && (
              <div className="mt-2.5">
                <Link
                  href={`/issues/${lastAlert.issueId}`}
                  onClick={clearAlert}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-400 transition"
                >
                  <span>{isBn ? 'বিস্তারিত দেখুন' : 'View Issue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={clearAlert}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#0e3b33] transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
