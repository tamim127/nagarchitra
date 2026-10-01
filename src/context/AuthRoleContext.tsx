'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, UserProfile } from '@/types';
import { apiClient } from '@/services/apiClient';

interface AuthRoleContextType {
  role: UserRole;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isTampered: boolean;
  login: (email: string, password: string, requiredRole?: UserRole) => Promise<{
    success: boolean;
    error?: string;
    isLocked?: boolean;
    remainingMinutes?: number;
  }>;
  register: (name: string, email: string, password: string, location?: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  hasRole: (requiredRole: UserRole) => boolean;
}

const GUEST_PROFILE: UserProfile = {
  id: '',
  name: 'Guest',
  email: '',
  role: 'CITIZEN',
  avatar: '',
  joinedDate: '',
  location: '',
  stats: { reportsCount: 0, verifiedCount: 0, resolvedCount: 0, impactScore: 0 },
  badges: [],
};

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

// Map backend user data to frontend UserProfile
function mapBackendUserToProfile(user: any): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    avatar: user.avatar || '',
    joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('bn-BD') : '',
    location: user.location || user.department || '',
    stats: {
      reportsCount: user.reportsCount || 0,
      verifiedCount: user.verifiedCount || 0,
      resolvedCount: user.resolvedCount || 0,
      impactScore: user.impactScore || 0,
    },
    badges: [],
  };
}

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(GUEST_PROFILE);
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isTampered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('nagarchitra_jwt_token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await apiClient.getMe();
        if (response.success && response.data) {
          const profile = mapBackendUserToProfile(response.data);
          setCurrentUser(profile);
          setRole(profile.role);
          setIsAuthenticated(true);
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem('nagarchitra_jwt_token');
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem('nagarchitra_jwt_token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (
    emailInput: string,
    passwordInput: string,
    requiredRole?: UserRole
  ): Promise<{ success: boolean; error?: string; isLocked?: boolean; remainingMinutes?: number }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const response = await apiClient.login(cleanEmail, cleanPass);

      if (!response.success) {
        return {
          success: false,
          error: response.message || 'Invalid email or password.',
        };
      }

      const user = response.data?.user;
      if (!user) {
        return { success: false, error: 'Invalid response from server.' };
      }

      // Role check if logging in from a dedicated portal
      if (requiredRole && user.role !== requiredRole && user.role !== 'SUPER_ADMIN') {
        // Clear the token since wrong portal
        localStorage.removeItem('nagarchitra_jwt_token');
        return {
          success: false,
          error: `Access Denied: This account has [${user.role}] privileges, not [${requiredRole}].`,
        };
      }

      const profile = mapBackendUserToProfile(user);
      setCurrentUser(profile);
      setRole(profile.role);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error. Please try again.',
      };
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    _location?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    try {
      const response = await apiClient.register({
        name: cleanName,
        email: cleanEmail,
        password,
        // SECURITY: role is NOT sent — backend always defaults to CITIZEN
      });

      if (!response.success) {
        return {
          success: false,
          error: response.message || 'Registration failed.',
        };
      }

      const user = response.data?.user;
      if (!user) {
        return { success: false, error: 'Invalid response from server.' };
      }

      const profile = mapBackendUserToProfile(user);
      setCurrentUser(profile);
      setRole(profile.role);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error. Please try again.',
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nagarchitra_jwt_token');
    // Clean up legacy localStorage keys
    localStorage.removeItem('nc_sec_token_v3');
    localStorage.removeItem('nc_active_user_v3');
    localStorage.removeItem('nagarchitra_demo_role');

    setIsAuthenticated(false);
    setCurrentUser(GUEST_PROFILE);
    setRole('CITIZEN');
  }, []);

  const updateUser = useCallback((data: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      // Security rule: Role and ID cannot be updated via updateUser
      const safeData = { ...data };
      delete safeData.role;
      delete safeData.id;
      return { ...prev, ...safeData };
    });
  }, []);

  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    if (role === 'SUPER_ADMIN') return true;
    if (requiredRole === 'SUPER_ADMIN') return false;
    if (requiredRole === 'ADMIN') return role === 'ADMIN';
    if (requiredRole === 'AUTHORITY') return role === 'AUTHORITY' || role === 'ADMIN';
    if (requiredRole === 'CITIZEN') return true;
    return false;
  }, [role]);

  // Show nothing while checking session
  if (isLoading) {
    return null;
  }

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
