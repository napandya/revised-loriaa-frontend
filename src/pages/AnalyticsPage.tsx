import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, TrendingUp, Zap, AlertCircle, Search, ArrowLeft
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const heatmapData = [
  { hour: '6 AM', voice: 2, sms: 1, capacity: 8 },
  { hour: '7 AM', voice: 5, sms: 3, capacity: 12 },
  { hour: '8 AM', voice: 15, sms: 8, capacity: 30 },
  { hour: '9 AM', voice: 25, sms: 15, capacity: 45 },
  { hour: '10 AM', voice: 28, sms: 18, capacity: 50 },
  { hour: '11 AM', voice: 22, sms: 12, capacity: 40 },
  { hour: '12 PM', voice: 18, sms: 10, capacity: 35 },
  { hour: '1 PM', voice: 15, sms: 8, capacity: 30 },
  { hour: '2 PM', voice: 20, sms: 12, capacity: 38 },
  { hour: '3 PM', voice: 24, sms: 18, capacity: 45 },
  { hour: '4 PM', voice: 28, sms: 20, capacity: 52 },
  { hour: '5 PM', voice: 18, sms: 14, capacity: 35 },
  { hour: '6 PM', voice: 10, sms: 8, capacity: 22 },
];

const interactionLogs = [
  { timestamp: 'Oct 12, 09:42 AM', direction: 'Inbound', channel: 'Voice', contact: 'Sarah Chen', contactPhone: '(555) 123-4567', duration: '2m 14s', ringTime: '0.5s', handledBy: 'AI', sentiment: 'Positive', hasAudio: true },
  { timestamp: 'Oct 12, 10:15 AM', direction: 'Inbound', channel: 'SMS', contact: 'Mike Davis', contactPhone: '(555) 234-5678', duration: '-', ringTime: '0.3s', handledBy: 'AI', sentiment: 'Neutral', hasAudio: false },
  { timestamp: 'Oct 12, 11:30 AM', direction: 'Inbound', channel: 'Voice', contact: 'John Roberts', contactPhone: '(555) 999-8888', duration: '5m 42s', ringTime: '0.8s', handledBy: 'Human', sentiment: 'Negative', hasAudio: true },
  { timestamp: 'Oct 12, 02:18 PM', direction: 'Inbound', channel: 'Voice', contact: '', contactPhone: '(555) 444-3333', duration: '0m 3s', ringTime: '2.1s', handledBy: 'AI', sentiment: 'Neutral', hasAudio: false },
];

export function AnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'health' | 'log'>('health');
  const [logFilter, setLogFilter] = useState('all');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/analytics/inbox`).then(r => r.json()).then(setAnalyticsData).catch(() => {});
  }, []);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="analytics-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/inbox')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Communication Analytics</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium" data-testid="export-analytics-btn">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button onClick={() => setActiveTab('health')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'health' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          data-testid="tab-health">
          Comm Health Dashboard
        </button>
        <button onClick={() => setActiveTab('log')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'log' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          data-testid="tab-log">
          Master Interaction Log
        </button>
      </div>

      {activeTab === 'health' ? <HealthDashboard data={analyticsData} /> : <MasterLog filter={logFilter} setFilter={setLogFilter} />}
    </div>
  );
}

function HealthDashboard({ data }: { data: any }) {
  const d = data || {};
  return (
    <div className="space-y-6">
      {/* KPI Row 1 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-green-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Volume (24h)</p>
          <p className="text-3xl font-bold text-blue-600">{d.total_volume_24h || 142}</p>
          <p className="text-xs text-slate-400 mt-1">{d.voice_calls || 45} Calls | {d.sms || 85} SMS | {d.emails || 12} Emails</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-green-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +0.08s
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Speed to Answer</p>
          <p className="text-3xl font-bold text-green-500">{d.speed_to_answer || 1.2}s</p>
          <p className="text-xs text-slate-400 mt-1">NFR-001 Target: &lt;800ms</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <button className="text-sm text-red-500 font-medium hover:underline">View Log</button>
          </div>
          <p className="text-sm text-slate-500 mb-1">Missed Opportunities</p>
          <p className="text-3xl font-bold text-red-500">{d.missed_opportunities || 3}</p>
          <p className="text-xs text-slate-400 mt-1">Dropped calls / Unanswered SMS</p>
        </div>
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">AI Resolution Rate</h3>
          <p className="text-sm text-slate-500 mb-2">Handled entirely by AI</p>
          <p className="text-3xl font-bold text-green-500">{d.ai_resolution_rate || 85}%</p>
          <p className="text-xs text-slate-400 mt-1">{100 - (d.ai_resolution_rate || 85)}% escalated to Human</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">Sentiment Score</h3>
          <p className="text-3xl font-bold text-orange-400 mt-3">Neutral-Positive</p>
          <p className="text-xs text-red-400 mt-2">2 Negative Interactions detected today</p>
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Peak Hours Heatmap</h3>
            <p className="text-sm text-slate-500">Call volume by hour - helps optimize human agent staffing</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">Voice Calls</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-600" /><span className="text-xs text-slate-500">SMS</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-300" /><span className="text-xs text-slate-500">Optimal Capacity</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={heatmapData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="voice" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={18} />
            <Bar dataKey="sms" fill="#D97706" radius={[2, 2, 0, 0]} barSize={18} />
            <Bar dataKey="capacity" fill="#CBD5E1" radius={[2, 2, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
          <p className="text-sm">
            <span className="font-medium text-green-600">Insight: </span>
            <span className="text-slate-600 dark:text-slate-300">Peak call hours are 10 AM - 5 PM. Consider having human agents on standby during 4-5 PM for "Human Takeover" support.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function MasterLog({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const filters = ['All Channels', 'Voice', 'SMS', 'Negative Sentiment', 'Dropped Calls'];

  const getSentimentColor = (s: string) => {
    if (s === 'Positive') return 'text-green-500 font-medium';
    if (s === 'Negative') return 'text-red-500 font-medium';
    return 'text-slate-500';
  };

  const getRingTimeColor = (t: string) => {
    const val = parseFloat(t);
    if (val <= 0.5) return 'text-green-500 font-medium';
    if (val <= 1.0) return 'text-amber-500 font-medium';
    return 'text-red-500 font-medium';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-slate-400"><Search className="w-4 h-4" /></span>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${filter === f ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}>
            {f}
          </button>
        ))}
        <div className="flex-1">
          <input type="text" placeholder="Search leads by name, email or source..." className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm placeholder-slate-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {['Timestamp', 'Direction', 'Channel', 'Contact', 'Duration', 'Ring Time', 'Handled By', 'Sentiment', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interactionLogs.map((log, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30" data-testid={`interaction-row-${i}`}>
                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">{log.timestamp}</td>
                <td className="py-3 px-4"><span className="text-sm text-blue-600 font-medium">{log.direction}</span></td>
                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">{log.channel}</td>
                <td className="py-3 px-4">
                  {log.contact && <p className="text-sm text-slate-700 dark:text-slate-200">{log.contact}</p>}
                  <p className="text-xs text-slate-500">{log.contactPhone}</p>
                </td>
                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">{log.duration}</td>
                <td className="py-3 px-4"><span className={`text-sm ${getRingTimeColor(log.ringTime)}`}>{log.ringTime}</span></td>
                <td className="py-3 px-4"><span className={`text-sm ${log.handledBy === 'AI' ? 'text-blue-600' : 'text-slate-700 dark:text-slate-200'}`}>{log.handledBy}</span></td>
                <td className="py-3 px-4"><span className={`text-sm ${getSentimentColor(log.sentiment)}`}>{log.sentiment}</span></td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-blue-500 hover:underline">View Transcript</button>
                    {log.hasAudio && <button className="text-xs text-purple-500 hover:underline">Play Audio</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyticsPage;
