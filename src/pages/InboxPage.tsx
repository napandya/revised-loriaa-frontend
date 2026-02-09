import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, Mail, Globe, Search, Star, Send, FileText, BarChart3 } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

const API_URL = API_CONFIG.baseURL;

const channelIconMap: Record<string, { icon: typeof Phone; color: string }> = {
  voice: { icon: Phone, color: '#22C55E' }, sms: { icon: MessageSquare, color: '#8B5CF6' },
  email: { icon: Mail, color: '#3B82F6' }, web: { icon: Globe, color: '#10B981' },
};

// Default mock data when backend is unavailable
const defaultConversations = [
  { id: '1', lead_name: 'John Doe', last_message: 'Hi, I am interested in the 2-bed apartment...', last_message_time: new Date().toISOString(), status: 'ai_replying', channels: ['voice', 'sms'], ai_mode: true, sentiment: 'positive', ai_accuracy: 92, lead: { email: 'john@example.com', phone: '(555) 123-4567', score: 92, unit_interest: '2 Bed', status: 'Touring', budget_min: 1200, budget_max: 1800, source: 'Facebook' } },
  { id: '2', lead_name: 'Jane Smith', last_message: 'What is the pet policy?', last_message_time: new Date().toISOString(), status: 'needs_attention', channels: ['email'], ai_mode: true, sentiment: 'neutral', ai_accuracy: 88, lead: { email: 'jane@example.com', phone: '(555) 234-5678', score: 85, unit_interest: '1 Bed', status: 'Inquiry', budget_min: 900, budget_max: 1200, source: 'Website' } },
];

const defaultStats = { ai_handled_today: 24, needs_attention: 3, live_calls: 2 };

const defaultMessages = [
  { id: '1', sender: 'John Doe', sender_type: 'user', content: 'Hi, I am interested in the 2-bed apartment. Is it still available?', channel: 'sms', timestamp: new Date().toISOString() },
  { id: '2', sender: 'Loriaa AI', sender_type: 'ai', content: 'Yes! The 2-bedroom apartment at Unit 404 is still available. It features hardwood floors, a modern kitchen, and natural light. Would you like to schedule a tour?', channel: 'sms', timestamp: new Date().toISOString(), source_document: 'Unit 404 Listing.pdf' },
];

function ChannelSquare({ channel }: { channel: string }) {
  const colors: Record<string, string> = { voice: '#22C55E', sms: '#8B5CF6', email: '#3B82F6', web: '#10B981' };
  return <span className="inline-block w-4 h-4 rounded-sm" style={{ backgroundColor: colors[channel] || '#94A3B8' }} />;
}

function ChannelIconSmall({ channel, size = 16 }: { channel: string; size?: number }) {
  const info = channelIconMap[channel]; if (!info) return null;
  const Icon = info.icon; return <Icon style={{ color: info.color, width: size, height: size }} />;
}

export function InboxPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>(defaultConversations);
  const [stats, setStats] = useState<any>(defaultStats);
  const [selected, setSelected] = useState<any>(defaultConversations[0]);
  const [messages, setMessages] = useState<any[]>(defaultMessages);
  const [channelFilter, setChannelFilter] = useState('all');
  const [aiMode, setAiMode] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`${API_URL}/api/v1/inbox`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        // Handle array or object response
        const convArray = Array.isArray(data) ? data : (data.conversations || []);
        if (convArray.length > 0) {
          // Transform backend response to frontend format
          const transformed = convArray.map((c: any) => ({
            id: c.id,
            lead_name: c.lead_name || c.contact_name || 'Unknown',
            last_message: c.last_message || c.preview || '',
            last_message_time: c.last_message_time || c.updated_at || c.created_at,
            status: c.status || 'active',
            channels: c.channels || [c.channel || 'web'],
            ai_mode: c.ai_mode !== false,
            sentiment: c.sentiment || 'neutral',
            ai_accuracy: c.ai_accuracy || 90,
            lead: c.lead || { email: '', phone: '', score: 0, unit_interest: '', status: '', budget_min: 0, budget_max: 0, source: '' }
          }));
          setConversations(transformed);
          setSelected(transformed[0]);
        }
        // Get stats from unread count endpoint
        fetch(`${API_URL}/api/v1/inbox/unread/count`, { headers })
          .then(r => r.ok ? r.json() : {})
          .then(countData => {
            setStats({
              ai_handled_today: countData.ai_handled_today || 24,
              needs_attention: countData.unread_count || 3,
              live_calls: countData.live_calls || 2
            });
          }).catch(() => {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const token = localStorage.getItem('token');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`${API_URL}/api/v1/inbox/${selected.id}`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.messages) {
          setMessages(data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender || m.sender_name || 'Unknown',
            sender_type: m.sender_type || (m.is_ai ? 'ai' : 'user'),
            content: m.content || m.text || '',
            channel: m.channel || 'web',
            timestamp: m.timestamp || m.created_at,
            source_document: m.source_document
          })));
        }
        setAiMode(selected.ai_mode !== false);
      })
      .catch(() => {});
  }, [selected?.id]);

  const toggleAi = (mode: boolean) => {
    if (!selected) return;
    setAiMode(mode);
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/v1/inbox/${selected.id}/status`, { 
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status: mode ? 'ai_active' : 'human_active' })
    }).catch(() => {});
  };

  const sendMsg = () => {
    if (!newMessage.trim() || !selected) return;
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/v1/inbox/${selected.id}/messages`, {
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ content: newMessage }),
    }).then(r => r.ok ? r.json() : null).then(msg => { 
      if (msg) {
        setMessages(p => [...p, {
          id: msg.id || Date.now().toString(),
          sender: 'Human Agent',
          sender_type: 'user',
          content: newMessage,
          channel: 'web',
          timestamp: new Date().toISOString()
        }]);
      }
      setNewMessage(''); 
    }).catch(() => {
      // Add message locally even if API fails
      setMessages(p => [...p, {
        id: Date.now().toString(),
        sender: 'Human Agent',
        sender_type: 'user',
        content: newMessage,
        channel: 'web',
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    });
  };

  const filtered = channelFilter === 'all' ? conversations : conversations.filter((c: any) => c.channels?.includes(channelFilter));
  const lead = selected?.lead || {};

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]" data-testid="inbox-page">
      <div className="px-6 pt-5 pb-4 bg-slate-50 dark:bg-slate-900 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Communication Hub</h1><p className="text-sm text-slate-500">Single pane of glass - Voice, SMS, Email, Web Chat unified</p></div>
          <div className="flex items-center gap-3">
            <StatBadge label="AI Handled Today" value={String(stats.ai_handled_today || 0)} borderColor="border-slate-200" />
            <StatBadge label="Needs Attention" value={String(stats.needs_attention || 0)} borderColor="border-red-400" valueColor="text-red-500" />
            <StatBadge label="Live Calls" value={String(stats.live_calls || 0)} borderColor="border-green-400" valueColor="text-green-500" />
            <button onClick={() => navigate('/analytics')} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold" data-testid="view-analytics-btn"><BarChart3 className="w-4 h-4" />View Analytics</button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex min-h-0 px-6 pb-4 gap-4">
        {/* Left: Conversation List */}
        <div className="w-80 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 space-y-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex gap-2">
              {['all', 'voice', 'sms'].map(f => (<button key={f} onClick={() => setChannelFilter(f)} className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-colors ${channelFilter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>))}
            </div>
            <div className="flex gap-2">{['Email', 'Leads', 'Residents'].map(f => (<button key={f} className="px-4 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300">{f}</button>))}</div>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-3">
            {filtered.map((conv: any) => (
              <div key={conv.id} onClick={() => setSelected(conv)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selected?.id === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-blue-200'}`} data-testid={`conversation-${conv.id}`}>
                <div className="flex items-start justify-between mb-1.5"><span className="font-semibold text-sm text-slate-800 dark:text-white">{conv.lead_name}</span><span className="text-[11px] text-blue-500 italic font-medium">{conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}</span></div>
                <p className="text-xs text-slate-500 mb-3 line-clamp-1">{conv.last_message}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-md ${conv.status === 'ai_replying' ? 'bg-green-50 text-green-600 border border-green-200' : conv.status === 'needs_attention' ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>{conv.status === 'ai_replying' ? 'AI Replying' : conv.status === 'needs_attention' ? 'Needs Attention' : 'Human Replying'}</span>
                  <div className="flex gap-2">{(conv.channels || []).map((ch: string) => <ChannelIconSmall key={ch} channel={ch} size={16} />)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Chat Thread */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden min-w-0">
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5"><span className="font-semibold text-base text-slate-800 dark:text-white">{selected?.lead_name || ''}</span><Star className="w-5 h-5 text-slate-300 hover:text-yellow-400 cursor-pointer" /><span className="text-sm text-slate-500 ml-1">{lead.phone || ''}</span></div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2"><span className="text-xs text-slate-500 font-medium mr-2">AI Mode</span><button onClick={() => toggleAi(true)} className={`px-3 py-1 text-xs font-bold rounded-md ${aiMode ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>ON</button><button onClick={() => toggleAi(false)} className={`px-3 py-1 text-xs font-bold rounded-md ${!aiMode ? 'bg-slate-500 text-white' : 'text-slate-400'}`}>OFF</button></div>
          </div>
          <div className="flex-1 overflow-auto px-5 py-4 space-y-5">
            {messages.map((msg: any) => (
              <div key={msg.id}>
                {msg.sender_type === 'user' ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2"><ChannelSquare channel={msg.channel} /><ChannelIconSmall channel={msg.channel} /><span className="text-xs text-slate-500 font-medium">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}</span></div>
                    <div className={`max-w-[80%] rounded-xl p-4 ${msg.channel === 'voice' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}><p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p></div>
                  </div>
                ) : (
                  <div>
                    <div className="max-w-[80%] ml-auto rounded-xl p-4 bg-orange-50 dark:bg-orange-900/10"><p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p></div>
                    {msg.source_document && <p className="text-right mt-1 mr-1"><span className="text-xs text-blue-500 font-medium">Source: {msg.source_document}</span></p>}
                    <div className="flex items-center gap-2 mt-1.5 justify-end"><span className="text-[11px] text-slate-400 font-medium">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}</span><span className="text-[11px] text-slate-500 font-medium">Loriaa AI Assistant</span><ChannelIconSmall channel={msg.channel} size={14} /></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex gap-2">
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="inbox-message-input" />
              <button onClick={sendMsg} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium" data-testid="inbox-send-btn"><Send className="w-4 h-4" /> Send</button>
            </div>
          </div>
        </div>

        {/* Right: Lead Details */}
        <div className="w-72 shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-auto">
          <div className="p-5 space-y-5">
            <div className="flex items-start justify-between"><div><h3 className="text-lg font-bold text-slate-800 dark:text-white">{selected?.lead_name || ''}</h3><p className="text-xs text-slate-500 mt-0.5">{lead.email || ''}</p><p className="text-xs text-slate-500">{lead.phone || ''}</p></div><div className="flex flex-col items-end gap-1"><span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-50 border-2 border-green-300 text-green-600 text-sm font-bold">{lead.score || 0}</span><span className="text-xs text-blue-600 font-semibold">{lead.unit_interest || ''}</span></div></div>
            <div><p className="text-sm text-slate-500 mb-1">Deal Stage</p><p className="text-lg font-semibold text-green-500 italic">{lead.status || ''}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Budget</p><p className="text-2xl font-bold text-green-500">{lead.budget_min && lead.budget_max ? `$${lead.budget_min.toLocaleString()} - $${lead.budget_max.toLocaleString()}` : 'N/A'}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Lead Source</p><p className="text-base font-medium text-blue-600 italic">{lead.source || ''}</p></div>
            <div className="space-y-3"><button className="w-full py-3 border-2 border-blue-500 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50" data-testid="book-tour-btn">Book Tour</button><button className="w-full py-3 border-2 border-green-500 text-green-600 rounded-xl text-sm font-semibold hover:bg-green-50" data-testid="send-application-btn">Send Application</button></div>
            <div className="border-t border-slate-100 dark:border-slate-700 pt-4"><h4 className="text-base font-bold text-blue-600 mb-2">AI Summary</h4><p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selected?.sentiment ? `Sentiment: ${selected.sentiment}` : ''}</p><p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{selected?.ai_accuracy ? `AI Accuracy: ${selected.ai_accuracy}%` : ''}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, borderColor = 'border-slate-200', valueColor = 'text-slate-800' }: { label: string; value: string; borderColor?: string; valueColor?: string }) {
  return (<div className={`flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border-2 ${borderColor} dark:border-slate-700`}><span className="text-[11px] text-slate-500 leading-tight font-medium">{label}</span><span className={`text-xl font-bold ${valueColor} dark:text-white`}>{value}</span></div>);
}

export default InboxPage;
