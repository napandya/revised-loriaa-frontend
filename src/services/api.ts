/**
 * API Service Layer
 * Typed functions for all backend API endpoints
 */

import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import { logger } from '@/lib/logger';

// ========== Types ==========

export interface LoginCredentials {
  username: string; // OAuth2 uses 'username' field for email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface Bot {
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

export interface CreateBotPayload {
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

/**
 * Frontend interface for call logs
 * Uses camelCase and formatted display values
 */
export interface CallLog {
  id: string;
  botName: string;
  phoneNumber: string;
  duration: string;
  cost: string;
  status: 'completed' | 'failed';
  timestamp: string;
}

/**
 * Backend response interface for call logs
 * Uses snake_case and raw values
 */
interface CallLogResponse {
  id: string;
  bot_id: string;
  bot_name: string;
  phone_number: string;
  start_time: string;
  duration_seconds: number;
  status: 'completed' | 'failed';
  call_type: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  avatar?: string;
}

export interface CreateTeamMemberPayload {
  name: string;
  email: string;
  role: string;
}

export interface BillingStats {
  current_month_cost: number;
  total_calls: number;
  total_duration: number;
  breakdown: {
    category: string;
    amount: number;
  }[];
}

export interface BillingHistory {
  month: string;
  cost: number;
  calls: number;
}

/**
 * Frontend interface for dashboard metrics
 * Note: totalDuration is stored in seconds (frontend components divide by 60 for display)
 */
export interface DashboardMetrics {
  callsHandled: number;      // Maps from backend: total_calls
  totalDuration: number;     // Maps from backend: total_duration_minutes (converted to seconds)
  totalCost: number;         // Maps from backend: total_cost
  avgDuration: number;       // Maps from backend: average_duration_seconds (converted to minutes)
}

/**
 * Backend response interface for dashboard metrics
 */
interface DashboardMetricsResponse {
  total_bots?: number;
  active_bots?: number;
  total_calls?: number;
  calls_this_month?: number;
  calls_today?: number;
  total_duration_minutes?: number;
  total_cost?: number;
  success_rate?: number;
  average_duration_seconds?: number;
}

export interface AnalyticsData {
  date: string;
  calls: number;
  duration: number;
  cost: number;
}

// ========== Helper Functions ==========

/**
 * Format duration from seconds to "M:SS" display format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "1:24" or "10:05"
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate and format cost from duration
 * @param durationSeconds - Duration in seconds
 * @returns Formatted cost string like "$0.25"
 */
function calculateCost(durationSeconds: number): string {
  const COST_PER_MINUTE = 0.18; // Default from Bot model
  const minutes = durationSeconds / 60;
  const cost = minutes * COST_PER_MINUTE;
  return `$${cost.toFixed(2)}`;
}

/**
 * Format ISO datetime string to localized readable format
 * @param datetime - ISO datetime string
 * @returns Formatted timestamp like "10/17/2025, 03:14:00 PM"
 */
function formatTimestamp(datetime: string): string {
  return new Date(datetime).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// ========== Authentication Service ==========

export const authService = {
  /**
   * Login with email and password
   * Uses OAuth2 form format (application/x-www-form-urlencoded)
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    logger.debug('Calling login API', { service: 'authService', method: 'login' });
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' for email
    formData.append('password', password);
    
    const response = await axiosInstance.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    logger.debug('Login API successful', { service: 'authService', method: 'login' });
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<User> {
    const response = await axiosInstance.post<User>(API_ENDPOINTS.auth.register, {
      email,
      password,
      name,
    });
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>(API_ENDPOINTS.auth.me);
    return response.data;
  },
};

// ========== Bots Service ==========

export const botsService = {
  /**
   * Get all bots with optional pagination and search
   */
  async getBots(params?: { skip?: number; limit?: number; search?: string }): Promise<Bot[]> {
    const response = await axiosInstance.get<Bot[]>(API_ENDPOINTS.bots.list, { params });
    return response.data;
  },

  /**
   * Get a single bot by ID
   */
  async getBotById(id: string): Promise<Bot> {
    const response = await axiosInstance.get<Bot>(API_ENDPOINTS.bots.detail(id));
    return response.data;
  },

  /**
   * Create a new bot
   */
  async createBot(bot: CreateBotPayload): Promise<Bot> {
    const response = await axiosInstance.post<Bot>(API_ENDPOINTS.bots.create, bot);
    return response.data;
  },

  /**
   * Update an existing bot
   */
  async updateBot(id: string, updates: Partial<CreateBotPayload>): Promise<Bot> {
    const response = await axiosInstance.put<Bot>(API_ENDPOINTS.bots.update(id), updates);
    return response.data;
  },

  /**
   * Delete a bot
   */
  async deleteBot(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.bots.delete(id));
  },
};

// ========== Call Logs Service ==========

export const callLogsService = {
  /**
   * Get all call logs
   * Transforms backend snake_case response to frontend camelCase format with formatted values
   */
  async getCallLogs(params?: { skip?: number; limit?: number }): Promise<CallLog[]> {
    const response = await axiosInstance.get<CallLogResponse[]>(API_ENDPOINTS.callLogs.list, { params });
    
    // Transform backend response to frontend format
    return response.data.map((log: CallLogResponse) => ({
      id: log.id,
      botName: log.bot_name,
      phoneNumber: log.phone_number,
      duration: formatDuration(log.duration_seconds),
      cost: calculateCost(log.duration_seconds),
      status: log.status,
      timestamp: formatTimestamp(log.start_time),
    }));
  },

  /**
   * Create a new call log
   */
  async createCallLog(callLog: Omit<CallLog, 'id'>): Promise<CallLog> {
    const response = await axiosInstance.post<CallLog>(API_ENDPOINTS.callLogs.create, callLog);
    return response.data;
  },

  /**
   * Get a single call log by ID
   * Transforms backend snake_case response to frontend camelCase format with formatted values
   */
  async getCallLogById(id: string): Promise<CallLog> {
    const response = await axiosInstance.get<CallLogResponse>(API_ENDPOINTS.callLogs.detail(id));
    const log = response.data;
    
    // Transform backend response to frontend format
    return {
      id: log.id,
      botName: log.bot_name,
      phoneNumber: log.phone_number,
      duration: formatDuration(log.duration_seconds),
      cost: calculateCost(log.duration_seconds),
      status: log.status,
      timestamp: formatTimestamp(log.start_time),
    };
  },
};

// ========== Teams Service ==========

export const teamsService = {
  /**
   * Get all team members
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await axiosInstance.get<TeamMember[]>(API_ENDPOINTS.teams.list);
    return response.data;
  },

  /**
   * Add a new team member
   */
  async addTeamMember(member: CreateTeamMemberPayload): Promise<TeamMember> {
    const response = await axiosInstance.post<TeamMember>(API_ENDPOINTS.teams.create, member);
    return response.data;
  },

  /**
   * Update a team member
   */
  async updateTeamMember(id: string, updates: Partial<CreateTeamMemberPayload>): Promise<TeamMember> {
    const response = await axiosInstance.put<TeamMember>(API_ENDPOINTS.teams.update(id), updates);
    return response.data;
  },

  /**
   * Delete a team member
   */
  async deleteTeamMember(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.teams.delete(id));
  },
};

// ========== Billing Service ==========

export const billingService = {
  /**
   * Get current month billing stats
   */
  async getCurrentBilling(): Promise<BillingStats> {
    const response = await axiosInstance.get<BillingStats>(API_ENDPOINTS.billing.current);
    return response.data;
  },

  /**
   * Get billing history
   */
  async getBillingHistory(): Promise<BillingHistory[]> {
    const response = await axiosInstance.get<BillingHistory[]>(API_ENDPOINTS.billing.history);
    return response.data;
  },
};

// ========== Dashboard Service ==========

export const dashboardService = {
  /**
   * Get dashboard overview metrics
   * Transforms backend snake_case response to frontend camelCase format
   */
  async getMetrics(): Promise<DashboardMetrics> {
    logger.debug('Fetching dashboard metrics', { service: 'dashboardService', method: 'getMetrics' });
    const response = await axiosInstance.get<DashboardMetricsResponse>(API_ENDPOINTS.dashboard.metrics);
    const data = response.data;
    
    // Transform backend response to frontend format with fallback values
    const transformed: DashboardMetrics = {
      callsHandled: data.total_calls || 0,
      totalDuration: data.total_duration_minutes ? data.total_duration_minutes * 60 : 0, // Convert minutes to seconds (frontend expects seconds)
      totalCost: data.total_cost || 0,
      avgDuration: data.average_duration_seconds ? data.average_duration_seconds / 60 : 0, // Convert seconds to minutes
    };
    
    logger.debug('Dashboard metrics transformed', { 
      service: 'dashboardService', 
      method: 'getMetrics',
      callsHandled: transformed.callsHandled 
    });
    
    return transformed;
  },

  /**
   * Get analytics with time-series data
   */
  async getAnalytics(params?: { period?: 'day' | 'week' | 'month' }): Promise<AnalyticsData[]> {
    const response = await axiosInstance.get<AnalyticsData[]>(API_ENDPOINTS.dashboard.analytics, { params });
    return response.data;
  },
};
