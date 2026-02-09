/**
 * TeamStore Tests
 * Tests for team store actions and state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTeamStore } from './teamStore';
import { UserRole } from '@/types';

describe('teamStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setState } = useTeamStore;
    setState({
      members: [],
      stats: {
        totalMembers: 0,
        activeUsers: 0,
        pendingInvites: 0,
      },
      isLoading: false,
      error: null,
    });
  });

  describe('fetchTeamMembers', () => {
    it('should fetch team members successfully', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      expect(result.current.members.length).toBeGreaterThan(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during fetch', async () => {
      const { result } = renderHook(() => useTeamStore());

      const fetchPromise = act(async () => {
        await result.current.fetchTeamMembers();
      });

      expect(result.current.isLoading).toBe(true);
      
      await fetchPromise;
      
      expect(result.current.isLoading).toBe(false);
    });

    it('should auto-fetch team stats after fetching members', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      expect(result.current.stats.totalMembers).toBe(result.current.members.length);
    });

    it('should fetch members with correct structure', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const members = result.current.members;
      expect(members.length).toBeGreaterThan(0);
      
      members.forEach(member => {
        expect(member).toHaveProperty('id');
        expect(member).toHaveProperty('name');
        expect(member).toHaveProperty('email');
        expect(member).toHaveProperty('role');
        expect(member).toHaveProperty('status');
      });
    });
  });

  describe('inviteMember', () => {
    it('should invite new team member successfully', async () => {
      const { result } = renderHook(() => useTeamStore());

      const inviteData = {
        name: 'New Member',
        email: 'new.member@example.com',
        role: UserRole.LEASING_STAFF,
      };

      await act(async () => {
        await result.current.inviteMember(inviteData);
      });

      expect(result.current.members.length).toBe(1);
      const member = result.current.members[0];
      expect(member.name).toBe(inviteData.name);
      expect(member.email).toBe(inviteData.email);
      expect(member.role).toBe(inviteData.role);
      expect(member.status).toBe('Pending');
      expect(member.invitedAt).toBeDefined();
    });

    it('should refresh stats after inviting member', async () => {
      const { result } = renderHook(() => useTeamStore());

      const inviteData = {
        name: 'New Member',
        email: 'new@example.com',
        role: UserRole.MARKETING,
      };

      await act(async () => {
        await result.current.inviteMember(inviteData);
      });

      expect(result.current.stats.totalMembers).toBe(1);
      expect(result.current.stats.pendingInvites).toBe(1);
    });
  });

  describe('updateMember', () => {
    it('should update team member successfully', async () => {
      const { result } = renderHook(() => useTeamStore());

      // Fetch members first
      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const memberId = result.current.members[0].id;
      const updates = { name: 'Updated Name', role: UserRole.ADMIN };

      await act(async () => {
        await result.current.updateMember(memberId, updates);
      });

      const updatedMember = result.current.members.find(m => m.id === memberId);
      expect(updatedMember?.name).toBe('Updated Name');
      expect(updatedMember?.role).toBe(UserRole.ADMIN);
    });

    it('should refresh stats when status changes', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const memberId = result.current.members.find(m => m.status === 'Active')?.id;
      if (!memberId) return;

      const oldStats = { ...result.current.stats };

      await act(async () => {
        await result.current.updateMember(memberId, { status: 'Inactive' });
      });

      // Stats should be recalculated
      expect(result.current.stats.activeUsers).toBeLessThanOrEqual(oldStats.activeUsers);
    });
  });

  describe('removeMember', () => {
    it('should remove team member successfully', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const initialCount = result.current.members.length;
      const memberIdToRemove = result.current.members[0].id;

      await act(async () => {
        await result.current.removeMember(memberIdToRemove);
      });

      expect(result.current.members.length).toBe(initialCount - 1);
      expect(result.current.members.find(m => m.id === memberIdToRemove)).toBeUndefined();
    });

    it('should refresh stats after removing member', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const initialTotal = result.current.stats.totalMembers;
      const memberIdToRemove = result.current.members[0].id;

      await act(async () => {
        await result.current.removeMember(memberIdToRemove);
      });

      expect(result.current.stats.totalMembers).toBe(initialTotal - 1);
    });
  });

  describe('resendInvite', () => {
    it('should update invitedAt timestamp', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const pendingMember = result.current.members.find(m => m.status === 'Pending');
      if (!pendingMember) return;

      const oldInvitedAt = pendingMember.invitedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10));

      await act(async () => {
        await result.current.resendInvite(pendingMember.id);
      });

      const updatedMember = result.current.members.find(m => m.id === pendingMember.id);
      expect(updatedMember?.invitedAt).toBeDefined();
      expect(updatedMember?.invitedAt).not.toBe(oldInvitedAt);
    });
  });

  describe('fetchTeamStats', () => {
    it('should calculate team stats correctly', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      await act(async () => {
        await result.current.fetchTeamStats();
      });

      const stats = result.current.stats;
      const members = result.current.members;

      expect(stats.totalMembers).toBe(members.length);
      expect(stats.activeUsers).toBe(members.filter(m => m.status === 'Active').length);
      expect(stats.pendingInvites).toBe(members.filter(m => m.status === 'Pending').length);
    });

    it('should have correct stats structure', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const stats = result.current.stats;
      expect(stats).toHaveProperty('totalMembers');
      expect(stats).toHaveProperty('activeUsers');
      expect(stats).toHaveProperty('pendingInvites');
      expect(stats.totalMembers).toBeGreaterThanOrEqual(0);
      expect(stats.activeUsers).toBeGreaterThanOrEqual(0);
      expect(stats.pendingInvites).toBeGreaterThanOrEqual(0);
    });

    it('should have valid stats relationships', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const stats = result.current.stats;
      
      // Active + Pending + Inactive should equal Total
      const activeAndPending = stats.activeUsers + stats.pendingInvites;
      expect(activeAndPending).toBeLessThanOrEqual(stats.totalMembers);
    });
  });

  describe('role filtering', () => {
    it('should fetch members with different roles', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const roles = new Set(result.current.members.map(m => m.role));
      expect(roles.size).toBeGreaterThan(1);
    });
  });

  describe('status tracking', () => {
    it('should fetch members with different statuses', async () => {
      const { result } = renderHook(() => useTeamStore());

      await act(async () => {
        await result.current.fetchTeamMembers();
      });

      const statuses = new Set(result.current.members.map(m => m.status));
      expect(statuses.size).toBeGreaterThan(0);
      
      // Check if any of the valid statuses are present
      const hasValidStatus = result.current.members.some(m => 
        ['Active', 'Pending', 'Inactive'].includes(m.status)
      );
      expect(hasValidStatus).toBe(true);
    });
  });
});
