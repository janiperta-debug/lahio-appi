import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Vercel production the FastAPI function lives under the same origin.
// A separate backend URL can still be supplied for local/native development.
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

type User = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  location_city: string;
  search_radius_km: number;
  location_locked_until: string | null;
  is_verified: boolean;
  language: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, displayName: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<NonNullable<User>>) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => {}, register: async () => {},
  logout: async () => {}, updateUser: () => {}, refreshUser: async () => {},
});

async function apiCall(path: string, options: any = {}) {
  const token = await AsyncStorage.getItem('access_token');
  const headers: any = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail));
  }
  return response.json();
}

export { apiCall };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const data = await apiCall('/api/auth/me');
        setUser(data.user);
      }
    } catch {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    }
    setLoading(false);
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const data = await apiCall('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    await AsyncStorage.setItem('access_token', data.access_token);
    await AsyncStorage.setItem('refresh_token', data.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, displayName: string) => {
    const data = await apiCall('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ email, password, display_name: displayName }),
    });
    await AsyncStorage.setItem('access_token', data.access_token);
    await AsyncStorage.setItem('refresh_token', data.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    setUser(null);
  };

  const updateUser = (updates: Partial<NonNullable<User>>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const refreshUser = async () => {
    try {
      const data = await apiCall('/api/auth/me');
      setUser(data.user);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
