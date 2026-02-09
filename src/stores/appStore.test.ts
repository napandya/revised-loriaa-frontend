/**
 * AppStore Tests
 * Tests for Zustand store actions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAppStore } from './appStore';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setState } = useAppStore;
    setState({
      bots: [],
      teamMembers: [],
      callLogs: [],
      metrics: {
        callsHandled: 0,
        totalDuration: 0,
        totalCost: 0,
        avgDuration: 0,
      },
      billingStats: null,
      billingHistory: [],
      isLoadingBots: false,
      isLoadingTeamMembers: false,
      isLoadingCallLogs: false,
      isLoadingMetrics: false,
      isLoadingBilling: false,
      botsError: null,
      teamMembersError: null,
      callLogsError: null,
      metricsError: null,
      billingError: null,
    });
  });

  describe('UI Actions', () => {
    it('should toggle sidebar collapsed state', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setSidebarCollapsed(true);
      });

      expect(result.current.sidebarCollapsed).toBe(true);
    });

    it('should set current page', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setCurrentPage('bots');
      });

      expect(result.current.currentPage).toBe('bots');
    });

    it('should set time filter', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTimeFilter('month');
      });

      expect(result.current.timeFilter).toBe('month');
    });
  });

  describe('Bots Actions', () => {
    it('should fetch bots successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchBots();
      });

      expect(result.current.bots).toHaveLength(2);
      expect(result.current.bots[0].name).toBe('Customer Support Bot');
      expect(result.current.isLoadingBots).toBe(false);
      expect(result.current.botsError).toBeNull();
    });

    it('should handle fetch bots error', async () => {
      server.use(
        http.get('http://localhost:8000/api/v1/bots', () => {
          return HttpResponse.json({ detail: 'Server error' }, { status: 500 });
        })
      );

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchBots();
      });

      expect(result.current.bots).toHaveLength(0);
      expect(result.current.isLoadingBots).toBe(false);
      expect(result.current.botsError).toBeTruthy();
    });

    it('should add bot successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      const newBot = {
        name: 'New Bot',
        hipaaCompliant: false,
        language: 'English',
        status: 'active' as const,
        greeting: 'Hello',
        prompt: 'Test prompt',
        voice: 'alloy',
        model: 'gpt-4',
      };

      await act(async () => {
        await result.current.addBot(newBot);
      });

      expect(result.current.bots).toHaveLength(1);
      expect(result.current.bots[0].name).toBe('New Bot');
    });

    it('should handle add bot error', async () => {
      server.use(
        http.post('http://localhost:8000/api/v1/bots', () => {
          return HttpResponse.json({ detail: 'Validation error' }, { status: 400 });
        })
      );

      const { result } = renderHook(() => useAppStore());

      const newBot = {
        name: 'New Bot',
        hipaaCompliant: false,
        language: 'English',
        status: 'active' as const,
        greeting: 'Hello',
        prompt: 'Test prompt',
        voice: 'alloy',
        model: 'gpt-4',
      };

      await expect(
        act(async () => {
          await result.current.addBot(newBot);
        })
      ).rejects.toThrow();
    });

    it('should update bot successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      // First fetch bots
      await act(async () => {
        await result.current.fetchBots();
      });

      const botId = result.current.bots[0].id;
      const updates = { greeting: 'Updated greeting' };

      await act(async () => {
        await result.current.updateBot(botId, updates);
      });

      const updatedBot = result.current.bots.find(b => b.id === botId);
      expect(updatedBot?.greeting).toBe('Updated greeting');
    });

    it('should delete bot successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      // First fetch bots
      await act(async () => {
        await result.current.fetchBots();
      });

      const botId = result.current.bots[0].id;
      const initialLength = result.current.bots.length;

      await act(async () => {
        await result.current.deleteBot(botId);
      });

      expect(result.current.bots).toHaveLength(initialLength - 1);
      expect(result.current.bots.find(b => b.id === botId)).toBeUndefined();
    });
  });

  describe('Team Members Actions', () => {
    it('should fetch team members successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      expect(result.current.teamMembers).toHaveLength(2);
      expect(result.current.teamMembers[0].name).toBe('John Doe');
      expect(result.current.isLoadingTeamMembers).toBe(false);
      expect(result.current.teamMembersError).toBeNull();
    });

    it('should handle fetch team members error', async () => {
      server.use(
        http.get('http://localhost:8000/api/v1/teams', () => {
          return HttpResponse.json({ detail: 'Server error' }, { status: 500 });
        })
      );

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      expect(result.current.teamMembers).toHaveLength(0);
      expect(result.current.teamMembersError).toBeTruthy();
    });

    it('should add team member successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      const newMember = {
        name: 'New Member',
        email: 'new@example.com',
        role: 'Developer',
      };

      await act(async () => {
        await result.current.addTeamMember(newMember);
      });

      expect(result.current.teamMembers).toHaveLength(1);
      expect(result.current.teamMembers[0].email).toBe('new@example.com');
    });
  });

  describe('Call Logs Actions', () => {
    it('should fetch call logs successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchCallLogs();
      });

      expect(result.current.callLogs).toHaveLength(2);
      expect(result.current.callLogs[0].botName).toBe('Customer Support Bot');
      expect(result.current.isLoadingCallLogs).toBe(false);
      expect(result.current.callLogsError).toBeNull();
    });

    it('should handle fetch call logs error', async () => {
      server.use(
        http.get('http://localhost:8000/api/v1/call-logs', () => {
          return HttpResponse.json({ detail: 'Server error' }, { status: 500 });
        })
      );

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchCallLogs();
      });

      expect(result.current.callLogsError).toBeTruthy();
    });
  });

  describe('Metrics Actions', () => {
    it('should fetch metrics successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchMetrics();
      });

      // Verify backend snake_case fields are transformed to frontend camelCase
      expect(result.current.metrics.callsHandled).toBe(1542); // from backend total_calls
      expect(result.current.metrics.totalDuration).toBe(15420); // from backend total_duration_minutes (257 mins * 60 = 15420 seconds)
      expect(result.current.metrics.totalCost).toBe(1850.4); // from backend total_cost
      expect(result.current.metrics.avgDuration).toBe(10.0); // from backend average_duration_seconds (600s / 60 = 10 mins)
      expect(result.current.isLoadingMetrics).toBe(false);
      expect(result.current.metricsError).toBeNull();
    });

    it('should handle fetch metrics error', async () => {
      server.use(
        http.get('http://localhost:8000/api/v1/dashboard/metrics', () => {
          return HttpResponse.json({ detail: 'Server error' }, { status: 500 });
        })
      );

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchMetrics();
      });

      expect(result.current.metricsError).toBeTruthy();
    });
  });

  describe('Billing Actions', () => {
    it('should fetch billing stats successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchBillingStats();
      });

      expect(result.current.billingStats).toBeDefined();
      expect(result.current.billingStats?.current_month_cost).toBe(1850.4);
      expect(result.current.isLoadingBilling).toBe(false);
      expect(result.current.billingError).toBeNull();
    });

    it('should fetch billing history successfully', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.fetchBillingHistory();
      });

      expect(result.current.billingHistory).toHaveLength(3);
      expect(result.current.isLoadingBilling).toBe(false);
    });
  });
});
