'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSocket } from '@/context/SocketContext';
import {
  Search,
  Bell,
  Menu,
  X,
  MapPin,
  Radio,
  LogOut,
  LogIn,
  Shield,
  Crown,
  Building2,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, currentUser, isAuthenticated, logout } = useAuthRole();
  const { language, setLanguage, t } = useLanguage();
  const { isConnected, onlineCount } = useSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', labelBn: 'হোম' },
    { href: '/explore', label: 'Explore', labelBn: 'এক্সপ্লোর' },
    { href: '/report', label: 'Report', labelBn: 'রিপোর্ট' },
    { href: '/dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড' },
    { href: '/nagar/mirpur', label: 'Areas', labelBn: 'এলাকা' },
    { href: '/statistics', label: 'Statistics', labelBn: 'পরিসংখ্যান' },
    { href: '/open-data', label: 'Open Data', labelBn: 'ওপেন ডেটা' },
    { href: '/about', label: 'About', labelBn: 'সম্পর্ক' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#072520] border-b border-[#0f3b33] text-white">
      {/* Top Secure Session & Real-time Live Banner */}
      <div className="bg-[#051a16] border-b border-[#0b2923] text-xs px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'bn' ? 'সুরক্ষিত সেশন (HMAC 256-bit)' : 'Secured Session (HMAC 256-bit)'}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 hidden md:inline font-bangla">
            {language === 'bn'
              ? 'জিরো-ট্রাস্ট আরব্যাক ও অ্যান্টি-স্পুফিং সুরক্ষিত'
              : 'Zero-Trust RBAC & Anti-Spoofing Protected'}
          </span>
        </div>

        {/* Portal shortcut + Real-time Socket.io Live Status */}
        <div className="flex items-center gap-3">
          {role === 'SUPER_ADMIN' && (
            <Link
              href="/super-admin"
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>👑 {language === 'bn' ? 'সুপার অ্যাডমিন কনসোল' : 'Super Admin Portal'}</span>
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition"
            >
              <span>🛡️ {language === 'bn' ? 'অ্যাডমিন মডারেশন' : 'Admin Portal'}</span>
            </Link>
          )}
          {role === 'AUTHORITY' && (
            <Link
              href="/authority"
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300 transition"
            >
              <span>🏢 {language === 'bn' ? 'কর্তৃপক্ষ ডেস্ক' : 'Authority Desk'}</span>
            </Link>
          )}

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0a2f28] border border-[#144b40] text-[10px]">
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
            </span>
            <span className="font-semibold text-emerald-300 tracking-tight">
              {isConnected
                ? language === 'bn'
                  ? `সকেট লাইভ · ${onlineCount} নাগরিক অনলাইন`
                  : `Socket Live · ${onlineCount} Online`
                : language === 'bn'
                ? 'সকেট সংযুক্ত হচ্ছে...'
                : 'Connecting to Live Socket...'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group focus:outline-none">
            <img
              src="/images/logo.png"
              alt="নগরচিত্র - NagarChitra"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm transition-colors py-2 font-bangla ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-300 hover:text-white font-medium'
                  }`}
                >
                  <span>{language === 'bn' ? link.labelBn : link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#0d342d] border border-[#164e43] rounded-full p-0.5 text-xs font-bold text-slate-300">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full transition ${
                  language === 'en'
                    ? 'bg-teal-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-0.5 rounded-full transition font-bangla ${
                  language === 'bn'
                    ? 'bg-teal-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Search Icon */}
            <Link
              href="/explore"
              className="text-slate-300 hover:text-white transition p-1.5"
              title={t('Search', 'খুঁজুন')}
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Notification Bell */}
            <Link
              href="/issues/road-damage-mirpur-10-8f92"
              className="relative text-slate-300 hover:text-white transition p-1.5"
              title={t('Notifications', 'নোটিফিকেশন')}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-[#13423a]">
                {/* User Profile Chip */}
                <Link
                  href={
                    role === 'SUPER_ADMIN'
                      ? '/super-admin'
                      : role === 'ADMIN'
                      ? '/admin'
                      : role === 'AUTHORITY'
                      ? '/authority'
                      : '/dashboard'
                  }
                  className="flex items-center gap-2 hover:opacity-90 transition group p-1 rounded-xl"
                  title={
                    language === 'bn'
                      ? `${currentUser.name} (${role} পোর্টাল)`
                      : `${currentUser.name} (${role} Portal)`
                  }
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/40 group-hover:ring-accent"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#072520] text-[10px]">
                      {role === 'SUPER_ADMIN' && '👑'}
                      {role === 'ADMIN' && '🛡️'}
                      {role === 'AUTHORITY' && '🏢'}
                      {role === 'CITIZEN' && '🇧🇩'}
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-white group-hover:text-accent transition">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bangla mt-0.5 font-semibold">
                      {role === 'SUPER_ADMIN'
                        ? language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin'
                        : role === 'ADMIN'
                        ? language === 'bn' ? 'মডারেটর অ্যাডমিন' : 'Admin'
                        : role === 'AUTHORITY'
                        ? language === 'bn' ? 'সিটি কর্তৃপক্ষ' : 'City Authority'
                        : language === 'bn' ? 'নাগরিক' : 'Citizen'}
                    </span>
                  </div>
                </Link>

                {/* Switch Role Link */}
                <Link
                  href="/login"
                  className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold font-bangla transition border border-white/10"
                  title={language === 'bn' ? 'অন্য রোলে লগইন করুন' : 'Switch account / Login'}
                >
                  <LogIn className="w-3.5 h-3.5 text-accent" />
                  <span>{language === 'bn' ? 'রোল লগইন' : 'Switch Role'}</span>
                </Link>

                {/* Prominent Visible Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-bold font-bangla transition shadow-sm"
                  title={language === 'bn' ? 'লগআউট করুন' : 'Logout'}
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-[#13423a]">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-slate-950 font-black text-xs hover:bg-accent-400 transition font-bangla shadow-md shadow-accent/25 hover:scale-105"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'লগইন' : 'Sign In'}</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-900 transition font-bangla"
                >
                  <span>{language === 'bn' ? 'নিবন্ধন' : 'Register'}</span>
                </Link>
              </div>
            )}
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
                {language === 'bn' ? link.labelBn : link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#123631] space-y-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href={
                    role === 'SUPER_ADMIN'
                      ? '/super-admin'
                      : role === 'ADMIN'
                      ? '/admin'
                      : role === 'AUTHORITY'
                      ? '/authority'
                      : '/dashboard'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                    <p className="text-[10px] text-accent uppercase font-black">{role} PORTAL</p>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold font-bangla"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 rounded-xl bg-[#0f3b33] text-white font-bold text-xs"
                >
                  <span>{language === 'bn' ? 'নিবন্ধন' : 'Register'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
