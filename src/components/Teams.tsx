import { useState, useEffect } from 'react';
import { PlusIcon, UserPlusIcon } from 'lucide-react';
import { Header } from './Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '../stores/appStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { logger } from '@/lib/logger';

export function Teams() {
  const { teamMembers, isLoadingTeamMembers, teamMembersError, fetchTeamMembers, addTeamMember } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Support',
  });

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    logger.info('Submitting team member form', {
      component: 'Teams',
      action: 'handleSubmit',
      email: formData.email,
    });
    
    try {
      await addTeamMember(formData);
      setFormData({ name: '', email: '', role: 'Support' });
      setIsOpen(false);
    } catch (err: any) {
      logger.error('Failed to add team member', {
        component: 'Teams',
        action: 'handleSubmit',
        email: formData.email,
      }, err);
      setError(err.message || 'Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header
        title="Teams"
        actionButton={{
          label: 'Add Member',
          onClick: () => setIsOpen(true),
        }}
      />

      {isLoadingTeamMembers ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">Loading team members...</div>
        </div>
      ) : teamMembersError ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-red-500">Error: {teamMembersError}</div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
          <div className="text-muted-foreground">No team members yet. Add your first member!</div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Member</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-card-foreground font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">{member.email}</td>
                    <td className="px-6 py-4 text-card-foreground">{member.role}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={member.active ? 'default' : 'secondary'}
                        className={
                          member.active
                            ? 'bg-tertiary/20 text-tertiary border-tertiary'
                            : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {member.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading">Add Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <div>
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-foreground">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="role" className="mt-2 bg-background text-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="Admin" className="text-popover-foreground">Admin</SelectItem>
                  <SelectItem value="Developer" className="text-popover-foreground">Developer</SelectItem>
                  <SelectItem value="Support" className="text-popover-foreground">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
