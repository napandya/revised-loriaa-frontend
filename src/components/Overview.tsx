import { useEffect } from 'react';
import { PhoneIcon, ClockIcon, DollarSignIcon, TrendingUpIcon } from 'lucide-react';
import { Header } from './Header';
import { MetricCard } from './MetricCard';
import { AnalyticsChart } from './AnalyticsChart';
import { useAppStore } from '../stores/appStore';
import { logger } from '@/lib/logger';

export function Overview() {
  const { metrics, isLoadingMetrics, metricsError, fetchMetrics } = useAppStore();

  useEffect(() => {
    logger.debug('Overview component mounted', { component: 'Overview', action: 'mount' });
    fetchMetrics();
  }, [fetchMetrics]);

  if (isLoadingMetrics) {
    return (
      <div>
        <Header title="Dashboard" showTimeFilter />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading metrics...</div>
        </div>
      </div>
    );
  }

  if (metricsError) {
    return (
      <div>
        <Header title="Dashboard" showTimeFilter />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {metricsError}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" showTimeFilter />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Calls Handled"
          value={metrics?.callsHandled?.toLocaleString() ?? '0'}
          icon={PhoneIcon}
        />
        <MetricCard
          title="Total Duration"
          value={`${((metrics?.totalDuration ?? 0) / 60).toFixed(0)} mins`}
          icon={ClockIcon}
        />
        <MetricCard
          title="Total Cost"
          value={`$${(metrics?.totalCost ?? 0).toFixed(2)}`}
          icon={DollarSignIcon}
        />
        <MetricCard
          title="Avg. Call Duration"
          value={`${(metrics?.avgDuration ?? 0).toFixed(1)} mins`}
          icon={TrendingUpIcon}
        />
      </div>

      <AnalyticsChart />
    </div>
  );
}
