'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  Bell,
  Menu,
  X,
  MapPin,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, currentUser } = useAuthRole();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', labelBn: 'হোম' },
    { href: '/explore', label: 'Explore', labelBn: 'এক্সপ্লোর' },
    { href: '/report', label: 'Report', labelBn: 'রিপোর্ট' },
    { href: '/nagar/mirpur', label: 'Areas', labelBn: 'এলাকা' },
    { href: '/statistics', label: 'Statistics', labelBn: 'পরিসংখ্যান' },
    { href: '/open-data', label: 'Open Data', labelBn: 'মুক্ত তথ্য' },
    { href: '/about/how-it-works', label: 'About', labelBn: 'সম্পর্কে' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08221E] border-b border-[#123631] text-white">
      {/* Top Demo Mode Banner */}
      <div className="bg-[#051814] border-b border-[#0D302A] text-xs px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-accent text-slate-950 font-black text-[9px] tracking-wider uppercase">
            DEMO MODE
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Actions are simulated in local state. Review different stakeholder perspectives.
          </span>
        </div>

        {/* Right mini controls in top bar */}
        <div className="flex items-center gap-3.5 text-xs">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#082621] border border-[#13423B] rounded-full p-0.5 text-[11px] font-bold text-slate-300">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full transition ${
                language === 'en'
                  ? 'bg-accent text-slate-900 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 rounded-full transition font-bangla ${
                language === 'bn'
                  ? 'bg-accent text-slate-900 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>

          <Link href="/explore" className="text-slate-400 hover:text-white transition" title="Search">
            <Search className="w-3.5 h-3.5" />
          </Link>

          <Link href="/issues/waste-dumping-dhanmondi-27-3b44" className="relative text-slate-400 hover:text-white transition" title="Notifications">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
              3
            </span>
          </Link>

          <Link href="/profile" className="flex items-center gap-1.5 hover:text-white transition pl-1">
            <img
              src={currentUser.avatar}
              alt="Tamiul"
              className="w-5 h-5 rounded-full object-cover ring-1 ring-accent/40"
            />
            <span className="text-[11px] font-bold text-slate-200 hidden sm:inline">Tamiul</span>
            <span className="text-[9px] text-slate-400 font-bangla hidden sm:inline">সিটিজেন</span>
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-600 to-accent flex items-center justify-center text-slate-950 font-black shadow-md shadow-accent/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-slate-900 fill-slate-900" />
            </div>
            <div className="flex flex-col">
              <span className="font-bangla font-black text-xl leading-none text-white tracking-tight">
                নগরচিত্র
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-accent/90">
                NagarChitra
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-semibold transition-colors py-2 ${
                    isActive
                      ? 'text-accent font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Report Button or spacing */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/report"
              className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              রিপোর্ট করুন +
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2 py-1 rounded bg-[#0C2F2B] border border-[#184640] text-xs font-bold text-accent"
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0E3530]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#123631] bg-[#08221E] px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-accent text-slate-900 font-bold'
                    : 'text-slate-200 hover:bg-[#0E3530]'
                }`}
              >
                {link.label} ({link.labelBn})
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#123631] flex items-center justify-between">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-slate-200">{currentUser.name}</span>
            </Link>
            <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent font-bold uppercase">
              {role}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
