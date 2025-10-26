'use client'

import { useEffect, useState } from 'react'
import { gamificationAPI } from '@/lib/api'
import Loading from '@/components/loading'
import { Award, Flame, Star, Trophy, TrendingUp } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  points: number
  icon: string
  unlocked?: boolean
}

interface LeaderboardEntry {
  rank: number
  username: string
  value: number
  avatar?: string
}

interface StreakData {
  current_streak: number
  longest_streak: number
  last_activity: string
}

interface Points {
  total_points: number
  level: number
  recent_history: Array<{ event: string; points: number; date: string }>
}

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'streak' | 'points'>('achievements')
  const [leaderboardType, setLeaderboardType] = useState('books_read')
  
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [points, setPoints] = useState<Points | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = 1

  useEffect(() => {
    loadGamificationData()
  }, [])

  const loadGamificationData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [achData, leaderData, streakData, pointsData] = await Promise.all([
        gamificationAPI.getAchievements(userId).catch(() => ({ earned_achievements: [] })),
        gamificationAPI.getLeaderboard(leaderboardType, 10).catch(() => ({ rankings: [] })),
        gamificationAPI.getStreak(userId).catch(() => null),
        gamificationAPI.getPoints(userId).catch(() => null)
      ])

      setAchievements(achData.earned_achievements || [])
      setLeaderboard(leaderData.rankings || [])
      setStreak(streakData)
      setPoints(pointsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load gamification data')
    } finally {
      setLoading(false)
    }
  }

  const handleLeaderboardChange = async (type: string) => {
    setLeaderboardType(type)
    try {
      const data = await gamificationAPI.getLeaderboard(type, 10)
      setLeaderboard(data.rankings || [])
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
    }
  }

  const handleRecordActivity = async () => {
    try {
      const data = await gamificationAPI.recordActivity(userId)
      setPoints(prev => prev ? { ...prev, total_points: data.total_points } : null)
      setStreak(prev => prev ? { ...prev, current_streak: prev.current_streak + 1 } : null)
    } catch (err: any) {
      setError(err.message || 'Failed to record activity')
    }
  }

  if (loading) return <Loading />

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎮 Gamification Hub</h1>
          <p className="text-muted-foreground">Track your reading achievements, compete with others, and earn rewards</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive rounded-lg p-4 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-foreground">{streak?.current_streak || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">days</p>
              </div>
              <Flame className="text-orange-500" size={40} />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-3xl font-bold text-foreground">{streak?.longest_streak || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">days</p>
              </div>
              <TrendingUp className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold text-foreground">{points?.total_points || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Level {points?.level || 1}
                </p>
              </div>
              <Star className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-3xl font-bold text-foreground">{achievements.length}</p>
                <p className="text-xs text-muted-foreground mt-1">unlocked</p>
              </div>
              <Award className="text-purple-500" size={40} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-border">
          {['achievements', 'leaderboard', 'streak', 'points'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 font-medium text-sm transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'achievements' && '🏆 Achievements'}
              {tab === 'leaderboard' && '🥇 Leaderboard'}
              {tab === 'streak' && '🔥 Streaks'}
              {tab === 'points' && '⭐ Points'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-500">
                        <Star size={16} /> {achievement.points} pts
                      </span>
                      <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                        ✓ Unlocked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <div className="flex gap-2 mb-6">
              {['books_read', 'streak', 'points', 'reviews'].map(type => (
                <button
                  key={type}
                  onClick={() => handleLeaderboardChange(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    leaderboardType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {type === 'books_read' && '📚 Books Read'}
                  {type === 'streak' && '🔥 Streaks'}
                  {type === 'points' && '⭐ Points'}
                  {type === 'reviews' && '✍️ Reviews'}
                </button>
              ))}
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leaderboard.map((entry, idx) => (
                      <tr key={idx} className={idx === 0 ? 'bg-yellow-50/10' : idx === 1 ? 'bg-gray-50/10' : ''}>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium">
                          {entry.rank === 1 && '🥇 '}
                          {entry.rank === 2 && '🥈 '}
                          {entry.rank === 3 && '🥉 '}
                          {entry.username}
                        </td>
                        <td className="px-6 py-4 text-right text-foreground font-bold">{entry.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'streak' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="text-center">
                <Flame className="text-orange-500 mx-auto mb-4" size={80} />
                <h2 className="text-3xl font-bold text-foreground mb-2">Current Streak</h2>
                <p className="text-5xl font-bold text-orange-500 mb-4">{streak?.current_streak || 0}</p>
                <p className="text-muted-foreground mb-6">Keep reading to maintain your streak!</p>
                <button
                  onClick={handleRecordActivity}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
                >
                  📖 Log Reading Activity
                </button>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Streak Records</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Longest Streak</span>
                  <span className="text-2xl font-bold text-foreground">{streak?.longest_streak || 0} days</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="text-foreground font-medium">{streak?.last_activity || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Next Milestone</span>
                  <span className="text-foreground font-medium">{((streak?.longest_streak || 0) + 10)} days 🎯</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-card rounded-lg border border-border p-8">
              <div className="text-center">
                <Star className="text-yellow-500 mx-auto mb-4" size={80} />
                <h2 className="text-3xl font-bold text-foreground mb-2">Your Points</h2>
                <p className="text-5xl font-bold text-yellow-500 mb-2">{points?.total_points || 0}</p>
                <p className="text-muted-foreground">Level {points?.level || 1}</p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {points?.recent_history && points.recent_history.length > 0 ? (
                  points.recent_history.map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{entry.event}</p>
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                      </div>
                      <span className="text-lg font-bold text-yellow-500">+{entry.points}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent activity. Start reading to earn points!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
