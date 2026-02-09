/**
 * Comprehensive TypeScript type definitions for Agentic CRM Platform
 */

// ========== Authentication Types ==========

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole | string;
  avatar?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  LEASING_STAFF = 'Leasing Staff',
  PROPERTY_MANAGER = 'Property Manager',
  MARKETING = 'Marketing',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ========== Lead Types ==========

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  TOURING = 'Touring',
  APPLICATION = 'Application',
  LEASE = 'Lease',
  MOVE_IN = 'Move-In',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  FACEBOOK = 'Facebook',
  GOOGLE = 'Google',
  REFERRAL = 'Referral',
  WALK_IN = 'Walk-In',
  PHONE = 'Phone',
  EMAIL = 'Email',
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  score: number; // 0-100
  status: LeadStatus;
  source: LeadSource;
  interest: string; // Unit type or specific unit
  aiInsight: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  assignedTo?: string;
  notes?: string;
}

export interface LeadsPipelineStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  touring: number;
}

export interface LeadsFilters {
  status?: LeadStatus;
  source?: LeadSource;
  minScore?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ========== Dashboard Types ==========

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number; // Percentage change
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface MarketingFunnelData {
  stage: string;
  value: number;
  percentage: number;
}

export interface LeasingVelocityData {
  date: string;
  leads: number;
  tours: number;
}

export interface AIActivityItem {
  id: string;
  agent: 'Leasing Agent' | 'Marketing Agent' | 'Property Manager' | 'COO Agent';
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface PortfolioHealth {
  score: number; // 0-100
  vacancyLossCost: number;
  marketingSpendEfficiency: number;
  ancillaryRevenue: number;
  totalRevenueProjected: number;
}

// ========== Team Management Types ==========

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive' | 'Pending';
  avatar?: string;
  lastActive?: string;
  invitedAt?: string;
}

export interface TeamStats {
  totalMembers: number;
  activeUsers: number;
  pendingInvites: number;
}

export interface InviteMemberData {
  email: string;
  name: string;
  role: UserRole;
}

// ========== Settings Types ==========

export interface Integration {
  id: string;
  name: string;
  status: 'Connected' | 'Not Connected' | 'Error';
  logo?: string;
  description?: string;
  connectedAt?: string;
}

export interface BillingInfo {
  currentPlan: string;
  nextBillingDate: string;
  amount: number;
  paymentMethod?: string;
  billingEmail?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  leadNotifications?: boolean;
  systemAlerts?: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  apiKeys: {
    id: string;
    name: string;
    createdAt: string;
    lastUsed?: string;
  }[];
}

// ========== Document & Knowledge Base Types ==========

export enum DocumentCategory {
  LEASING_POLICIES = 'Leasing Policies',
  PROPERTY_INFO = 'Property Info',
  TEMPLATES = 'Templates',
  COMPLIANCE = 'Compliance',
  MARKETING = 'Marketing',
  OTHER = 'Other',
}

export enum TriggerEvent {
  LEAD_INQUIRY = 'Lead Inquiry',
  TOUR_SCHEDULED = 'Tour Scheduled',
  APPLICATION_RECEIVED = 'Application Received',
  LEASE_SIGNING = 'Lease Signing',
  MOVE_IN = 'Move-In',
  MAINTENANCE_REQUEST = 'Maintenance Request',
  MANUAL = 'Manual',
}

export enum AgentAccess {
  ALL_AGENTS = 'All Agents',
  LEASING_AGENT = 'Leasing Agent',
  MARKETING_AGENT = 'Marketing Agent',
  COMPLIANCE_WORKER = 'Compliance Worker',
  PROPERTY_MANAGER = 'Property Manager',
}

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  size: number; // in bytes
  uploadedAt: string;
  uploadedBy: string;
  triggerEvent?: TriggerEvent;
  agentAccess: AgentAccess[];
  expirationDate?: string;
  status: 'Active' | 'Expired' | 'Archived';
  url?: string;
}

export interface DocumentRepository {
  [DocumentCategory.LEASING_POLICIES]: Document[];
  [DocumentCategory.PROPERTY_INFO]: Document[];
  [DocumentCategory.TEMPLATES]: Document[];
  [DocumentCategory.COMPLIANCE]: Document[];
  [DocumentCategory.MARKETING]: Document[];
  [DocumentCategory.OTHER]: Document[];
}

// ========== Agent Dashboard Types ==========

export interface AgentMetric {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export interface LeasingFunnelStage {
  id: string;
  name: string;
  cards: LeadCard[];
}

export interface LeadCard {
  id: string;
  leadId: string;
  name: string;
  unit: string;
  time?: string;
  channel?: 'Email' | 'SMS' | 'Phone' | 'Chat';
  score?: number;
  tourType?: 'Self Guided' | 'Agent Assisted';
  tourTime?: string;
  needsApproval?: boolean;
  status?: string;
  checklistItems?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface AgentStatus {
  online: boolean;
  prospectsHandling: number;
  interventionMode: boolean;
}

// ========== API Response Types ==========

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}
