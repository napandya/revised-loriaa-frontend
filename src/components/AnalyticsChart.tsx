import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', calls: 120, duration: 1800, cost: 85 },
  { name: 'Tue', calls: 180, duration: 2400, cost: 115 },
  { name: 'Wed', calls: 150, duration: 2100, cost: 98 },
  { name: 'Thu', calls: 220, duration: 3200, cost: 145 },
  { name: 'Fri', calls: 190, duration: 2800, cost: 128 },
  { name: 'Sat', calls: 140, duration: 1900, cost: 92 },
  { name: 'Sun', calls: 110, duration: 1600, cost: 78 },
];

export function AnalyticsChart() {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground font-heading">Analytics Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 25%)" />
          <XAxis dataKey="name" stroke="hsl(220, 10%, 70%)" />
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
            dataKey="calls"
            stroke="hsl(255, 85%, 52%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(255, 85%, 52%)', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="hsl(170, 70%, 45%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(170, 70%, 45%)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
