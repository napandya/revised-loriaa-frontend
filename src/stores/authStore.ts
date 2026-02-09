import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, SignUpData, AuthState } from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

// Constants for mock user data
const MOCK_USER_ROLE = 'Admin';

/**
 * Ensures error message is always a string primitive
 * @param message - The message to coerce to string
 * @param fallback - Fallback message if coercion fails
 * @returns A string error message
 */
function ensureErrorString(message: any, fallback: string): string {
  return typeof message === 'string' ? message : fallback;
}

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => void;
}

/**
 * Authentication store managing user state and auth operations
 * Persists token and user data to localStorage
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login with email and password
       */
      login: async (credentials: LoginCredentials) => {
        logger.info('Attempting login', { 
          component: 'authStore', 
          action: 'login',
          email: credentials.email 
        });
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await authService.login(credentials);
          
          // Mock login - simulating API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: 'Demo User',
            role: MOCK_USER_ROLE,
            avatar: undefined,
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          logger.info('Login successful', { 
            component: 'authStore', 
            action: 'login',
            userId: mockUser.id 
          });
          
          set({ 
            user: mockUser, 
            token: mockToken,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'authStore',
            action: 'login',
            email: credentials.email,
          });
          
          set({ 
            error: ensureErrorString(classified.userMessage, 'Login failed. Please try again.'),
            isLoading: false 
          });
          throw error;
        }
      },

      /**
       * Sign up new user
       */
      signup: async (data: SignUpData) => {
        logger.info('Attempting signup', { 
          component: 'authStore', 
          action: 'signup',
          email: data.email 
        });
        
        set({ isLoading: true, error: null });
        
        try {
          // Validate passwords match
          if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          
          // TODO: Replace with actual API call
          // const response = await authService.signup(data);
          
          // Mock signup
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            email: data.email,
            name: data.name,
            role: MOCK_USER_ROLE,
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          logger.info('Signup successful', { 
            component: 'authStore', 
            action: 'signup',
            userId: mockUser.id 
          });
          
          set({ 
            user: mockUser, 
            token: mockToken,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'authStore',
            action: 'signup',
            email: data.email,
          });
          
          set({ 
            error: ensureErrorString(classified.userMessage, 'Signup failed. Please try again.'),
            isLoading: false 
          });
          throw error;
        }
      },

      /**
       * Logout user and clear state
       */
      logout: () => {
        logger.info('User logout', { 
          component: 'authStore', 
          action: 'logout',
          userId: get().user?.id 
        });
        
        set({ 
          user: null,
          token: null,
          isAuthenticated: false,
          error: null 
        });
      },

      /**
       * OAuth login with Google
       * Demo implementation - replace with real Google OAuth in production
       */
      loginWithGoogle: async () => {
        logger.info('Attempting Google OAuth', { 
          component: 'authStore', 
          action: 'loginWithGoogle' 
        });
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual Google OAuth flow
          // const response = await authService.loginWithGoogle();
          
          // Mock Google OAuth - simulating API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: 'google-demo-1',
            email: 'demo.google@gmail.com',
            name: 'Google Demo User',
            role: MOCK_USER_ROLE,
            avatar: undefined,
          };
          
          const mockToken = 'mock-google-token-' + Date.now();
          
          logger.info('Google OAuth successful', { 
            component: 'authStore', 
            action: 'loginWithGoogle',
            userId: mockUser.id 
          });
          
          set({ 
            user: mockUser, 
            token: mockToken,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'authStore',
            action: 'loginWithGoogle',
          });
          
          set({ 
            error: ensureErrorString(classified.userMessage, 'Failed to login with Google. Please try again.'),
            isLoading: false 
          });
          throw error;
        }
      },

      /**
       * OAuth login with Microsoft
       * Demo implementation - replace with real Microsoft OAuth in production
       */
      loginWithMicrosoft: async () => {
        logger.info('Attempting Microsoft OAuth', { 
          component: 'authStore', 
          action: 'loginWithMicrosoft' 
        });
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual Microsoft OAuth flow
          // const response = await authService.loginWithMicrosoft();
          
          // Mock Microsoft OAuth - simulating API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: 'microsoft-demo-1',
            email: 'demo.microsoft@outlook.com',
            name: 'Microsoft Demo User',
            role: MOCK_USER_ROLE,
            avatar: undefined,
          };
          
          const mockToken = 'mock-microsoft-token-' + Date.now();
          
          logger.info('Microsoft OAuth successful', { 
            component: 'authStore', 
            action: 'loginWithMicrosoft',
            userId: mockUser.id 
          });
          
          set({ 
            user: mockUser, 
            token: mockToken,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'authStore',
            action: 'loginWithMicrosoft',
          });
          
          set({ 
            error: ensureErrorString(classified.userMessage, 'Failed to login with Microsoft. Please try again.'),
            isLoading: false 
          });
          throw error;
        }
      },

      /**
       * Refresh authentication token
       */
      refreshToken: async () => {
        logger.info('Refreshing token', { 
          component: 'authStore', 
          action: 'refreshToken' 
        });
        
        try {
          const currentToken = get().token;
          if (!currentToken) {
            throw new Error('No token to refresh');
          }
          
          // TODO: Replace with actual API call
          // const response = await authService.refreshToken(currentToken);
          
          // Mock token refresh
          const newToken = 'mock-refreshed-token-' + Date.now();
          
          logger.info('Token refreshed successfully', { 
            component: 'authStore', 
            action: 'refreshToken' 
          });
          
          set({ token: newToken });
        } catch (error: any) {
          handleError(error, {
            component: 'authStore',
            action: 'refreshToken',
          });
          
          // On refresh failure, logout user
          get().logout();
          throw error;
        }
      },

      /**
       * Update user profile
       */
      updateUser: (updates: Partial<User>) => {
        logger.info('Updating user profile', { 
          component: 'authStore', 
          action: 'updateUser',
          userId: get().user?.id 
        });
        
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Check authentication status from persisted storage
       * Validates if user has a valid token and user data
       */
      checkAuth: () => {
        const state = get();
        
        // Validate token is a string primitive
        const hasValidToken = typeof state.token === 'string' && state.token.length > 0;
        
        // Validate user object has correct shape with primitive values
        const hasValidUser = state.user !== null && 
          typeof state.user === 'object' &&
          typeof state.user.id === 'string' && state.user.id.length > 0 &&
          typeof state.user.email === 'string' && state.user.email.length > 0 &&
          typeof state.user.name === 'string' && state.user.name.length > 0 &&
          (typeof state.user.role === 'string' && state.user.role.length > 0);
        
        logger.info('Checking auth status', { 
          component: 'authStore', 
          action: 'checkAuth',
          hasValidToken,
          hasValidUser
        });
        
        if (hasValidToken && hasValidUser) {
          set({ isAuthenticated: true });
        } else {
          // Clear potentially corrupted state
          logger.warn('Invalid auth state detected, clearing storage', {
            component: 'authStore',
            action: 'checkAuth',
            hasValidToken,
            hasValidUser
          });
          set({ isAuthenticated: false, user: null, token: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        // Only persist serializable data, exclude functions
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (error) {
            console.error('Failed to parse localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Failed to save to localStorage:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state) => {
        // Validate rehydrated state
        if (state) {
          // Ensure role is a string primitive if user exists
          if (state.user && typeof state.user.role !== 'string') {
            logger.warn('Coercing user role to string primitive', {
              component: 'authStore',
              action: 'onRehydrateStorage',
              originalRole: state.user.role
            });
            state.user.role = String(state.user.role || MOCK_USER_ROLE);
          }
        }
      },
    }
  )
);
