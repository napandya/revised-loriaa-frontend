import { useState, useEffect } from 'react';
import { SearchIcon, PhoneIcon, EditIcon, PlusIcon } from 'lucide-react';
import { Header } from './Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '../stores/appStore';

interface BotsListProps {
  onBotSelect: (botId: string) => void;
  onCreateBot: () => void;
}

export function BotsList({ onBotSelect, onCreateBot }: BotsListProps) {
  const { bots, isLoadingBots, botsError, fetchBots } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const filteredBots = bots.filter((bot) =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header
        title="Bots"
        actionButton={{
          label: 'Create Bot',
          onClick: onCreateBot,
        }}
      />

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="SearchIcon bots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card text-card-foreground border-border"
          />
        </div>
      </div>

      {isLoadingBots ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">Loading bots...</div>
        </div>
      ) : botsError ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-red-500">Error: {botsError}</div>
        </div>
      ) : filteredBots.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">
            {searchQuery ? 'No bots found matching your search.' : 'No bots yet. Create your first bot!'}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">HIPAA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Language</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 text-card-foreground">{bot.name}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={bot.hipaaCompliant ? 'default' : 'secondary'}
                        className={
                          bot.hipaaCompliant
                            ? 'bg-success/20 text-success border-success'
                            : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {bot.hipaaCompliant ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">{bot.language}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={bot.status === 'active' ? 'default' : 'secondary'}
                        className={
                          bot.status === 'active'
                            ? 'bg-tertiary/20 text-tertiary border-tertiary'
                            : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {bot.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          aria-label="Call bot"
                        >
                          <PhoneIcon className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onBotSelect(bot.id)}
                          className="bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          aria-label="EditIcon bot"
                        >
                          <EditIcon className="w-4 h-4" strokeWidth={1.5} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Page 1 of 1</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="bg-card text-card-foreground border-border">
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled className="bg-card text-card-foreground border-border">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
