/**
 * AuthStore Tests
 * Tests for authentication store actions and state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './authStore';
import { LoginCredentials, SignUpData } from '@/types';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setState } = useAuthStore;
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const { result } = renderHook(() => useAuthStore());

      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await act(async () => {
        await result.current.login(credentials);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe(credentials.email);
      expect(result.current.token).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during login', async () => {
      const { result } = renderHook(() => useAuthStore());

      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginPromise = act(async () => {
        await result.current.login(credentials);
      });

      // Check loading state is set immediately
      expect(result.current.isLoading).toBe(true);
      
      await loginPromise;
      
      expect(result.current.isLoading).toBe(false);
    });

    it('should clear error on successful login', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set initial error
      act(() => {
        result.current.setState({ error: 'Previous error' });
      });

      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await act(async () => {
        await result.current.login(credentials);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('signup', () => {
    it('should signup successfully with valid data', async () => {
      const { result } = renderHook(() => useAuthStore());

      const signupData: SignUpData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await act(async () => {
        await result.current.signup(signupData);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe(signupData.email);
      expect(result.current.user?.name).toBe(signupData.name);
      expect(result.current.token).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
    });

    it('should fail when passwords do not match', async () => {
      const { result } = renderHook(() => useAuthStore());

      const signupData: SignUpData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different-password',
      };

      await expect(
        act(async () => {
          await result.current.signup(signupData);
        })
      ).rejects.toThrow();

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should clear all authentication state', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('OAuth methods', () => {
    it('should login successfully with Google OAuth', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loginWithGoogle();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('demo.google@gmail.com');
      expect(result.current.user?.name).toBe('Google Demo User');
      expect(result.current.token).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should login successfully with Microsoft OAuth', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loginWithMicrosoft();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('demo.microsoft@outlook.com');
      expect(result.current.user?.name).toBe('Microsoft Demo User');
      expect(result.current.token).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set user role correctly for Google OAuth', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loginWithGoogle();
      });

      expect(result.current.user?.role).toBe('Admin');
      // Verify role can be serialized without errors
      expect(() => JSON.stringify(result.current.user)).not.toThrow();
    });

    it('should set user role correctly for Microsoft OAuth', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loginWithMicrosoft();
      });

      expect(result.current.user?.role).toBe('Admin');
      // Verify role can be serialized without errors
      expect(() => JSON.stringify(result.current.user)).not.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token when user is authenticated', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      const oldToken = result.current.token;

      // Wait a bit to ensure token changes
      await new Promise(resolve => setTimeout(resolve, 10));

      // Refresh token
      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.token).toBeDefined();
      expect(result.current.token).not.toBe(oldToken);
    });

    it('should logout when refresh fails (no token)', async () => {
      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.refreshToken();
        })
      ).rejects.toThrow();

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.user?.email).toBe('test@example.com');
    });

    it('should not update when user is not set', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error
      act(() => {
        result.current.setState({ error: 'Test error' });
      });

      expect(result.current.error).toBe('Test error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should set isAuthenticated to true when token and user exist', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set token and user
      act(() => {
        result.current.setState({
          token: 'test-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'Admin',
          },
          isAuthenticated: false,
        });
      });

      // Check auth
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set isAuthenticated to false when token is missing', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set user but no token
      act(() => {
        result.current.setState({
          token: null,
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'Admin',
          },
          isAuthenticated: true,
        });
      });

      // Check auth
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should set isAuthenticated to false when user is missing', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set token but no user
      act(() => {
        result.current.setState({
          token: 'test-token',
          user: null,
          isAuthenticated: true,
        });
      });

      // Check auth
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should set isAuthenticated to false when both token and user are missing', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set state with no token or user
      act(() => {
        result.current.setState({
          token: null,
          user: null,
          isAuthenticated: true,
        });
      });

      // Check auth
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });
});
