import { Badge } from '@/components/ui/badge';

interface LeadScoreBadgeProps {
  score: number;
  className?: string;
}

/**
 * Color-coded lead score badge
 * High score (80-100) = green
 * Medium score (50-79) = yellow
 * Low score (0-49) = red
 */
export function LeadScoreBadge({ score, className = '' }: LeadScoreBadgeProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) {
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    } else if (score >= 50) {
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    } else {
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getScoreColor(score)} ${className}`}
    >
      <span className="font-semibold">{score}</span>
      <span className="mx-1">·</span>
      <span>{getScoreLabel(score)}</span>
    </Badge>
  );
}
