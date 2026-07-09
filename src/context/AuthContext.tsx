'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  uid?: string;
  fullName: string;
  displayName?: string;
  email: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
  branch?: string;
  semester?: number;
}

const mapUser = (u: any): User | null => {
  if (!u) return null;
  return {
    ...u,
    id: u.id || u._id?.toString(),
    uid: u.id || u._id?.toString(),
    displayName: u.fullName,
  };
};

interface AuthContextType {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const router = useRouter();

  // Custom setUser wrapper that automatically maps users
  const setUser = (val: User | null | ((prev: User | null) => User | null)) => {
    if (typeof val === 'function') {
      setUserState(prev => mapUser(val(prev)));
    } else {
      setUserState(mapUser(val));
    }
  };

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch session', err);
      setUserError(err);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsUserLoading(true);
    setUserError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setUser(data.user);
      router.push('/');
    } catch (err: any) {
      setUserError(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsUserLoading(true);
    setUserError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      setUser(data.user);
      router.push('/');
    } catch (err: any) {
      setUserError(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  };

  const logout = async () => {
    setIsUserLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (err: any) {
      console.error('Failed to log out', err);
    } finally {
      setIsUserLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isUserLoading, userError, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUser() {
  const { user, isUserLoading, userError } = useAuth();
  return { user, isUserLoading, userError };
}
