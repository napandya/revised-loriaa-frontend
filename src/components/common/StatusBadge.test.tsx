/**
 * StatusBadge Component Tests
 * Tests for status badge color coding and rendering
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import { LeadStatus } from '@/types';

describe('StatusBadge', () => {
  it('should render NEW status with blue color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.NEW} />);
    
    expect(screen.getByText('New')).toBeInTheDocument();
    const badge = container.querySelector('.bg-blue-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render CONTACTED status with green color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.CONTACTED} />);
    
    expect(screen.getByText('Contacted')).toBeInTheDocument();
    const badge = container.querySelector('.bg-green-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render QUALIFIED status with purple color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.QUALIFIED} />);
    
    expect(screen.getByText('Qualified')).toBeInTheDocument();
    const badge = container.querySelector('.bg-purple-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render TOURING status with cyan color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.TOURING} />);
    
    expect(screen.getByText('Touring')).toBeInTheDocument();
    const badge = container.querySelector('.bg-cyan-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render APPLICATION status with orange color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.APPLICATION} />);
    
    expect(screen.getByText('Application')).toBeInTheDocument();
    const badge = container.querySelector('.bg-orange-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render LEASE status with emerald color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.LEASE} />);
    
    expect(screen.getByText('Lease')).toBeInTheDocument();
    const badge = container.querySelector('.bg-emerald-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render MOVE_IN status with teal color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.MOVE_IN} />);
    
    expect(screen.getByText('Move-In')).toBeInTheDocument();
    const badge = container.querySelector('.bg-teal-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should render LOST status with red color', () => {
    const { container } = render(<StatusBadge status={LeadStatus.LOST} />);
    
    expect(screen.getByText('Lost')).toBeInTheDocument();
    const badge = container.querySelector('.bg-red-500\\/10');
    expect(badge).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <StatusBadge status={LeadStatus.NEW} className="custom-class" />
    );
    
    const badge = container.querySelector('.custom-class');
    expect(badge).toBeInTheDocument();
  });

  it('should render all status values correctly', () => {
    Object.values(LeadStatus).forEach((status) => {
      const { rerender, container } = render(<StatusBadge status={status} />);
      
      // Should render the status text
      expect(container.textContent).toContain(status);
      
      // Should have color classes
      const coloredElement = container.querySelector('[class*="bg-"]');
      expect(coloredElement).toBeInTheDocument();
      
      rerender(<></>);
    });
  });
});
