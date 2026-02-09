import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Link2, CreditCard, Bell, Shield, ChevronRight
} from 'lucide-react';
import { API_CONFIG } from '@/config/api';

const API_URL = API_CONFIG.baseURL;

// Default data when backend is unavailable
const defaultIntegrations = [
  { name: 'ResMan', status: 'connected' },
  { name: 'Facebook Ads', status: 'connected' },
  { name: 'Twilio SMS', status: 'not_connected' },
  { name: 'Google Ads', status: 'connected' },
];

const defaultBilling = { current_plan: 'Enterprise Bundle', next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };

export function SettingsPage() {
  const [data, setData] = useState<any>({ integrations: defaultIntegrations, billing: defaultBilling });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    Promise.all([
      fetch(`${API_URL}/api/v1/settings/integrations`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_URL}/api/v1/billing/current`, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([integrations, billing]) => {
      setData({
        integrations: Array.isArray(integrations) ? integrations : defaultIntegrations,
        billing: billing || defaultBilling
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const integrations = data?.integrations || defaultIntegrations;
  const billing = data?.billing || defaultBilling;

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full" data-testid="settings-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        </div>
        <p className="text-sm text-slate-500 italic">Manage integrations, billing, and system configuration</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Integrations */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Integrations</h3>
              <p className="text-sm text-slate-500">Connect to external services</p>
            </div>
          </div>
          <div className="space-y-0">
            {integrations.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                <span className={`text-sm font-semibold ${item.status === 'connected' ? 'text-green-500' : 'text-slate-400'}`}>{item.status === 'connected' ? 'Connected' : 'Not Connected'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Billing</h3>
              <p className="text-sm text-slate-500">Manage subscription and payments</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-slate-500">Current Plan</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{billing.current_plan || 'Enterprise Bundle'}</p>
          </div>
          <div className="mb-5">
            <p className="text-xs text-slate-500">Next Billing Date</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{billing.next_billing_date ? new Date(billing.next_billing_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100 transition-colors">
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">View Usage & Billing</p>
              <p className="text-xs text-slate-500">Track Voice & SMS Costs</p>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
              <p className="text-sm text-slate-500">Configure alerts and updates</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', checked: true },
              { label: 'SMS Alerts', checked: true },
              { label: 'Push Notifications', checked: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 ${item.checked ? 'bg-purple-500 border-purple-500' : 'border-slate-300 dark:border-slate-600'}`} />
                <span className="text-sm text-slate-700 dark:text-slate-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Security</h3>
              <p className="text-sm text-slate-500">Access control and permissions</p>
            </div>
          </div>
          <div className="space-y-0">
            {['Change Password', 'Two-Factor Authentication', 'API Keys'].map((item, i) => (
              <div key={i} className="py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
