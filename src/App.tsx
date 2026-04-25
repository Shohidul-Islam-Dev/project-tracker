import { useState } from 'react';
import { useStore } from './store/useStore';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import ManageUsers from './components/ManageUsers';
import AddProject from './components/AddProject';
import SettingsPage from './components/SettingsPage';
import MyAccount from './components/MyAccount';
import { Menu } from 'lucide-react';
import Logo from './components/Logo';

export default function App() {
  const { currentUser, selectedProjectId, selectProject, sidebarOpen, toggleSidebar } = useStore();
  const [activeView, setActiveView] = useState('dashboard');

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleSelectProject = (id: string) => {
    selectProject(id);
    setActiveView('project');
  };

  const renderMainContent = () => {
    if (selectedProjectId && activeView === 'project') {
      return <ProjectDetail />;
    }

    switch (activeView) {
      case 'my-account':
        return <MyAccount />;
      case 'users':
        return currentUser.role === 'admin' ? <ManageUsers /> : <Dashboard onSelectProject={handleSelectProject} />;
      case 'settings':
        return currentUser.role === 'admin' ? <SettingsPage /> : <Dashboard onSelectProject={handleSelectProject} />;
      case 'add-project':
        return currentUser.role === 'admin' ? (
          <AddProject onClose={() => setActiveView('dashboard')} />
        ) : (
          <Dashboard onSelectProject={handleSelectProject} />
        );
      default:
        return <Dashboard onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-800 flex items-center px-4 gap-4 flex-shrink-0 bg-gray-950/80 backdrop-blur-xl">
          {!sidebarOpen && (
            <>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Logo size="sm" showText={false} />
            </>
          )}
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-gray-300">
              {selectedProjectId && activeView === 'project'
                ? '📂 Project Details'
                : activeView === 'my-account'
                ? '👤 My Account'
                : activeView === 'users'
                ? '👥 User Management'
                : activeView === 'settings'
                ? '⚙️ Settings'
                : activeView === 'add-project'
                ? '➕ New Project'
                : '📊 Dashboard'}
            </h2>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              currentUser.role === 'admin'
                ? 'bg-purple-500/20 text-purple-300'
                : currentUser.role === 'worker'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-green-500/20 text-green-300'
            }`}>
              {currentUser.role === 'admin' ? '🛡️ Admin' : currentUser.role === 'worker' ? '🔧 Worker' : '👁️ Visitor'}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
