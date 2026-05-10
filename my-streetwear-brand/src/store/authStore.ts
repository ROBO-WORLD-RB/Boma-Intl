import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { api, LoginCredentials, RegisterData } from '@/lib/api';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken,
  createUserWithEmailAndPassword
} from 'firebase/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  initialize: () => void;

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
      isInitialized: false,

      initialize: () => {
        if (get().isInitialized) return;

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const token = await getIdToken(firebaseUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', token);
            }
            set({ token });
            // Fetch profile from our backend to get role and other info
            try {
              const response = await api.auth.me();
              set({ user: response.data, isInitialized: true });
            } catch (err) {
              set({ isInitialized: true });
            }
          } else {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-token');
            }
            set({ user: null, token: null, isInitialized: true });
          }
        });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            credentials.email, 
            credentials.password
          );
          
          // 2. Get ID Token
          const token = await getIdToken(userCredential.user);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }
          
          // 3. Sync with backend to get full user profile (and create user if not exists)
          const response = await api.auth.login({
            email: credentials.email,
            password: 'FIREBASE_MANAGED_AUTH' // Backend will verify via Firebase token
          });
          
          set({ user: response.data.user, token, isLoading: false });
        } catch (error: any) {
          let message = 'Login failed';
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            message = 'Invalid email or password';
          } else if (error.code === 'auth/too-many-requests') {
            message = 'Too many failed attempts. Please try again later.';
          }
          
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Create user in Firebase
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );

          // 2. Get ID Token
          const token = await getIdToken(userCredential.user);

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }

          // 3. Sync with backend
          const response = await api.auth.register({
            ...data,
            password: 'FIREBASE_MANAGED_AUTH'
          });

          set({ user: response.data.user, token, isLoading: false });
        } catch (error: any) {
          let message = 'Registration failed';
          if (error.code === 'auth/email-already-in-use') {
            message = 'Email already in use';
          }
          
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        await firebaseSignOut(auth);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        set({ user: null, token: null, error: null });
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await api.auth.me();
          set({ user: response.data, isLoading: false });
        } catch (error) {
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
    }
  )
);
