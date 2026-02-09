import { create } from 'zustand';
import { TeamMember, TeamStats, InviteMemberData, UserRole } from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface TeamStore {
  // State
  members: TeamMember[];
  stats: TeamStats;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTeamMembers: () => Promise<void>;
  inviteMember: (data: InviteMemberData) => Promise<void>;
  updateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  resendInvite: (id: string) => Promise<void>;
  fetchTeamStats: () => Promise<void>;
}

/**
 * Team store managing team members, invitations, and stats
 */
export const useTeamStore = create<TeamStore>((set, get) => ({
  // Initial state
  members: [],
  stats: {
    totalMembers: 0,
    activeUsers: 0,
    pendingInvites: 0,
  },
  isLoading: false,
  error: null,

  /**
   * Fetch team members
   */
  fetchTeamMembers: async () => {
    logger.info('Fetching team members', { 
      component: 'teamStore', 
      action: 'fetchTeamMembers' 
    });
    
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      // const members = await teamService.getMembers();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Anderson',
          email: 'john.anderson@example.com',
          role: UserRole.ADMIN,
          status: 'Active',
          avatar: undefined,
          lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah.chen@example.com',
          role: UserRole.LEASING_STAFF,
          status: 'Active',
          avatar: undefined,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Michael Rodriguez',
          email: 'michael.r@example.com',
          role: UserRole.PROPERTY_MANAGER,
          status: 'Active',
          avatar: undefined,
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          name: 'Emily Taylor',
          email: 'emily.taylor@example.com',
          role: UserRole.MARKETING,
          status: 'Pending',
          avatar: undefined,
          invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          name: 'David Kim',
          email: 'david.kim@example.com',
          role: UserRole.LEASING_STAFF,
          status: 'Inactive',
          avatar: undefined,
          lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      logger.info('Successfully fetched team members', { 
        component: 'teamStore', 
        action: 'fetchTeamMembers',
        count: mockMembers.length 
      });
      
      set({ members: mockMembers, isLoading: false });
      
      // Auto-fetch stats
      get().fetchTeamStats();
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'teamStore',
        action: 'fetchTeamMembers',
      });
      
      set({ 
        error: classified.userMessage,
        isLoading: false 
      });
    }
  },

  /**
   * Invite new team member
   */
  inviteMember: async (data) => {
    logger.info('Inviting team member', { 
      component: 'teamStore', 
      action: 'inviteMember',
      email: data.email 
    });
    
    try {
      // TODO: Replace with actual API call
      // const newMember = await teamService.inviteMember(data);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'Pending',
        invitedAt: new Date().toISOString(),
      };
      
      logger.info('Successfully invited team member', { 
        component: 'teamStore', 
        action: 'inviteMember',
        memberId: newMember.id 
      });
      
      set(state => ({ 
        members: [...state.members, newMember] 
      }));
      
      // Refresh stats
      get().fetchTeamStats();
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'teamStore',
        action: 'inviteMember',
        email: data.email,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Update team member
   */
  updateMember: async (id, updates) => {
    logger.info('Updating team member', { 
      component: 'teamStore', 
      action: 'updateMember',
      memberId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // await teamService.updateMember(id, updates);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        members: state.members.map(member => 
          member.id === id ? { ...member, ...updates } : member
        ),
      }));
      
      logger.info('Successfully updated team member', { 
        component: 'teamStore', 
        action: 'updateMember',
        memberId: id 
      });
      
      // Refresh stats if status changed
      if (updates.status) {
        get().fetchTeamStats();
      }
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'teamStore',
        action: 'updateMember',
        memberId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Remove team member
   */
  removeMember: async (id) => {
    logger.info('Removing team member', { 
      component: 'teamStore', 
      action: 'removeMember',
      memberId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // await teamService.removeMember(id);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        members: state.members.filter(member => member.id !== id),
      }));
      
      logger.info('Successfully removed team member', { 
        component: 'teamStore', 
        action: 'removeMember',
        memberId: id 
      });
      
      // Refresh stats
      get().fetchTeamStats();
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'teamStore',
        action: 'removeMember',
        memberId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Resend invitation
   */
  resendInvite: async (id) => {
    logger.info('Resending invitation', { 
      component: 'teamStore', 
      action: 'resendInvite',
      memberId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // await teamService.resendInvite(id);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        members: state.members.map(member => 
          member.id === id 
            ? { ...member, invitedAt: new Date().toISOString() }
            : member
        ),
      }));
      
      logger.info('Successfully resent invitation', { 
        component: 'teamStore', 
        action: 'resendInvite',
        memberId: id 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'teamStore',
        action: 'resendInvite',
        memberId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Fetch team stats
   */
  fetchTeamStats: async () => {
    logger.info('Fetching team stats', { 
      component: 'teamStore', 
      action: 'fetchTeamStats' 
    });
    
    try {
      // TODO: Replace with actual API call
      // const stats = await teamService.getStats();
      
      const members = get().members;
      
      const stats: TeamStats = {
        totalMembers: members.length,
        activeUsers: members.filter(m => m.status === 'Active').length,
        pendingInvites: members.filter(m => m.status === 'Pending').length,
      };
      
      logger.info('Successfully fetched team stats', { 
        component: 'teamStore', 
        action: 'fetchTeamStats',
        stats 
      });
      
      set({ stats });
    } catch (error: any) {
      handleError(error, {
        component: 'teamStore',
        action: 'fetchTeamStats',
      });
    }
  },
}));
