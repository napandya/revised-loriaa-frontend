import { create } from 'zustand';
import { AgentStatus, AgentMetric, LeasingFunnelStage, LeadCard } from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface AgentStore {
  // State
  status: AgentStatus;
  metrics: AgentMetric[];
  funnelStages: LeasingFunnelStage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAgentData: () => Promise<void>;
  updateAgentStatus: (status: Partial<AgentStatus>) => Promise<void>;
  moveCard: (cardId: string, fromStage: string, toStage: string) => Promise<void>;
  toggleInterventionMode: () => Promise<void>;
  updateCard: (stageId: string, cardId: string, updates: Partial<LeadCard>) => void;
}

/**
 * Agent store managing AI agent status, metrics, and leasing funnel
 */
export const useAgentStore = create<AgentStore>((set, get) => ({
  // Initial state
  status: {
    online: true,
    prospectsHandling: 0,
    interventionMode: false,
  },
  metrics: [],
  funnelStages: [],
  isLoading: false,
  error: null,

  /**
   * Fetch agent dashboard data
   */
  fetchAgentData: async () => {
    logger.info('Fetching agent data', { 
      component: 'agentStore', 
      action: 'fetchAgentData' 
    });
    
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API calls
      // const [status, metrics, funnel] = await Promise.all([
      //   agentService.getStatus(),
      //   agentService.getMetrics(),
      //   agentService.getFunnel(),
      // ]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockStatus: AgentStatus = {
        online: true,
        prospectsHandling: 12,
        interventionMode: false,
      };
      
      const mockMetrics: AgentMetric[] = [
        { label: 'Active Conversations', value: 12, icon: 'message-circle', color: 'blue' },
        { label: 'Tours Today', value: 5, icon: 'calendar', color: 'green' },
        { label: 'Avg Response Time', value: '2.3min', icon: 'clock', color: 'purple' },
        { label: 'Conversion Rate', value: '34%', icon: 'trending-up', color: 'emerald' },
      ];
      
      const mockFunnel: LeasingFunnelStage[] = [
        {
          id: 'inquiry',
          name: 'Inquiry',
          cards: [
            {
              id: 'c1',
              leadId: '1',
              name: 'John Smith',
              unit: '2BR - Pet Friendly',
              time: '5m ago',
              channel: 'Email',
              score: 85,
            },
            {
              id: 'c2',
              leadId: '2',
              name: 'Sarah Johnson',
              unit: '1BR - Downtown',
              time: '12m ago',
              channel: 'SMS',
              score: 72,
            },
          ],
        },
        {
          id: 'qualification',
          name: 'Qualification',
          cards: [
            {
              id: 'c3',
              leadId: '3',
              name: 'Michael Brown',
              unit: '3BR - Pool Access',
              time: '1h ago',
              channel: 'Chat',
              score: 95,
            },
          ],
        },
        {
          id: 'tour',
          name: 'Tour Scheduled',
          cards: [
            {
              id: 'c4',
              leadId: '4',
              name: 'Emily Davis',
              unit: 'Studio - Budget',
              tourType: 'Self Guided',
              tourTime: 'Today 2:00 PM',
            },
            {
              id: 'c5',
              leadId: '5',
              name: 'David Wilson',
              unit: '2BR - Corner Unit',
              tourType: 'Agent Assisted',
              tourTime: 'Tomorrow 10:00 AM',
            },
          ],
        },
        {
          id: 'application',
          name: 'Application',
          cards: [
            {
              id: 'c6',
              leadId: '6',
              name: 'Lisa Anderson',
              unit: '1BR - City View',
              needsApproval: true,
              checklistItems: [
                { id: 'check1', label: 'Credit Check', completed: true },
                { id: 'check2', label: 'Income Verification', completed: true },
                { id: 'check3', label: 'Background Check', completed: false },
              ],
            },
          ],
        },
        {
          id: 'lease',
          name: 'Lease Signing',
          cards: [
            {
              id: 'c7',
              leadId: '7',
              name: 'Robert Taylor',
              unit: '2BR - Garden View',
              status: 'Ready to sign',
            },
          ],
        },
      ];
      
      logger.info('Successfully fetched agent data', { 
        component: 'agentStore', 
        action: 'fetchAgentData',
        metricsCount: mockMetrics.length,
        funnelStages: mockFunnel.length 
      });
      
      set({ 
        status: mockStatus,
        metrics: mockMetrics,
        funnelStages: mockFunnel,
        isLoading: false 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'agentStore',
        action: 'fetchAgentData',
      });
      
      set({ 
        error: classified.userMessage,
        isLoading: false 
      });
    }
  },

  /**
   * Update agent status
   */
  updateAgentStatus: async (statusUpdates) => {
    logger.info('Updating agent status', { 
      component: 'agentStore', 
      action: 'updateAgentStatus',
      updates: statusUpdates 
    });
    
    try {
      // TODO: Replace with actual API call
      // await agentService.updateStatus(statusUpdates);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => ({
        status: { ...state.status, ...statusUpdates },
      }));
      
      logger.info('Successfully updated agent status', { 
        component: 'agentStore', 
        action: 'updateAgentStatus' 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'agentStore',
        action: 'updateAgentStatus',
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Move card between funnel stages (drag & drop)
   */
  moveCard: async (cardId, fromStage, toStage) => {
    logger.info('Moving card between stages', { 
      component: 'agentStore', 
      action: 'moveCard',
      cardId,
      fromStage,
      toStage 
    });
    
    try {
      // TODO: Replace with actual API call
      // await agentService.moveCard(cardId, fromStage, toStage);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => {
        const stages = [...state.funnelStages];
        const fromStageIndex = stages.findIndex(s => s.id === fromStage);
        const toStageIndex = stages.findIndex(s => s.id === toStage);
        
        if (fromStageIndex === -1 || toStageIndex === -1) return state;
        
        const cardIndex = stages[fromStageIndex].cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return state;
        
        const card = stages[fromStageIndex].cards[cardIndex];
        stages[fromStageIndex].cards.splice(cardIndex, 1);
        stages[toStageIndex].cards.push(card);
        
        return { funnelStages: stages };
      });
      
      logger.info('Successfully moved card', { 
        component: 'agentStore', 
        action: 'moveCard',
        cardId 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'agentStore',
        action: 'moveCard',
        cardId,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Toggle intervention mode
   */
  toggleInterventionMode: async () => {
    logger.info('Toggling intervention mode', { 
      component: 'agentStore', 
      action: 'toggleInterventionMode',
      currentMode: get().status.interventionMode 
    });
    
    const newMode = !get().status.interventionMode;
    await get().updateAgentStatus({ interventionMode: newMode });
  },

  /**
   * Update card details
   */
  updateCard: (stageId, cardId, updates) => {
    logger.debug('Updating card', { 
      component: 'agentStore', 
      action: 'updateCard',
      stageId,
      cardId 
    });
    
    set(state => {
      const stages = state.funnelStages.map(stage => {
        if (stage.id !== stageId) return stage;
        
        return {
          ...stage,
          cards: stage.cards.map(card => 
            card.id === cardId ? { ...card, ...updates } : card
          ),
        };
      });
      
      return { funnelStages: stages };
    });
  },
}));
