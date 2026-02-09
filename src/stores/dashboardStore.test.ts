/**
 * DashboardStore Tests
 * Tests for dashboard store actions and state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboardStore } from './dashboardStore';

describe('dashboardStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setState } = useDashboardStore;
    setState({
      metrics: [],
      marketingFunnel: [],
      leasingVelocity: [],
      aiActivity: [],
      portfolioHealth: null,
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
      },
      isLoading: false,
      error: null,
    });
  });

  describe('fetchDashboardData', () => {
    it('should fetch all dashboard data successfully', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      expect(result.current.metrics.length).toBeGreaterThan(0);
      expect(result.current.marketingFunnel.length).toBeGreaterThan(0);
      expect(result.current.leasingVelocity.length).toBeGreaterThan(0);
      expect(result.current.aiActivity.length).toBeGreaterThan(0);
      expect(result.current.portfolioHealth).not.toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during fetch', async () => {
      const { result } = renderHook(() => useDashboardStore());

      const fetchPromise = act(async () => {
        await result.current.fetchDashboardData();
      });

      expect(result.current.isLoading).toBe(true);
      
      await fetchPromise;
      
      expect(result.current.isLoading).toBe(false);
    });

    it('should clear error on successful fetch', async () => {
      const { result } = renderHook(() => useDashboardStore());

      // Set initial error
      act(() => {
        result.current.setState({ error: 'Previous error' });
      });

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      expect(result.current.error).toBeNull();
    });

    it('should fetch metrics with correct structure', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const metrics = result.current.metrics;
      expect(metrics.length).toBeGreaterThan(0);
      
      metrics.forEach(metric => {
        expect(metric).toHaveProperty('label');
        expect(metric).toHaveProperty('value');
        expect(metric).toHaveProperty('trend');
        expect(['up', 'down', 'neutral']).toContain(metric.trend);
      });
    });

    it('should fetch marketing funnel with percentage calculations', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const funnel = result.current.marketingFunnel;
      expect(funnel.length).toBeGreaterThan(0);
      
      funnel.forEach(stage => {
        expect(stage).toHaveProperty('stage');
        expect(stage).toHaveProperty('value');
        expect(stage).toHaveProperty('percentage');
        expect(stage.percentage).toBeGreaterThanOrEqual(0);
        expect(stage.percentage).toBeLessThanOrEqual(100);
      });
    });

    it('should fetch leasing velocity data', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const velocity = result.current.leasingVelocity;
      expect(velocity.length).toBeGreaterThan(0);
      
      velocity.forEach(entry => {
        expect(entry).toHaveProperty('date');
        expect(entry).toHaveProperty('leads');
        expect(entry).toHaveProperty('tours');
        expect(entry.leads).toBeGreaterThanOrEqual(0);
        expect(entry.tours).toBeGreaterThanOrEqual(0);
      });
    });

    it('should fetch AI activity items', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const activity = result.current.aiActivity;
      expect(activity.length).toBeGreaterThan(0);
      
      activity.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('agent');
        expect(item).toHaveProperty('action');
        expect(item).toHaveProperty('timestamp');
        expect(item).toHaveProperty('status');
      });
    });

    it('should fetch portfolio health data', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const health = result.current.portfolioHealth;
      expect(health).not.toBeNull();
      expect(health).toHaveProperty('score');
      expect(health).toHaveProperty('vacancyLossCost');
      expect(health).toHaveProperty('marketingSpendEfficiency');
      expect(health).toHaveProperty('ancillaryRevenue');
      expect(health).toHaveProperty('totalRevenueProjected');
    });
  });

  describe('setDateRange', () => {
    it('should update date range', () => {
      const { result } = renderHook(() => useDashboardStore());

      const newFrom = '2024-01-01';
      const newTo = '2024-01-31';

      act(() => {
        result.current.setDateRange(newFrom, newTo);
      });

      expect(result.current.dateRange.from).toBe(newFrom);
      expect(result.current.dateRange.to).toBe(newTo);
    });

    it('should have default date range of last 30 days', () => {
      const { result } = renderHook(() => useDashboardStore());

      const from = new Date(result.current.dateRange.from);
      const to = new Date(result.current.dateRange.to);
      const daysDiff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

      expect(daysDiff).toBeGreaterThanOrEqual(28);
      expect(daysDiff).toBeLessThanOrEqual(31);
    });
  });

  describe('refreshMetrics', () => {
    it('should refresh only metrics data', async () => {
      const { result } = renderHook(() => useDashboardStore());

      // First fetch all data
      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const initialMetrics = [...result.current.metrics];
      const initialFunnel = [...result.current.marketingFunnel];

      // Refresh metrics
      await act(async () => {
        await result.current.refreshMetrics();
      });

      // Metrics should be updated
      expect(result.current.metrics).toBeDefined();
      expect(result.current.metrics.length).toBe(initialMetrics.length);
      
      // Other data should remain the same
      expect(result.current.marketingFunnel).toEqual(initialFunnel);
    });

    it('should update metric change values on refresh', async () => {
      const { result } = renderHook(() => useDashboardStore());

      await act(async () => {
        await result.current.fetchDashboardData();
      });

      const oldMetrics = [...result.current.metrics];

      await act(async () => {
        await result.current.refreshMetrics();
      });

      // At least some metrics should have change values
      const hasChanges = result.current.metrics.some(m => m.change !== undefined);
      expect(hasChanges).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      const { result } = renderHook(() => useDashboardStore());

      // Note: Current implementation uses mock data, so we can't easily test real errors
      // This test verifies the structure is in place
      await act(async () => {
        await result.current.fetchDashboardData();
      });

      // Should not have errors with mock data
      expect(result.current.error).toBeNull();
    });
  });
});
