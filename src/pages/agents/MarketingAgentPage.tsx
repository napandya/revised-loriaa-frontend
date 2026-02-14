import { useState, useEffect } from 'react';
import {
  Send, TrendingUp, TrendingDown, AlertCircle, Eye, Clock, CheckCircle,
  Users, DollarSign, Settings as SettingsIcon, Sparkles, Copy, RefreshCw, Loader2
} from 'lucide-react';
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';

const API_URL = API_CONFIG.baseURL;

interface CampaignCard {
  unit: string;
  beds: string;
  price: string;
  badge?: { label: string; color: string; bg: string; border: string };
  action?: string;
  actionColor?: string;
  secondAction?: { label: string; color: string };
  meta?: string;
  leads?: string;
  leadsColor?: string;
  viewLink?: string;
  activeDays?: string;
}

const campaignColumns: { key: string; label: string; icon: React.ReactNode; count: number; cards: CampaignCard[] }[] = [
  {
    key: 'detected', label: 'Detected Vacancies', icon: <AlertCircle className="w-5 h-5 text-red-400" />, count: 1,
    cards: [{
      unit: 'Unit 402', beds: '2 Bed / 1 Bath', price: '$1200/mo',
      badge: { label: 'Needs Media', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
      action: 'Upload Photos/Videos', actionColor: 'bg-red-600 text-white hover:bg-red-700',
    }],
  },
  {
    key: 'drafting', label: 'Drafting', icon: <Clock className="w-5 h-5 text-blue-400" />, count: 1,
    cards: [{
      unit: 'Unit 305', beds: '1 Bed / 1 Bath', price: '$950/mo',
      action: 'Generating...', actionColor: 'bg-blue-500 text-white',
    }],
  },
  {
    key: 'review', label: 'Review & Approve', icon: <Eye className="w-5 h-5 text-purple-500" />, count: 1,
    cards: [{
      unit: 'Unit 504B', beds: '2 Bed / 2 Bath', price: '$1400/mo',
      badge: { label: 'Ready', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
      action: 'Approve', actionColor: 'bg-green-500 text-white hover:bg-green-600',
      secondAction: { label: 'Reject', color: 'border-red-400 text-red-500 hover:bg-red-50' },
    }],
  },
  {
    key: 'published', label: 'Published', icon: <CheckCircle className="w-5 h-5 text-green-500" />, count: 2,
    cards: [
      {
        unit: 'Unit 102', beds: '3 Bed / 2 Bath', price: '$1800/mo',
        leads: '12 Leads', leadsColor: 'text-green-600 bg-green-50 border-green-200',
        viewLink: 'View on FB', activeDays: '4 Active Days',
        action: 'Stop Campaign', actionColor: 'border-slate-300 text-slate-600 hover:bg-slate-50 bg-white',
      },
      {
        unit: 'Unit 207', beds: '2 Bed / 1 Bath', price: '$1150/mo',
        leads: '5 Leads', leadsColor: 'text-green-600 bg-green-50 border-green-200',
        viewLink: 'View on FB', activeDays: '2 Active Days',
        action: 'Stop Campaign', actionColor: 'border-slate-300 text-slate-600 hover:bg-slate-50 bg-white',
      },
    ],
  },
];

const activityStream = [
  { time: '09:05 AM', agent: 'Lead Capture Worker', agentColor: 'text-green-600 bg-green-50 border-green-200', action: 'Synced John Doe (Lead) from Facebook Form #442 to CRM Leads Table' },
  { time: '09:12 AM', agent: 'Publishing Worker', agentColor: 'text-purple-600 bg-purple-50 border-purple-200', action: 'Successfully posted Ad Set #102 to Meta API' },
  { time: '09:15 AM', agent: 'Content Gen Worker', agentColor: 'text-red-500 bg-red-50 border-red-200', action: 'Analyzed 4 photos for Unit 3B. Tags generated: Hardwood, Modern Kitchen, Natural Light' },
  { time: '10:02 AM', agent: 'Manager Agent', agentColor: 'text-slate-600 bg-slate-50 border-slate-200', action: 'Received "Notice to Vacate" for Unit 3B. Created task #99' },
];

const workerSettings = [
  { name: 'Content Gen Worker', desc: 'Configure tone, branding, templates', status: 'Active' },
  { name: 'Publishing Worker', desc: 'Manage platform connections', status: 'Active' },
  { name: 'Lead Capture Worker', desc: 'Configure data mapping & responses', status: 'Active' },
];

// Default stats when backend is unavailable
const defaultStats = { active_campaigns: 12, pending_approval: 3, leads_generated: 145, cost_per_lead: 4.20 };

export function MarketingAgentPage() {
  const [tab, setTab] = useState<'pipeline' | 'activity' | 'adcopy'>('pipeline');
  const [autoPublish, setAutoPublish] = useState(true);
  const [campaignData, setCampaignData] = useState<any>({ stats: defaultStats });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`${API_URL}/api/v1/agents/marketing/activity?limit=10`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setCampaignData({
            stats: data.stats || defaultStats,
            campaigns: data.campaigns || [],
            activities: data.activities || []
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = campaignData?.stats || defaultStats;

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="marketing-agent-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Send className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Campaign Manager Agent</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-800 rounded-xl border-2 border-green-300">
            <span className="text-xl font-bold text-green-500">Online</span>
            <div className="text-right">
              <p className="text-xs text-slate-500">Monitoring</p>
              <p className="text-sm font-bold text-slate-700 dark:text-white">142 Units</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800 rounded-xl">
            <div className="text-right">
              <p className="text-xs text-slate-300">Auto Publish</p>
              <p className="text-xs text-slate-300">Mode</p>
            </div>
            <div className="flex gap-1 bg-slate-700 rounded-lg p-0.5">
              <button onClick={() => setAutoPublish(true)} className={`px-3 py-1 text-xs font-bold rounded-md ${autoPublish ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>ON</button>
              <button onClick={() => setAutoPublish(false)} className={`px-3 py-1 text-xs font-bold rounded-md ${!autoPublish ? 'bg-slate-500 text-white' : 'text-slate-400'}`}>OFF</button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI icon={<Eye className="w-6 h-6 text-blue-500" />} iconBg="bg-blue-50" label="Active Campaigns" value={String(stats.active_campaigns || 12)} sub="vs Last Week" trend="+2" trendUp />
        <KPI icon={<AlertCircle className="w-6 h-6 text-orange-500" />} iconBg="bg-orange-50" label="Pending Approval" value={String(stats.pending_approval || 3)} valueColor="text-orange-500" sub="Action Required" subColor="text-orange-500" />
        <KPI icon={<Users className="w-6 h-6 text-purple-500" />} iconBg="bg-purple-50" label="Leads Generated" value={String(stats.leads_generated || 145)} valueColor="text-purple-600" sub="This Month" trend="+12%" trendUp />
        <KPI icon={<DollarSign className="w-6 h-6 text-slate-600" />} iconBg="bg-slate-100" label="Cost Per Head" value={`$${stats.cost_per_lead?.toFixed(2) || '4.20'}`} valueColor="text-green-500" sub="Efficiency Improved" trend="-10%" trendUp={false} />
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button onClick={() => setTab('pipeline')}
          className={`pb-3 text-base font-medium transition-colors ${tab === 'pipeline' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          data-testid="tab-pipeline">
          Campaign Pipeline
        </button>
        <button onClick={() => setTab('adcopy')}
          className={`pb-3 text-base font-medium transition-colors flex items-center gap-2 ${tab === 'adcopy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          data-testid="tab-adcopy">
          <Sparkles className="w-4 h-4" />
          AI Ad Copy Generator
        </button>
        <button onClick={() => setTab('activity')}
          className={`pb-3 text-base font-medium transition-colors ${tab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          data-testid="tab-activity">
          Worker Activity
        </button>
      </div>

      {tab === 'pipeline' ? <PipelineTab /> : tab === 'adcopy' ? <AdCopyTab /> : <ActivityTab />}
    </div>
  );
}

function PipelineTab() {
  return (
    <div>
      {/* Column Headers */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {campaignColumns.map(col => (
          <div key={col.key} className="flex items-center gap-2">
            {col.icon}
            <span className="text-base font-bold text-slate-800 dark:text-white">{col.label}</span>
            <span className="text-base text-slate-400 font-medium">{col.count}</span>
          </div>
        ))}
      </div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-4 gap-4 items-start">
        {campaignColumns.map(col => (
          <div key={col.key} className="space-y-3">
            {col.cards.map((card, idx) => (
              <div key={idx} className={`bg-white dark:bg-slate-800 rounded-xl p-4 border ${col.key === 'detected' ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} hover:shadow-md transition-shadow`} data-testid={`campaign-card-${col.key}-${idx}`}>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">{card.unit}</span>
                  <div className="flex items-center gap-2">
                    {card.badge && (
                      <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded border ${card.badge.bg} ${card.badge.color} ${card.badge.border}`}>{card.badge.label}</span>
                    )}
                    {card.leads && (
                      <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded border ${card.leadsColor}`}>{card.leads}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-slate-500">{card.beds}</p>
                  {card.viewLink && <span className="text-xs text-blue-500 hover:underline cursor-pointer">{card.viewLink}</span>}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{card.price}</p>
                  {card.activeDays && <span className="text-xs text-slate-400">{card.activeDays}</span>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {card.action && (
                    <button className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-center border ${card.actionColor}`}>
                      {card.action}
                    </button>
                  )}
                  {card.secondAction && (
                    <button className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-center border ${card.secondAction.color}`}>
                      {card.secondAction.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdCopyTab() {
  const [platform, setPlatform] = useState('facebook');
  const [objective, setObjective] = useState('lead_generation');
  const [propertyName, setPropertyName] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [numVariations, setNumVariations] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
  ];

  const objectives = [
    { value: 'lead_generation', label: 'Lead Generation' },
    { value: 'brand_awareness', label: 'Brand Awareness' },
    { value: 'tour_scheduling', label: 'Tour Scheduling' },
    { value: 'lease_signing', label: 'Lease Signing' },
    { value: 'move_in_special', label: 'Move-In Special' },
    { value: 'open_house', label: 'Open House' },
  ];

  const handleGenerate = async () => {
    if (!propertyName.trim()) return;
    setGenerating(true);
    setError(null);
    setResults(null);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        property_name: propertyName,
        platform,
        objective,
        num_variations: String(numVariations),
      });
      if (specialOffer.trim()) params.set('special_offer', specialOffer);

      const res = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.agents.marketing.generateAdCopy}?${params}`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      if (data.success && data.result) {
        setResults(data.result);
      } else {
        setError(data.message || 'Generation failed');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to generate ad copy');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Controls — 2 cols */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">AI Ad Copy Generator</h3>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Powered by ChatGPT — generate compelling advertising copy for any platform, optimized for apartment leasing.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Name *</label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g., Sunset Ridge Apartments"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Objective</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {objectives.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Special Offer (optional)</label>
              <input
                type="text"
                value={specialOffer}
                onChange={(e) => setSpecialOffer(e.target.value)}
                placeholder="e.g., First month free, $500 off move-in"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Variations</label>
              <select
                value={numVariations}
                onChange={(e) => setNumVariations(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} variation{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !propertyName.trim()}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating with ChatGPT...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Ad Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results — 3 cols */}
      <div className="col-span-3 space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {!results && !generating && !error && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
            <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">AI-Powered Ad Copy</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md mx-auto">
              Enter your property details and click &quot;Generate&quot; to create platform-optimized ad copy powered by ChatGPT.
            </p>
          </div>
        )}

        {generating && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">ChatGPT is generating your ad copy...</p>
            <p className="text-sm text-slate-400 mt-1">This usually takes 5-10 seconds</p>
          </div>
        )}

        {results && results.variations && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {results.num_variations} Variations for {results.platform?.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </h3>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>

            {results.variations.map((variation: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded">
                    Variation {idx + 1}
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(variation, null, 2))}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>

                <div className="space-y-2">
                  {variation.headline && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Headline</span>
                      <p className="text-base font-semibold text-slate-800 dark:text-white">{variation.headline}</p>
                    </div>
                  )}
                  {variation.headlines && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Headlines</span>
                      {variation.headlines.map((h: string, i: number) => (
                        <p key={i} className="text-base font-semibold text-slate-800 dark:text-white">{h}</p>
                      ))}
                    </div>
                  )}
                  {variation.primary_text && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Primary Text</span>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{variation.primary_text}</p>
                    </div>
                  )}
                  {variation.caption && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Caption</span>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{variation.caption}</p>
                    </div>
                  )}
                  {variation.intro_text && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Intro Text</span>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{variation.intro_text}</p>
                    </div>
                  )}
                  {variation.description && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</span>
                      <p className="text-sm text-slate-500">{variation.description}</p>
                    </div>
                  )}
                  {variation.descriptions && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Descriptions</span>
                      {variation.descriptions.map((d: string, i: number) => (
                        <p key={i} className="text-sm text-slate-500">{d}</p>
                      ))}
                    </div>
                  )}
                  {variation.hook_text && (
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Hook</span>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{variation.hook_text}</p>
                    </div>
                  )}
                  {variation.hashtags && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(Array.isArray(variation.hashtags) ? variation.hashtags : []).map((tag: string, i: number) => (
                        <span key={i} className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}
                  {variation.cta && (
                    <div className="mt-2">
                      <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg">
                        {variation.cta}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {results.usage && (
              <p className="text-xs text-slate-400 text-right">
                Tokens used: {results.usage.total_tokens} ({results.model_used})
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Activity Stream - 3 cols */}
      <div className="col-span-3 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Worker Agent Activity Stream</h3>
        <div className="space-y-5">
          {activityStream.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="text-sm text-slate-500 font-medium w-20 shrink-0 pt-0.5">{item.time}</span>
              <span className={`px-2.5 py-1 text-[11px] font-semibold rounded border shrink-0 whitespace-nowrap ${item.agentColor}`}>
                {item.agent}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Worker Settings - 2 cols */}
      <div className="col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Worker Settings</h3>
          <SettingsIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-5">
          {workerSettings.map((w, i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{w.name}</p>
                <p className="text-sm text-slate-500">{w.desc}</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold text-green-600 bg-green-50 rounded border border-green-200">{w.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, iconBg, label, value, valueColor = 'text-blue-600', sub, subColor = 'text-slate-400', trend, trendUp }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string;
  valueColor?: string; sub: string; subColor?: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${iconBg} dark:bg-opacity-20 rounded-xl flex items-center justify-center`}>{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${valueColor} dark:text-white`}>{value}</p>
      <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
    </div>
  );
}

export default MarketingAgentPage;
