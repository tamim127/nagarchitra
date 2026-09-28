'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, Database } from 'lucide-react';

export default function DataMethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Civic Integrity Standards
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Data Methodology & Governance
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          NagarChitra enforces strict data governance to ensure civic statistics are unbiased, tamper-proof, and privacy-preserving.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>1. Privacy by Design & EXIF Stripping</span>
          </h3>
          <p>
            When citizens upload photographs of public hazards, the system automatically strips sensitive EXIF metadata (camera serial numbers, private facial identifiers) while preserving verified geolocation coordinates. Domestic private properties are restricted from public listing.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>2. Citizen Verification Thresholds</span>
          </h3>
          <p>
            An issue marked &ldquo;RESOLVED&rdquo; by authority personnel enters a mandatory 7-day review window. 
            If local residents cast 3 or more &ldquo;STILL EXISTS&rdquo; votes with a majority dispute ratio, the platform automatically transitions the issue to &ldquo;REOPENED&rdquo; with an automated system audit log.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span>3. Open Civic Datasets</span>
          </h3>
          <p>
            Data exports are provided in open standards (CSV and GeoJSON). Citizen names are masked in public API exports to protect community contributors from harassment or political retribution.
          </p>
        </section>
      </div>
    </div>
  );
}
