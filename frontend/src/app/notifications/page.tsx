'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Bell, Mail, Smartphone, Clock, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'recommendation' | 'release' | 'comment' | 'achievement'
  read: boolean
  timestamp: Date
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  newReleases: boolean
  recommendations: boolean
  comments: boolean
  achievements: boolean
  weeklyDigest: boolean
  emailFrequency: 'instant' | 'daily' | 'weekly'
  doNotDisturb: boolean
  doNotDisturbStart: string
  doNotDisturbEnd: string
}

export default function NotificationsPage() {
  const { theme } = useTheme()
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newReleases: true,
    recommendations: true,
    comments: true,
    achievements: true,
    weeklyDigest: true,
    emailFrequency: 'daily',
    doNotDisturb: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '08:00',
  })

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Release!',
      message: 'Tara Westover published a new book: "The Reckoning"',
      type: 'release',
      read: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      title: 'Personalized Recommendation',
      message: 'Based on your reading history, we recommend "Klara and the Sun"',
      type: 'recommendation',
      read: false,
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'Achievement Unlocked!',
      message: 'You\'ve reached 50 books read this year! 🎉',
      type: 'achievement',
      read: true,
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      title: 'Comment on Your Review',
      message: 'Someone liked your review of "Dune"',
      type: 'comment',
      read: true,
      timestamp: new Date(Date.now() - 259200000),
    },
  ])

  const [selectedTab, setSelectedTab] = useState<'notifications' | 'settings'>('notifications')
  const [saved, setSaved] = useState(false)

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [notifications])

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }, [notifications])

  const handleSettingChange = useCallback((key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  const handleSaveSettings = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'release':
        return '📚'
      case 'recommendation':
        return '💡'
      case 'achievement':
        return '🏆'
      case 'comment':
        return '💬'
      default:
        return '🔔'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Notifications</h1>
          </div>
          <p className={`${textColor} text-lg`}>Manage your notifications and preferences</p>
        </div>

        <div className="flex gap-2 mb-8">
          {['notifications', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-6 py-3 rounded-lg transition font-semibold ${
                selectedTab === tab
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {selectedTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className={`border ${cardColor} rounded-lg p-12 text-center`}>
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold">No notifications</p>
                <p className={textColor}>You're all caught up! Check back later.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border ${cardColor} rounded-lg p-6 hover:shadow-lg transition ${
                    !notification.read ? (theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50') : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold">{notification.title}</h3>
                          <p className={`${textColor} text-sm`}>{notification.message}</p>
                          <p className={`${textColor} text-xs mt-2`}>
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        {!notification.read && (
                          <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-blue-600 rounded transition"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-5 h-5 text-blue-500 hover:text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 hover:bg-red-600 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-500 hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="space-y-6">
            {saved && (
              <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 font-semibold">Settings saved successfully!</p>
              </div>
            )}

            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Email Notifications
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleSettingChange('emailNotifications', e.target.checked)
                    }
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">Enable email notifications</span>
                </label>

                {settings.emailNotifications && (
                  <div>
                    <label className="block font-semibold mb-2">Email Frequency</label>
                    <select
                      value={settings.emailFrequency}
                      onChange={(e) =>
                        handleSettingChange('emailFrequency', e.target.value)
                      }
                      className={`w-full max-w-xs px-4 py-2 rounded-lg border ${inputBg}`}
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Smartphone className="w-6 h-6" />
                Push Notifications
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      handleSettingChange('pushNotifications', e.target.checked)
                    }
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">Enable push notifications</span>
                </label>
              </div>
            </div>

            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-2xl font-bold mb-4">Notification Types</h2>

              <div className="space-y-3">
                {[
                  { key: 'newReleases', label: 'New Releases from Favorite Authors' },
                  { key: 'recommendations', label: 'Personalized Recommendations' },
                  { key: 'comments', label: 'Comments on Your Reviews' },
                  { key: 'achievements', label: 'Achievement Unlocked' },
                  { key: 'weeklyDigest', label: 'Weekly Digest' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof NotificationSettings] as boolean}
                      onChange={(e) =>
                        handleSettingChange(
                          item.key as keyof NotificationSettings,
                          e.target.checked
                        )
                      }
                      className="w-5 h-5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Do Not Disturb
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.doNotDisturb}
                    onChange={(e) =>
                      handleSettingChange('doNotDisturb', e.target.checked)
                    }
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">Enable Do Not Disturb</span>
                </label>

                {settings.doNotDisturb && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-sm">Start Time</label>
                      <input
                        type="time"
                        value={settings.doNotDisturbStart}
                        onChange={(e) =>
                          handleSettingChange('doNotDisturbStart', e.target.value)
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm">End Time</label>
                      <input
                        type="time"
                        value={settings.doNotDisturbEnd}
                        onChange={(e) =>
                          handleSettingChange('doNotDisturbEnd', e.target.value)
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Save Settings
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
