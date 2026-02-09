/**
 * InviteMemberModal Component Tests
 * Tests for form validation and role selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InviteMemberModal } from './InviteMemberModal';
import { useTeamStore } from '@/stores/teamStore';
import { UserRole } from '@/types';

// Mock the team store
vi.mock('@/stores/teamStore', () => ({
  useTeamStore: vi.fn(),
}));

describe('InviteMemberModal', () => {
  const mockInviteMember = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTeamStore as any).mockReturnValue({
      inviteMember: mockInviteMember,
    });
  });

  describe('rendering', () => {
    it('should not render when open is false', () => {
      render(<InviteMemberModal open={false} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.queryByText('Invite Team Member')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.getByText('Invite Team Member')).toBeInTheDocument();
      expect(screen.getByText(/Send an invitation/)).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Role/)).toBeInTheDocument();
    });

    it('should render Cancel and Send Invitation buttons', () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Invitation/ })).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should require name field', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await userEvent.click(submitButton);
      
      const nameInput = screen.getByLabelText(/Full Name/) as HTMLInputElement;
      expect(nameInput.validity.valid).toBe(false);
    });

    it('should require email field', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await userEvent.click(submitButton);
      
      const emailInput = screen.getByLabelText(/Email Address/) as HTMLInputElement;
      expect(emailInput.validity.valid).toBe(false);
    });

    it('should require valid email format', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const emailInput = screen.getByLabelText(/Email Address/) as HTMLInputElement;
      await userEvent.type(emailInput, 'invalid-email');
      
      expect(emailInput.validity.valid).toBe(false);
    });

    it('should accept valid email format', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const emailInput = screen.getByLabelText(/Email Address/) as HTMLInputElement;
      await userEvent.type(emailInput, 'valid@example.com');
      
      expect(emailInput.validity.valid).toBe(true);
    });
  });

  describe('role selection', () => {
    it('should have default role of Leasing Staff', () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const roleSelect = screen.getByLabelText(/Role/) as HTMLSelectElement;
      expect(roleSelect.value).toBe(UserRole.LEASING_STAFF);
    });

    it('should allow selecting Admin role', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const roleSelect = screen.getByLabelText(/Role/) as HTMLSelectElement;
      await userEvent.selectOptions(roleSelect, UserRole.ADMIN);
      
      expect(roleSelect.value).toBe(UserRole.ADMIN);
    });

    it('should allow selecting Property Manager role', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const roleSelect = screen.getByLabelText(/Role/) as HTMLSelectElement;
      await userEvent.selectOptions(roleSelect, UserRole.PROPERTY_MANAGER);
      
      expect(roleSelect.value).toBe(UserRole.PROPERTY_MANAGER);
    });

    it('should allow selecting Marketing role', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const roleSelect = screen.getByLabelText(/Role/) as HTMLSelectElement;
      await userEvent.selectOptions(roleSelect, UserRole.MARKETING);
      
      expect(roleSelect.value).toBe(UserRole.MARKETING);
    });

    it('should render all available roles in dropdown', () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const roleSelect = screen.getByLabelText(/Role/);
      const options = Array.from(roleSelect.querySelectorAll('option'));
      const roleValues = options.map(opt => opt.value);
      
      expect(roleValues).toContain(UserRole.ADMIN);
      expect(roleValues).toContain(UserRole.LEASING_STAFF);
      expect(roleValues).toContain(UserRole.PROPERTY_MANAGER);
      expect(roleValues).toContain(UserRole.MARKETING);
    });
  });

  describe('form submission', () => {
    it('should submit form with valid data', async () => {
      mockInviteMember.mockResolvedValueOnce(undefined);
      
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      await user.selectOptions(screen.getByLabelText(/Role/), UserRole.ADMIN);
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockInviteMember).toHaveBeenCalledWith({
          name: 'John Smith',
          email: 'john@example.com',
          role: UserRole.ADMIN,
        });
      });
    });

    it('should close modal after successful submission', async () => {
      mockInviteMember.mockResolvedValueOnce(undefined);
      
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should show sending state during submission', async () => {
      mockInviteMember.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      expect(screen.getByRole('button', { name: /Sending\.\.\./ })).toBeInTheDocument();
    });

    it('should disable buttons during submission', async () => {
      mockInviteMember.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/ });
      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should handle submission errors', async () => {
      mockInviteMember.mockRejectedValueOnce(new Error('Failed to invite member'));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });

    it('should submit with default role if not changed', async () => {
      mockInviteMember.mockResolvedValueOnce(undefined);
      
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockInviteMember).toHaveBeenCalledWith(
          expect.objectContaining({
            role: UserRole.LEASING_STAFF,
          })
        );
      });
    });
  });

  describe('cancel action', () => {
    it('should call onOpenChange when Cancel button is clicked', async () => {
      render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/ });
      await userEvent.click(cancelButton);
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('form reset', () => {
    it('should reset form after successful submission', async () => {
      mockInviteMember.mockResolvedValueOnce(undefined);
      
      const { rerender } = render(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Send Invitation/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
      
      // Simulate reopening the modal
      rerender(<InviteMemberModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const nameInput = screen.getByLabelText(/Full Name/) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/Email Address/) as HTMLInputElement;
      
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });
});
