/**
 * API Configuration
 * Centralized configuration for API endpoints
 * 
 * Backend runs on Docker at localhost:8000
 * All endpoints use /api/v1/ prefix
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  timeout: 30000,
} as const;

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    me: '/api/v1/auth/me',
  },
  // Bots
  bots: {
    list: '/api/v1/bots',
    create: '/api/v1/bots',
    detail: (id: string) => `/api/v1/bots/${id}`,
    update: (id: string) => `/api/v1/bots/${id}`,
    delete: (id: string) => `/api/v1/bots/${id}`,
  },
  // Call Logs
  callLogs: {
    list: '/api/v1/call-logs',
    create: '/api/v1/call-logs',
    detail: (id: string) => `/api/v1/call-logs/${id}`,
  },
  // Teams
  teams: {
    list: '/api/v1/teams',
    create: '/api/v1/teams',
    update: (id: string) => `/api/v1/teams/${id}`,
    delete: (id: string) => `/api/v1/teams/${id}`,
  },
  // Billing
  billing: {
    current: '/api/v1/billing/current',
    history: '/api/v1/billing/history',
  },
  // Dashboard
  dashboard: {
    metrics: '/api/v1/dashboard/metrics',
    analytics: '/api/v1/dashboard/analytics',
    coo: '/api/v1/dashboard/coo',
    marketingFunnel: '/api/v1/dashboard/marketing-funnel',
    leasingVelocity: '/api/v1/dashboard/leasing-velocity',
    agentActivity: '/api/v1/dashboard/agent-activity',
    portfolioHealth: '/api/v1/dashboard/portfolio-health',
  },
  // Knowledge Base
  kb: {
    documents: '/api/v1/kb/documents',
    delete: (id: string) => `/api/v1/kb/documents/${id}`,
  },
  // Leads
  leads: {
    list: '/api/v1/leads',
    create: '/api/v1/leads',
    detail: (id: string) => `/api/v1/leads/${id}`,
    update: (id: string) => `/api/v1/leads/${id}`,
    delete: (id: string) => `/api/v1/leads/${id}`,
    pipelineStats: '/api/v1/leads/pipeline/stats',
  },
  // Inbox
  inbox: {
    list: '/api/v1/inbox',
    detail: (id: string) => `/api/v1/inbox/${id}`,
    messages: (id: string) => `/api/v1/inbox/${id}/messages`,
    markRead: (id: string) => `/api/v1/inbox/${id}/read`,
    updateStatus: (id: string) => `/api/v1/inbox/${id}/status`,
    unreadCount: '/api/v1/inbox/unread/count',
  },
  // Agents
  agents: {
    leasing: {
      execute: '/api/v1/agents/leasing/execute',
      qualifyLead: '/api/v1/agents/leasing/qualify-lead',
      scheduleTour: '/api/v1/agents/leasing/schedule-tour',
      activity: '/api/v1/agents/leasing/activity',
    },
    marketing: {
      execute: '/api/v1/agents/marketing/execute',
      analyzeCampaign: '/api/v1/agents/marketing/analyze-campaign',
      optimizeBudget: '/api/v1/agents/marketing/optimize-budget',
      activity: '/api/v1/agents/marketing/activity',
    },
    property: {
      execute: '/api/v1/agents/property/execute',
      query: '/api/v1/agents/property/query',
      activity: '/api/v1/agents/property/activity',
    },
  },
  // Documents
  documents: {
    list: '/api/v1/documents',
    create: '/api/v1/documents',
    detail: (id: string) => `/api/v1/documents/${id}`,
    delete: (id: string) => `/api/v1/documents/${id}`,
  },
  // Settings
  settings: {
    profile: '/api/v1/settings/profile',
    notifications: '/api/v1/settings/notifications',
    integrations: '/api/v1/settings/integrations',
  },
} as const;
