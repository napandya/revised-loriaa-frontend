import { useState, useEffect } from 'react';
import { 
  Phone, Clock, TrendingUp, FileText, DollarSign,
  MessageSquare, Calendar, CheckCircle, AlertCircle, KeyRound
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';

const API_URL = API_CONFIG.baseURL;

interface LeadCard {
  name: string;
  unit?: string;
  time?: string;
  channel?: string;
  score?: number;
  tourType?: string;
  tourTime?: string;
  badges?: { label: string; color: string; bg: string; border: string }[];
  status?: string;
  statusColor?: string;
  checklist?: { label: string; done: boolean }[];
}

const funnelColumns: { key: string; label: string; icon: React.ReactNode; count: number; leads: LeadCard[] }[] = [
  {
    key: 'inquiry', label: 'Inquiry', icon: <MessageSquare className="w-5 h-5 text-blue-500" />, count: 2,
    leads: [
      { name: 'John Doe', time: '2 mins ago', channel: 'SMS', unit: '1 Bed inquiry', badges: [{ label: 'Parking ($25)', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }], status: 'Negotiating', statusColor: 'text-blue-600' },
      { name: 'Lisa A', time: '15 mins ago', channel: 'Voice', unit: '2 Bed', status: 'Answering Questions', statusColor: 'text-green-600' },
    ]
  },
  {
    key: 'touring', label: 'Touring', icon: <Calendar className="w-5 h-5 text-purple-500" />, count: 2,
    leads: [
      { name: 'Jane Smith', unit: 'Unit 404', tourType: 'Self Guided', badges: [{ label: 'Tomorrow, 2:00 PM', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }, { label: 'Prep Unit 404', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' }] },
      { name: 'Robert Chen', unit: 'Unit 202', tourType: 'Agent Assisted', badges: [{ label: 'Today, 4:30 PM', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }] },
    ]
  },
  {
    key: 'application', label: 'Application', icon: <FileText className="w-5 h-5 text-orange-500" />, count: 1,
    leads: [
      { name: 'Mike Ross', unit: 'Unit 305', score: 740, badges: [{ label: 'Needs Approval', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }] },
    ]
  },
  {
    key: 'lease', label: 'Lease', icon: <FileText className="w-5 h-5 text-green-500" />, count: 2,
    leads: [
      { name: 'Sarah Johnson', unit: 'Unit 101', badges: [{ label: 'Awaiting Signature', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }] },
      { name: 'David Martinez', unit: 'Unit 508', badges: [{ label: 'Awaiting Countersign', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }] },
    ]
  },
  {
    key: 'movein', label: 'Move-In', icon: <KeyRound className="w-5 h-5 text-teal-500" />, count: 1,
    leads: [
      { name: 'Emily Rodriguez', unit: 'Unit 210', badges: [{ label: 'Moving In 3 Days', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' }], checklist: [{ label: 'Renters Insurance', done: true }, { label: 'Setup Fee Paid', done: true }, { label: 'Electricity Account', done: false }] },
    ]
  },
];

// Default metrics when backend is unavailable
const defaultMetrics = { response_time: '45s', tour_conversion: '32%', app_volume: 12, upsell_revenue: 300 };
const defaultStatus = { online: true, prospects_handling: 45 };

export function LeasingAgentPage() {
  const [data, setData] = useState<any>({ metrics: defaultMetrics, status: defaultStatus });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`${API_URL}/api/v1/agents/leasing/activity?limit=10`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(activityData => {
        if (activityData) {
          setData({
            funnel: activityData.funnel || {},
            metrics: activityData.metrics || defaultMetrics,
            status: activityData.status || defaultStatus,
            activities: activityData.activities || []
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const funnel = data?.funnel || {};
  const metrics = data?.metrics || defaultMetrics;
  const status = data?.status || defaultStatus;

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="leasing-agent-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leasing Agent</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xl font-bold text-green-500">{status.online ? 'Online' : 'Offline'}</span>
            <div className="text-right">
              <p className="text-xs text-slate-500">Handling</p>
              <p className="text-sm font-bold text-slate-700 dark:text-white">{status.prospects_handling || 45} Prospects</p>
            </div>
          </div>
          <div className="px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl">
            <p className="text-sm font-semibold text-slate-700">Intervention</p>
            <p className="text-sm font-semibold text-slate-700">Mode</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPI icon={<Clock className="w-6 h-6 text-blue-500" />} iconBg="bg-blue-50" label="Response Time" value={metrics.response_time || '45s'} sub="Avg AI pickup time" trend="+2" trendUp />
        <KPI icon={<TrendingUp className="w-6 h-6 text-purple-500" />} iconBg="bg-purple-50" label="Tour Conversion" value={metrics.tour_conversion || '32%'} valueColor="text-green-500" sub="Leads who booked tours" />
        <KPI icon={<FileText className="w-6 h-6 text-green-500" />} iconBg="bg-green-50" label="App Volume" value={String(metrics.app_volume || 12)} valueColor="text-green-500" sub="Pending reviews" />
        <KPI icon={<DollarSign className="w-6 h-6 text-red-400" />} iconBg="bg-red-50" label="Upsell Revenue" value={`$${metrics.upsell_revenue || 300}`} valueColor="text-red-500" sub="This week" />
      </div>

      {/* Leasing Funnel */}
      <div className="mb-4">
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Leasing Funnel</h2>
          <span className="text-sm text-slate-400 italic">Track leads through the entire lifecycle</span>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {funnelColumns.map(col => (
            <div key={col.key} className="flex items-center gap-2">
              {col.icon}
              <span className="text-lg font-bold text-slate-800 dark:text-white">{col.label}</span>
              <span className="text-lg text-slate-400 font-medium">{col.count}</span>
            </div>
          ))}
        </div>

        {/* Kanban Cards */}
        <div className="grid grid-cols-5 gap-4 items-start">
          {funnelColumns.map(col => (
            <div key={col.key} className="space-y-3">
              {col.leads.map((lead, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer" data-testid={`lead-card-${col.key}-${idx}`}>
                  {/* Name + meta */}
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{lead.name}</span>
                    <div className="text-right">
                      {lead.time && <p className="text-[11px] text-slate-400">{lead.time}</p>}
                      {lead.channel && <p className="text-[11px] text-slate-500 font-medium">{lead.channel}</p>}
                      {lead.tourType && <p className="text-[11px] text-slate-500 font-medium">{lead.tourType}</p>}
                      {lead.score && <span className="inline-block px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-50 rounded border border-blue-200">Score {lead.score}</span>}
                    </div>
                  </div>
                  {lead.unit && <p className="text-xs text-slate-500 mb-2">{lead.unit}</p>}

                  {/* Badges */}
                  {lead.badges && (
                    <div className="space-y-1.5 mb-2">
                      {lead.badges.map((b, bi) => (
                        <div key={bi} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${b.bg} ${b.color} ${b.border} text-center`}>
                          {b.label}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status */}
                  {lead.status && (
                    <p className={`text-xs font-semibold italic ${lead.statusColor || 'text-blue-500'}`}>{lead.status}</p>
                  )}

                  {/* Checklist */}
                  {lead.checklist && (
                    <div className="space-y-1.5 mt-2">
                      {lead.checklist.map((item, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          {item.done ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-xs ${item.done ? 'text-green-600' : 'text-red-500'} font-medium`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Leasing Agent Activity Stream */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Leasing Agent Activity Stream</h2>
        <div className="grid grid-cols-2 gap-x-12 gap-y-5">
          {[
            { time: '09:05 AM', agent: 'Ledger Worker', agentColor: 'text-green-600 bg-green-50 border-green-200', action: 'Posted $10 Setup Fee & $13 Insurance Charge to Unit 404 Ledger' },
            { time: '09:05 AM', agent: 'Ledger Worker', agentColor: 'text-green-600 bg-green-50 border-green-200', action: 'Posted $10 Setup Fee & $13 Insurance Charge to Unit 404 Ledger' },
            { time: '09:12 AM', agent: 'Compliance Worker', agentColor: 'text-purple-600 bg-purple-50 border-purple-200', action: 'Detected Lease Signature. Updated ResMan status to "Leased"' },
            { time: '09:12 AM', agent: 'Compliance Worker', agentColor: 'text-purple-600 bg-purple-50 border-purple-200', action: 'Detected Lease Signature. Updated ResMan status to "Leased"' },
            { time: '09:15 AM', agent: 'Tour Worker', agentColor: 'text-red-500 bg-red-50 border-red-200', action: 'Synced Tour24 appointment for Unit 202 to Outlook Calendar' },
            { time: '09:15 AM', agent: 'Tour Worker', agentColor: 'text-red-500 bg-red-50 border-red-200', action: 'Synced Tour24 appointment for Unit 202 to Outlook Calendar' },
            { time: '10:02 AM', agent: 'Utility Worker', agentColor: 'text-slate-600 bg-slate-50 border-slate-200', action: 'Sent "Day 3" SMS reminder to Tenant #5502 regarding TXU Electricity' },
            { time: '10:02 AM', agent: 'Utility Worker', agentColor: 'text-slate-600 bg-slate-50 border-slate-200', action: 'Sent "Day 3" SMS reminder to Tenant #5502 regarding TXU Electricity' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="text-sm text-slate-500 font-medium w-20 shrink-0 pt-0.5">{item.time}</span>
              <span className={`px-2.5 py-1 text-[11px] font-semibold rounded border shrink-0 ${item.agentColor}`}>
                {item.agent}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, iconBg, label, value, valueColor = 'text-slate-800', sub, trend, trendUp }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string;
  valueColor?: string; sub: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${iconBg} dark:bg-opacity-20 rounded-xl flex items-center justify-center`}>{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${valueColor} dark:text-white`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

export default LeasingAgentPage;
