import { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit, Trash2, Mail, Shield,
  CheckCircle, Clock, MoreVertical
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

export function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total_members: 0, active_users: 0, pending_invites: 0 });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'Leasing Staff' });

  useEffect(() => {
    fetch(`${API_URL}/api/team/members`).then(r => r.json()).then(d => {
      setMembers(d.members || []);
      setStats(d.stats || {});
    }).catch(() => {});
  }, []);

  const handleInvite = () => {
    if (!inviteData.email) return;
    fetch(`${API_URL}/api/team/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inviteData),
    }).then(r => r.json()).then(newMember => {
      setMembers(p => [...p, newMember]);
      setStats(p => ({ ...p, total_members: p.total_members + 1, pending_invites: p.pending_invites + 1 }));
      setShowInviteModal(false);
      setInviteData({ name: '', email: '', role: 'Leasing Staff' });
    }).catch(() => {});
  };

  const handleDelete = (id: string) => {
    fetch(`${API_URL}/api/team/members/${id}`, { method: 'DELETE' }).then(() => {
      setMembers(p => p.filter(m => m.id !== id));
      setStats(p => ({ ...p, total_members: p.total_members - 1 }));
    }).catch(() => {});
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Property Manager': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="p-6" data-testid="team-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and permissions</p>
          </div>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total_members}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.active_users}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending_invites}</p>
              <p className="text-sm text-muted-foreground">Pending Invites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="data-table">
          <thead className="bg-muted/50">
            <tr>
              <th>MEMBER</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>LAST ACTIVE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member: any) => (
              <tr key={member.id} className="hover:bg-muted/30">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </td>
                <td>
                  <span className={`flex items-center gap-1 text-sm ${
                    member.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {member.status === 'Active' ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pending
                      </>
                    )}
                  </span>
                </td>
                <td className="text-sm text-muted-foreground">
                  {member.lastActive || 'Never'}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInviteModal(false)}>
          <div className="bg-card rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select 
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                >
                  <option>Leasing Staff</option>
                  <option>Property Manager</option>
                  <option>Super Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowInviteModal(false)} 
                  className="flex-1 py-2 border border-border rounded-lg text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button onClick={handleInvite} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamPage;
