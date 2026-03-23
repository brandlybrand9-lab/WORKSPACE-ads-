import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Plus, Edit, Trash2, Shield, User, UserCog } from 'lucide-react';
import { useAppStore, User as TeamMember, Role } from '@/src/store/useStore';
import { Modal } from '@/src/components/ui/modal';

export function Team() {
  const { t } = useTranslation();
  const { team, addTeamMember, updateTeamMember, deleteTeamMember, user } = useAppStore();
  const isAdmin = user?.role === 'admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as Role,
  });

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', role: 'employee' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (editingMember) {
      updateTeamMember(editingMember.id, formData);
      toast.success('Team member updated successfully');
    } else {
      addTeamMember(formData);
      toast.success('Team member added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id === user?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    deleteTeamMember(id);
    toast.success('Team member removed successfully');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-500" />;
      case 'manager': return <UserCog className="w-4 h-4 text-indigo-500" />;
      default: return <User className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'manager': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your employees and their access levels.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            Add Employee
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-indigo-500 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {member.name}
                        {member.id === user?.id && <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full">You</span>}
                      </h4>
                      <div className="text-sm text-zinc-500">
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      <span className="capitalize">{member.role}</span>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(member)}>
                          <Edit className="w-4 h-4 text-zinc-400 hover:text-indigo-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} disabled={member.id === user?.id}>
                          <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role & Access Level</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 rounded-md h-10 px-3 text-sm"
            >
              <option value="employee">Employee (Basic Access)</option>
              <option value="manager">Manager (Manage Teams & Leads)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingMember ? 'Save Changes' : 'Add Member'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
