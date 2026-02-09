import { LayoutDashboardIcon, BotIcon, PhoneIcon, UsersIcon, CreditCardIcon, MenuIcon, XIcon } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigate: (page: string) => void;
}

export function Sidebar({ isCollapsed, onToggle, onNavigate }: SidebarProps) {
  const { currentPage, sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
    { id: 'bots', label: 'Bots', icon: BotIcon },
    { id: 'call-logs', label: 'Call Logs', icon: PhoneIcon },
    { id: 'teams', label: 'Teams', icon: UsersIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  ];

  return (
    <>
      <Button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-card text-card-foreground hover:bg-accent"
        size="icon"
        aria-label="Toggle menu"
      >
        {sidebarCollapsed ? <MenuIcon className="w-6 h-6" /> : <XIcon className="w-6 h-6" />}
      </Button>

      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-transform duration-200 ease-in-out z-40 ${
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        } w-64 flex flex-col`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-gradient-1 font-heading">Loriaa</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) {
                    setSidebarCollapsed(true);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-all duration-200 ease-in-out cursor-pointer text-foreground">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">SJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover text-popover-foreground">
              <DropdownMenuItem className="cursor-pointer text-popover-foreground">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-popover-foreground">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-popover-foreground">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
