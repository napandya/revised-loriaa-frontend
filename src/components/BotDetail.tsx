import { useState } from 'react';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '../stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface BotDetailProps {
  botId: string;
  onBack: () => void;
}

export function BotDetail({ botId, onBack }: BotDetailProps) {
  const { bots, updateBot, deleteBot } = useAppStore();
  const { toast } = useToast();
  const bot = bots.find((b) => b.id === botId);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    greeting: bot?.greeting || '',
    prompt: bot?.prompt || '',
    voice: bot?.voice || 'alloy',
    language: bot?.language || 'English',
    model: bot?.model || 'gpt-4',
    phoneNumber: bot?.phoneNumber || '',
  });

  if (!bot) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Bot not found</p>
        <Button onClick={onBack} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
          Go Back
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    logger.info('Saving bot settings', {
      component: 'BotDetail',
      action: 'handleSave',
      botId,
    });
    try {
      await updateBot(botId, formData);
      toast({
        title: 'Success',
        description: 'Bot settings saved successfully',
      });
    } catch (error: any) {
      logger.error('Failed to save bot settings', {
        component: 'BotDetail',
        action: 'handleSave',
        botId,
      }, error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save bot settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bot?')) {
      setIsDeleting(true);
      logger.info('Deleting bot', {
        component: 'BotDetail',
        action: 'handleDelete',
        botId,
      });
      try {
        await deleteBot(botId);
        toast({
          title: 'Bot Deleted',
          description: 'The bot has been removed',
        });
        onBack();
      } catch (error: any) {
        logger.error('Failed to delete bot', {
          component: 'BotDetail',
          action: 'handleDelete',
          botId,
        }, error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete bot',
          variant: 'destructive',
        });
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground font-heading">{bot.name}</h1>
        </div>
        <div className="flex gap-3">
          <Button className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90">
            Test Bot
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2Icon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            {isDeleting ? 'Deleting...' : 'Delete Bot'}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-foreground font-heading">Bot Cost</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cost per minute</p>
              <p className="text-2xl font-bold text-foreground">$0.12</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total calls</p>
              <p className="text-2xl font-bold text-foreground">342</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total cost</p>
              <p className="text-2xl font-bold text-foreground">$245.80</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-6 text-foreground font-heading">Model Configuration</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="greeting" className="text-foreground">Greeting Text</Label>
              <Input
                id="greeting"
                value={formData.greeting}
                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <div>
              <Label htmlFor="prompt" className="text-foreground">Prompt / Instructions</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={6}
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="voice" className="text-foreground">Voice</Label>
                <Select
                  value={formData.voice}
                  onValueChange={(value) => setFormData({ ...formData, voice: value })}
                >
                  <SelectTrigger id="voice" className="mt-2 bg-background text-foreground border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="alloy" className="text-popover-foreground">Alloy</SelectItem>
                    <SelectItem value="echo" className="text-popover-foreground">Echo</SelectItem>
                    <SelectItem value="fable" className="text-popover-foreground">Fable</SelectItem>
                    <SelectItem value="nova" className="text-popover-foreground">Nova</SelectItem>
                    <SelectItem value="shimmer" className="text-popover-foreground">Shimmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="text-foreground">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger id="language" className="mt-2 bg-background text-foreground border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="English" className="text-popover-foreground">English</SelectItem>
                    <SelectItem value="Spanish" className="text-popover-foreground">Spanish</SelectItem>
                    <SelectItem value="French" className="text-popover-foreground">French</SelectItem>
                    <SelectItem value="German" className="text-popover-foreground">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model" className="text-foreground">Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <SelectTrigger id="model" className="mt-2 bg-background text-foreground border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="gpt-4" className="text-popover-foreground">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo" className="text-popover-foreground">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-6 text-foreground font-heading">Phone Number</h2>
          <div className="flex gap-4">
            <Select
              value={formData.phoneNumber}
              onValueChange={(value) => setFormData({ ...formData, phoneNumber: value })}
            >
              <SelectTrigger className="flex-1 bg-background text-foreground border-border">
                <SelectValue placeholder="Select phone number" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="+1 (555) 123-4567" className="text-popover-foreground">+1 (555) 123-4567</SelectItem>
                <SelectItem value="+1 (555) 987-6543" className="text-popover-foreground">+1 (555) 987-6543</SelectItem>
                <SelectItem value="+1 (555) 456-7890" className="text-popover-foreground">+1 (555) 456-7890</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSave} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Attach
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
