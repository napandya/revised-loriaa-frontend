import { create } from 'zustand';
import {
  botsService,
  teamsService,
  dashboardService,
  callLogsService,
  billingService,
  Bot as ApiBot,
  TeamMember as ApiTeamMember,
  CallLog as ApiCallLog,
  DashboardMetrics,
  CreateBotPayload,
  CreateTeamMemberPayload,
  BillingStats,
  BillingHistory,
} from '@/services/api';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface Bot {
  id: string;
  name: string;
  hipaaCompliant: boolean;
  language: string;
  status: 'active' | 'inactive';
  greeting: string;
  prompt: string;
  voice: string;
  model: string;
  phoneNumber?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  avatar?: string;
}

interface CallLog {
  id: string;
  botName: string;
  phoneNumber: string;
  duration: string;
  cost: string;
  status: 'completed' | 'failed';
  timestamp: string;
}

interface MetricsData {
  callsHandled: number;
  totalDuration: number;
  totalCost: number;
  avgDuration: number;
}

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  currentPage: string;
  timeFilter: 'day' | 'week' | 'month';
  
  // Data State
  bots: Bot[];
  teamMembers: TeamMember[];
  callLogs: CallLog[];
  metrics: MetricsData;
  billingStats: BillingStats | null;
  billingHistory: BillingHistory[];
  
  // Loading States
  isLoadingBots: boolean;
  isLoadingTeamMembers: boolean;
  isLoadingCallLogs: boolean;
  isLoadingMetrics: boolean;
  isLoadingBilling: boolean;
  
  // Error States
  botsError: string | null;
  teamMembersError: string | null;
  callLogsError: string | null;
  metricsError: string | null;
  billingError: string | null;
  
  // UI Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentPage: (page: string) => void;
  setTimeFilter: (filter: 'day' | 'week' | 'month') => void;
  
  // Bots Actions
  fetchBots: () => Promise<void>;
  addBot: (bot: CreateBotPayload) => Promise<void>;
  updateBot: (id: string, updates: Partial<CreateBotPayload>) => Promise<void>;
  deleteBot: (id: string) => Promise<void>;
  
  // Team Members Actions
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (member: CreateTeamMemberPayload) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<CreateTeamMemberPayload>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  
  // Call Logs Actions
  fetchCallLogs: () => Promise<void>;
  
  // Metrics Actions
  fetchMetrics: () => Promise<void>;
  
  // Billing Actions
  fetchBillingStats: () => Promise<void>;
  fetchBillingHistory: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // UI State
  sidebarCollapsed: false,
  currentPage: 'overview',
  timeFilter: 'week',
  
  // Data State - Start with empty arrays
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
  
  // Loading States
  isLoadingBots: false,
  isLoadingTeamMembers: false,
  isLoadingCallLogs: false,
  isLoadingMetrics: false,
  isLoadingBilling: false,
  
  // Error States
  botsError: null,
  teamMembersError: null,
  callLogsError: null,
  metricsError: null,
  billingError: null,
  
  // UI Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTimeFilter: (filter) => set({ timeFilter: filter }),
  
  // Bots Actions
  fetchBots: async () => {
    logger.info('Fetching bots', { component: 'appStore', action: 'fetchBots' });
    set({ isLoadingBots: true, botsError: null });
    try {
      const bots = await botsService.getBots();
      logger.info('Successfully fetched bots', { 
        component: 'appStore', 
        action: 'fetchBots',
        count: bots.length 
      });
      set({ bots, isLoadingBots: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'fetchBots',
      });
      set({ 
        botsError: classified.userMessage, 
        isLoadingBots: false 
      });
    }
  },
  
  addBot: async (bot) => {
    logger.info('Creating new bot', { 
      component: 'appStore', 
      action: 'addBot',
      botName: bot.name 
    });
    try {
      const newBot = await botsService.createBot(bot);
      logger.info('Successfully created bot', { 
        component: 'appStore', 
        action: 'addBot',
        botId: newBot.id,
        botName: newBot.name 
      });
      set((state) => ({ bots: [...state.bots, newBot] }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'addBot',
        botName: bot.name,
      });
      throw new Error(classified.userMessage);
    }
  },
  
  updateBot: async (id, updates) => {
    logger.info('Updating bot', { 
      component: 'appStore', 
      action: 'updateBot',
      botId: id 
    });
    try {
      const updatedBot = await botsService.updateBot(id, updates);
      logger.info('Successfully updated bot', { 
        component: 'appStore', 
        action: 'updateBot',
        botId: id 
      });
      set((state) => ({
        bots: state.bots.map((bot) => (bot.id === id ? updatedBot : bot)),
      }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'updateBot',
        botId: id,
      });
      throw new Error(classified.userMessage);
    }
  },
  
  deleteBot: async (id) => {
    logger.info('Deleting bot', { 
      component: 'appStore', 
      action: 'deleteBot',
      botId: id 
    });
    try {
      await botsService.deleteBot(id);
      logger.info('Successfully deleted bot', { 
        component: 'appStore', 
        action: 'deleteBot',
        botId: id 
      });
      set((state) => ({ bots: state.bots.filter((bot) => bot.id !== id) }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'deleteBot',
        botId: id,
      });
      throw new Error(classified.userMessage);
    }
  },
  
  // Team Members Actions
  fetchTeamMembers: async () => {
    logger.info('Fetching team members', { component: 'appStore', action: 'fetchTeamMembers' });
    set({ isLoadingTeamMembers: true, teamMembersError: null });
    try {
      const teamMembers = await teamsService.getTeamMembers();
      logger.info('Successfully fetched team members', { 
        component: 'appStore', 
        action: 'fetchTeamMembers',
        count: teamMembers.length 
      });
      set({ teamMembers, isLoadingTeamMembers: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'fetchTeamMembers',
      });
      set({ 
        teamMembersError: classified.userMessage, 
        isLoadingTeamMembers: false 
      });
    }
  },
  
  addTeamMember: async (member) => {
    logger.info('Adding team member', { 
      component: 'appStore', 
      action: 'addTeamMember',
      memberEmail: member.email 
    });
    try {
      const newMember = await teamsService.addTeamMember(member);
      logger.info('Successfully added team member', { 
        component: 'appStore', 
        action: 'addTeamMember',
        memberId: newMember.id 
      });
      set((state) => ({ teamMembers: [...state.teamMembers, newMember] }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'addTeamMember',
        memberEmail: member.email,
      });
      throw new Error(classified.userMessage);
    }
  },
  
  updateTeamMember: async (id, updates) => {
    logger.info('Updating team member', { 
      component: 'appStore', 
      action: 'updateTeamMember',
      memberId: id 
    });
    try {
      const updatedMember = await teamsService.updateTeamMember(id, updates);
      logger.info('Successfully updated team member', { 
        component: 'appStore', 
        action: 'updateTeamMember',
        memberId: id 
      });
      set((state) => ({
        teamMembers: state.teamMembers.map((member) => 
          member.id === id ? updatedMember : member
        ),
      }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'updateTeamMember',
        memberId: id,
      });
      throw new Error(classified.userMessage);
    }
  },
  
  deleteTeamMember: async (id) => {
    logger.info('Deleting team member', { 
      component: 'appStore', 
      action: 'deleteTeamMember',
      memberId: id 
    });
    try {
      await teamsService.deleteTeamMember(id);
      logger.info('Successfully deleted team member', { 
        component: 'appStore', 
        action: 'deleteTeamMember',
        memberId: id 
      });
      set((state) => ({ 
        teamMembers: state.teamMembers.filter((member) => member.id !== id) 
      }));
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'deleteTeamMember',
        memberId: id,
      });
      throw new Error(classified.userMessage);
    }
  },
  
  // Call Logs Actions
  fetchCallLogs: async () => {
    logger.info('Fetching call logs', { component: 'appStore', action: 'fetchCallLogs' });
    set({ isLoadingCallLogs: true, callLogsError: null });
    try {
      const callLogs = await callLogsService.getCallLogs();
      logger.info('Successfully fetched call logs', { 
        component: 'appStore', 
        action: 'fetchCallLogs',
        count: callLogs.length 
      });
      set({ callLogs, isLoadingCallLogs: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'fetchCallLogs',
      });
      set({ 
        callLogsError: classified.userMessage, 
        isLoadingCallLogs: false 
      });
    }
  },
  
  // Metrics Actions
  fetchMetrics: async () => {
    logger.info('Fetching metrics', { component: 'appStore', action: 'fetchMetrics' });
    set({ isLoadingMetrics: true, metricsError: null });
    try {
      const metrics = await dashboardService.getMetrics();
      
      // Validate metrics data
      logger.info('Successfully fetched and validated metrics', { 
        component: 'appStore', 
        action: 'fetchMetrics',
        callsHandled: metrics.callsHandled,
        totalDuration: metrics.totalDuration,
        totalCost: metrics.totalCost,
        avgDuration: metrics.avgDuration
      });
      
      set({ metrics, isLoadingMetrics: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'fetchMetrics',
      });
      set({ 
        metricsError: classified.userMessage, 
        isLoadingMetrics: false 
      });
    }
  },
  
  // Billing Actions
  fetchBillingStats: async () => {
    logger.info('Fetching billing stats', { component: 'appStore', action: 'fetchBillingStats' });
    set({ isLoadingBilling: true, billingError: null });
    try {
      const billingStats = await billingService.getCurrentBilling();
      logger.info('Successfully fetched billing stats', { 
        component: 'appStore', 
        action: 'fetchBillingStats',
        cost: billingStats.current_month_cost 
      });
      set({ billingStats, isLoadingBilling: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'fetchBillingStats',
      });
      set({ 
        billingError: classified.userMessage, 
        isLoadingBilling: false 
      });
    }
  },
  
  fetchBillingHistory: async () => {
    logger.info('Fetching billing history', { component: 'appStore', action: 'fetchBillingHistory' });
    set({ isLoadingBilling: true, billingError: null });
    try {
      const billingHistory = await billingService.getBillingHistory();
      logger.info('Successfully fetched billing history', { 
        component: 'appStore', 
        action: 'fetchBillingHistory',
        count: billingHistory.length 
      });
      set({ billingHistory, isLoadingBilling: false });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'appStore',
        action: 'fetchBillingHistory',
      });
      set({ 
        billingError: classified.userMessage, 
        isLoadingBilling: false 
      });
    }
  },
}));
