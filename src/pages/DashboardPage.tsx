import { useEffect, useState } from 'react';
import { 
  Download, TrendingUp, TrendingDown, DollarSign, 
  Home, Filter, Zap
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { API_CONFIG } from '@/config/api';

const API_URL = API_CONFIG.baseURL;
const SOURCE_COLORS = ['#3B82F6', '#EF4444', '#8B5CF6', '#10B981'];

const leasingVelocityData = [
  { day: 'Mon', leads: 12, tours: 7 },
  { day: 'Tue', leads: 15, tours: 6 },
  { day: 'Wed', leads: 14, tours: 8 },
  { day: 'Thu', leads: 18, tours: 7 },
  { day: 'Fri', leads: 22, tours: 9 },
  { day: 'Sat', leads: 28, tours: 8 },
  { day: 'Sun', leads: 10, tours: 6 },
];

// Default mock data for when backend is not available
const defaultData = {
  portfolio_health: { score: 94, vacancy_loss_cost: 4500, marketing_spend_efficiency: 1200, ancillary_revenue: 850, total_revenue_projected: 145000 },
  leads_by_source: [
    { source: 'Facebook', count: 45, percentage: 35 },
    { source: 'Google Ads', count: 32, percentage: 25 },
    { source: 'Website', count: 28, percentage: 22 },
    { source: 'Referral', count: 23, percentage: 18 },
  ],
  ai_activity: [
    { timestamp: new Date().toISOString(), agent: 'Marketing Agent', action: 'Synced John Doe (Lead) from Facebook Form #442 to CRM Leads Table' },
    { timestamp: new Date().toISOString(), agent: 'Leasing Agent', action: 'Scheduled tour for Unit 404 with prospect Jane Smith' },
    { timestamp: new Date().toISOString(), agent: 'Marketing Agent', action: 'Published Facebook Campaign for Unit 102' },
  ],
  metrics: { avg_response_time: '12 Sec', tour_conversion: '35%', apps_submitted: '35%' }
};

export function DashboardPage() {
  const [data, setData] = useState<any>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Fetch dashboard metrics from backend
    Promise.all([
      fetch(`${API_URL}/api/v1/dashboard/metrics`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_URL}/api/v1/dashboard/portfolio-health`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_URL}/api/v1/dashboard/agent-activity?limit=5`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([metrics, health, activity]) => {
      setData({
        portfolio_health: health || defaultData.portfolio_health,
        leads_by_source: defaultData.leads_by_source, // Use default, backend may not have this
        ai_activity: activity?.activities || defaultData.ai_activity,
        metrics: metrics ? {
          avg_response_time: `${metrics.average_duration_seconds || 12} Sec`,
          tour_conversion: `${metrics.success_rate || 35}%`,
          apps_submitted: `${metrics.total_calls || 35}%`
        } : defaultData.metrics
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const health = data?.portfolio_health || {};
  const sources = (data?.leads_by_source || []).map((s: any, i: number) => ({ ...s, name: s.source, value: s.count, leads: s.count, color: SOURCE_COLORS[i % 4], pct: `${s.percentage}%` }));
  const activities = data?.ai_activity || [];
  const metrics = data?.metrics || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">COO Command Center</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">COO Agent Status</span>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-semibold rounded">Monitoring</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Portfolio Health Score</span>
            <span className="text-lg font-bold text-slate-800 dark:text-white">{health.score || 94}/100</span>
          </div>
          <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200">
            <option>Last 30 Days</option><option>Last 7 Days</option><option>Last 90 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium" data-testid="export-report-btn">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard icon={<TrendingDown className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" label="Vacancy Loss Cost" value={`$${(health.vacancy_loss_cost || 4500).toLocaleString()}`} valueColor="text-red-500" sub="Equivalent to 2.5 Units" trend="+2.5%" trendUp />
        <KPICard icon={<DollarSign className="w-5 h-5 text-blue-500" />} iconBg="bg-blue-50" label="Marketing Spend Efficiency" value={`$${health.marketing_spend_efficiency || 1200}`} valueColor="text-blue-600" sub={`$${(health.marketing_spend_efficiency || 8.24).toFixed(2)} Cost Per Lead`} trend="-15%" trendUp={false} />
        <KPICard icon={<TrendingUp className="w-5 h-5 text-green-500" />} iconBg="bg-green-50" label="Ancillary Revenue Captured" value={`$${(health.ancillary_revenue || 850).toLocaleString()}`} valueColor="text-green-500" sub="From Parking ($25) & Patio ($35)" trend="+12%" trendUp />
        <KPICard icon={<Home className="w-5 h-5 text-purple-500" />} iconBg="bg-purple-50" label="Total Revenue Projected" value={`$${(health.total_revenue_projected || 145000).toLocaleString()}`} valueColor="text-purple-500" sub="Includes 5 Pending Move-ins" trend="+8%" trendUp />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Marketing Performance Funnel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-base font-semibold text-slate-800 dark:text-white">Marketing Performance</h3><p className="text-sm text-slate-500">Lead Generation Funnel</p></div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Filter className="w-5 h-5 text-teal-500" /></button>
          </div>
          <div className="relative h-48 flex items-center justify-center">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              <defs><linearGradient id="funnelGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#93C5FD" stopOpacity="0.6"/><stop offset="100%" stopColor="#1E40AF" stopOpacity="0.95"/></linearGradient></defs>
              <path d="M 10 5 L 390 5 L 320 45 L 280 85 L 250 125 L 150 125 L 120 85 L 80 45 Z" fill="url(#funnelGrad)" />
              <path d="M 390 5 L 320 45 L 330 50 L 400 10 Z" fill="#1E3A8A" opacity="0.4"/>
              <path d="M 320 45 L 280 85 L 290 90 L 330 50 Z" fill="#1E3A8A" opacity="0.35"/>
              <path d="M 280 85 L 250 125 L 260 130 L 290 90 Z" fill="#1E3A8A" opacity="0.3"/>
            </svg>
          </div>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
            <p className="text-sm"><span className="font-medium text-green-600">Insight: </span><span className="text-slate-600 dark:text-slate-300">Campaign 'Village Green' is performing 20% better than average.</span></p>
          </div>
        </div>

        {/* Leasing Velocity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-base font-semibold text-slate-800 dark:text-white">Leasing Velocity</h3><p className="text-sm text-slate-500">Leads vs. Tours This Week</p></div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Filter className="w-5 h-5 text-purple-500" /></button>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={leasingVelocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 28]} ticks={[0, 7, 14, 21, 28]} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
              <Line type="monotone" dataKey="tours" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-1">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-xs text-slate-500">leads</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-xs text-slate-500">tours</span></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="text-center"><p className="text-xs text-slate-500 mb-1">Avg Response Time</p><p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.avg_response_time || '12 Sec'}</p></div>
            <div className="text-center"><p className="text-xs text-slate-500 mb-1">Tour Conversion</p><p className="text-xl font-bold text-green-500">{metrics.tour_conversion || '35%'}</p></div>
            <div className="text-center"><p className="text-xs text-slate-500 mb-1">Apps Submitted</p><p className="text-xl font-bold text-blue-500">{metrics.apps_submitted || '35%'}</p></div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* AI Workforce Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-blue-500" /><h3 className="text-base font-semibold text-slate-800 dark:text-white">AI Workforce Activity</h3></div>
            <button className="text-sm text-blue-500 hover:underline font-medium" data-testid="view-all-activity">View All</button>
          </div>
          <div className="space-y-3">
            {activities.map((a: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs text-slate-400 w-16 shrink-0 pt-0.5 font-medium">{a.timestamp ? new Date(a.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}</span>
                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded shrink-0 ${a.agent?.includes('Marketing') ? 'bg-pink-100 text-pink-600' : 'bg-cyan-100 text-cyan-600'}`}>{a.agent}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{a.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Source - Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Leads by Source</h3>
          <div className="flex items-center gap-8">
            <div className="w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sources} cx="50%" cy="50%" outerRadius={75} dataKey="value" startAngle={90} endAngle={-270}>
                    {sources.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {sources.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.pct}</span>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{item.name}</span>
                  <span className="text-sm text-slate-400">{item.leads} Leads</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, iconBg, label, value, valueColor, sub, trend, trendUp }: { icon: React.ReactNode; iconBg: string; label: string; value: string; valueColor: string; sub: string; trend: string; trendUp: boolean }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${iconBg} dark:bg-opacity-20 rounded-full flex items-center justify-center`}>{icon}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}<span>{trend}</span>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

export default DashboardPage;
