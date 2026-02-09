/**
 * MetricCard Component Tests
 * Tests for metric display, trends, and changes
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';
import { UsersIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';

describe('MetricCard', () => {
  it('should render label and value', () => {
    render(<MetricCard label="Total Leads" value={342} />);
    
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('342')).toBeInTheDocument();
  });

  it('should render string values', () => {
    render(<MetricCard label="Revenue" value="$1,234" />);
    
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('should render positive change with up trend', () => {
    render(
      <MetricCard 
        label="Total Leads" 
        value={342} 
        change={12.5} 
        trend="up" 
      />
    );
    
    expect(screen.getByText(/\+12\.5%/)).toBeInTheDocument();
    expect(screen.getByText(/vs last period/)).toBeInTheDocument();
  });

  it('should render negative change with down trend', () => {
    render(
      <MetricCard 
        label="Applications" 
        value={45} 
        change={-3.1} 
        trend="down" 
      />
    );
    
    expect(screen.getByText(/-3\.1%/)).toBeInTheDocument();
  });

  it('should render zero change', () => {
    render(
      <MetricCard 
        label="Metric" 
        value={100} 
        change={0} 
        trend="neutral" 
      />
    );
    
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it('should not render change when not provided', () => {
    render(<MetricCard label="Total Leads" value={342} />);
    
    expect(screen.queryByText(/vs last period/)).not.toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    const { container } = render(
      <MetricCard 
        label="Total Leads" 
        value={342} 
        icon={UsersIcon} 
      />
    );
    
    // Icon should be rendered
    const iconContainer = container.querySelector('.bg-primary\\/10');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should not render icon when not provided', () => {
    const { container } = render(
      <MetricCard label="Total Leads" value={342} />
    );
    
    const iconContainer = container.querySelector('.bg-primary\\/10');
    expect(iconContainer).not.toBeInTheDocument();
  });

  it('should apply correct color for up trend', () => {
    const { container } = render(
      <MetricCard 
        label="Metric" 
        value={100} 
        change={5} 
        trend="up" 
      />
    );
    
    const changeElement = container.querySelector('.text-green-500');
    expect(changeElement).toBeInTheDocument();
  });

  it('should apply correct color for down trend', () => {
    const { container } = render(
      <MetricCard 
        label="Metric" 
        value={100} 
        change={-5} 
        trend="down" 
      />
    );
    
    const changeElement = container.querySelector('.text-red-500');
    expect(changeElement).toBeInTheDocument();
  });

  it('should apply correct color for neutral trend', () => {
    const { container } = render(
      <MetricCard 
        label="Metric" 
        value={100} 
        change={0} 
        trend="neutral" 
      />
    );
    
    const changeElement = container.querySelector('.text-gray-500');
    expect(changeElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MetricCard 
        label="Metric" 
        value={100} 
        className="custom-class" 
      />
    );
    
    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(<MetricCard label="Revenue" value={1234567} />);
    
    expect(screen.getByText('1234567')).toBeInTheDocument();
  });

  it('should handle decimal changes', () => {
    render(
      <MetricCard 
        label="Metric" 
        value={100} 
        change={12.34} 
        trend="up" 
      />
    );
    
    expect(screen.getByText(/\+12\.34%/)).toBeInTheDocument();
  });

  it('should default to neutral trend when not specified', () => {
    const { container } = render(
      <MetricCard 
        label="Metric" 
        value={100} 
        change={5} 
      />
    );
    
    const changeElement = container.querySelector('.text-gray-500');
    expect(changeElement).toBeInTheDocument();
  });
});
