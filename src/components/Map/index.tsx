'use client';

import React from 'react';
import dynamic from 'next/dynamic';

export const CivicMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] bg-slate-100 flex flex-col items-center justify-center text-slate-500 rounded-xl animate-pulse">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-medium">Loading Dhaka Civic Map...</span>
      </div>
    ),
  }
);

export const LocationPicker = dynamic(
  () => import('./LocationPickerMap').then((mod) => mod.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] bg-slate-100 flex flex-col items-center justify-center text-slate-500 rounded-xl animate-pulse">
        <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-xs">Initializing map picker...</span>
      </div>
    ),
  }
);
