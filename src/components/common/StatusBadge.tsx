import { LeadStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

/**
 * Color-coded status badge component for lead statuses
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusColor = (status: LeadStatus): string => {
    switch (status) {
      case LeadStatus.NEW:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case LeadStatus.CONTACTED:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case LeadStatus.QUALIFIED:
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case LeadStatus.TOURING:
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case LeadStatus.APPLICATION:
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case LeadStatus.LEASE:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case LeadStatus.MOVE_IN:
        return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case LeadStatus.LOST:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} ${className}`}
    >
      {status}
    </Badge>
  );
}
