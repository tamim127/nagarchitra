'use client';

import React, { useState, useMemo } from 'react';
import { useIssues } from '@/context/IssueContext';
import { useLanguage } from '@/context/LanguageContext';
import { CivicMap } from '@/components/Map';
import { Issue, IssueCategoryGroup, IssueSeverity, IssueStatus } from '@/types';
import { ISSUE_CATEGORIES } from '@/data/categories';
import { DHAKA_AREAS } from '@/data/areas';
import Link from 'next/link';
import {
  Filter,
  Search,
  MapPin,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  ThumbsUp,
  Flame,
  List,
  Map as MapIcon,
} from 'lucide-react';
import { IssueCard } from '@/components/IssueCard';

export default function ExplorePage() {
  const { issues } = useIssues();
  const { t, language } = useLanguage();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Selected issue on map
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  // Category list
  const categoryGroups = useMemo(() => {
    const map = new Map<string, typeof ISSUE_CATEGORIES>();
    ISSUE_CATEGORIES.forEach((cat) => {
      const existing = map.get(cat.group) || [];
      map.set(cat.group, [...existing, cat]);
    });
    return Array.from(map.entries());
  }, []);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(query) || (issue.titleBn && issue.titleBn.includes(query));
        const matchesDesc = issue.description.toLowerCase().includes(query);
        const matchesAddress = issue.location.address.toLowerCase().includes(query);
        const matchesArea = issue.location.area.toLowerCase().includes(query);
        const matchesTrack = issue.trackingNumber.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesAddress && !matchesArea && !matchesTrack) {
          return false;
        }
      }

      // Area
      if (selectedArea !== 'ALL') {
        const normArea = issue.location.area.toLowerCase().replace(/[^a-z]/g, '');
        const normSelected = selectedArea.toLowerCase().replace(/[^a-z]/g, '');
        if (!normArea.includes(normSelected) && !normSelected.includes(normArea)) {
          return false;
        }
      }

      // Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(issue.categoryId)) {
        return false;
      }

      // Status
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(issue.status)) {
        return false;
      }

      // Severity
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(issue.severity)) {
        return false;
      }

      return true;
    });
  }, [issues, searchQuery, selectedArea, selectedCategories, selectedStatuses, selectedSeverities]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleSeverity = (sev: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedArea('ALL');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedSeverities([]);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedArea !== 'ALL' ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedSeverities.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px-36px)]">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search issues, areas, roads, tracking IDs...', 'সমস্যা, এলাকা, রাস্তা বা ট্র্যাকিং আইডি খুঁজুন...')}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Area Selector Dropdown */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
          >
            <option value="ALL">{t('All Dhaka Areas', 'ঢাকার সব এলাকা')}</option>
            {DHAKA_AREAS.map((a) => (
              <option key={a.slug} value={a.name}>
                {language === 'bn' ? a.nameBn : a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile View Toggle */}
          <div className="flex md:hidden items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setMobileTab('map')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                mobileTab === 'map' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileTab('list')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                mobileTab === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              hasActiveFilters
                ? 'bg-primary-50 border-primary text-primary'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('Filters', 'ফিল্টার')}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-accent"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
            >
              {t('Reset', 'রিসেট')}
            </button>
          )}

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            {filteredIssues.length} {t('issues found', 'টি সমস্যা')}
          </span>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Filter Sidebar (Desktop) */}
        <aside
          className={`${
            showFiltersModal ? 'flex' : 'hidden lg:flex'
          } w-80 bg-white border-r border-slate-200 p-4 flex-col gap-5 overflow-y-auto shrink-0 z-30 absolute lg:relative inset-y-0 left-0 shadow-lg lg:shadow-none`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              {t('Filter Issues', 'ফিল্টার করুন')}
            </span>
            <button
              onClick={() => setShowFiltersModal(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Filters */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {t('Lifecycle Status', 'অবস্থা / স্ট্যাটাস')}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'SUBMITTED', label: 'Reported' },
                { id: 'VERIFIED', label: 'Verified' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'RESOLVED', label: 'Resolved' },
                { id: 'CITIZEN_VERIFICATION', label: 'In Review' },
                { id: 'CLOSED', label: 'Closed' },
                { id: 'REOPENED', label: 'Reopened' },
              ].map((s) => {
                const active = selectedStatuses.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleStatus(s.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-left transition ${
                      active
                        ? 'bg-primary text-white border-primary'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Filters */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {t('Severity Level', 'ঝুঁকির মাত্রা')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'CRITICAL', label: 'Critical', color: 'text-red-700 bg-red-50 border-red-200' },
                { id: 'HIGH', label: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200' },
                { id: 'MEDIUM', label: 'Medium', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
                { id: 'LOW', label: 'Low', color: 'text-slate-600 bg-slate-50 border-slate-200' },
              ].map((sev) => {
                const active = selectedSeverities.includes(sev.id);
                return (
                  <button
                    key={sev.id}
                    onClick={() => toggleSeverity(sev.id)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border transition ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : `${sev.color} hover:opacity-80`
                    }`}
                  >
                    {sev.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {t('Problem Category', 'সমস্যার ধরন')}
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {ISSUE_CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-lg border transition ${
                      active
                        ? 'bg-primary-50 border-primary text-primary font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                    <span className="text-[10px] text-slate-400">{cat.group}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Section: Interactive Leaflet Map OR Mobile List View */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Map view */}
          <div className={`w-full h-full ${mobileTab === 'list' ? 'hidden md:block' : 'block'}`}>
            <CivicMap
              issues={filteredIssues}
              selectedIssueId={activeIssue?.id}
              onSelectIssue={(issue) => setActiveIssue(issue)}
              height="100%"
            />
          </div>

          {/* List view (mobile alternative) */}
          <div
            className={`w-full h-full overflow-y-auto p-4 space-y-4 md:hidden ${
              mobileTab === 'list' ? 'block' : 'hidden'
            }`}
          >
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredIssues.length} issues in Dhaka
            </span>
            <div className="grid grid-cols-1 gap-4">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>

          {/* Bottom Floating Issue Preview Drawer (When a marker is clicked on the map) */}
          {activeIssue && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-[400] animate-scale-up space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary uppercase">
                    {activeIssue.status.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                    {activeIssue.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{activeIssue.location.address}</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveIssue(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                  <span>{activeIssue.communityConfirmations} confirmed</span>
                </span>

                <Link
                  href={`/issues/${activeIssue.id}`}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-light bg-primary-50 px-3 py-1 rounded-lg"
                >
                  <span>{t('View Detail & Audit', 'বিস্তারিত দেখুন')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
