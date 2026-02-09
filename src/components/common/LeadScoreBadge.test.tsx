/**
 * LeadScoreBadge Component Tests
 * Tests for score colors and labels (high/medium/low)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadScoreBadge } from './LeadScoreBadge';

describe('LeadScoreBadge', () => {
  describe('high score (80-100)', () => {
    it('should render score 80 as High with green color', () => {
      const { container } = render(<LeadScoreBadge score={80} />);
      
      expect(screen.getByText('80')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      const badge = container.querySelector('.bg-green-500\\/10');
      expect(badge).toBeInTheDocument();
    });

    it('should render score 90 as High', () => {
      render(<LeadScoreBadge score={90} />);
      
      expect(screen.getByText('90')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should render score 100 as High', () => {
      render(<LeadScoreBadge score={100} />);
      
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  describe('medium score (50-79)', () => {
    it('should render score 50 as Medium with yellow color', () => {
      const { container } = render(<LeadScoreBadge score={50} />);
      
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      const badge = container.querySelector('.bg-yellow-500\\/10');
      expect(badge).toBeInTheDocument();
    });

    it('should render score 65 as Medium', () => {
      render(<LeadScoreBadge score={65} />);
      
      expect(screen.getByText('65')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should render score 79 as Medium', () => {
      render(<LeadScoreBadge score={79} />);
      
      expect(screen.getByText('79')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });
  });

  describe('low score (0-49)', () => {
    it('should render score 0 as Low with red color', () => {
      const { container } = render(<LeadScoreBadge score={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      const badge = container.querySelector('.bg-red-500\\/10');
      expect(badge).toBeInTheDocument();
    });

    it('should render score 25 as Low', () => {
      render(<LeadScoreBadge score={25} />);
      
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should render score 49 as Low', () => {
      render(<LeadScoreBadge score={49} />);
      
      expect(screen.getByText('49')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });
  });

  describe('boundary testing', () => {
    it('should correctly handle score at high/medium boundary (79 vs 80)', () => {
      const { rerender } = render(<LeadScoreBadge score={79} />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
      
      rerender(<LeadScoreBadge score={80} />);
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should correctly handle score at medium/low boundary (49 vs 50)', () => {
      const { rerender } = render(<LeadScoreBadge score={49} />);
      expect(screen.getByText('Low')).toBeInTheDocument();
      
      rerender(<LeadScoreBadge score={50} />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });
  });

  describe('formatting', () => {
    it('should include separator between score and label', () => {
      render(<LeadScoreBadge score={85} />);
      
      // Check for the middle dot separator
      const badge = screen.getByText('·');
      expect(badge).toBeInTheDocument();
    });

    it('should render score as semibold', () => {
      const { container } = render(<LeadScoreBadge score={85} />);
      
      const scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('font-semibold');
    });
  });

  describe('custom styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <LeadScoreBadge score={85} className="custom-class" />
      );
      
      const badge = container.querySelector('.custom-class');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('color coding verification', () => {
    it('should use green for high scores', () => {
      const { container } = render(<LeadScoreBadge score={95} />);
      const badge = container.querySelector('.text-green-500');
      expect(badge).toBeInTheDocument();
    });

    it('should use yellow for medium scores', () => {
      const { container } = render(<LeadScoreBadge score={60} />);
      const badge = container.querySelector('.text-yellow-500');
      expect(badge).toBeInTheDocument();
    });

    it('should use red for low scores', () => {
      const { container } = render(<LeadScoreBadge score={30} />);
      const badge = container.querySelector('.text-red-500');
      expect(badge).toBeInTheDocument();
    });
  });
});
