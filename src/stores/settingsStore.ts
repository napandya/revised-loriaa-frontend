import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Integration, 
  BillingInfo, 
  NotificationSettings, 
  SecuritySettings 
} from '@/types';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface SettingsStore {
  // State
  integrations: Integration[];
  billing: BillingInfo | null;
  notifications: NotificationSettings;
  security: SecuritySettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchIntegrations: () => Promise<void>;
  connectIntegration: (id: string) => Promise<void>;
  disconnectIntegration: (id: string) => Promise<void>;
  fetchBilling: () => Promise<void>;
  updateBilling: (updates: Partial<BillingInfo>) => Promise<void>;
  updateNotifications: (settings: Partial<NotificationSettings>) => Promise<void>;
  updateSecurity: (settings: Partial<SecuritySettings>) => Promise<void>;
  generate2FACode: () => Promise<string>;
  createApiKey: (name: string) => Promise<void>;
  deleteApiKey: (id: string) => Promise<void>;
}

/**
 * Settings store managing integrations, billing, notifications, and security
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      integrations: [],
      billing: null,
      notifications: {
        emailNotifications: true,
        smsAlerts: true,
        pushNotifications: false,
        leadNotifications: true,
        systemAlerts: true,
      },
      security: {
        twoFactorEnabled: false,
        apiKeys: [],
      },
      isLoading: false,
      error: null,

      /**
       * Fetch integrations
       */
      fetchIntegrations: async () => {
        logger.info('Fetching integrations', { 
          component: 'settingsStore', 
          action: 'fetchIntegrations' 
        });
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const integrations = await settingsService.getIntegrations();
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockIntegrations: Integration[] = [
            {
              id: 'yardi',
              name: 'Yardi',
              status: 'Connected',
              logo: '/integrations/yardi.png',
              description: 'Property management software',
              connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'rentcafe',
              name: 'RENTCafé',
              status: 'Connected',
              logo: '/integrations/rentcafe.png',
              description: 'Online leasing and payments',
              connectedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'appfolio',
              name: 'AppFolio',
              status: 'Not Connected',
              logo: '/integrations/appfolio.png',
              description: 'Property management platform',
            },
            {
              id: 'buildium',
              name: 'Buildium',
              status: 'Not Connected',
              logo: '/integrations/buildium.png',
              description: 'Property management software',
            },
          ];
          
          logger.info('Successfully fetched integrations', { 
            component: 'settingsStore', 
            action: 'fetchIntegrations',
            count: mockIntegrations.length 
          });
          
          set({ integrations: mockIntegrations, isLoading: false });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'fetchIntegrations',
          });
          
          set({ 
            error: classified.userMessage,
            isLoading: false 
          });
        }
      },

      /**
       * Connect integration
       */
      connectIntegration: async (id) => {
        logger.info('Connecting integration', { 
          component: 'settingsStore', 
          action: 'connectIntegration',
          integrationId: id 
        });
        
        try {
          // TODO: Replace with actual API call
          // await settingsService.connectIntegration(id);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            integrations: state.integrations.map(int => 
              int.id === id 
                ? { ...int, status: 'Connected' as const, connectedAt: new Date().toISOString() }
                : int
            ),
          }));
          
          logger.info('Successfully connected integration', { 
            component: 'settingsStore', 
            action: 'connectIntegration',
            integrationId: id 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'connectIntegration',
            integrationId: id,
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Disconnect integration
       */
      disconnectIntegration: async (id) => {
        logger.info('Disconnecting integration', { 
          component: 'settingsStore', 
          action: 'disconnectIntegration',
          integrationId: id 
        });
        
        try {
          // TODO: Replace with actual API call
          // await settingsService.disconnectIntegration(id);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            integrations: state.integrations.map(int => 
              int.id === id 
                ? { ...int, status: 'Not Connected' as const, connectedAt: undefined }
                : int
            ),
          }));
          
          logger.info('Successfully disconnected integration', { 
            component: 'settingsStore', 
            action: 'disconnectIntegration',
            integrationId: id 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'disconnectIntegration',
            integrationId: id,
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Fetch billing information
       */
      fetchBilling: async () => {
        logger.info('Fetching billing info', { 
          component: 'settingsStore', 
          action: 'fetchBilling' 
        });
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const billing = await settingsService.getBilling();
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockBilling: BillingInfo = {
            currentPlan: 'Professional',
            nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: 299.00,
            paymentMethod: 'Visa ending in 4242',
            billingEmail: 'billing@example.com',
          };
          
          logger.info('Successfully fetched billing info', { 
            component: 'settingsStore', 
            action: 'fetchBilling' 
          });
          
          set({ billing: mockBilling, isLoading: false });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'fetchBilling',
          });
          
          set({ 
            error: classified.userMessage,
            isLoading: false 
          });
        }
      },

      /**
       * Update billing information
       */
      updateBilling: async (updates) => {
        logger.info('Updating billing info', { 
          component: 'settingsStore', 
          action: 'updateBilling' 
        });
        
        try {
          // TODO: Replace with actual API call
          // await settingsService.updateBilling(updates);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            billing: state.billing ? { ...state.billing, ...updates } : null,
          }));
          
          logger.info('Successfully updated billing info', { 
            component: 'settingsStore', 
            action: 'updateBilling' 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'updateBilling',
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Update notification settings
       */
      updateNotifications: async (settings) => {
        logger.info('Updating notification settings', { 
          component: 'settingsStore', 
          action: 'updateNotifications',
          settings 
        });
        
        try {
          // TODO: Replace with actual API call
          // await settingsService.updateNotifications(settings);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            notifications: { ...state.notifications, ...settings },
          }));
          
          logger.info('Successfully updated notification settings', { 
            component: 'settingsStore', 
            action: 'updateNotifications' 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'updateNotifications',
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Update security settings
       */
      updateSecurity: async (settings) => {
        logger.info('Updating security settings', { 
          component: 'settingsStore', 
          action: 'updateSecurity' 
        });
        
        try {
          // TODO: Replace with actual API call
          // await settingsService.updateSecurity(settings);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            security: { ...state.security, ...settings },
          }));
          
          logger.info('Successfully updated security settings', { 
            component: 'settingsStore', 
            action: 'updateSecurity' 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'updateSecurity',
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Generate 2FA code
       */
      generate2FACode: async () => {
        logger.info('Generating 2FA code', { 
          component: 'settingsStore', 
          action: 'generate2FACode' 
        });
        
        try {
          // TODO: Replace with actual API call
          // const code = await settingsService.generate2FA();
          
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockCode = 'JBSWY3DPEHPK3PXP';
          
          logger.info('Successfully generated 2FA code', { 
            component: 'settingsStore', 
            action: 'generate2FACode' 
          });
          
          return mockCode;
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'generate2FACode',
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Create API key
       */
      createApiKey: async (name) => {
        logger.info('Creating API key', { 
          component: 'settingsStore', 
          action: 'createApiKey',
          keyName: name 
        });
        
        try {
          // TODO: Replace with actual API call
          // const apiKey = await settingsService.createApiKey(name);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newKey = {
            id: Date.now().toString(),
            name,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            security: {
              ...state.security,
              apiKeys: [...state.security.apiKeys, newKey],
            },
          }));
          
          logger.info('Successfully created API key', { 
            component: 'settingsStore', 
            action: 'createApiKey',
            keyId: newKey.id 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'createApiKey',
            keyName: name,
          });
          throw new Error(classified.userMessage);
        }
      },

      /**
       * Delete API key
       */
      deleteApiKey: async (id) => {
        logger.info('Deleting API key', { 
          component: 'settingsStore', 
          action: 'deleteApiKey',
          keyId: id 
        });
        
        try {
          // TODO: Replace with actual API call
          // await settingsService.deleteApiKey(id);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            security: {
              ...state.security,
              apiKeys: state.security.apiKeys.filter(key => key.id !== id),
            },
          }));
          
          logger.info('Successfully deleted API key', { 
            component: 'settingsStore', 
            action: 'deleteApiKey',
            keyId: id 
          });
        } catch (error: any) {
          const classified = handleError(error, {
            component: 'settingsStore',
            action: 'deleteApiKey',
            keyId: id,
          });
          throw new Error(classified.userMessage);
        }
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ 
        notifications: state.notifications,
      }),
    }
  )
);
