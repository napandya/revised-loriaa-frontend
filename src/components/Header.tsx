import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '../stores/appStore';

interface HeaderProps {
  title: string;
  showTimeFilter?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ title, showTimeFilter, actionButton }: HeaderProps) {
  const { timeFilter, setTimeFilter } = useAppStore();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-bold text-foreground font-heading">{title}</h1>
      <div className="flex items-center gap-4">
        {showTimeFilter && (
          <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
            <SelectTrigger className="w-32 bg-card text-card-foreground border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground">
              <SelectItem value="day" className="text-popover-foreground">Day</SelectItem>
              <SelectItem value="week" className="text-popover-foreground">Week</SelectItem>
              <SelectItem value="month" className="text-popover-foreground">Month</SelectItem>
            </SelectContent>
          </Select>
        )}
        {actionButton && (
          <Button
            onClick={actionButton.onClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {actionButton.label}
          </Button>
        )}
      </div>
    </header>
  );
}
