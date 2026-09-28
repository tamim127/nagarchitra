'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin,
  PlusCircle,
  BarChart3,
  Building,
  Menu,
  X,
  Languages,
  Database,
  User,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, currentUser } = useAuthRole();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: '/explore',
      label: t('Explore Map', 'ম্যাপ এক্সপ্লোর'),
      icon: MapPin,
    },
    {
      href: '/report',
      label: t('Report Issue', 'সমস্যা রিপোর্ট'),
      icon: PlusCircle,
      highlight: true,
    },
    {
      href: '/nagar/mirpur',
      label: t('Area Pulse', 'এলাকাভিত্তিক চিত্র'),
      icon: BarChart3,
    },
    {
      href: '/authority',
      label: t('Authority Workspace', 'কর্তৃপক্ষ ওয়ার্কস্পেস'),
      icon: Building,
      badge: role === 'AUTHORITY' ? 'Active' : undefined,
    },
    {
      href: '/open-data',
      label: t('Open Data', 'মুক্ত নাগরিক তথ্য'),
      icon: Database,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tight text-accent">ন</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Nagar<span className="text-primary font-black">Chitra</span>
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  BD
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                {t('See. Report. Track.', 'সমস্যা দেখুন। রিপোর্ট করুন। পরিবর্তন ট্র্যাক করুন।')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href.startsWith('/nagar') && pathname.startsWith('/nagar'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'bg-primary text-white hover:bg-primary-light shadow-sm hover:shadow-md'
                      : isActive
                      ? 'text-primary bg-primary-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? 'text-accent' : ''}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              title="Toggle English / বাংলা"
            >
              <Languages className="w-3.5 h-3.5 text-primary" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Profile Link */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <div className="text-right hidden xl:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-medium capitalize">{role.toLowerCase()}</p>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 text-xs font-bold text-slate-700"
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold ${
                  link.highlight
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-primary-50 text-primary font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-bold text-slate-800">{currentUser.name}</span>
            </Link>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
              {role}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
