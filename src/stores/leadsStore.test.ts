/**
 * LeadsStore Tests
 * Tests for leads store actions and state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadsStore } from './leadsStore';
import { LeadStatus, LeadSource } from '@/types';

describe('leadsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setState } = useLeadsStore;
    setState({
      leads: [],
      pipelineStats: {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        touring: 0,
      },
      filters: {},
      selectedLead: null,
      isLoading: false,
      error: null,
    });
  });

  describe('fetchLeads', () => {
    it('should fetch leads successfully', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      expect(result.current.leads.length).toBeGreaterThan(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during fetch', async () => {
      const { result } = renderHook(() => useLeadsStore());

      const fetchPromise = act(async () => {
        await result.current.fetchLeads();
      });

      expect(result.current.isLoading).toBe(true);
      
      await fetchPromise;
      
      expect(result.current.isLoading).toBe(false);
    });

    it('should auto-fetch pipeline stats after fetching leads', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      expect(result.current.pipelineStats.total).toBe(result.current.leads.length);
    });
  });

  describe('createLead', () => {
    it('should create new lead successfully', async () => {
      const { result } = renderHook(() => useLeadsStore());

      const newLead = {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '+1234567890',
        score: 80,
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        interest: 'Test Interest',
      };

      await act(async () => {
        await result.current.createLead(newLead);
      });

      expect(result.current.leads.length).toBe(1);
      expect(result.current.leads[0].name).toBe('Test Lead');
      expect(result.current.leads[0].id).toBeDefined();
      expect(result.current.leads[0].createdAt).toBeDefined();
    });

    it('should add lead to beginning of list', async () => {
      const { result } = renderHook(() => useLeadsStore());

      // First fetch existing leads
      await act(async () => {
        await result.current.fetchLeads();
      });

      const initialCount = result.current.leads.length;

      const newLead = {
        name: 'Newest Lead',
        email: 'newest@example.com',
        phone: '+1234567890',
        score: 90,
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        interest: 'Test',
      };

      await act(async () => {
        await result.current.createLead(newLead);
      });

      expect(result.current.leads.length).toBe(initialCount + 1);
      expect(result.current.leads[0].name).toBe('Newest Lead');
    });
  });

  describe('updateLead', () => {
    it('should update lead successfully', async () => {
      const { result } = renderHook(() => useLeadsStore());

      // Fetch leads first
      await act(async () => {
        await result.current.fetchLeads();
      });

      const leadId = result.current.leads[0].id;
      const updates = { name: 'Updated Name', score: 95 };

      await act(async () => {
        await result.current.updateLead(leadId, updates);
      });

      const updatedLead = result.current.leads.find(l => l.id === leadId);
      expect(updatedLead?.name).toBe('Updated Name');
      expect(updatedLead?.score).toBe(95);
      expect(updatedLead?.updatedAt).toBeDefined();
    });

    it('should refresh pipeline stats when status changes', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      const leadId = result.current.leads[0].id;
      const oldStats = { ...result.current.pipelineStats };

      await act(async () => {
        await result.current.updateLead(leadId, { status: LeadStatus.QUALIFIED });
      });

      // Stats should be recalculated
      expect(result.current.pipelineStats).not.toEqual(oldStats);
    });
  });

  describe('deleteLead', () => {
    it('should delete lead successfully', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      const initialCount = result.current.leads.length;
      const leadIdToDelete = result.current.leads[0].id;

      await act(async () => {
        await result.current.deleteLead(leadIdToDelete);
      });

      expect(result.current.leads.length).toBe(initialCount - 1);
      expect(result.current.leads.find(l => l.id === leadIdToDelete)).toBeUndefined();
    });
  });

  describe('filters', () => {
    it('should set filters', () => {
      const { result } = renderHook(() => useLeadsStore());

      act(() => {
        result.current.setFilters({ status: LeadStatus.QUALIFIED });
      });

      expect(result.current.filters.status).toBe(LeadStatus.QUALIFIED);
    });

    it('should merge filters when setting new ones', () => {
      const { result } = renderHook(() => useLeadsStore());

      act(() => {
        result.current.setFilters({ status: LeadStatus.QUALIFIED });
      });

      act(() => {
        result.current.setFilters({ source: LeadSource.WEBSITE });
      });

      expect(result.current.filters.status).toBe(LeadStatus.QUALIFIED);
      expect(result.current.filters.source).toBe(LeadSource.WEBSITE);
    });

    it('should clear all filters', () => {
      const { result } = renderHook(() => useLeadsStore());

      act(() => {
        result.current.setFilters({ 
          status: LeadStatus.QUALIFIED,
          source: LeadSource.WEBSITE 
        });
      });

      expect(Object.keys(result.current.filters).length).toBeGreaterThan(0);

      act(() => {
        result.current.clearFilters();
      });

      expect(Object.keys(result.current.filters).length).toBe(0);
    });
  });

  describe('selectLead', () => {
    it('should select a lead', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      const leadToSelect = result.current.leads[0];

      act(() => {
        result.current.selectLead(leadToSelect);
      });

      expect(result.current.selectedLead).toEqual(leadToSelect);
    });

    it('should clear selected lead', () => {
      const { result } = renderHook(() => useLeadsStore());

      act(() => {
        result.current.selectLead(null);
      });

      expect(result.current.selectedLead).toBeNull();
    });
  });

  describe('updateLeadStatus', () => {
    it('should update lead status', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      const leadId = result.current.leads[0].id;
      const newStatus = LeadStatus.TOURING;

      await act(async () => {
        await result.current.updateLeadStatus(leadId, newStatus);
      });

      const updatedLead = result.current.leads.find(l => l.id === leadId);
      expect(updatedLead?.status).toBe(newStatus);
    });
  });

  describe('fetchPipelineStats', () => {
    it('should calculate pipeline stats correctly', async () => {
      const { result } = renderHook(() => useLeadsStore());

      await act(async () => {
        await result.current.fetchLeads();
      });

      await act(async () => {
        await result.current.fetchPipelineStats();
      });

      const stats = result.current.pipelineStats;
      const leads = result.current.leads;

      expect(stats.total).toBe(leads.length);
      expect(stats.new).toBe(leads.filter(l => l.status === LeadStatus.NEW).length);
      expect(stats.contacted).toBe(leads.filter(l => l.status === LeadStatus.CONTACTED).length);
      expect(stats.qualified).toBe(leads.filter(l => l.status === LeadStatus.QUALIFIED).length);
      expect(stats.touring).toBe(leads.filter(l => l.status === LeadStatus.TOURING).length);
    });
  });
});
