import { useState } from 'react';
import { useStore } from '../store/useStore';
import { OrderStatus } from '../store/types';
import { Save, X, FolderPlus } from 'lucide-react';

interface AddProjectProps {
  onClose: () => void;
}

export default function AddProject({ onClose }: AddProjectProps) {
  const { addProject } = useStore();
  const [form, setForm] = useState({
    name: '',
    clientName: '',
    clientUserId: '',
    amount: 0,
    account: '',
    cms: '',
    orderStatus: 'pending' as OrderStatus,
    information: '',
    category: 'Web Development',
    assignedWorkers: [] as string[],
    responsible: '',
    incDate: new Date().toISOString().split('T')[0],
    percentage: 0,
    orderPageUrl: '',
    spreadsheetLink: '',
    assignBy: '',
    deliLastTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.clientName) return;
    addProject(form);
    onClose();
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
          <FolderPlus className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Project</h1>
          <p className="text-gray-400 text-sm">Create a new project to track</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
        {/* Section: Basic Info */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Name *</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="E.g. E-Commerce Platform Redesign"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Client Name *</label>
            <input
              value={form.clientName}
              onChange={e => setForm({ ...form, clientName: e.target.value })}
              placeholder="Client Company Name"
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Client User ID</label>
            <input
              value={form.clientUserId}
              onChange={e => setForm({ ...form, clientUserId: e.target.value })}
              placeholder="CLI-2024-XXX"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">CMS / Platform</label>
            <input
              value={form.cms}
              onChange={e => setForm({ ...form, cms: e.target.value })}
              placeholder="WordPress, React, etc."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Section: Financial & Account */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Financial & Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount ($)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Account</label>
            <input
              value={form.account}
              onChange={e => setForm({ ...form, account: e.target.value })}
              placeholder="ACC-XXXX"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.percentage}
              onChange={e => setForm({ ...form, percentage: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Order Status</label>
            <select
              value={form.orderStatus}
              onChange={e => setForm({ ...form, orderStatus: e.target.value as OrderStatus })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Section: Assignment & Dates */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Assignment & Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Responsible</label>
            <input
              value={form.responsible}
              onChange={e => setForm({ ...form, responsible: e.target.value })}
              placeholder="Person responsible"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Assign By</label>
            <input
              value={form.assignBy}
              onChange={e => setForm({ ...form, assignBy: e.target.value })}
              placeholder="Assigned by"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Inc Date</label>
            <input
              type="date"
              value={form.incDate}
              onChange={e => setForm({ ...form, incDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Delivery Deadline</label>
            <input
              type="date"
              value={form.deliLastTime}
              onChange={e => setForm({ ...form, deliLastTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Section: Links */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Order Page URL</label>
            <input
              value={form.orderPageUrl}
              onChange={e => setForm({ ...form, orderPageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Spreadsheet Link</label>
            <input
              value={form.spreadsheetLink}
              onChange={e => setForm({ ...form, spreadsheetLink: e.target.value })}
              placeholder="https://docs.google.com/..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Section: Description */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Description</h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Information</label>
          <textarea
            value={form.information}
            onChange={e => setForm({ ...form, information: e.target.value })}
            rows={4}
            placeholder="Describe the project scope, requirements, deliverables..."
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none placeholder-gray-500"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
          >
            <Save className="w-4 h-4" />
            Create Project
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
