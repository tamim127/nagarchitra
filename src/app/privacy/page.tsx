'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
      <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
        <p><strong>NagarChitra (নগরচিত্র)</strong> is committed to protecting citizen privacy. We only collect the minimal information necessary to report and track public infrastructure issues.</p>
        <p>1. <strong>Location Data:</strong> Geolocation coordinates pinned during reports are publicly displayed only for public roads and civic spaces. We do not track continuous background GPS.</p>
        <p>2. <strong>Photographic Evidence:</strong> Images submitted must strictly depict public issues (broken pavement, waste heaps, open manholes). Photos containing non-consensual personal faces or private indoor spaces will be flagged and removed.</p>
        <p>3. <strong>Open Data Protection:</strong> Personal contact info (phone numbers, email addresses) is never exported into public open datasets.</p>
      </div>
    </div>
  );
}
