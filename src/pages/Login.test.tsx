/**
 * Login Component Tests
 * Tests for login page functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  it('should render login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show/hide password when eye icon is clicked', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    // Click the eye icon button
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button has no aria-label
    await user.click(toggleButton);

    expect(passwordInput.type).toBe('text');
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    render(<Login />);

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
      expect(window.location.href).toBe('/overview');
    });
  });

  it('should display error on login failure', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('http://localhost:8000/api/v1/auth/login', () => {
        return HttpResponse.json(
          { detail: 'Invalid credentials' },
          { status: 401 }
        );
      })
    );

    render(<Login />);

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/session has expired|invalid|password|try again/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during login', async () => {
    const user = userEvent.setup();
    render(<Login />);

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Check for loading state
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
  });

  it('should handle Google login click', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    await user.click(googleButton);

    await waitFor(() => {
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
      expect(localStorage.getItem('authProvider')).toBe('google');
      expect(window.location.href).toBe('/overview');
    });
  });

  it('should handle Microsoft login click', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const microsoftButton = screen.getByRole('button', { name: /continue with microsoft/i });
    await user.click(microsoftButton);

    await waitFor(() => {
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
      expect(localStorage.getItem('authProvider')).toBe('microsoft');
      expect(window.location.href).toBe('/overview');
    });
  });

  it('should toggle remember me checkbox', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const checkbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should require email and password fields', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form validation should prevent submission
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
