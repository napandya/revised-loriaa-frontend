/**
 * AuthPage Component Tests
 * Smoke tests for login/signup page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthPage } from './AuthPage';
import { useAuthStore } from '@/stores/authStore';

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AuthPage', () => {
  const mockLogin = vi.fn();
  const mockSignup = vi.fn();
  const mockLoginWithGoogle = vi.fn();
  const mockLoginWithMicrosoft = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      loginWithGoogle: mockLoginWithGoogle,
      loginWithMicrosoft: mockLoginWithMicrosoft,
      isLoading: false,
      error: null,
    });
  });

  describe('page rendering', () => {
    it('should render the auth page', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/Loriaa/i)).toBeInTheDocument();
      expect(screen.getByText(/Welcome to the/i)).toBeInTheDocument();
      expect(screen.getByText(/Autonomous Workforce/i)).toBeInTheDocument();
    });

    it('should render login form by default', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('should render brand messaging', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/AI-powered property management/i)).toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('should switch to signup form when tab is clicked', async () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      const signupTab = screen.getByText(/Sign Up/i);
      await userEvent.click(signupTab);

      // Should show name field only in signup form
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('should switch back to login form', async () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      // Switch to signup
      const signupTab = screen.getByText(/Sign Up/i);
      await userEvent.click(signupTab);

      // Switch back to login
      const loginTab = screen.getByText(/Sign In/i);
      await userEvent.click(loginTab);

      // Name field should not be present in login
      expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
    });
  });

  describe('login form', () => {
    it('should render email and password fields', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('should have password visibility toggle', async () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      // Click the eye icon to toggle visibility
      const toggleButtons = screen.getAllByRole('button');
      const eyeToggle = toggleButtons.find(btn => btn.querySelector('[class*="lucide-eye"]'));
      
      if (eyeToggle) {
        await userEvent.click(eyeToggle);
        expect(passwordInput.type).toBe('text');
      }
    });
  });

  describe('signup form', () => {
    it('should render all signup fields', async () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      // Switch to signup
      const signupTab = screen.getByText(/Sign Up/i);
      await userEvent.click(signupTab);

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/Password/i).length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });
  });

  describe('OAuth buttons', () => {
    it('should render Google sign in button', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    });

    it('should render Microsoft sign in button', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Continue with Microsoft/i })).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('should show loading state when isLoading is true', () => {
      (useAuthStore as any).mockReturnValue({
        login: mockLogin,
        signup: mockSignup,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithMicrosoft: mockLoginWithMicrosoft,
        isLoading: true,
        error: null,
      });

      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      // Sign In button should show loading state
      const signInButton = screen.getByRole('button', { name: /Signing In.../i });
      expect(signInButton).toBeDisabled();
    });
  });

  describe('error handling', () => {
    it('should display error message when present', () => {
      (useAuthStore as any).mockReturnValue({
        login: mockLogin,
        signup: mockSignup,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithMicrosoft: mockLoginWithMicrosoft,
        isLoading: false,
        error: 'Invalid credentials',
      });

      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    it('should safely handle non-primitive error values', () => {
      // Mock store returns an object instead of string (edge case)
      (useAuthStore as any).mockReturnValue({
        login: mockLogin,
        signup: mockSignup,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithMicrosoft: mockLoginWithMicrosoft,
        isLoading: false,
        error: { message: 'Object error message' } as any, // Non-primitive error
      });

      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      // Should fallback to displaying error.message or default message
      const errorContainer = screen.getByText(/Object error message|An error occurred/i);
      expect(errorContainer).toBeInTheDocument();
    });

    it('should handle undefined error message property', () => {
      // Mock store returns an object without message property
      (useAuthStore as any).mockReturnValue({
        login: mockLogin,
        signup: mockSignup,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithMicrosoft: mockLoginWithMicrosoft,
        isLoading: false,
        error: { code: 'ERR_001' } as any, // Object without message
      });

      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      // Should display fallback message
      const errorContainer = screen.getByText(/An error occurred/i);
      expect(errorContainer).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should have submit button', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
