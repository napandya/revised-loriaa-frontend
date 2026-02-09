import { useEffect } from 'react';
import { DollarSignIcon, TrendingUpIcon, CreditCardIcon } from 'lucide-react';
import { Header } from './Header';
import { MetricCard } from './MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../stores/appStore';

export function Billing() {
  const { 
    billingStats, 
    billingHistory, 
    isLoadingBilling, 
    billingError, 
    fetchBillingStats, 
    fetchBillingHistory 
  } = useAppStore();

  useEffect(() => {
    fetchBillingStats();
    fetchBillingHistory();
  }, [fetchBillingStats, fetchBillingHistory]);

  if (isLoadingBilling) {
    return (
      <div>
        <Header title="Billing" />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading billing data...</div>
        </div>
      </div>
    );
  }

  if (billingError) {
    return (
      <div>
        <Header title="Billing" />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {billingError}</div>
        </div>
      </div>
    );
  }

  const currentMonthCost = billingStats?.current_month_cost || 0;
  const totalCalls = billingStats?.total_calls || 0;
  const totalDuration = billingStats?.total_duration || 0;
  
  // Calculate average monthly cost from history
  const avgMonthlyCost = billingHistory.length > 0
    ? billingHistory.reduce((sum, item) => sum + item.cost, 0) / billingHistory.length
    : 0;

  return (
    <div>
      <Header title="Billing" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Current Month" value={`$${currentMonthCost.toFixed(2)}`} icon={DollarSignIcon} />
        <MetricCard title="Total Calls" value={totalCalls.toLocaleString()} icon={CreditCardIcon} />
        <MetricCard title="Avg. Monthly" value={`$${avgMonthlyCost.toFixed(2)}`} icon={TrendingUpIcon} />
      </div>

      {billingHistory.length > 0 && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground font-heading">Monthly Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={billingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 25%)" />
              <XAxis dataKey="month" stroke="hsl(220, 10%, 70%)" />
              <YAxis stroke="hsl(220, 10%, 70%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220, 12%, 17%)',
                  border: '1px solid hsl(220, 12%, 25%)',
                  borderRadius: '8px',
                  color: 'hsl(0, 0%, 96%)',
                }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="hsl(255, 85%, 52%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(255, 85%, 52%)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-8 bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground font-heading">Payment Method</h3>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <CreditCardIcon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-foreground font-medium">•••• •••• •••• 4242</p>
            <p className="text-sm text-muted-foreground">Expires 12/25</p>
          </div>
        </div>
      </div>
    </div>
  );
}
