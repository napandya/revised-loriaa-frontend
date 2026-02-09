import { create } from 'zustand';
import { Lead, LeadsPipelineStats, LeadsFilters, LeadStatus, LeadSource } from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface LeadsStore {
  // State
  leads: Lead[];
  pipelineStats: LeadsPipelineStats;
  filters: LeadsFilters;
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchLeads: () => Promise<void>;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  setFilters: (filters: Partial<LeadsFilters>) => void;
  clearFilters: () => void;
  selectLead: (lead: Lead | null) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  fetchPipelineStats: () => Promise<void>;
}

/**
 * Leads store managing lead data, pipeline stats, and CRUD operations
 */
export const useLeadsStore = create<LeadsStore>((set, get) => ({
  // Initial state
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

  /**
   * Fetch all leads with current filters
   */
  fetchLeads: async () => {
    logger.info('Fetching leads', { 
      component: 'leadsStore', 
      action: 'fetchLeads',
      filters: get().filters 
    });
    
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      // const leads = await leadsService.getLeads(get().filters);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          score: 85,
          status: LeadStatus.QUALIFIED,
          source: LeadSource.WEBSITE,
          interest: '2BR - Pet Friendly',
          aiInsight: 'High intent, prefers ground floor unit',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          lastContactedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Agent 1',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+1 (555) 234-5678',
          score: 72,
          status: LeadStatus.CONTACTED,
          source: LeadSource.FACEBOOK,
          interest: '1BR - Downtown',
          aiInsight: 'Price sensitive, looking for move-in specials',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          lastContactedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'mbrown@example.com',
          phone: '+1 (555) 345-6789',
          score: 95,
          status: LeadStatus.TOURING,
          source: LeadSource.GOOGLE,
          interest: '3BR - Pool Access',
          aiInsight: 'Ready to sign, tour scheduled tomorrow',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          lastContactedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Agent 2',
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '+1 (555) 456-7890',
          score: 45,
          status: LeadStatus.NEW,
          source: LeadSource.REFERRAL,
          interest: 'Studio - Budget',
          aiInsight: 'First-time renter, needs guidance',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      logger.info('Successfully fetched leads', { 
        component: 'leadsStore', 
        action: 'fetchLeads',
        count: mockLeads.length 
      });
      
      set({ leads: mockLeads, isLoading: false });
      
      // Auto-fetch pipeline stats
      get().fetchPipelineStats();
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'leadsStore',
        action: 'fetchLeads',
      });
      
      set({ 
        error: classified.userMessage,
        isLoading: false 
      });
    }
  },

  /**
   * Create new lead
   */
  createLead: async (leadData) => {
    logger.info('Creating lead', { 
      component: 'leadsStore', 
      action: 'createLead',
      leadName: leadData.name 
    });
    
    try {
      // TODO: Replace with actual API call
      // const newLead = await leadsService.createLead(leadData);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newLead: Lead = {
        ...leadData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      logger.info('Successfully created lead', { 
        component: 'leadsStore', 
        action: 'createLead',
        leadId: newLead.id 
      });
      
      set(state => ({ leads: [newLead, ...state.leads] }));
      
      // Refresh pipeline stats
      get().fetchPipelineStats();
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'leadsStore',
        action: 'createLead',
        leadName: leadData.name,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Update existing lead
   */
  updateLead: async (id, updates) => {
    logger.info('Updating lead', { 
      component: 'leadsStore', 
      action: 'updateLead',
      leadId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // const updatedLead = await leadsService.updateLead(id, updates);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        leads: state.leads.map(lead => 
          lead.id === id 
            ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
            : lead
        ),
      }));
      
      logger.info('Successfully updated lead', { 
        component: 'leadsStore', 
        action: 'updateLead',
        leadId: id 
      });
      
      // Refresh pipeline stats if status changed
      if (updates.status) {
        get().fetchPipelineStats();
      }
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'leadsStore',
        action: 'updateLead',
        leadId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Delete lead
   */
  deleteLead: async (id) => {
    logger.info('Deleting lead', { 
      component: 'leadsStore', 
      action: 'deleteLead',
      leadId: id 
    });
    
    try {
      // TODO: Replace with actual API call
      // await leadsService.deleteLead(id);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        leads: state.leads.filter(lead => lead.id !== id),
      }));
      
      logger.info('Successfully deleted lead', { 
        component: 'leadsStore', 
        action: 'deleteLead',
        leadId: id 
      });
      
      // Refresh pipeline stats
      get().fetchPipelineStats();
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'leadsStore',
        action: 'deleteLead',
        leadId: id,
      });
      throw new Error(classified.userMessage);
    }
  },

  /**
   * Set filters
   */
  setFilters: (filters) => {
    logger.info('Setting lead filters', { 
      component: 'leadsStore', 
      action: 'setFilters',
      filters 
    });
    
    set(state => ({ 
      filters: { ...state.filters, ...filters } 
    }));
    
    // Auto-refresh leads with new filters
    get().fetchLeads();
  },

  /**
   * Clear all filters
   */
  clearFilters: () => {
    logger.info('Clearing lead filters', { 
      component: 'leadsStore', 
      action: 'clearFilters' 
    });
    
    set({ filters: {} });
    get().fetchLeads();
  },

  /**
   * Select a lead for detailed view
   */
  selectLead: (lead) => {
    logger.debug('Selecting lead', { 
      component: 'leadsStore', 
      action: 'selectLead',
      leadId: lead?.id 
    });
    
    set({ selectedLead: lead });
  },

  /**
   * Update lead status (quick action)
   */
  updateLeadStatus: async (id, status) => {
    logger.info('Updating lead status', { 
      component: 'leadsStore', 
      action: 'updateLeadStatus',
      leadId: id,
      newStatus: status 
    });
    
    await get().updateLead(id, { status });
  },

  /**
   * Fetch pipeline statistics
   */
  fetchPipelineStats: async () => {
    logger.info('Fetching pipeline stats', { 
      component: 'leadsStore', 
      action: 'fetchPipelineStats' 
    });
    
    try {
      // TODO: Replace with actual API call
      // const stats = await leadsService.getPipelineStats();
      
      const leads = get().leads;
      
      const stats: LeadsPipelineStats = {
        total: leads.length,
        new: leads.filter(l => l.status === LeadStatus.NEW).length,
        contacted: leads.filter(l => l.status === LeadStatus.CONTACTED).length,
        qualified: leads.filter(l => l.status === LeadStatus.QUALIFIED).length,
        touring: leads.filter(l => l.status === LeadStatus.TOURING).length,
      };
      
      logger.info('Successfully fetched pipeline stats', { 
        component: 'leadsStore', 
        action: 'fetchPipelineStats',
        stats 
      });
      
      set({ pipelineStats: stats });
    } catch (error: any) {
      handleError(error, {
        component: 'leadsStore',
        action: 'fetchPipelineStats',
      });
    }
  },
}));
