'use client'

import { useState } from 'react'
import { User, Lock, Bell, Eye, HelpCircle, LogOut, Trash2, Download, Save } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications' | 'data' | 'account'>('profile')
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Book lover and avid reader',
    favoriteGenres: ['Fiction', 'Mystery', 'Sci-Fi'],
    location: 'New York, USA',
    website: 'https://johnreads.com',
  })
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showReadingHistory: true,
    allowMessages: true,
    showFavoriteBooks: true,
    shareReadingStats: false,
    profileVisibility: 'public',
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newRecommendations: true,
    communityUpdates: true,
    weeklyDigest: true,
    monthlyReport: true,
    friendActivity: false,
  })
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your profile, privacy, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'privacy', label: 'Privacy', icon: Eye },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'data', label: 'Data & Privacy', icon: HelpCircle },
                { id: 'account', label: 'Account', icon: Lock },
              ].map(item => {
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition border-b border-slate-200 dark:border-slate-700 last:border-0 ${
                      activeTab === item.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <ItemIcon size={20} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              {saved && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                  <Save size={20} />
                  Settings saved successfully!
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Information</h2>

                  <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                      JD
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{profileData.name}</h3>
                      <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium text-sm">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={e => setProfileData({ ...profileData, website: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handleSave}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Public Profile</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Allow others to view your profile</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.publicProfile}
                        onChange={e => setPrivacySettings({ ...privacySettings, publicProfile: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Show Reading History</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Let friends see books you're reading</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.showReadingHistory}
                        onChange={e => setPrivacySettings({ ...privacySettings, showReadingHistory: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Allow Messages</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive messages from other readers</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.allowMessages}
                        onChange={e => setPrivacySettings({ ...privacySettings, allowMessages: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <button
                      onClick={handleSave}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Preferences</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={e => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Push Notifications</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Get browser notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={e => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">New Recommendations</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Get notified about new book recommendations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.newRecommendations}
                        onChange={e => setNotifications({ ...notifications, newRecommendations: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Weekly Digest</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive weekly reading digest</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.weeklyDigest}
                        onChange={e => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <button
                      onClick={handleSave}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data & Privacy</h2>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Export Your Data</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                        Download all your personal data including reading history, ratings, and preferences
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
                        <Download size={18} />
                        Export Data (CSV)
                      </button>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2">
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account & Security</h2>

                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Lock size={20} />
                        Change Password
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Update your password regularly to keep your account secure</p>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                        Change Password
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {mfaEnabled ? 'Two-factor authentication is enabled on your account' : 'Enable two-factor authentication for added security'}
                      </p>
                      <button
                        onClick={() => setMfaEnabled(!mfaEnabled)}
                        className={`px-4 py-2 rounded-lg transition font-medium ${
                          mfaEnabled
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <LogOut size={20} />
                        Sign Out
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Sign out from all devices</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                        Sign Out Everywhere
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
