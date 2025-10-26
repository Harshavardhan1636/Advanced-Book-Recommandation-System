'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
  TrendingUp,
  Calendar,
  BookOpen,
  Award,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ReadingGoal {
  id: string
  title: string
  type: 'books' | 'pages' | 'hours' | 'genres'
  targetValue: number
  currentValue: number
  deadline: string
  category?: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'abandoned'
  createdDate: string
}

interface GoalProgress {
  week: string
  progress: number
  target: number
}

export default function ReadingGoalsPage() {
  const { theme } = useTheme()
  const [goals, setGoals] = useState<ReadingGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateGoal, setShowCreateGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<ReadingGoal | null>(null)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'active' | 'completed'>('overview')
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'books' as const,
    targetValue: 0,
    deadline: '',
    category: '',
    priority: 'medium' as const,
  })

  const mockGoals: ReadingGoal[] = [
    {
      id: '1',
      title: 'Read 24 books this year',
      type: 'books',
      targetValue: 24,
      currentValue: 18,
      deadline: '2025-12-31',
      priority: 'high',
      status: 'active',
      createdDate: '2025-01-01',
    },
    {
      id: '2',
      title: 'Complete 5000 pages',
      type: 'pages',
      targetValue: 5000,
      currentValue: 3850,
      deadline: '2025-12-31',
      priority: 'high',
      status: 'active',
      createdDate: '2025-01-01',
    },
    {
      id: '3',
      title: 'Read 3 fantasy books',
      type: 'genres',
      targetValue: 3,
      currentValue: 2,
      deadline: '2025-11-30',
      category: 'Fantasy',
      priority: 'medium',
      status: 'active',
      createdDate: '2025-08-15',
    },
    {
      id: '4',
      title: 'Read 100 hours this quarter',
      type: 'hours',
      targetValue: 100,
      currentValue: 78,
      deadline: '2025-12-31',
      priority: 'medium',
      status: 'active',
      createdDate: '2025-10-01',
    },
    {
      id: '5',
      title: 'Complete mystery novel series',
      type: 'books',
      targetValue: 5,
      currentValue: 5,
      deadline: '2025-09-30',
      priority: 'high',
      status: 'completed',
      createdDate: '2025-06-01',
    },
  ]

  const progressData: GoalProgress[] = [
    { week: 'Week 1', progress: 2, target: 6 },
    { week: 'Week 2', progress: 5, target: 6 },
    { week: 'Week 3', progress: 8, target: 6 },
    { week: 'Week 4', progress: 12, target: 6 },
    { week: 'Week 5', progress: 15, target: 6 },
    { week: 'Week 6', progress: 18, target: 6 },
  ]

  useEffect(() => {
    setGoals(mockGoals)
    setLoading(false)
  }, [])

  const handleCreateGoal = useCallback(() => {
    if (newGoal.title && newGoal.targetValue > 0 && newGoal.deadline) {
      const goal: ReadingGoal = {
        id: String(goals.length + 1),
        title: newGoal.title,
        type: newGoal.type,
        targetValue: newGoal.targetValue,
        currentValue: 0,
        deadline: newGoal.deadline,
        category: newGoal.category,
        priority: newGoal.priority,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
      }
      setGoals([...goals, goal])
      setShowCreateGoal(false)
      setNewGoal({
        title: '',
        type: 'books',
        targetValue: 0,
        deadline: '',
        category: '',
        priority: 'medium',
      })
    }
  }, [newGoal, goals])

  const handleUpdateProgress = useCallback(
    (goalId: string, newValue: number) => {
      setGoals(
        goals.map((goal) => {
          if (goal.id === goalId) {
            const updatedGoal = { ...goal, currentValue: Math.min(newValue, goal.targetValue) }
            if (updatedGoal.currentValue === updatedGoal.targetValue) {
              updatedGoal.status = 'completed'
            }
            return updatedGoal
          }
          return goal
        })
      )
    },
    [goals]
  )

  const handleDeleteGoal = useCallback(
    (goalId: string) => {
      setGoals(goals.filter((g) => g.id !== goalId))
    },
    [goals]
  )

  const filteredGoals = goals.filter((g) => {
    if (selectedTab === 'active') return g.status === 'active'
    if (selectedTab === 'completed') return g.status === 'completed'
    return true
  })

  const getProgressPercentage = (goal: ReadingGoal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'active':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-500 bg-opacity-20'
      case 'medium':
        return 'text-yellow-500 bg-yellow-500 bg-opacity-20'
      default:
        return 'text-blue-500 bg-blue-500 bg-opacity-20'
    }
  }

  const activeGoalsCount = goals.filter((g) => g.status === 'active').length
  const completedGoalsCount = goals.filter((g) => g.status === 'completed').length
  const averageProgress = goals.length > 0 ? Math.round((goals.reduce((sum, g) => sum + getProgressPercentage(g), 0) / goals.length)) : 0

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const accentColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-500" />
              <h1 className="text-4xl font-bold">Reading Goals</h1>
            </div>
            <button
              onClick={() => setShowCreateGoal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${accentColor} text-white transition`}
            >
              <Plus className="w-5 h-5" />
              New Goal
            </button>
          </div>
          <p className={`${textColor} text-lg`}>Track your reading goals and celebrate your achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Active Goals</p>
                <p className="text-3xl font-bold text-blue-500">{activeGoalsCount}</p>
              </div>
              <Target className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Completed</p>
                <p className="text-3xl font-bold text-green-500">{completedGoalsCount}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Avg Progress</p>
                <p className="text-3xl font-bold text-purple-500">{averageProgress}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textColor} text-sm`}>Total Goals</p>
                <p className="text-3xl font-bold text-orange-500">{goals.length}</p>
              </div>
              <Award className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {showCreateGoal && (
          <div className={`border ${cardColor} rounded-lg p-6 mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Create New Goal</h2>
              <button onClick={() => setShowCreateGoal(false)} className="p-1 hover:bg-slate-700 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                }`}
              />
              <select
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                }`}
              >
                <option value="books">Books</option>
                <option value="pages">Pages</option>
                <option value="hours">Hours</option>
                <option value="genres">Genres</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="number"
                placeholder="Target value"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                }`}
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                }`}
              />
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {newGoal.type === 'genres' && (
              <input
                type="text"
                placeholder="Genre category"
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                  theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                }`}
              />
            )}

            <div className="flex gap-3">
              <button onClick={handleCreateGoal} className={`px-6 py-2 rounded-lg ${accentColor} text-white transition`}>
                Create Goal
              </button>
              <button
                onClick={() => setShowCreateGoal(false)}
                className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={`lg:col-span-2 border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-xl font-bold mb-4">Progress Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="week" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                    border: `1px solid ${theme === 'dark' ? '#475569' : '#cbd5e1'}`,
                  }}
                />
                <Bar dataKey="progress" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-xl font-bold mb-4">Goal Distribution</h2>
            <div className="space-y-4">
              {goals.map((goal) => {
                const typeCounts = goals.reduce(
                  (acc, g) => {
                    acc[g.type] = (acc[g.type] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>
                )
                return null
              })}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Books</span>
                  <span className="text-sm font-semibold text-blue-500">
                    {goals.filter((g) => g.type === 'books').length}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Pages</span>
                  <span className="text-sm font-semibold text-purple-500">
                    {goals.filter((g) => g.type === 'pages').length}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Hours</span>
                  <span className="text-sm font-semibold text-green-500">
                    {goals.filter((g) => g.type === 'hours').length}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Genres</span>
                  <span className="text-sm font-semibold text-orange-500">
                    {goals.filter((g) => g.type === 'genres').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            {['overview', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedTab === tab
                    ? `${accentColor} text-white`
                    : theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className={`border ${cardColor} rounded-lg p-6 hover:shadow-lg transition`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{goal.title}</h3>
                    <p className={`${textColor} text-sm`}>{goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-slate-700 rounded">
                      <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-1 hover:bg-slate-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-bold">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${getProgressPercentage(goal)}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-400 mt-1">{Math.round(getProgressPercentage(goal))}% Complete</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)} text-white`}>
                      {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
