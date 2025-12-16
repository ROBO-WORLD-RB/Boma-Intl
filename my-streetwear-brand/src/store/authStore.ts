import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { api, LoginCredentials, RegisterData } from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  // Computed
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.login(credentials);
          const { token, user } = response.data;
          
          // Store token in localStorage for API client
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }
          
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.register(data);
          const { token, user } = response.data;
          
          // Store token in localStorage for API client
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }
          
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        api.auth.logout();
        set({ user: null, token: null, error: null });
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await api.auth.me();
          set({ user: response.data, isLoading: false });
        } catch (error) {
          // Token might be invalid, clear auth state
          get().logout();
          set({ isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user) => {
        set({ user });
      },

      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('auth-token', token);
          } else {
            localStorage.removeItem('auth-token');
          }
        }
        set({ token });
      },

      isAuthenticated: () => {
        return !!get().token && !!get().user;
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => {
        // Sync token to localStorage on rehydration
        return (state) => {
          if (state?.token && typeof window !== 'undefined') {
            localStorage.setItem('auth-token', state.token);
          }
        };
      },
    }
  )
);
