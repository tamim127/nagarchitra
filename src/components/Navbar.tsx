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
    { href: '/authority', label: 'Statistics', labelBn: 'পরিসংখ্যান' },
    { href: '/open-data', label: 'Open Data', labelBn: 'মুক্ত তথ্য' },
    { href: '/about/how-it-works', label: 'About', labelBn: 'সম্পর্কে' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08221E] border-b border-[#123631] text-white">
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

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#0C2F2B] border border-[#184640] rounded-full p-0.5 text-xs font-bold text-slate-300">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition ${
                  language === 'en'
                    ? 'bg-accent text-slate-900 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-full transition font-bangla ${
                  language === 'bn'
                    ? 'bg-accent text-slate-900 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Quick Search Icon */}
            <Link
              href="/explore"
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-[#0E3530] transition"
              title="Search issues"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Notification Bell */}
            <Link
              href="/issues/waste-dumping-dhanmondi-27-3b44"
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-[#0E3530] transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#08221E] animate-pulse" />
            </Link>

            {/* User Profile Avatar with Online Status */}
            <Link
              href="/profile"
              className="relative flex items-center p-0.5 rounded-full ring-2 ring-accent/30 hover:ring-accent transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#08221E]" />
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
