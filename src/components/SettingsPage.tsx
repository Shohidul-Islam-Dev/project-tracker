import { useState } from 'react';
import {
  Settings,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { defaultUsers, defaultProjects } from '../store/data';

export default function SettingsPage() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    localStorage.setItem('projects', JSON.stringify(defaultProjects));
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  const handleExport = () => {
    const data = {
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      projects: JSON.parse(localStorage.getItem('projects') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
        if (data.projects) localStorage.setItem('projects', JSON.stringify(data.projects));
        window.location.reload();
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Manage application data and configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Export Data</p>
                  <p className="text-xs text-gray-500">Download all projects and users as JSON</p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-all"
              >
                Export
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">Import Data</p>
                  <p className="text-xs text-gray-500">Restore from a JSON backup file</p>
                </div>
              </div>
              <label className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-500 transition-all cursor-pointer">
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-900/80 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          {!showResetConfirm ? (
            <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-white">Reset All Data</p>
                  <p className="text-xs text-gray-500">Reset all projects and users to default demo data</p>
                </div>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-all"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-300 mb-3">
                ⚠️ This will permanently delete all your data and restore default demo data. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-all"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📋 Setup Instructions</h2>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">1. GitHub Setup</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Create a new repository on GitHub</li>
                <li>Push your project code to the repository</li>
                <li>Make sure <code className="px-1.5 py-0.5 bg-gray-800 rounded text-purple-300">package.json</code> is in the root</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Vercel Deployment</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Go to <span className="text-purple-400">vercel.com</span> and sign in with GitHub</li>
                <li>Click "New Project" and import your repository</li>
                <li>Framework Preset: <code className="px-1.5 py-0.5 bg-gray-800 rounded text-purple-300">Vite</code></li>
                <li>Build Command: <code className="px-1.5 py-0.5 bg-gray-800 rounded text-purple-300">npm run build</code></li>
                <li>Output Directory: <code className="px-1.5 py-0.5 bg-gray-800 rounded text-purple-300">dist</code></li>
                <li>Click "Deploy"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
