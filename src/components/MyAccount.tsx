import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  User,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  Wrench,
  EyeIcon,
} from 'lucide-react';

export default function MyAccount() {
  const { currentUser, updateUserCredentials } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const roleConfig = {
    admin: { label: 'Administrator', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Shield },
    worker: { label: 'Worker', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Wrench },
    visitor: { label: 'Visitor', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: EyeIcon },
  };

  const role = currentUser?.role || 'visitor';
  const rc = roleConfig[role];
  const RoleIcon = rc.icon;

  const handleSaveProfile = () => {
    if (!currentUser) return;
    if (!name.trim() || !username.trim()) {
      setAccountMsg({ type: 'error', text: 'Name and username cannot be empty.' });
      setTimeout(() => setAccountMsg(null), 4000);
      return;
    }
    const success = updateUserCredentials(currentUser.id, { name: name.trim(), username: username.trim() });
    if (success) {
      setAccountMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setAccountMsg({ type: 'error', text: 'Username is already taken by another user.' });
    }
    setTimeout(() => setAccountMsg(null), 4000);
  };

  const handleChangePassword = () => {
    if (!currentUser) return;
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      setTimeout(() => setPasswordMsg(null), 4000);
      return;
    }
    if (currentPassword !== currentUser.password) {
      setPasswordMsg({ type: 'error', text: 'Current password is incorrect.' });
      setTimeout(() => setPasswordMsg(null), 4000);
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
      setTimeout(() => setPasswordMsg(null), 4000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      setTimeout(() => setPasswordMsg(null), 4000);
      return;
    }
    const success = updateUserCredentials(currentUser.id, { password: newPassword });
    if (success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: 'Failed to update password.' });
    }
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Account</h1>
          <p className="text-gray-400 text-sm">Manage your profile and password</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* User Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg shadow-purple-500/20">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
              <p className="text-gray-400 text-sm">@{currentUser?.username}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${rc.bg} ${rc.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  {rc.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {accountMsg && (
            <div className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
              accountMsg.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {accountMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {accountMsg.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all pr-11 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all pr-11 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            {passwordMsg && (
              <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl ${
                passwordMsg.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                {passwordMsg.text}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white rounded-xl text-sm font-semibold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
