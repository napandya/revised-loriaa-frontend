import { useState, useEffect } from 'react';
import {
  Building2, Upload, FileText, ChevronRight, CheckSquare,
  Users, Lightbulb, Clock, AlertCircle
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';

const API_URL = API_CONFIG.baseURL;

// Default document categories when backend is unavailable
const defaultCategories = { 'Leasing Policies': 12, 'Property Info': 8, 'Templates': 5, 'Compliance': 3 };

export function PropertyManagerPage() {
  const [tab, setTab] = useState<'knowledge' | 'tasks' | 'nba'>('knowledge');
  const [docData, setDocData] = useState<any>({ categories: defaultCategories });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`${API_URL}/api/v1/documents`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          // Transform backend response
          const docs = Array.isArray(data) ? data : (data.documents || []);
          const categories = docs.reduce((acc: any, doc: any) => {
            const cat = doc.category || 'Other';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {});
          setDocData({ documents: docs, categories: Object.keys(categories).length > 0 ? categories : defaultCategories });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="property-manager-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Property Manager Studio</h1>
        </div>
        <p className="text-sm text-slate-500 italic">The Orchestrator - Manage AI knowledge base, tasks, and workflows</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b border-slate-200 dark:border-slate-700">
        {[
          { key: 'knowledge', label: 'Knowledge Base' },
          { key: 'tasks', label: 'Task Command Center' },
          { key: 'nba', label: 'Next Best Action' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`pb-3 text-base font-medium transition-colors ${tab === t.key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            data-testid={`tab-${t.key}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'knowledge' && <KnowledgeBaseTab docData={docData} />}
      {tab === 'tasks' && <TaskCommandTab />}
      {tab === 'nba' && <NextBestActionTab />}
    </div>
  );
}

function KnowledgeBaseTab({ docData }: { docData: any }) {
  const [selectedCategory, setSelectedCategory] = useState('Leasing Policies');
  const cats = docData?.categories || {};
  const categories = [
    { name: 'Leasing Policies', icon: FileText, count: cats['Leasing Policies'] || 0 },
    { name: 'Property Info', icon: Building2, count: cats['Property Info'] || 0 },
    { name: 'Templates', icon: FileText, count: cats['Templates'] || 0 },
    { name: 'Compliance', icon: CheckSquare, count: cats['Compliance'] || 0 },
  ];

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Document Repository - Left */}
      <div className="col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Document Repository</h3>
        <div className="space-y-1">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name;
            return (
              <button key={i} onClick={() => setSelectedCategory(cat.name)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 border border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${isActive ? 'text-blue-600' : 'text-slate-700 dark:text-slate-200'}`}>{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-medium">{cat.count}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload & Configure - Right */}
      <div className="col-span-3 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Upload & Configure Document</h3>

        {/* Drag & Drop Zone */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer" data-testid="upload-dropzone">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">Click To Upload Or Drag And Drop Here</p>
          <p className="text-xs text-slate-400 mt-1">PDF, DOC Or DOCX (Max. 50MB)</p>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Document Category</label>
            <select className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
              <option>Policy</option>
              <option>Template</option>
              <option>Compliance</option>
              <option>Property Info</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Trigger Event (When to use?)</label>
            <select className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
              <option>On Inquiry</option>
              <option>On Tour</option>
              <option>On Application</option>
              <option>On Move-In</option>
            </select>
          </div>
        </div>

        {/* Agent Access Checkboxes */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Assigned Agent Access</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'All Agents (Public Info)', checked: true },
              { label: 'Leasing Agent', checked: false },
              { label: 'Marketing Agent', checked: false },
              { label: 'Compliance Worker', checked: false },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.checked ? 'bg-purple-500 border-purple-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {item.checked && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Expiration Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Expiration Date (Optional)</label>
          <input type="text" placeholder="mm/dd/yyyy" className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm placeholder-slate-400" />
        </div>

        <button className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors" data-testid="upload-vectorize-btn">
          Upload & Vectorize
        </button>
      </div>
    </div>
  );
}

function TaskCommandTab() {
  const tasks = [
    { title: 'Approve Ad Copy: Unit 305', source: 'Marketing Agent', status: 'Pending Approval', priority: 'High', priorityColor: 'bg-red-500' },
    { title: 'Review Screening: John Doe', source: 'Leasing Agent', status: 'Flagged - Criminal Record Found', priority: 'High', priorityColor: 'bg-red-500' },
    { title: 'Unit 404 Vacant - Take Photos', source: 'System', status: 'Scheduled for Tomorrow', priority: 'Medium', priorityColor: 'bg-orange-400' },
  ];

  const agents = [
    { name: 'Leasing Agent', status: 'green', activity: 'Engaging via SMS with Lead #4092\n(Discussion: Parking Upsell)' },
    { name: 'Marketing Agent', status: 'green', activity: 'Publishing Facebook Campaign for Unit 102' },
    { name: 'Compliance Worker', status: 'orange', activity: 'Waiting for Electric Account # from Unit 201 (Day 3 Check)' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* My Queue */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-5">
          <CheckSquare className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">My Queue</h3>
        </div>
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div key={i} className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600" data-testid={`task-card-${i}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm text-slate-800 dark:text-white">{task.title}</p>
                <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded ${task.priorityColor}`}>{task.priority}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Source: {task.source}</p>
              <p className="text-xs text-slate-500 mb-3">{task.status}</p>
              <button className="text-sm text-blue-600 font-semibold hover:underline">Review</button>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Watchlist */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Agent Watchlist</h3>
        </div>
        <div className="space-y-4">
          {agents.map((agent, i) => (
            <div key={i} className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${agent.status === 'green' ? 'bg-green-500' : 'bg-orange-400'}`} />
                <span className="font-bold text-sm text-slate-800 dark:text-white">{agent.name}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{agent.activity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delegation Station */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Delegation Station</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Select Agent</label>
          <select className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
            <option>Leasing Agent</option>
            <option>Marketing Agent</option>
            <option>Compliance Worker</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Task Description</label>
          <textarea rows={5} placeholder="Tell The Agent To..." className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm placeholder-slate-400 resize-none" />
        </div>

        <button className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 mb-6" data-testid="delegate-task-btn">
          Delegate Task
        </button>

        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Actions</h4>
          <div className="space-y-2.5">
            {['Email all residents about pool closure', 'Update rent increase notices', 'Generate vacancy report'].map((action, i) => (
              <button key={i} className="text-sm text-blue-600 hover:underline block">{action}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NextBestActionTab() {
  return (
    <div>
      {/* AI Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <Lightbulb className="w-7 h-7 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI-Powered Recommendations</h3>
          <p className="text-sm text-slate-500">Smart suggestions to optimize your property operations</p>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">Pre-Lease Campaign Recommendation</h4>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">Unit 305 is becoming vacant in 5 days. Marketing Agent suggests launching a "Pre-Lease" campaign now.</p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600">Launch Campaign</button>
            <button className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Dismiss</button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">Tour Day Weather Update</h4>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">3 Tours scheduled for Saturday. Leasing Agent suggests sending a weather update/parking guide to these prospects.</p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600">Send Updates</button>
            <button className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyManagerPage;
