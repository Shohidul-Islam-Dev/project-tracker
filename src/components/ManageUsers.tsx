import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Role } from '../store/types';
import {
  Plus,
  Trash2,
  Shield,
  Wrench,
  Eye,
  X,
  Save,
  FolderPlus,
} from 'lucide-react';

const roleConfig: Record<Role, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  admin: { label: 'Admin', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Shield },
  worker: { label: 'Worker', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Wrench },
  visitor: { label: 'Visitor', color: 'text-green-400', bg: 'bg-green-500/10', icon: Eye },
};

export default function ManageUsers() {
  const {
    users,
    projects,
    currentUser,
    addUser,
    deleteUser,
    updateUserRole,
    assignProjectToUser,
    removeProjectFromUser,
  } = useStore();

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    role: 'worker' as Role,
  });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) return;
    addUser({
      ...newUser,
      assignedProjects: [],
    });
    setNewUser({ username: '', password: '', name: '', role: 'worker' });
    setShowAddUser(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Manage Users</h1>
          <p className="text-gray-400 mt-1">Add, edit, and manage user access</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="johndoe"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="text"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="password123"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="admin">Admin</option>
                <option value="worker">Worker</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all"
            >
              <Save className="w-4 h-4" />
              Create User
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {users.map(user => {
          const config = roleConfig[user.role];
          const RoleIcon = config.icon;
          const isExpanded = expandedUser === user.id;
          const isSelf = user.id === currentUser?.id;
          const assignedProjectNames = projects.filter(p =>
            user.assignedProjects.includes(p.id)
          );

          return (
            <div
              key={user.id}
              className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedUser(isExpanded ? null : user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{user.name}</p>
                      {isSelf && (
                        <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.assignedProjects.length} projects
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role Management */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Change Role</h4>
                      <div className="flex gap-2">
                        {(['admin', 'worker', 'visitor'] as Role[]).map(role => (
                          <button
                            key={role}
                            onClick={() => updateUserRole(user.id, role)}
                            disabled={isSelf}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              user.role === role
                                ? `${roleConfig[role].bg} ${roleConfig[role].color} border border-current/30`
                                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                            } ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {roleConfig[role].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delete User */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Actions</h4>
                      <button
                        onClick={() => {
                          if (!isSelf && confirm('Delete this user?')) deleteUser(user.id);
                        }}
                        disabled={isSelf}
                        className={`flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all ${
                          isSelf ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete User
                      </button>
                    </div>
                  </div>

                  {/* Project Assignments */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">
                      Assigned Projects
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {assignedProjectNames.length > 0 ? (
                        assignedProjectNames.map(p => (
                          <span
                            key={p.id}
                            className="flex items-center gap-1.5 text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700"
                          >
                            {p.name}
                            <button
                              onClick={() => removeProjectFromUser(user.id, p.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-600">No projects assigned</p>
                      )}
                    </div>

                    {/* Assign new projects */}
                    <div className="flex flex-wrap gap-2">
                      {projects
                        .filter(p => !user.assignedProjects.includes(p.id))
                        .map(p => (
                          <button
                            key={p.id}
                            onClick={() => assignProjectToUser(user.id, p.id)}
                            className="flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                          >
                            <FolderPlus className="w-3 h-3" />
                            {p.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
