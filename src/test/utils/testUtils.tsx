/**
 * Test Utilities
 * Custom render function with providers and helper utilities
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock localStorage
 */
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

/**
 * Setup mock localStorage
 */
export function setupLocalStorageMock() {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
}

/**
 * Mock window.location.href
 */
export function mockWindowLocation() {
  delete (window as any).location;
  window.location = { href: '' } as any;
}

/**
 * Wait for async operations
 */
export function waitForAsync(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create mock bot data
 */
export function createMockBot(overrides = {}) {
  return {
    id: '1',
    name: 'Test Bot',
    hipaaCompliant: false,
    language: 'English',
    status: 'active' as const,
    greeting: 'Hello!',
    prompt: 'Test prompt',
    voice: 'alloy',
    model: 'gpt-4',
    phoneNumber: '+1 (555) 123-4567',
    ...overrides,
  };
}

/**
 * Create mock team member data
 */
export function createMockTeamMember(overrides = {}) {
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    active: true,
    ...overrides,
  };
}

/**
 * Create mock call log data
 */
export function createMockCallLog(overrides = {}) {
  return {
    id: '1',
    botName: 'Test Bot',
    phoneNumber: '+1 (555) 123-4567',
    duration: '5:30',
    cost: '$0.65',
    status: 'completed' as const,
    timestamp: '2024-01-15 10:30:00',
    ...overrides,
  };
}

/**
 * Create mock metrics data
 */
export function createMockMetrics(overrides = {}) {
  return {
    callsHandled: 1000,
    totalDuration: 3600,
    totalCost: 450.5,
    avgDuration: 3.6,
    ...overrides,
  };
}

/**
 * Create mock billing stats
 */
export function createMockBillingStats(overrides = {}) {
  return {
    current_month_cost: 1250.5,
    total_calls: 2500,
    total_duration: 7500,
    breakdown: [
      { category: 'API Calls', amount: 750.25 },
      { category: 'Storage', amount: 250.0 },
      { category: 'Bandwidth', amount: 250.25 },
    ],
    ...overrides,
  };
}

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
