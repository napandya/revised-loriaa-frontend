import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Megaphone,
  Building2,
  Settings,
  UsersRound,
  Moon,
  Sun,
  Phone
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', section: 'GENERAL' },
  { id: 'leads', label: 'Leads', icon: Users, path: '/leads', section: 'GENERAL' },
  { id: 'inbox', label: 'Unified Inbox', icon: MessageSquare, path: '/inbox', section: 'GENERAL' },
  { id: 'leasing-agent', label: 'Leasing Agent', icon: Phone, path: '/agents/leasing', section: 'AI WORKFORCE' },
  { id: 'marketing-agent', label: 'Marketing Agent', icon: Megaphone, path: '/agents/marketing', section: 'AI WORKFORCE' },
  { id: 'property-manager', label: 'Property Manager', icon: Building2, path: '/agents/property', section: 'AI WORKFORCE' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'SYSTEM' },
  { id: 'team', label: 'Team Management', icon: UsersRound, path: '/team', section: 'SYSTEM' },
];

function LoriaaLogo() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* White circle background */}
      <circle cx="24" cy="24" r="23" fill="white" />
      
      {/* Curved arc at bottom */}
      <path d="M 8 32 Q 24 40 40 32" stroke="#4F8EF7" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M 10 34 Q 24 41 38 34" stroke="#7C5CFC" strokeWidth="1.5" fill="none" opacity="0.3"/>
      
      {/* Building 1 - left short */}
      <rect x="11" y="20" width="6" height="14" rx="1" fill="url(#buildGrad1)" />
      <rect x="12.5" y="22" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="14.5" y="22" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="12.5" y="25" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="14.5" y="25" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="12.5" y="28" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="14.5" y="28" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      
      {/* Building 2 - center tall */}
      <rect x="18" y="12" width="7" height="22" rx="1" fill="url(#buildGrad2)" />
      <rect x="19.5" y="14" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="22.2" y="14" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="19.5" y="17" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="22.2" y="17" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="19.5" y="20" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="22.2" y="20" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="19.5" y="23" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="22.2" y="23" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="19.5" y="26" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      <rect x="22.2" y="26" width="1.3" height="1.3" rx="0.3" fill="#C4B5FD" />
      
      {/* Building 3 - right medium */}
      <rect x="26" y="17" width="6" height="17" rx="1" fill="url(#buildGrad3)" />
      <rect x="27.5" y="19" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="29.5" y="19" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="27.5" y="22" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="29.5" y="22" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="27.5" y="25" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      <rect x="29.5" y="25" width="1.2" height="1.2" rx="0.3" fill="#B8D4FF" />
      
      {/* Circuit connections - pink/red lines */}
      <line x1="30" y1="14" x2="35" y2="10" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="35" y1="10" x2="35" y2="7" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="35" cy="7" r="2" fill="#F43F5E" />
      
      <line x1="32" y1="18" x2="37" y2="16" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="37" cy="16" r="1.5" fill="#F43F5E" />
      
      <line x1="25" y1="11" x2="28" y2="8" stroke="#818CF8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="28" cy="8" r="1.5" fill="#818CF8" />
      
      {/* Gradients for buildings */}
      <defs>
        <linearGradient id="buildGrad1" x1="11" y1="20" x2="17" y2="34">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="buildGrad2" x1="18" y1="12" x2="25" y2="34">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="buildGrad3" x1="26" y1="17" x2="32" y2="34">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'OTHER';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside 
      className="w-60 h-screen flex flex-col shrink-0"
      style={{ background: '#1E2740' }}
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3">
        <LoriaaLogo />
        <div>
          <h1 className="font-bold text-white text-base tracking-tight">Loriaa CRM</h1>
          <p className="text-[13px] text-blue-200/70">Property Management</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/15 mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            <p className="px-3 mb-2 text-[11px] font-semibold text-blue-300/60 uppercase tracking-widest">
              {section}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/inbox' && location.pathname === '/analytics');
                
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                        isActive 
                          ? "bg-blue-500/25 text-white font-medium" 
                          : "text-blue-100/70 hover:bg-white/8 hover:text-white"
                      )}
                      data-testid={`nav-${item.id}`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-blue-100/70 hover:bg-white/8 hover:text-white transition-colors"
          data-testid="theme-toggle"
        >
          {theme === 'light' ? (
            <><Moon className="w-[18px] h-[18px]" /><span>Dark Mode</span></>
          ) : (
            <><Sun className="w-[18px] h-[18px]" /><span>Light Mode</span></>
          )}
        </button>

        <div className="mt-3 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-400/30 rounded-full flex items-center justify-center text-white text-xs font-medium">
              AU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-blue-200/50 truncate">admin@loriaa.ai</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
