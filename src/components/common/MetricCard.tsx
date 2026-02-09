import { TrendingUpIcon, TrendingDownIcon, MinusIcon, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  className?: string;
}

/**
 * KPI metric card with value, change percentage, and trend indicator
 */
export function MetricCard({ 
  label, 
  value, 
  change, 
  trend = 'neutral',
  icon: Icon,
  className = '' 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUpIcon;
    if (trend === 'down') return TrendingDownIcon;
    return MinusIcon;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={`p-6 bg-card text-card-foreground border-border ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-4 h-4 ${getTrendColor()}`} />
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </Card>
  );
}
