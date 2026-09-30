'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';
import {
  generateSecureSessionToken,
  verifySecureSessionToken,
  recordFailedAttempt,
  clearFailedAttempts,
  recordSecurityAudit,
  getFailedAttempts,
  sanitizeInput,
} from '@/services/authSecurity';

interface AuthRoleContextType {
  role: UserRole;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isTampered: boolean;
  login: (email: string, password: string, requiredRole?: UserRole) => {
    success: boolean;
    error?: string;
    isLocked?: boolean;
    remainingMinutes?: number;
  };
  register: (name: string, email: string, password: string, location?: string) => {
    success: boolean;
    error?: string;
  };
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  hasRole: (requiredRole: UserRole) => boolean;
}

const CITIZEN_PROFILE: UserProfile = {
  id: 'u-1',
  name: 'Tuhin Rahman',
  email: 'citizen@nagarchitra.bd',
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
  ],
};

const AUTHORITY_PROFILE: UserProfile = {
  id: 'u-auth-1',
  name: 'Engr. Mahbubur Rahman',
  email: 'authority@dncc.gov.bd',
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
  email: 'admin@nagarchitra.org',
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

const SUPER_ADMIN_PROFILE: UserProfile = {
  id: 'u-super-1',
  name: 'Engr. Tariqul Islam (Master Admin)',
  email: 'superadmin@nagarchitra.gov.bd',
  role: 'SUPER_ADMIN',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  joinedDate: 'November 2025',
  location: 'Ministry of Local Govt & Dhaka Metropolitan Governance',
  stats: {
    reportsCount: 0,
    verifiedCount: 940,
    resolvedCount: 680,
    impactScore: 9500,
  },
  badges: [
    {
      id: 'b-super-1',
      name: 'Root Authority',
      nameBn: 'রুট অ্যাডমিনিস্ট্রেটর',
      description: 'Unrestricted cyber oversight and cryptographic governance keys.',
      icon: 'ShieldAlert',
      unlockedAt: '2025-11-01',
    },
  ],
};

const DEFAULT_CREDENTIALS: Record<string, { passwordHash: string; profile: UserProfile }> = {
  'citizen@nagarchitra.bd': {
    passwordHash: 'Citizen@2026!',
    profile: CITIZEN_PROFILE,
  },
  'tuhin@email.com': {
    passwordHash: 'Citizen@2026!',
    profile: CITIZEN_PROFILE,
  },
  'authority@dncc.gov.bd': {
    passwordHash: 'DhakaZone4@2026!',
    profile: AUTHORITY_PROFILE,
  },
  'm.rahman@dncc.gov.bd.demo': {
    passwordHash: 'DhakaZone4@2026!',
    profile: AUTHORITY_PROFILE,
  },
  'admin@nagarchitra.org': {
    passwordHash: 'AdminPass@2026!',
    profile: ADMIN_PROFILE,
  },
  'superadmin@nagarchitra.gov.bd': {
    passwordHash: 'SuperAdmin@Dhaka#2026!',
    profile: SUPER_ADMIN_PROFILE,
  },
};

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CITIZEN_PROFILE);
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isTampered, setIsTampered] = useState<boolean>(false);

  // Authenticate & Verify cryptographic token on boot
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('nc_sec_token_v3');
      const storedUser = localStorage.getItem('nc_active_user_v3');

      if (storedToken && storedUser) {
        const verifyRes = verifySecureSessionToken(storedToken);

        if (verifyRes.valid && verifyRes.session) {
          const userObj = JSON.parse(storedUser);
          // Check role integrity against session signature
          if (userObj.role === verifyRes.session.role && userObj.id === verifyRes.session.userId) {
            setCurrentUser(userObj);
            setRole(verifyRes.session.role);
            setIsAuthenticated(true);
            setIsTampered(false);
            return;
          } else {
            // Privilege escalation tampering detected!
            console.error('[SECURITY ALERT] Role tampering detected in localStorage!');
            setIsTampered(true);
            recordSecurityAudit({
              eventType: 'ROLE_TAMPERING_ATTEMPT',
              email: userObj.email || 'unknown',
              role: userObj.role || 'unknown',
              severity: 'CRITICAL',
              details: `Client storage tampering detected: claimed role [${userObj.role}] did not match signed cryptographic token [${verifyRes.session.role}]. Privilege stripped.`,
              ipMasked: '103.205.*.*',
            });
            logout();
            return;
          }
        } else {
          // Token invalid or expired
          if (verifyRes.error === 'ROLE_TAMPERING_DETECTED') {
            setIsTampered(true);
          }
          logout();
          return;
        }
      }

      // If user has explicitly logged out, preserve logged-out state
      if (localStorage.getItem('nc_logged_out') === 'true') {
        setIsAuthenticated(false);
        return;
      }

      // Default baseline login (Citizen) with signed token for initial onboarding
      const { token } = generateSecureSessionToken(CITIZEN_PROFILE);
      localStorage.setItem('nc_sec_token_v3', token);
      localStorage.setItem('nc_active_user_v3', JSON.stringify(CITIZEN_PROFILE));
      setCurrentUser(CITIZEN_PROFILE);
      setRole('CITIZEN');
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    }
  }, []);

  const login = (
    emailInput: string,
    passwordInput: string,
    requiredRole?: UserRole
  ): { success: boolean; error?: string; isLocked?: boolean; remainingMinutes?: number } => {
    const cleanEmail = sanitizeInput(emailInput).toLowerCase();
    const cleanPass = passwordInput.trim();

    // Check brute-force lockout
    const attemptStatus = getFailedAttempts(cleanEmail);
    if (attemptStatus.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((attemptStatus.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        isLocked: true,
        remainingMinutes,
        error: `Account is temporarily locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.`,
      };
    }

    const account = DEFAULT_CREDENTIALS[cleanEmail];

    if (!account || account.passwordHash !== cleanPass) {
      const record = recordFailedAttempt(cleanEmail);
      recordSecurityAudit({
        eventType: 'LOGIN_FAILED',
        email: cleanEmail,
        role: requiredRole || 'UNKNOWN',
        severity: record.isLocked ? 'CRITICAL' : 'WARN',
        details: `Invalid credentials entered. Failure count: ${record.count}`,
        ipMasked: '103.205.*.*',
      });

      return {
        success: false,
        isLocked: record.isLocked,
        remainingMinutes: record.remainingLockoutMinutes,
        error: record.isLocked
          ? `Too many failed attempts. Account locked for 15 minutes.`
          : `Invalid email or password. Attempt ${record.count} of 5.`,
      };
    }

    // Role check if logging in from a dedicated portal
    if (requiredRole && account.profile.role !== requiredRole && account.profile.role !== 'SUPER_ADMIN') {
      recordSecurityAudit({
        eventType: 'ACCESS_VIOLATION',
        email: cleanEmail,
        role: account.profile.role,
        severity: 'WARN',
        details: `User with role [${account.profile.role}] attempted to login through [${requiredRole}] portal.`,
        ipMasked: '103.205.*.*',
      });

      return {
        success: false,
        error: `Access Denied: This account has [${account.profile.role}] privileges, not [${requiredRole}].`,
      };
    }

    // Success: clear brute force counters and issue signed token
    clearFailedAttempts(cleanEmail);
    const { token } = generateSecureSessionToken(account.profile);

    try {
      localStorage.removeItem('nc_logged_out');
      localStorage.setItem('nc_sec_token_v3', token);
      localStorage.setItem('nc_active_user_v3', JSON.stringify(account.profile));
    } catch (e) {}

    setCurrentUser(account.profile);
    setRole(account.profile.role);
    setIsAuthenticated(true);
    setIsTampered(false);

    recordSecurityAudit({
      eventType: 'LOGIN_SUCCESS',
      email: cleanEmail,
      role: account.profile.role,
      severity: 'INFO',
      details: `Authenticated successfully with role [${account.profile.role}]. Cryptographic token sealed.`,
      ipMasked: '103.205.*.*',
    });

    return { success: true };
  };

  const register = (
    name: string,
    email: string,
    password: string,
    location?: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanName = sanitizeInput(name);

    if (DEFAULT_CREDENTIALS[cleanEmail]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const newCitizen: UserProfile = {
      id: `u-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: 'CITIZEN',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'আজকে নিবন্ধিত',
      location: location || 'Dhaka Metropolitan',
      stats: {
        reportsCount: 0,
        verifiedCount: 0,
        resolvedCount: 0,
        impactScore: 100,
      },
      badges: [],
    };

    DEFAULT_CREDENTIALS[cleanEmail] = {
      passwordHash: password,
      profile: newCitizen,
    };

    const { token } = generateSecureSessionToken(newCitizen);
    try {
      localStorage.removeItem('nc_logged_out');
      localStorage.setItem('nc_sec_token_v3', token);
      localStorage.setItem('nc_active_user_v3', JSON.stringify(newCitizen));
    } catch (e) {}

    setCurrentUser(newCitizen);
    setRole('CITIZEN');
    setIsAuthenticated(true);

    recordSecurityAudit({
      eventType: 'LOGIN_SUCCESS',
      email: cleanEmail,
      role: 'CITIZEN',
      severity: 'INFO',
      details: 'New citizen account registered and authenticated.',
      ipMasked: '103.205.*.*',
    });

    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem('nc_sec_token_v3');
      localStorage.removeItem('nc_active_user_v3');
      localStorage.removeItem('nagarchitra_demo_role');
      localStorage.setItem('nc_logged_out', 'true');
    } catch (e) {}

    recordSecurityAudit({
      eventType: 'LOGOUT',
      email: currentUser.email,
      role: currentUser.role,
      severity: 'INFO',
      details: 'User logged out and session revoked.',
      ipMasked: '103.205.*.*',
    });

    setIsAuthenticated(false);
    setCurrentUser(CITIZEN_PROFILE);
    setRole('CITIZEN');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      // Security rule: Role cannot be updated via updateUser
      const safeData = { ...data };
      delete safeData.role;
      delete safeData.id;

      const updated = { ...prev, ...safeData };
      const { token } = generateSecureSessionToken(updated);
      try {
        localStorage.setItem('nc_sec_token_v3', token);
        localStorage.setItem('nc_active_user_v3', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (role === 'SUPER_ADMIN') return true;
    if (requiredRole === 'SUPER_ADMIN') return false;
    if (requiredRole === 'ADMIN') return role === 'ADMIN';
    if (requiredRole === 'AUTHORITY') return role === 'AUTHORITY' || role === 'ADMIN';
    if (requiredRole === 'CITIZEN') return true;
    return false;
  };

  return (
    <AuthRoleContext.Provider
      value={{
        role,
        currentUser,
        isAuthenticated,
        isTampered,
        login,
        register,
        logout,
        updateUser,
        hasRole,
      }}
    >
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
