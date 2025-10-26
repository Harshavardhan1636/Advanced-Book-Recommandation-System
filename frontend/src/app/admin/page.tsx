'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Settings,
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Shield,
  Activity,
  Database,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalBooks: number
  totalReviews: number
  serverUptime: number
}

interface SystemHealth {
  category: string
  status: 'healthy' | 'warning' | 'critical'
  percentage: number
}

export default function AdminPage() {
  const { theme } = useTheme()
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'users' | 'content' | 'system'>('dashboard')

  const stats: AdminStats = {
    totalUsers: 15420,
    activeUsers: 3847,
    totalBooks: 82156,
    totalReviews: 254639,
    serverUptime: 99.98,
  }

  const systemHealth: SystemHealth[] = [
    { category: 'Database', status: 'healthy', percentage: 98 },
    { category: 'API Server', status: 'healthy', percentage: 99.5 },
    { category: 'Cache', status: 'healthy', percentage: 97 },
    { category: 'Search Engine', status: 'warning', percentage: 85 },
  ]

  const activityData = [
    { time: '00:00', users: 120, books: 45, reviews: 89 },
    { time: '04:00', users: 89, books: 32, reviews: 56 },
    { time: '08:00', users: 456, books: 234, reviews: 345 },
    { time: '12:00', users: 789, books: 567, reviews: 678 },
    { time: '16:00', users: 934, books: 812, reviews: 945 },
    { time: '20:00', users: 1234, books: 1023, reviews: 1456 },
  ]

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2025-10-26', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2025-10-25', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2025-10-24', status: 'inactive' },
  ]

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500 bg-green-500 bg-opacity-20'
      case 'warning':
        return 'text-yellow-500 bg-yellow-500 bg-opacity-20'
      case 'critical':
        return 'text-red-500 bg-red-500 bg-opacity-20'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className={`${textColor} text-lg`}>Manage your BookHub platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Total Users</p>
                <p className="text-3xl font-bold text-blue-500">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Active Now</p>
                <p className="text-3xl font-bold text-green-500">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <Activity className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Total Books</p>
                <p className="text-3xl font-bold text-purple-500">{stats.totalBooks.toLocaleString()}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Total Reviews</p>
                <p className="text-3xl font-bold text-orange-500">{stats.totalReviews.toLocaleString()}</p>
              </div>
              <PieChart className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Uptime</p>
                <p className="text-3xl font-bold text-emerald-500">{stats.serverUptime}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {['dashboard', 'users', 'content', 'system'].map((tab) => (
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

        {selectedTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-xl font-bold mb-4">24-Hour Activity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                  <XAxis dataKey="time" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                      border: `1px solid ${theme === 'dark' ? '#475569' : '#cbd5e1'}`,
                    }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-xl font-bold mb-4">System Health</h2>
              <div className="space-y-4">
                {systemHealth.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{item.category}</span>
                      <span className={`text-sm font-bold ${getHealthColor(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.status === 'healthy'
                            ? 'bg-green-500'
                            : item.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className={`border ${cardColor} rounded-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} bg-opacity-50`}>
                    <th className="text-left px-6 py-4 font-semibold">Name</th>
                    <th className="text-left px-6 py-4 font-semibold">Email</th>
                    <th className="text-left px-6 py-4 font-semibold">Join Date</th>
                    <th className="text-left px-6 py-4 font-semibold">Status</th>
                    <th className="text-left px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} hover:bg-opacity-50`}>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'active'
                              ? 'text-green-500 bg-green-500 bg-opacity-20'
                              : 'text-gray-500 bg-gray-500 bg-opacity-20'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-semibold">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'content' && (
          <div className={`border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-6">Content Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-opacity-50 rounded-lg">
                <div>
                  <p className="font-semibold">Flagged Content</p>
                  <p className={textColor}>12 reviews pending review</p>
                </div>
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-opacity-50 rounded-lg">
                <div>
                  <p className="font-semibold">Duplicated Books</p>
                  <p className={textColor}>3 books need merging</p>
                </div>
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-opacity-50 rounded-lg">
                <div>
                  <p className="font-semibold">Pending Approvals</p>
                  <p className={textColor}>8 new books awaiting approval</p>
                </div>
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'system' && (
          <div className={`border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-6">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-3">Server Details</p>
                <div className={`space-y-2 ${textColor} text-sm`}>
                  <p>OS: Linux (Ubuntu 22.04)</p>
                  <p>Memory: 64GB / 128GB</p>
                  <p>Storage: 2.5TB / 10TB</p>
                  <p>CPU: 32 cores @ 3.2GHz</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-3">Database</p>
                <div className={`space-y-2 ${textColor} text-sm`}>
                  <p>PostgreSQL 14.2</p>
                  <p>Size: 450GB</p>
                  <p>Connections: 1,243 / 5,000</p>
                  <p>Query Time: 45ms avg</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
