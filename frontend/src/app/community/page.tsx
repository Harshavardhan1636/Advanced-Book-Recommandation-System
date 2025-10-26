'use client'

import { useState, useEffect } from 'react'
import { userAPI, gamificationAPI } from '@/lib/api'
import { Users, Trophy, Heart, MessageCircle, BookOpen, TrendingUp, Search, Plus } from 'lucide-react'

interface User {
  id: string
  name: string
  avatar?: string
  bio?: string
  books_read: number
  rating: number
  genres: string[]
  streak?: number
}

interface Leaderboard {
  rank: number
  user: User
  score: number
  change?: number
}

interface Challenge {
  id: string
  name: string
  description: string
  goal: number
  current: number
  participants: number
  duration_days: number
  reward?: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'network' | 'leaderboards' | 'challenges' | 'clubs'>('network')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [similarUsers, setSimilarUsers] = useState<User[]>([])
  const [leaderboards, setLeaderboards] = useState<{ [key: string]: Leaderboard[] }>({})
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('books_read')
  const [myConnections, setMyConnections] = useState<User[]>([])

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = async () => {
    setLoading(true)
    setError(null)
    try {
      const userId = 1

      const [
        similarUsersData,
        booksLeaderboard,
        streakLeaderboard,
        pointsLeaderboard,
        reviewsLeaderboard,
        challengesData,
        connections
      ] = await Promise.all([
        userAPI.getSimilarUsers ? userAPI.getSimilarUsers().catch(() => []) : Promise.resolve([]),
        gamificationAPI.getLeaderboard('books_read').catch(() => []),
        gamificationAPI.getLeaderboard('streak').catch(() => []),
        gamificationAPI.getLeaderboard('points').catch(() => []),
        gamificationAPI.getLeaderboard('reviews').catch(() => []),
        gamificationAPI.createCompetition('', '', 30, 'books', 12).catch(() => []),
        userAPI.getProfile ? userAPI.getProfile().catch(() => []) : Promise.resolve([]),
      ])

      setSimilarUsers(similarUsersData.users || [])
      setLeaderboards({
        books_read: booksLeaderboard.leaderboard || [],
        streak: streakLeaderboard.leaderboard || [],
        points: pointsLeaderboard.leaderboard || [],
        reviews: reviewsLeaderboard.leaderboard || [],
      })
      setChallenges([
        {
          id: '1',
          name: 'October Reading Marathon',
          description: 'Read 5 books this month and compete for glory',
          goal: 5,
          current: 2,
          participants: 1245,
          duration_days: 7,
          reward: '🏆 Special Badge + 500 Points',
        },
        {
          id: '2',
          name: 'Mystery Month',
          description: 'Read as many mystery books as possible',
          goal: 3,
          current: 1,
          participants: 892,
          duration_days: 14,
          reward: '🔍 Detective Badge + 300 Points',
        },
        {
          id: '3',
          name: '100-Day Reading Challenge',
          description: 'Maintain a 100-day reading streak',
          goal: 100,
          current: 45,
          participants: 567,
          duration_days: 56,
          reward: '🔥 Century Badge + 1000 Points',
        },
      ])
      setMyConnections(similarUsersData.users?.slice(0, 5) || [])
    } catch (err) {
      setError('Failed to load community data')
      console.error('Community error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = (userId: string) => {
    console.log('Connecting to user:', userId)
  }

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId)
  }

  const filteredUsers = similarUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading community...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">BookHub Community</h1>
          <p className="text-slate-600 dark:text-slate-400">Connect with readers, compete, and grow together</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'network', label: 'Network', icon: Users },
            { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
            { id: 'challenges', label: 'Challenges', icon: TrendingUp },
            { id: 'clubs', label: 'Book Clubs', icon: MessageCircle },
          ].map(tab => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <TabIcon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-8">
            {/* My Connections */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Heart className="text-red-500" size={24} />
                My Connections ({myConnections.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {myConnections.map(user => (
                  <div
                    key={user.id}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-600 hover:shadow-lg transition"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{user.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{user.books_read} books read</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded text-xs font-medium hover:bg-slate-300 transition">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Similar Readers */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Users className="text-blue-500" size={24} />
                Find Similar Readers
              </h2>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-slate-600 dark:text-slate-400">
                    No readers found matching your search
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">⭐ {user.rating.toFixed(1)} rating</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">{user.bio}</p>

                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                        <p>{user.books_read} books • {user.streak || 0} day streak</p>
                        <p className="mt-1 text-purple-600 dark:text-purple-400">{user.genres?.join(', ')}</p>
                      </div>

                      <button
                        onClick={() => handleConnect(user.id)}
                        className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Connect
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboards Tab */}
        {activeTab === 'leaderboards' && (
          <div className="space-y-8">
            {/* Leaderboard Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'books_read', label: 'Books Read', icon: '📚' },
                { id: 'streak', label: 'Reading Streak', icon: '🔥' },
                { id: 'points', label: 'Points', icon: '⭐' },
                { id: 'reviews', label: 'Reviews', icon: '✍️' },
              ].map(board => (
                <button
                  key={board.id}
                  onClick={() => setSelectedLeaderboard(board.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    selectedLeaderboard === board.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-purple-300'
                  }`}
                >
                  <span>{board.icon}</span>
                  {board.label}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            {leaderboards[selectedLeaderboard] && leaderboards[selectedLeaderboard].length > 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Rank</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Reader</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Score</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboards[selectedLeaderboard].slice(0, 20).map((entry, index) => (
                        <tr
                          key={entry.user.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {entry.rank <= 3 ? (
                                <span className="text-2xl">
                                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                </span>
                              ) : (
                                <span className="font-bold text-slate-600 dark:text-slate-400">{entry.rank}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                {entry.user.name.charAt(0)}
                              </div>
                              <span className="font-medium text-slate-900 dark:text-white">{entry.user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{entry.score}</td>
                          <td className="px-6 py-4">
                            {entry.change ? (
                              <span className={entry.change > 0 ? 'text-green-600' : 'text-red-600'}>
                                {entry.change > 0 ? '↑' : '↓'} {Math.abs(entry.change)}
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center text-slate-600 dark:text-slate-400">
                No leaderboard data available
              </div>
            )}
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex-1">{challenge.name}</h3>
                  <TrendingUp className="text-purple-600" size={20} />
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{challenge.description}</p>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {challenge.current}/{challenge.goal}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${(challenge.current / challenge.goal) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div>👥 {challenge.participants} participants</div>
                    <div>⏱️ {challenge.duration_days} days left</div>
                  </div>
                </div>

                {challenge.reward && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded mb-4 text-xs text-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                    {challenge.reward}
                  </div>
                )}

                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Book Clubs Tab */}
        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {['Mystery Lovers Club', 'Sci-Fi Discussion Group', 'Classic Literature Society', 'Indie Authors Circle'][i - 1]}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {[234, 156, 389, 127][i - 1]} members
                    </p>
                  </div>
                  <BookOpen className="text-purple-600" size={24} />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                  {['Discuss the latest mysteries and thrilling whodunits', 'Share and explore futuristic worlds', 'Explore timeless classics and their impact', 'Support and celebrate independent authors'][i - 1]}
                </p>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Current Book</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {['The Girl with the Dragon Tattoo', 'Dune', 'Pride and Prejudice', 'The Midnight Library'][i - 1]}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                    Join Club
                  </button>
                  <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
