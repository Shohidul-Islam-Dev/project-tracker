import { useStore } from '../store/useStore';
import {
  FolderOpen,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { OrderStatus } from '../store/types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  review: { label: 'Review', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10' },
};

interface DashboardProps {
  onSelectProject: (id: string) => void;
}

export default function Dashboard({ onSelectProject }: DashboardProps) {
  const { currentUser, projects } = useStore();

  const visibleProjects =
    currentUser?.role === 'admin'
      ? projects
      : projects.filter(p => currentUser?.assignedProjects.includes(p.id));

  const totalAmount = visibleProjects.reduce((sum, p) => sum + p.amount, 0);
  const avgProgress =
    visibleProjects.length > 0
      ? Math.round(visibleProjects.reduce((sum, p) => sum + p.overallProgress, 0) / visibleProjects.length)
      : 0;
  const completedCount = visibleProjects.filter(p => p.orderStatus === 'completed').length;
  const inProgressCount = visibleProjects.filter(p => p.orderStatus === 'in-progress').length;

  const stats = [
    {
      label: 'Total Projects',
      value: visibleProjects.length,
      icon: FolderOpen,
      color: 'from-purple-600 to-purple-400',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Avg. Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-400',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Total Revenue',
      value: `$${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-600 to-green-400',
      iconColor: 'text-green-400',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-emerald-400',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Welcome back, {currentUser?.name} 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's an overview of your projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-gray-800`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Project Status Breakdown</h2>
          <div className="space-y-4">
            {(['in-progress', 'pending', 'review', 'completed', 'cancelled'] as OrderStatus[]).map(status => {
              const count = visibleProjects.filter(p => p.orderStatus === status).length;
              const pct = visibleProjects.length > 0 ? (count / visibleProjects.length) * 100 : 0;
              const config = statusConfig[status];
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                    <span className="text-sm text-gray-400">
                      {count} project{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status === 'in-progress'
                          ? 'bg-blue-500'
                          : status === 'pending'
                          ? 'bg-yellow-500'
                          : status === 'review'
                          ? 'bg-purple-500'
                          : status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-lg font-bold text-white">{inProgressCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-lg font-bold text-white">{completedCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-lg font-bold text-white">
                  {visibleProjects.filter(p => p.orderStatus === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">All Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {visibleProjects.map(project => {
                const config = statusConfig[project.orderStatus];
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => onSelectProject(project.id)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{project.name}</p>
                      <p className="text-xs text-gray-500">{project.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{project.clientName}</p>
                      <p className="text-xs text-gray-500">{project.clientUserId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            style={{ width: `${project.overallProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{project.overallProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      ${project.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-800 rounded-lg transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
