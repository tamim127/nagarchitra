'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';

interface AuthRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  availableRoles: { role: UserRole; label: string; subtitle: string }[];
}

const CITIZEN_PROFILE: UserProfile = {
  id: 'u-1',
  name: 'Tuhin Rahman',
  email: 'tuhin@email.com',
  role: 'CITIZEN',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  joinedDate: '০১ মার্চ ২০২৬',
  location: 'Mirpur 10, Dhaka',
  stats: {
    reportsCount: 14,
    verifiedCount: 28,
    resolvedCount: 9,
    impactScore: 420,
  },
  badges: [
    {
      id: 'b-1',
      name: 'First Reporter',
      nameBn: 'প্রথম রিপোর্টার',
      description: 'Submitted an authenticated public report that was verified by civic moderators.',
      icon: 'Award',
      unlockedAt: '2026-03-12',
    },
    {
      id: 'b-2',
      name: 'Local Observer',
      nameBn: 'স্থানীয় পর্যবেক্ষক',
      description: 'Confirmed 20+ nearby civic problems in their residential ward.',
      icon: 'Eye',
      unlockedAt: '2026-06-04',
    },
    {
      id: 'b-3',
      name: 'Verified Contributor',
      nameBn: 'যাচাইকৃত নাগরিক',
      description: 'Provided photographic resolution verification with 90%+ community agreement.',
      icon: 'CheckCircle2',
      unlockedAt: '2026-08-19',
    },
  ],
};

const AUTHORITY_PROFILE: UserProfile = {
  id: 'u-auth-1',
  name: 'Engr. Mahbubur Rahman',
  email: 'm.rahman@dncc.gov.bd.demo',
  role: 'AUTHORITY',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  joinedDate: 'January 2026',
  location: 'DNCC Zone 4 Engineering Division',
  stats: {
    reportsCount: 0,
    verifiedCount: 84,
    resolvedCount: 52,
    impactScore: 1250,
  },
  badges: [
    {
      id: 'b-auth-1',
      name: 'Zone Officer',
      nameBn: 'জোনাল অফিসার',
      description: 'Authorized engineering workflow and work-order dispatcher.',
      icon: 'Shield',
      unlockedAt: '2026-01-10',
    },
  ],
};

const ADMIN_PROFILE: UserProfile = {
  id: 'u-admin-1',
  name: 'Civic Admin Triage',
  email: 'moderation@nagarchitra.org',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  joinedDate: 'January 2026',
  location: 'Dhaka Central Operations',
  stats: {
    reportsCount: 0,
    verifiedCount: 310,
    resolvedCount: 140,
    impactScore: 3200,
  },
  badges: [
    {
      id: 'b-admin-1',
      name: 'System Moderator',
      nameBn: 'সিস্টেম মডারেটর',
      description: 'Platform integrity, spam rejection, and public data certification.',
      icon: 'Key',
      unlockedAt: '2026-01-01',
    },
  ],
};

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('CITIZEN');

  useEffect(() => {
    const savedRole = localStorage.getItem('nagarchitra_demo_role') as UserRole;
    if (savedRole && (savedRole === 'CITIZEN' || savedRole === 'AUTHORITY' || savedRole === 'ADMIN')) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('nagarchitra_demo_role', newRole);
  };

  const currentUser = role === 'AUTHORITY' ? AUTHORITY_PROFILE : role === 'ADMIN' ? ADMIN_PROFILE : CITIZEN_PROFILE;

  const availableRoles = [
    { role: 'CITIZEN' as UserRole, label: 'Citizen', subtitle: 'Report & Verify' },
    { role: 'AUTHORITY' as UserRole, label: 'Authority', subtitle: 'DNCC / WASA / DESCO' },
    { role: 'ADMIN' as UserRole, label: 'Admin', subtitle: 'Platform Operations' },
  ];

  return (
    <AuthRoleContext.Provider value={{ role, setRole, currentUser, availableRoles }}>
      {children}
    </AuthRoleContext.Provider>
  );
};

export const useAuthRole = () => {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider');
  }
  return context;
};
