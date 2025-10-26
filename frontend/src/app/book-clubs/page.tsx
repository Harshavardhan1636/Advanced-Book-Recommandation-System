'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Users, BookOpen, Calendar, MessageCircle, Plus, Search, Filter, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface BookClub {
  id: string
  name: string
  currentBook: {
    title: string
    author: string
    coverUrl: string
  }
  members: number
  maxMembers: number
  meetingSchedule: string
  nextMeetingDate: string
  genre: string
  description: string
  joinedByUser: boolean
  discussionTopics: string[]
}

export default function BookClubsPage() {
  const { theme } = useTheme()
  const [clubs, setClubs] = useState<BookClub[]>([])
  const [filteredClubs, setFilteredClubs] = useState<BookClub[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [showCreateClub, setShowCreateClub] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedClub, setSelectedClub] = useState<BookClub | null>(null)
  const [newClubData, setNewClubData] = useState({
    name: '',
    description: '',
    genre: '',
    maxMembers: 30,
    meetingSchedule: 'weekly',
  })

  const mockClubs: BookClub[] = [
    {
      id: '1',
      name: 'Classic Literature Enthusiasts',
      currentBook: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=300&fit=crop',
      },
      members: 24,
      maxMembers: 30,
      meetingSchedule: 'Every Sunday 7 PM EST',
      nextMeetingDate: '2025-10-31',
      genre: 'Classic',
      description: 'Discussing timeless classics and their cultural impact',
      joinedByUser: true,
      discussionTopics: ['Character Development', 'Historical Context', 'Writing Style'],
    },
    {
      id: '2',
      name: 'Mystery & Thriller Club',
      currentBook: {
        title: 'The Girl on the Train',
        author: 'Paula Hawkins',
        coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=200&h=300&fit=crop',
      },
      members: 18,
      maxMembers: 25,
      meetingSchedule: 'Every other Saturday 8 PM EST',
      nextMeetingDate: '2025-11-01',
      genre: 'Mystery',
      description: 'Fast-paced mysteries and page-turning thrillers',
      joinedByUser: false,
      discussionTopics: ['Plot Twists', 'Suspense', 'Detective Work'],
    },
    {
      id: '3',
      name: 'Science Fiction Dreamers',
      currentBook: {
        title: 'Dune',
        author: 'Frank Herbert',
        coverUrl: 'https://images.unsplash.com/photo-1497206365907-4d71bcdd2085?w=200&h=300&fit=crop',
      },
      members: 32,
      maxMembers: 40,
      meetingSchedule: 'Every Friday 9 PM EST',
      nextMeetingDate: '2025-10-31',
      genre: 'Science Fiction',
      description: 'Exploring futuristic worlds and cosmic adventures',
      joinedByUser: true,
      discussionTopics: ['World Building', 'Technology', 'Philosophies'],
    },
    {
      id: '4',
      name: 'Fantasy & Magic Circle',
      currentBook: {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e3ffe02?w=200&h=300&fit=crop',
      },
      members: 28,
      maxMembers: 35,
      meetingSchedule: 'Every Wednesday 7:30 PM EST',
      nextMeetingDate: '2025-10-29',
      genre: 'Fantasy',
      description: 'Magical realms, epic quests, and fantasy adventures',
      joinedByUser: false,
      discussionTopics: ['Magic Systems', 'Quests', 'Character Arcs'],
    },
    {
      id: '5',
      name: 'Contemporary Romance Readers',
      currentBook: {
        title: 'It Ends with Us',
        author: 'Colleen Hoover',
        coverUrl: 'https://images.unsplash.com/photo-1501979915551-4e8d30928351?w=200&h=300&fit=crop',
      },
      members: 41,
      maxMembers: 45,
      meetingSchedule: 'Every Monday 8 PM EST',
      nextMeetingDate: '2025-10-27',
      genre: 'Romance',
      description: 'Modern love stories and emotional connections',
      joinedByUser: true,
      discussionTopics: ['Relationships', 'Character Chemistry', 'Emotions'],
    },
    {
      id: '6',
      name: 'Non-Fiction Mind Sharers',
      currentBook: {
        title: 'Educated',
        author: 'Tara Westover',
        coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop',
      },
      members: 15,
      maxMembers: 20,
      meetingSchedule: 'Every other Tuesday 7 PM EST',
      nextMeetingDate: '2025-11-04',
      genre: 'Non-Fiction',
      description: 'Real stories, learning, and personal development',
      joinedByUser: false,
      discussionTopics: ['Life Lessons', 'Facts', 'Personal Growth'],
    },
  ]

  useEffect(() => {
    setClubs(mockClubs)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = clubs

    if (searchQuery) {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.currentBook.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter((club) => club.genre === selectedGenre)
    }

    setFilteredClubs(filtered)
  }, [searchQuery, selectedGenre, clubs])

  const handleCreateClub = useCallback(() => {
    if (newClubData.name && newClubData.description && newClubData.genre) {
      const newClub: BookClub = {
        id: String(clubs.length + 1),
        name: newClubData.name,
        description: newClubData.description,
        genre: newClubData.genre,
        currentBook: {
          title: 'Not yet selected',
          author: 'TBD',
          coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=300&fit=crop',
        },
        members: 1,
        maxMembers: newClubData.maxMembers,
        meetingSchedule: newClubData.meetingSchedule,
        nextMeetingDate: '',
        joinedByUser: true,
        discussionTopics: [],
      }
      setClubs([...clubs, newClub])
      setShowCreateClub(false)
      setNewClubData({
        name: '',
        description: '',
        genre: '',
        maxMembers: 30,
        meetingSchedule: 'weekly',
      })
    }
  }, [newClubData, clubs])

  const handleJoinClub = useCallback(
    (club: BookClub) => {
      if (club.members < club.maxMembers && !club.joinedByUser) {
        setClubs(
          clubs.map((c) =>
            c.id === club.id ? { ...c, members: c.members + 1, joinedByUser: true } : c
          )
        )
        setShowJoinModal(false)
      }
    },
    [clubs]
  )

  const genres = ['all', 'Classic', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Non-Fiction']

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
              <Users className="w-8 h-8 text-blue-500" />
              <h1 className="text-4xl font-bold">Book Clubs</h1>
            </div>
            <button
              onClick={() => setShowCreateClub(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${accentColor} text-white transition`}
            >
              <Plus className="w-5 h-5" />
              Create Club
            </button>
          </div>
          <p className={`${textColor} text-lg`}>Join a community of book enthusiasts and discuss your favorite reads</p>
        </div>

        {showCreateClub && (
          <div className={`border ${cardColor} rounded-lg p-6 mb-8 backdrop-blur-sm`}>
            <h2 className="text-2xl font-bold mb-4">Create a New Book Club</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Club Name"
                value={newClubData.name}
                onChange={(e) => setNewClubData({ ...newClubData, name: e.target.value })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-black'
                }`}
              />
              <select
                value={newClubData.genre}
                onChange={(e) => setNewClubData({ ...newClubData, genre: e.target.value })}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-black'
                }`}
              >
                <option value="">Select Genre</option>
                {genres.filter((g) => g !== 'all').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Club Description"
              value={newClubData.description}
              onChange={(e) => setNewClubData({ ...newClubData, description: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-black'
              }`}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">Max Members</label>
                <input
                  type="number"
                  value={newClubData.maxMembers}
                  onChange={(e) => setNewClubData({ ...newClubData, maxMembers: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-black'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Meeting Schedule</label>
                <select
                  value={newClubData.meetingSchedule}
                  onChange={(e) => setNewClubData({ ...newClubData, meetingSchedule: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-black'
                  }`}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateClub}
                className={`px-6 py-2 rounded-lg ${accentColor} text-white transition`}
              >
                Create Club
              </button>
              <button
                onClick={() => setShowCreateClub(false)}
                className="px-6 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-black'
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-black'
              }`}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === 'all' ? 'All Genres' : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className={`border ${cardColor} rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1`}
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                  <p className={`${textColor} text-sm mb-4`}>{club.description}</p>

                  <div className="mb-4 pb-4 border-b border-slate-700">
                    <h4 className="font-semibold mb-2">Currently Reading</h4>
                    <p className="font-medium text-blue-400">{club.currentBook.title}</p>
                    <p className={`${textColor} text-sm`}>by {club.currentBook.author}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>
                        {club.members}/{club.maxMembers} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{club.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>Next: {new Date(club.nextMeetingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Discussion Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.discussionTopics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {club.joinedByUser ? (
                    <button className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Joined
                    </button>
                  ) : club.members < club.maxMembers ? (
                    <button
                      onClick={() => {
                        setSelectedClub(club)
                        setShowJoinModal(true)
                      }}
                      className={`w-full py-2 rounded-lg ${accentColor} text-white transition`}
                    >
                      Join Club
                    </button>
                  ) : (
                    <button className="w-full py-2 rounded-lg bg-gray-600 text-white cursor-not-allowed transition">
                      Club Full
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showJoinModal && selectedClub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${cardColor} border rounded-lg p-6 max-w-md w-full`}>
              <h2 className="text-2xl font-bold mb-4">Join {selectedClub.name}?</h2>
              <p className={`${textColor} mb-6`}>
                You're about to join a community discussing{' '}
                <span className="text-blue-400 font-semibold">{selectedClub.currentBook.title}</span>. Meetings are{' '}
                <span className="text-blue-400 font-semibold">{selectedClub.meetingSchedule}</span>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleJoinClub(selectedClub)}
                  className={`flex-1 py-2 rounded-lg ${accentColor} text-white transition`}
                >
                  Join Club
                </button>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
