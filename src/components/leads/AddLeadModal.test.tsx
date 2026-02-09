/**
 * AddLeadModal Component Tests
 * Tests for form validation and submission
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddLeadModal } from './AddLeadModal';
import { useLeadsStore } from '@/stores/leadsStore';

// Mock the leads store
vi.mock('@/stores/leadsStore', () => ({
  useLeadsStore: vi.fn(),
}));

describe('AddLeadModal', () => {
  const mockCreateLead = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLeadsStore as any).mockReturnValue({
      createLead: mockCreateLead,
    });
  });

  describe('rendering', () => {
    it('should not render when open is false', () => {
      render(<AddLeadModal open={false} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.queryByText('Add Manual Lead')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.getByText('Add Manual Lead')).toBeInTheDocument();
      expect(screen.getByText(/Enter lead details/)).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Interest/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Source/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
    });

    it('should render Cancel and Add Lead buttons', () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Lead/ })).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should require name field', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await userEvent.click(submitButton);
      
      const nameInput = screen.getByLabelText(/Full Name/) as HTMLInputElement;
      expect(nameInput.validity.valid).toBe(false);
    });

    it('should require email field', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await userEvent.click(submitButton);
      
      const emailInput = screen.getByLabelText(/Email/) as HTMLInputElement;
      expect(emailInput.validity.valid).toBe(false);
    });

    it('should require valid email format', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const emailInput = screen.getByLabelText(/Email/) as HTMLInputElement;
      await userEvent.type(emailInput, 'invalid-email');
      
      expect(emailInput.validity.valid).toBe(false);
    });

    it('should require phone field', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await userEvent.click(submitButton);
      
      const phoneInput = screen.getByLabelText(/Phone/) as HTMLInputElement;
      expect(phoneInput.validity.valid).toBe(false);
    });
  });

  describe('form submission', () => {
    it('should submit form with valid data', async () => {
      mockCreateLead.mockResolvedValueOnce(undefined);
      
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone/), '+1234567890');
      await user.type(screen.getByLabelText(/Interest/), '2BR Unit');
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockCreateLead).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+1234567890',
            interest: '2BR Unit',
          })
        );
      });
    });

    it('should close modal after successful submission', async () => {
      mockCreateLead.mockResolvedValueOnce(undefined);
      
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone/), '+1234567890');
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should show submitting state during submission', async () => {
      mockCreateLead.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone/), '+1234567890');
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await user.click(submitButton);
      
      expect(screen.getByRole('button', { name: /Adding\.\.\./ })).toBeInTheDocument();
    });

    it('should disable buttons during submission', async () => {
      mockCreateLead.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone/), '+1234567890');
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await user.click(submitButton);
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/ });
      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should handle submission errors', async () => {
      mockCreateLead.mockRejectedValueOnce(new Error('Failed to create lead'));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/Full Name/), 'John Smith');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone/), '+1234567890');
      
      const submitButton = screen.getByRole('button', { name: /Add Lead/ });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('cancel action', () => {
    it('should call onOpenChange when Cancel button is clicked', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/ });
      await userEvent.click(cancelButton);
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('form fields', () => {
    it('should allow selecting lead source', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const sourceSelect = screen.getByLabelText(/Source/) as HTMLSelectElement;
      await userEvent.selectOptions(sourceSelect, 'Website');
      
      expect(sourceSelect.value).toBe('Website');
    });

    it('should allow entering notes', async () => {
      render(<AddLeadModal open={true} onOpenChange={mockOnOpenChange} />);
      
      const notesTextarea = screen.getByLabelText(/Notes/);
      await userEvent.type(notesTextarea, 'Test notes');
      
      expect(notesTextarea).toHaveValue('Test notes');
    });
  });
});
