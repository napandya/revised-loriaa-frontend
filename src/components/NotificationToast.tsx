import { useEffect, useState } from 'react';
import { 
  X, Bot, MessageSquare, Megaphone, Check,
  Calendar, FileText, Home, AlertCircle
} from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

interface ToastNotification extends Notification {
  isVisible: boolean;
}

export function NotificationToast() {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Listen for new notifications and show toasts
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      
      // Check if we already have this toast
      const exists = toasts.some(t => t.id === latest.id);
      if (!exists) {
        const newToast: ToastNotification = { ...latest, isVisible: true };
        setToasts(prev => [newToast, ...prev].slice(0, 5));

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setToasts(prev => 
            prev.map(t => t.id === latest.id ? { ...t, isVisible: false } : t)
          );
          
          // Remove from DOM after animation
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== latest.id));
          }, 300);
        }, 5000);
      }
    }
  }, [notifications]);

  const dismissToast = (id: string) => {
    setToasts(prev => 
      prev.map(t => t.id === id ? { ...t, isVisible: false } : t)
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'agent_activity': return <Bot className="w-5 h-5" />;
      case 'lead_response': return <MessageSquare className="w-5 h-5" />;
      case 'campaign_update': return <Megaphone className="w-5 h-5" />;
      case 'task_complete': return <Check className="w-5 h-5" />;
      case 'tour_scheduled': return <Calendar className="w-5 h-5" />;
      case 'application_received': return <FileText className="w-5 h-5" />;
      case 'lease_signed': return <Home className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColors = (type: string, priority: string) => {
    if (priority === 'urgent') return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    if (priority === 'high') return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
    
    switch (type) {
      case 'agent_activity': return 'border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20';
      case 'lead_response': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'campaign_update': return 'border-l-pink-500 bg-pink-50 dark:bg-pink-900/20';
      case 'tour_scheduled': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'application_received': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'lease_signed': return 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'border-l-slate-500 bg-slate-50 dark:bg-slate-800';
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'text-red-600 dark:text-red-400';
    if (priority === 'high') return 'text-orange-600 dark:text-orange-400';
    
    switch (type) {
      case 'agent_activity': return 'text-cyan-600 dark:text-cyan-400';
      case 'lead_response': return 'text-blue-600 dark:text-blue-400';
      case 'campaign_update': return 'text-pink-600 dark:text-pink-400';
      case 'tour_scheduled': return 'text-purple-600 dark:text-purple-400';
      case 'application_received': return 'text-green-600 dark:text-green-400';
      case 'lease_signed': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" data-testid="notification-toasts">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "w-80 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300",
            getColors(toast.type, toast.priority),
            toast.isVisible 
              ? "translate-x-0 opacity-100" 
              : "translate-x-full opacity-0"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn("shrink-0", getIconColor(toast.type, toast.priority))}>
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm text-foreground">{toast.title}</p>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {toast.message}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full animate-shrink",
                toast.priority === 'urgent' ? 'bg-red-500' :
                toast.priority === 'high' ? 'bg-orange-500' : 'bg-primary'
              )}
              style={{ animationDuration: '5s' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationToast;
