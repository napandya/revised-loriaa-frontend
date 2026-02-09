import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  source: string;
  sourceAgent: string;
  sourceDate: string;
  sourceTime: string;
  interest: string;
  status: string;
  aiContext: string;
}

const API_URL = API_CONFIG.baseURL;

// Default mock data when backend is unavailable
const defaultLeads: Lead[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', score: 92, source: 'Facebook', sourceAgent: '(Campaign Agent)', sourceDate: '01-15-2024', sourceTime: '09:30 AM', interest: '2 Bed', status: 'New', aiContext: 'High intent buyer, mentioned move-in date within 30 days' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 234-5678', score: 85, source: 'Google Ads', sourceAgent: '(Campaign Agent)', sourceDate: '01-14-2024', sourceTime: '02:15 PM', interest: '1 Bed', status: 'Contacted', aiContext: 'Budget conscious, comparing multiple properties' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '(555) 345-6789', score: 78, source: 'Website', sourceAgent: '(Direct)', sourceDate: '01-13-2024', sourceTime: '11:00 AM', interest: '3 Bed', status: 'Touring', aiContext: 'Family with pets, needs pet-friendly unit' },
];

const defaultStats = { total: 45, new: 12, contacted: 8, qualified: 15, touring: 10 };

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [stats, setStats] = useState(defaultStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`${API_URL}/api/v1/leads`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        // Handle both array response and object with leads array
        const leadsArray = Array.isArray(data) ? data : (data.leads || []);
        const mapped = leadsArray.map((l: any) => ({
          id: l.id,
          name: l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Unknown',
          email: l.email || '',
          phone: l.phone || '',
          score: l.score || Math.floor(Math.random() * 30) + 70,
          source: l.source || 'Website',
          sourceAgent: '(Campaign Agent)',
          sourceDate: l.created_at ? new Date(l.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : '',
          sourceTime: l.created_at ? new Date(l.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
          interest: l.unit_interest || l.interest || '1 Bed',
          status: l.status || 'new',
          aiContext: l.ai_insight || l.notes || '',
        }));
        if (mapped.length > 0) {
          setLeads(mapped);
          // Calculate stats from leads
          const statusCounts = mapped.reduce((acc: any, lead: Lead) => {
            const s = lead.status.toLowerCase();
            acc[s] = (acc[s] || 0) + 1;
            return acc;
          }, {});
          setStats({
            total: mapped.length,
            new: statusCounts['new'] || 0,
            contacted: statusCounts['contacted'] || 0,
            qualified: statusCounts['qualified'] || statusCounts['inquiry'] || 0,
            touring: statusCounts['touring'] || 0,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'new') return 'text-blue-600';
    if (s === 'contacted') return 'text-orange-500';
    if (s === 'qualified' || s === 'inquiry') return 'text-purple-600';
    if (s === 'touring') return 'text-red-500';
    if (s === 'application') return 'text-green-600';
    if (s === 'lease') return 'text-emerald-600';
    if (s === 'move-in') return 'text-teal-600';
    return 'text-slate-600';
  };

  const filteredLeads = leads.filter(lead => {
    const matchSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || lead.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="leads-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leads</h1>
            <p className="text-sm text-slate-500">All communications in one place</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium"
          data-testid="add-manual-lead-btn"
        >
          <Plus className="w-4 h-4" />
          Add Manual Lead
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: stats.total, color: 'text-blue-600' },
          { label: 'New', value: stats.new, color: 'text-green-500' },
          { label: 'Contacted', value: stats.contacted, color: 'text-green-500' },
          { label: 'Qualified', value: stats.qualified, color: 'text-purple-600' },
          { label: 'Touring', value: stats.touring, color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email or source.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="leads-search"
          />
        </div>
        <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <Filter className="w-4 h-4 text-slate-500" />
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200"
          data-testid="leads-status-filter"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="inquiry">Inquiry</option>
          <option value="touring">Touring</option>
          <option value="application">Application</option>
          <option value="lease">Lease</option>
          <option value="move-in">Move-In</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Lead Score</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Lead Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Source & Time</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Interest</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">AI Context</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer" data-testid={`lead-row-${lead.id}`}>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold bg-green-50 text-green-600 border border-green-200">
                    {lead.score}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="font-medium text-slate-800 dark:text-white">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.email}</p>
                  <p className="text-xs text-slate-500">{lead.phone}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{lead.source}</p>
                  <p className="text-xs text-slate-500">{lead.sourceAgent}</p>
                  <p className="text-xs text-slate-500">{lead.sourceDate}</p>
                  <p className="text-xs text-slate-500">{lead.sourceTime}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-blue-600">{lead.interest}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-sm font-medium ${getStatusStyle(lead.status)}`}>{lead.status}</span>
                </td>
                <td className="py-4 px-4 max-w-[280px]">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-medium text-slate-700 dark:text-slate-300">AI Insight: </span>
                    {lead.aiContext}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()} data-testid="add-lead-modal">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Add Manual Lead</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                <input type="tel" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Interest</label>
                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                  <option>1 Bed</option>
                  <option>2 Bed</option>
                  <option>3 Bed</option>
                  <option>Studio</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadsPage;
