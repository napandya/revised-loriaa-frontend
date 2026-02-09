import { useEffect } from 'react';
import { PhoneIcon, ClockIcon } from 'lucide-react';
import { Header } from './Header';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '../stores/appStore';
import { logger } from '@/lib/logger';

export function CallLogs() {
  const { callLogs, isLoadingCallLogs, callLogsError, fetchCallLogs } = useAppStore();

  useEffect(() => {
    logger.debug('CallLogs component mounted', { component: 'CallLogs', action: 'mount' });
    fetchCallLogs();
  }, [fetchCallLogs]);

  return (
    <div>
      <Header title="Call Logs" showTimeFilter />

      {isLoadingCallLogs ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">Loading call logs...</div>
        </div>
      ) : callLogsError ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-red-500">Error: {callLogsError}</div>
        </div>
      ) : callLogs.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">No call logs yet.</div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Bot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">PhoneIcon Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {callLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 text-card-foreground font-medium">{log.botName}</td>
                    <td className="px-6 py-4 text-card-foreground">{log.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-card-foreground">
                        <ClockIcon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        {log.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">{log.cost}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={log.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          log.status === 'completed'
                            ? 'bg-success/20 text-success border-success'
                            : 'bg-destructive/20 text-destructive border-destructive'
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}
