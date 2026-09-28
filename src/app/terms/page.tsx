'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
      <h1 className="text-3xl font-black text-slate-900">Terms of Use & Community Guidelines</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
        <p>By accessing NagarChitra, you agree to adhere to our Civic Integrity Principles:</p>
        <p>1. <strong>Factual Submissions Only:</strong> You may only report real, verifiable civic defects. Submitting fabricated complaints or spam will result in account suspension.</p>
        <p>2. <strong>Constructive Civic Engagement:</strong> The platform is designed to assist city maintenance crews with actionable ground data, not for targeted harassment or slander.</p>
        <p>3. <strong>Civic Prototype Disclaimer:</strong> Unless an official municipal partnership is established, authority actions on this prototype platform represent demonstration workflows.</p>
      </div>
    </div>
  );
}
