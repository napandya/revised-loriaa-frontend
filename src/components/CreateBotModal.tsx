import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBotModal({ isOpen, onClose }: CreateBotModalProps) {
  const { addBot } = useAppStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    greeting: '',
    prompt: '',
    voice: 'alloy',
    language: 'English',
    model: 'gpt-4',
    hipaaCompliant: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    logger.info('Submitting bot creation form', {
      component: 'CreateBotModal',
      action: 'handleSubmit',
      botName: formData.name,
    });
    
    try {
      await addBot({
        ...formData,
        status: 'inactive',
      });
      toast({
        title: 'Success',
        description: 'Bot created successfully',
      });
      logger.info('Bot creation successful', {
        component: 'CreateBotModal',
        action: 'handleSubmit',
        botName: formData.name,
      });
      setFormData({
        name: '',
        greeting: '',
        prompt: '',
        voice: 'alloy',
        language: 'English',
        model: 'gpt-4',
        hipaaCompliant: false,
      });
      onClose();
    } catch (error: any) {
      logger.error('Bot creation failed', {
        component: 'CreateBotModal',
        action: 'handleSubmit',
        botName: formData.name,
      }, error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create bot',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground font-heading">Create New Bot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bot-name" className="text-foreground">Bot Name</Label>
            <Input
              id="bot-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-2 bg-background text-foreground border-border"
            />
          </div>

          <div>
            <Label htmlFor="bot-greeting" className="text-foreground">Greeting Text</Label>
            <Input
              id="bot-greeting"
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              required
              className="mt-2 bg-background text-foreground border-border"
            />
          </div>

          <div>
            <Label htmlFor="bot-prompt" className="text-foreground">Prompt / Instructions</Label>
            <Textarea
              id="bot-prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              rows={4}
              required
              className="mt-2 bg-background text-foreground border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bot-voice" className="text-foreground">Voice</Label>
              <Select
                value={formData.voice}
                onValueChange={(value) => setFormData({ ...formData, voice: value })}
              >
                <SelectTrigger id="bot-voice" className="mt-2 bg-background text-foreground border-border">
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
              <Label htmlFor="bot-language" className="text-foreground">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger id="bot-language" className="mt-2 bg-background text-foreground border-border">
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
              <Label htmlFor="bot-model" className="text-foreground">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger id="bot-model" className="mt-2 bg-background text-foreground border-border">
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
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Create Bot'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
