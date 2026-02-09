/**
 * TeamPage Component Tests
 * Smoke tests for team management page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamPage } from './TeamPage';
import { useTeamStore } from '@/stores/teamStore';
import { UserRole } from '@/types';

// Mock the team store
vi.mock('@/stores/teamStore', () => ({
  useTeamStore: vi.fn(),
}));

describe('TeamPage', () => {
  const mockFetchTeamMembers = vi.fn();
  const mockFetchTeamStats = vi.fn();
  const mockRemoveMember = vi.fn();

  const mockMembers = [
    {
      id: '1',
      name: 'John Anderson',
      email: 'john@example.com',
      role: UserRole.ADMIN,
      status: 'Active',
      lastActive: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      role: UserRole.LEASING_STAFF,
      status: 'Active',
      lastActive: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Mike Taylor',
      email: 'mike@example.com',
      role: UserRole.MARKETING,
      status: 'Pending',
      invitedAt: new Date().toISOString(),
    },
  ];

  const mockStats = {
    totalMembers: 10,
    activeUsers: 8,
    pendingInvites: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTeamStore as any).mockReturnValue({
      members: mockMembers,
      stats: mockStats,
      isLoading: false,
      error: null,
      fetchTeamMembers: mockFetchTeamMembers,
      fetchTeamStats: mockFetchTeamStats,
      removeMember: mockRemoveMember,
    });
  });

  describe('page rendering', () => {
    it('should render the team page', () => {
      render(<TeamPage />);

      expect(screen.getByText(/Team/i)).toBeInTheDocument();
    });

    it('should render team stats cards', () => {
      render(<TeamPage />);

      expect(screen.getByText(/Total Members/i)).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText(/Pending Invites/i)).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render team members table', () => {
      render(<TeamPage />);

      // Check table headers
      expect(screen.getByText(/Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Email/i)).toBeInTheDocument();
      expect(screen.getByText(/Role/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();
    });

    it('should display team member data', () => {
      render(<TeamPage />);

      expect(screen.getByText('John Anderson')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('sarah@example.com')).toBeInTheDocument();
    });
  });

  describe('invite button', () => {
    it('should render Invite Member button', () => {
      render(<TeamPage />);

      const inviteButton = screen.getByRole('button', { name: /Invite Member/i });
      expect(inviteButton).toBeInTheDocument();
    });

    it('should open modal when Invite button is clicked', async () => {
      render(<TeamPage />);

      const inviteButton = screen.getByRole('button', { name: /Invite Member/i });
      await userEvent.click(inviteButton);

      // Modal should be rendered
      expect(screen.getByText(/Invite Team Member/i)).toBeInTheDocument();
    });
  });

  describe('role badges', () => {
    it('should display role badges for members', () => {
      render(<TeamPage />);

      expect(screen.getByText(UserRole.ADMIN)).toBeInTheDocument();
      expect(screen.getByText(UserRole.LEASING_STAFF)).toBeInTheDocument();
      expect(screen.getByText(UserRole.MARKETING)).toBeInTheDocument();
    });
  });

  describe('status badges', () => {
    it('should display status badges for members', () => {
      render(<TeamPage />);

      const activeStatuses = screen.getAllByText(/Active/i);
      expect(activeStatuses.length).toBeGreaterThan(0);
      
      expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    });
  });

  describe('member avatars', () => {
    it('should display member avatars', () => {
      render(<TeamPage />);

      // Check for avatar initials
      expect(screen.getByText(/JA/i)).toBeInTheDocument(); // John Anderson
      expect(screen.getByText(/SC/i)).toBeInTheDocument(); // Sarah Chen
    });
  });

  describe('last active time', () => {
    it('should display last active time for active members', () => {
      render(<TeamPage />);

      const lastActiveElements = screen.getAllByText(/Last active:/i);
      expect(lastActiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('loading state', () => {
    it('should show loading state', () => {
      (useTeamStore as any).mockReturnValue({
        members: [],
        stats: mockStats,
        isLoading: true,
        error: null,
        fetchTeamMembers: mockFetchTeamMembers,
        fetchTeamStats: mockFetchTeamStats,
        removeMember: mockRemoveMember,
      });

      render(<TeamPage />);

      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message when present', () => {
      (useTeamStore as any).mockReturnValue({
        members: [],
        stats: mockStats,
        isLoading: false,
        error: 'Failed to load team members',
        fetchTeamMembers: mockFetchTeamMembers,
        fetchTeamStats: mockFetchTeamStats,
        removeMember: mockRemoveMember,
      });

      render(<TeamPage />);

      expect(screen.getByText(/Failed to load team members/i)).toBeInTheDocument();
    });
  });

  describe('data fetching', () => {
    it('should call fetchTeamMembers on mount', () => {
      render(<TeamPage />);

      expect(mockFetchTeamMembers).toHaveBeenCalled();
    });

    it('should call fetchTeamStats on mount', () => {
      render(<TeamPage />);

      expect(mockFetchTeamStats).toHaveBeenCalled();
    });
  });

  describe('member actions', () => {
    it('should display action buttons for each member', () => {
      render(<TeamPage />);

      // Check for edit/delete action buttons (using aria-labels or test-ids if available)
      const buttons = screen.getAllByRole('button');
      // Should have Invite Member button + action buttons for each member
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  describe('empty state', () => {
    it('should show empty state when no members', () => {
      (useTeamStore as any).mockReturnValue({
        members: [],
        stats: {
          totalMembers: 0,
          activeUsers: 0,
          pendingInvites: 0,
        },
        isLoading: false,
        error: null,
        fetchTeamMembers: mockFetchTeamMembers,
        fetchTeamStats: mockFetchTeamStats,
        removeMember: mockRemoveMember,
      });

      render(<TeamPage />);

      // Should show 0 in stats
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('team stats', () => {
    it('should display all team metrics', () => {
      render(<TeamPage />);

      expect(screen.getByText(/Total Members/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Invites/i)).toBeInTheDocument();
    });

    it('should display correct team numbers', () => {
      render(<TeamPage />);

      expect(screen.getByText('10')).toBeInTheDocument(); // Total Members
      expect(screen.getByText('8')).toBeInTheDocument(); // Active Users
      expect(screen.getByText('2')).toBeInTheDocument(); // Pending Invites
    });
  });

  describe('member information', () => {
    it('should display member names and emails', () => {
      render(<TeamPage />);

      expect(screen.getByText('John Anderson')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('sarah@example.com')).toBeInTheDocument();
      expect(screen.getByText('Mike Taylor')).toBeInTheDocument();
      expect(screen.getByText('mike@example.com')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have table structure for screen readers', () => {
      render(<TeamPage />);

      // Table should be present
      const table = screen.getAllByRole('columnheader');
      expect(table.length).toBeGreaterThan(0);
    });
  });
});
