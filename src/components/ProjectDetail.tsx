import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import { useStore } from '../store/useStore';
import { OrderStatus } from '../store/types';
import {
  ArrowLeft,
  User,
  CreditCard,
  Monitor,
  FileText,
  Clock,
  CalendarDays,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Timer,
  Eye,
  Ban,
  Sheet,
  UserCheck,
  Percent,
  Globe,
} from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Timer },
  review: { label: 'Under Review', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Eye },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: Ban },
};

const allStatuses: OrderStatus[] = ['pending', 'in-progress', 'review', 'completed', 'cancelled'];

export default function ProjectDetail() {
  const {
    currentUser,
    projects,
    selectedProjectId,
    selectProject,
    updateOrderStatus,
    addProgressEntry,
    updateProjectDetails,
    updateProject,
    deleteProject,
  } = useStore();

  const project = projects.find(p => p.id === selectedProjectId);

  const [editingInfo, setEditingInfo] = useState(false);
  const [editInfo, setEditInfo] = useState('');
  const [editCms, setEditCms] = useState('');

  const [showAddProgress, setShowAddProgress] = useState(false);
  const [newProgressDesc, setNewProgressDesc] = useState('');
  const [newProgressPct, setNewProgressPct] = useState(0);

  const [editingProject, setEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    clientName: '',
    clientUserId: '',
    amount: 0,
    account: '',
    category: '',
    responsible: '',
    incDate: '',
    percentage: 0,
    orderPageUrl: '',
    spreadsheetLink: '',
    assignBy: '',
    deliLastTime: '',
    cms: '',
  });

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Select a Project</h2>
          <p className="text-gray-500">Choose a project from the sidebar to view details</p>
        </div>
      </div>
    );
  }

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'worker';
  const isAdmin = currentUser?.role === 'admin';
  const config = statusConfig[project.orderStatus];
  const StatusIcon = config.icon;

  const handleSaveInfo = () => {
    updateProjectDetails(project.id, { information: editInfo, cms: editCms });
    setEditingInfo(false);
  };

  const handleAddProgress = () => {
    if (!newProgressDesc.trim()) return;
    addProgressEntry(project.id, {
      date: new Date().toISOString().split('T')[0],
      description: newProgressDesc,
      percentage: newProgressPct,
      updatedBy: currentUser?.id || '',
    });
    setNewProgressDesc('');
    setNewProgressPct(0);
    setShowAddProgress(false);
  };

  const handleSaveProject = () => {
    updateProject(project.id, editForm);
    setEditingProject(false);
  };

  const startEditProject = () => {
    setEditForm({
      name: project.name,
      clientName: project.clientName,
      clientUserId: project.clientUserId,
      amount: project.amount,
      account: project.account,
      category: project.category,
      responsible: project.responsible || '',
      incDate: project.incDate || '',
      percentage: project.percentage || 0,
      orderPageUrl: project.orderPageUrl || '',
      spreadsheetLink: project.spreadsheetLink || '',
      assignBy: project.assignBy || '',
      deliLastTime: project.deliLastTime || '',
      cms: project.cms,
    });
    setEditingProject(true);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Back Button & Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => selectProject(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-gray-400 mt-1">{project.category} • {project.clientName}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && !editingProject && (
              <button
                onClick={startEditProject}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this project?')) {
                    deleteProject(project.id);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Edit Project Modal */}
        {editingProject && (
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Project Details</h3>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Basic Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Name</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                <input value={editForm.clientName} onChange={e => setEditForm({ ...editForm, clientName: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Client User ID</label>
                <input value={editForm.clientUserId} onChange={e => setEditForm({ ...editForm, clientUserId: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CMS / Platform</label>
                <input value={editForm.cms} onChange={e => setEditForm({ ...editForm, cms: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
            </div>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Financial & Percentage</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account</label>
                <input value={editForm.account} onChange={e => setEditForm({ ...editForm, account: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Percentage (%)</label>
                <input type="number" min="0" max="100" value={editForm.percentage} onChange={e => setEditForm({ ...editForm, percentage: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
            </div>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assignment & Dates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Responsible</label>
                <input value={editForm.responsible} onChange={e => setEditForm({ ...editForm, responsible: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Assign By</label>
                <input value={editForm.assignBy} onChange={e => setEditForm({ ...editForm, assignBy: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Inc Date</label>
                <input type="date" value={editForm.incDate} onChange={e => setEditForm({ ...editForm, incDate: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Delivery Deadline</label>
                <input type="date" value={editForm.deliLastTime} onChange={e => setEditForm({ ...editForm, deliLastTime: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
            </div>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Order Page URL</label>
                <input value={editForm.orderPageUrl} onChange={e => setEditForm({ ...editForm, orderPageUrl: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Spreadsheet Link</label>
                <input value={editForm.spreadsheetLink} onChange={e => setEditForm({ ...editForm, spreadsheetLink: e.target.value })} placeholder="https://docs.google.com/..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSaveProject} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all">
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={() => setEditingProject(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status Badge & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`${config.bg} border ${config.border} rounded-2xl p-5`}>
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-8 h-8 ${config.color}`} />
              <div>
                <p className="text-sm text-gray-400">Order Status</p>
                <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
              </div>
            </div>
            {canEdit && (
              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-2">Change Status:</label>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(project.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        project.orderStatus === status
                          ? `${statusConfig[status].bg} ${statusConfig[status].color} border ${statusConfig[status].border}`
                          : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                      }`}
                    >
                      {statusConfig[status].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-2">Overall Progress</p>
            <p className="text-4xl font-bold text-white mb-3">{project.overallProgress}%</p>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${project.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Delivery Countdown Timer */}
        <div className="mb-6">
          <CountdownTimer deadline={project.deliLastTime || ''} status={project.orderStatus} />
        </div>

        {/* Info Cards Grid — All Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Client User ID</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.clientUserId || '—'}</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Amount / Account</span>
            </div>
            <p className="text-sm font-semibold text-white">${project.amount.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{project.account || '—'}</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">CMS / Platform</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.cms || '—'}</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Percentage</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.percentage ?? project.overallProgress}%</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Responsible</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.responsible || '—'}</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Assign By</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.assignBy || '—'}</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Inc Date</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.incDate || '—'}</p>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Delivery Deadline</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.deliLastTime || '—'}</p>
          </div>
        </div>

        {/* Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Order Page URL</span>
            </div>
            {project.orderPageUrl ? (
              <a href={project.orderPageUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 underline break-all transition-colors">
                {project.orderPageUrl}
              </a>
            ) : (
              <p className="text-sm text-gray-500">—</p>
            )}
          </div>
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sheet className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Spreadsheet Link</span>
            </div>
            {project.spreadsheetLink ? (
              <a href={project.spreadsheetLink} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 underline break-all transition-colors">
                {project.spreadsheetLink}
              </a>
            ) : (
              <p className="text-sm text-gray-500">—</p>
            )}
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Created</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.createdAt}</p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</span>
            </div>
            <p className="text-sm font-semibold text-white">{project.updatedAt}</p>
          </div>
        </div>

        {/* Information / Description */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Project Information</h2>
            </div>
            {canEdit && !editingInfo && (
              <button
                onClick={() => {
                  setEditInfo(project.information);
                  setEditCms(project.cms);
                  setEditingInfo(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {editingInfo ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">CMS / Platform</label>
                <input value={editCms} onChange={e => setEditCms(e.target.value)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Information</label>
                <textarea value={editInfo} onChange={e => setEditInfo(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveInfo} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all">
                  <Save className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setEditingInfo(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed">{project.information || 'No information provided.'}</p>
          )}
        </div>

        {/* Progress Report */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Progress Report</h2>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowAddProgress(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            )}
          </div>

          {showAddProgress && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-medium text-white mb-3">New Progress Entry</h4>
              <div className="space-y-3">
                <textarea
                  value={newProgressDesc}
                  onChange={e => setNewProgressDesc(e.target.value)}
                  placeholder="Describe the progress..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                />
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Overall Progress: {newProgressPct}%
                  </label>
                  <input type="range" min="0" max="100" value={newProgressPct} onChange={e => setNewProgressPct(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddProgress} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all">
                    <Save className="w-4 h-4" /> Add
                  </button>
                  <button onClick={() => setShowAddProgress(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {project.progressEntries.length > 0 ? (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
              <div className="space-y-6">
                {[...project.progressEntries].reverse().map((entry, idx) => (
                  <div key={entry.id} className="relative flex gap-4">
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${idx === 0 ? 'bg-purple-600 shadow-lg shadow-purple-500/30' : 'bg-gray-800 border-2 border-gray-700'}`}>
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-gray-500'}`} />
                    </div>
                    <div className="flex-1 bg-gray-800/30 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{entry.date}</span>
                        <span className="text-xs font-semibold text-purple-400">{entry.percentage}%</span>
                      </div>
                      <p className="text-sm text-gray-300">{entry.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No progress entries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
