import { create } from 'zustand';
import { 
  DashboardMetric, 
  MarketingFunnelData, 
  LeasingVelocityData,
  AIActivityItem,
  PortfolioHealth 
} from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface DashboardStore {
  // State
  metrics: DashboardMetric[];
  marketingFunnel: MarketingFunnelData[];
  leasingVelocity: LeasingVelocityData[];
  aiActivity: AIActivityItem[];
  portfolioHealth: PortfolioHealth | null;
  dateRange: { from: string; to: string };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  setDateRange: (from: string, to: string) => void;
  refreshMetrics: () => Promise<void>;
}

/**
 * Dashboard store managing COO-level metrics and analytics
 */
export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial state
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

  /**
   * Fetch all dashboard data
   */
  fetchDashboardData: async () => {
    logger.info('Fetching dashboard data', { 
      component: 'dashboardStore', 
      action: 'fetchDashboardData' 
    });
    
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API calls
      // const [metrics, funnel, velocity, activity, health] = await Promise.all([
      //   dashboardService.getMetrics(),
      //   dashboardService.getFunnel(),
      //   dashboardService.getVelocity(),
      //   dashboardService.getActivity(),
      //   dashboardService.getPortfolioHealth(),
      // ]);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMetrics: DashboardMetric[] = [
        { label: 'Total Leads', value: 342, change: 12.5, trend: 'up', icon: 'users' },
        { label: 'Tours Scheduled', value: 89, change: 8.2, trend: 'up', icon: 'calendar' },
        { label: 'Applications', value: 45, change: -3.1, trend: 'down', icon: 'file-text' },
        { label: 'Leases Signed', value: 23, change: 5.7, trend: 'up', icon: 'pen-tool' },
      ];
      
      const mockFunnel: MarketingFunnelData[] = [
        { stage: 'Awareness', value: 1000, percentage: 100 },
        { stage: 'Interest', value: 500, percentage: 50 },
        { stage: 'Consideration', value: 250, percentage: 25 },
        { stage: 'Application', value: 100, percentage: 10 },
        { stage: 'Lease', value: 50, percentage: 5 },
      ];
      
      const mockVelocity: LeasingVelocityData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        leads: Math.floor(Math.random() * 20) + 5,
        tours: Math.floor(Math.random() * 10) + 2,
      }));
      
      const mockActivity: AIActivityItem[] = [
        {
          id: '1',
          agent: 'Leasing Agent',
          action: 'Qualified lead from website inquiry',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          status: 'success',
        },
        {
          id: '2',
          agent: 'Marketing Agent',
          action: 'Created Facebook ad campaign',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'info',
        },
        {
          id: '3',
          agent: 'Property Manager',
          action: 'Scheduled maintenance for Unit 204',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'success',
        },
        {
          id: '4',
          agent: 'COO Agent',
          action: 'Portfolio health score updated',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'info',
        },
      ];
      
      const mockHealth: PortfolioHealth = {
        score: 87,
        vacancyLossCost: 15420,
        marketingSpendEfficiency: 2.4,
        ancillaryRevenue: 8750,
        totalRevenueProjected: 245000,
      };
      
      logger.info('Successfully fetched dashboard data', { 
        component: 'dashboardStore', 
        action: 'fetchDashboardData',
        metricsCount: mockMetrics.length,
        activityCount: mockActivity.length,
      });
      
      set({ 
        metrics: mockMetrics,
        marketingFunnel: mockFunnel,
        leasingVelocity: mockVelocity,
        aiActivity: mockActivity,
        portfolioHealth: mockHealth,
        isLoading: false 
      });
    } catch (error: any) {
      const classified = handleError(error, {
        component: 'dashboardStore',
        action: 'fetchDashboardData',
      });
      
      set({ 
        error: classified.userMessage,
        isLoading: false 
      });
    }
  },

  /**
   * Set date range filter
   */
  setDateRange: (from: string, to: string) => {
    logger.info('Setting date range', { 
      component: 'dashboardStore', 
      action: 'setDateRange',
      from,
      to 
    });
    
    set({ dateRange: { from, to } });
    // Auto-refresh data when date range changes
    get().fetchDashboardData();
  },

  /**
   * Refresh metrics only
   */
  refreshMetrics: async () => {
    logger.info('Refreshing metrics', { 
      component: 'dashboardStore', 
      action: 'refreshMetrics' 
    });
    
    try {
      // TODO: Replace with actual API call
      // const metrics = await dashboardService.getMetrics();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const currentMetrics = get().metrics;
      // Simulate small changes in metrics
      const updatedMetrics = currentMetrics.map(metric => ({
        ...metric,
        change: metric.change ? metric.change + (Math.random() - 0.5) * 2 : undefined,
      }));
      
      logger.info('Successfully refreshed metrics', { 
        component: 'dashboardStore', 
        action: 'refreshMetrics' 
      });
      
      set({ metrics: updatedMetrics });
    } catch (error: any) {
      handleError(error, {
        component: 'dashboardStore',
        action: 'refreshMetrics',
      });
    }
  },
}));
