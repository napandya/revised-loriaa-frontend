/**
 * LeadsPage Component Tests
 * Smoke tests for leads management page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadsPage } from './LeadsPage';
import { useLeadsStore } from '@/stores/leadsStore';
import { LeadStatus, LeadSource } from '@/types';

// Mock the leads store
vi.mock('@/stores/leadsStore', () => ({
  useLeadsStore: vi.fn(),
}));

describe('LeadsPage', () => {
  const mockFetchLeads = vi.fn();
  const mockSetFilters = vi.fn();

  const mockLeads = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      score: 85,
      status: LeadStatus.QUALIFIED,
      source: LeadSource.WEBSITE,
      interest: '2BR Unit',
      aiInsight: 'High intent lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+0987654321',
      score: 65,
      status: LeadStatus.CONTACTED,
      source: LeadSource.FACEBOOK,
      interest: '1BR Unit',
      aiInsight: 'Interested in pet-friendly units',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockPipelineStats = {
    total: 100,
    new: 25,
    contacted: 30,
    qualified: 20,
    touring: 15,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLeadsStore as any).mockReturnValue({
      leads: mockLeads,
      pipelineStats: mockPipelineStats,
      isLoading: false,
      error: null,
      fetchLeads: mockFetchLeads,
      setFilters: mockSetFilters,
    });
  });

  describe('page rendering', () => {
    it('should render the leads page', () => {
      render(<LeadsPage />);

      expect(screen.getByText(/Leads/i)).toBeInTheDocument();
    });

    it('should render pipeline stats cards', () => {
      render(<LeadsPage />);

      expect(screen.getByText(/Total Leads/i)).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText(/New/i)).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should render leads table', () => {
      render(<LeadsPage />);

      // Check table headers
      expect(screen.getByText(/Lead Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Lead Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();
    });

    it('should display lead data in table', () => {
      render(<LeadsPage />);

      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('should render search input', () => {
      render(<LeadsPage />);

      const searchInput = screen.getByPlaceholderText(/Search leads/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should allow typing in search field', async () => {
      render(<LeadsPage />);

      const searchInput = screen.getByPlaceholderText(/Search leads/i) as HTMLInputElement;
      await userEvent.type(searchInput, 'John');

      expect(searchInput.value).toBe('John');
    });
  });

  describe('filter functionality', () => {
    it('should render filter button', () => {
      render(<LeadsPage />);

      const filterButton = screen.getByRole('button', { name: /Filter/i });
      expect(filterButton).toBeInTheDocument();
    });
  });

  describe('add lead functionality', () => {
    it('should render Add Lead button', () => {
      render(<LeadsPage />);

      const addButton = screen.getByRole('button', { name: /Add Manual Lead/i });
      expect(addButton).toBeInTheDocument();
    });

    it('should open modal when Add Lead button is clicked', async () => {
      render(<LeadsPage />);

      const addButton = screen.getByRole('button', { name: /Add Manual Lead/i });
      await userEvent.click(addButton);

      // Modal should be rendered
      expect(screen.getByText(/Add Manual Lead/i)).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading state', () => {
      (useLeadsStore as any).mockReturnValue({
        leads: [],
        pipelineStats: mockPipelineStats,
        isLoading: true,
        error: null,
        fetchLeads: mockFetchLeads,
        setFilters: mockSetFilters,
      });

      render(<LeadsPage />);

      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message when present', () => {
      (useLeadsStore as any).mockReturnValue({
        leads: [],
        pipelineStats: mockPipelineStats,
        isLoading: false,
        error: 'Failed to load leads',
        fetchLeads: mockFetchLeads,
        setFilters: mockSetFilters,
      });

      render(<LeadsPage />);

      expect(screen.getByText(/Failed to load leads/i)).toBeInTheDocument();
    });
  });

  describe('data fetching', () => {
    it('should call fetchLeads on mount', () => {
      render(<LeadsPage />);

      expect(mockFetchLeads).toHaveBeenCalled();
    });
  });

  describe('lead score display', () => {
    it('should display lead scores', () => {
      render(<LeadsPage />);

      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('65')).toBeInTheDocument();
    });
  });

  describe('status badges', () => {
    it('should display lead status badges', () => {
      render(<LeadsPage />);

      expect(screen.getByText(/Qualified/i)).toBeInTheDocument();
      expect(screen.getByText(/Contacted/i)).toBeInTheDocument();
    });
  });

  describe('source display', () => {
    it('should display lead sources', () => {
      render(<LeadsPage />);

      expect(screen.getByText(/Website/i)).toBeInTheDocument();
      expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
    });
  });

  describe('pipeline stats', () => {
    it('should display all pipeline metrics', () => {
      render(<LeadsPage />);

      expect(screen.getByText(/Total Leads/i)).toBeInTheDocument();
      expect(screen.getByText(/New/i)).toBeInTheDocument();
      expect(screen.getByText(/Contacted/i)).toBeInTheDocument();
      expect(screen.getByText(/Qualified/i)).toBeInTheDocument();
    });

    it('should display correct pipeline numbers', () => {
      render(<LeadsPage />);

      expect(screen.getByText('100')).toBeInTheDocument(); // Total
      expect(screen.getByText('25')).toBeInTheDocument(); // New
      expect(screen.getByText('30')).toBeInTheDocument(); // Contacted
      expect(screen.getByText('20')).toBeInTheDocument(); // Qualified
    });
  });

  describe('empty state', () => {
    it('should show empty state when no leads', () => {
      (useLeadsStore as any).mockReturnValue({
        leads: [],
        pipelineStats: {
          total: 0,
          new: 0,
          contacted: 0,
          qualified: 0,
          touring: 0,
        },
        isLoading: false,
        error: null,
        fetchLeads: mockFetchLeads,
        setFilters: mockSetFilters,
      });

      render(<LeadsPage />);

      // Should show some indication of no leads
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
