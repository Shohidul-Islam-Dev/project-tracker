import { useStore } from '../store/useStore';
import {
  LogOut,
  Plus,
  Search,
  ChevronLeft,
  LayoutDashboard,
  Users,
  Settings,
  CircleDot,
  UserCog,
} from 'lucide-react';
import { useState } from 'react';
import { OrderStatus } from '../store/types';
import Logo from './Logo';

const statusColors: Record<OrderStatus, string> = {
  pending: 'text-yellow-400',
  'in-progress': 'text-blue-400',
  review: 'text-purple-400',
  completed: 'text-green-400',
  cancelled: 'text-red-400',
};

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const {
    currentUser,
    projects,
    selectedProjectId,
    selectProject,
    logout,
    sidebarOpen,
    toggleSidebar,
  } = useStore();

  const [search, setSearch] = useState('');

  const visibleProjects =
    currentUser?.role === 'admin'
      ? projects
      : projects.filter(p => currentUser?.assignedProjects.includes(p.id));

  const filteredProjects = visibleProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const roleLabel =
    currentUser?.role === 'admin'
      ? 'Administrator'
      : currentUser?.role === 'worker'
      ? 'Worker'
      : 'Visitor';

  const roleBadgeColor =
    currentUser?.role === 'admin'
      ? 'bg-purple-500/20 text-purple-300'
      : currentUser?.role === 'worker'
      ? 'bg-blue-500/20 text-blue-300'
      : 'bg-green-500/20 text-green-300';

  return (
    <div
      className={`${
        sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
      } bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600/30 to-emerald-600/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
              <Logo size="sm" showText={false} />
            </div>
            <span className="font-bold text-lg">
              <span style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>I⚡S</span>
              <span className="text-gray-300 font-normal text-sm ml-1">Tracker</span>
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => {
            onViewChange('dashboard');
            selectProject(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeView === 'dashboard' && !selectedProjectId
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        <button
          onClick={() => {
            onViewChange('my-account');
            selectProject(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeView === 'my-account'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <UserCog className="w-4 h-4" />
          My Account
        </button>

        {currentUser?.role === 'admin' && (
          <>
            <button
              onClick={() => {
                onViewChange('users');
                selectProject(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === 'users'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Manage Users
            </button>
            <button
              onClick={() => {
                onViewChange('settings');
                selectProject(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === 'settings'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Projects ({filteredProjects.length})
          </span>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onViewChange('add-project')}
              className="p-1 text-gray-400 hover:text-purple-400 hover:bg-gray-800 rounded-lg transition-colors"
              title="Add Project"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-1">
          {filteredProjects.map(project => (
            <button
              key={project.id}
              onClick={() => {
                selectProject(project.id);
                onViewChange('project');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group ${
                selectedProjectId === project.id
                  ? 'bg-purple-600/15 border border-purple-500/30 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <CircleDot className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusColors[project.orderStatus]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${project.overallProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{project.overallProgress}%</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
              {roleLabel}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
