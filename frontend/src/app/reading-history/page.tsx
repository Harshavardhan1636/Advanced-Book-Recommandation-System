'use client'

import { useState, useEffect } from 'react'
import { userAPI } from '@/lib/api'
import { Calendar, Filter, Search, Download, Eye, Star, Clock, BookOpen } from 'lucide-react'

interface HistoryEntry {
  book_id: string
  title: string
  author: string
  cover_url?: string
  date_added: string
  date_completed?: string
  status: 'reading' | 'completed' | 'abandoned'
  rating?: number
  review?: string
  reading_time_minutes?: number
  genre?: string
  pages_read?: number
  total_pages?: number
}

export default function ReadingHistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'reading' | 'completed' | 'abandoned'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'rating' | 'title'>('recent')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [genreFilter, setGenreFilter] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  const genres = ['fiction', 'non-fiction', 'mystery', 'romance', 'sci-fi', 'fantasy', 'thriller', 'biography', 'history', 'science']
  const statuses = ['reading', 'completed', 'abandoned']

  useEffect(() => {
    loadReadingHistory()
  }, [])

  const loadReadingHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userAPI.getReadingHistory()
      setHistory(data.history || [])
      applyFilters(data.history || [], searchQuery, statusFilter, dateRange, genreFilter, sortBy)
    } catch (err) {
      setError('Failed to load reading history')
      console.error('Reading history error:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (data: HistoryEntry[], query: string, status: string, dates: any, genres: string[], sort: string) => {
    let filtered = [...data]

    // Search
    if (query) {
      filtered = filtered.filter(
        entry => 
          entry.title.toLowerCase().includes(query.toLowerCase()) ||
          entry.author.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter(entry => entry.status === status)
    }

    // Genre filter
    if (genres.length > 0) {
      filtered = filtered.filter(entry => entry.genre && genres.includes(entry.genre))
    }

    // Date range
    if (dates.from || dates.to) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date_added)
        const fromDate = dates.from ? new Date(dates.from) : null
        const toDate = dates.to ? new Date(dates.to) : null
        
        if (fromDate && entryDate < fromDate) return false
        if (toDate && entryDate > toDate) return false
        return true
      })
    }

    // Sort
    if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime())
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredHistory(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    applyFilters(history, query, statusFilter, dateRange, genreFilter, sortBy)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status as any)
    applyFilters(history, searchQuery, status, dateRange, genreFilter, sortBy)
  }

  const handleGenreToggle = (genre: string) => {
    const newGenres = genreFilter.includes(genre)
      ? genreFilter.filter(g => g !== genre)
      : [...genreFilter, genre]
    setGenreFilter(newGenres)
    applyFilters(history, searchQuery, statusFilter, dateRange, newGenres, sortBy)
  }

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    const newDateRange = { ...dateRange, [type]: value }
    setDateRange(newDateRange)
    applyFilters(history, searchQuery, statusFilter, newDateRange, genreFilter, sortBy)
  }

  const handleSort = (sort: string) => {
    setSortBy(sort as any)
    applyFilters(history, searchQuery, statusFilter, dateRange, genreFilter, sort)
  }

  const exportHistory = () => {
    const csv = [
      ['Title', 'Author', 'Status', 'Added Date', 'Completed Date', 'Rating', 'Pages Read', 'Genre'],
      ...filteredHistory.map(entry => [
        entry.title,
        entry.author,
        entry.status,
        entry.date_added,
        entry.date_completed || 'N/A',
        entry.rating || 'N/A',
        entry.pages_read ? `${entry.pages_read}/${entry.total_pages}` : 'N/A',
        entry.genre || 'N/A'
      ])
    ]

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reading-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const stats = {
    totalBooks: history.length,
    completedBooks: history.filter(h => h.status === 'completed').length,
    currentlyReading: history.filter(h => h.status === 'reading').length,
    averageRating: history.filter(h => h.rating).length > 0
      ? (history.filter(h => h.rating).reduce((sum, h) => sum + (h.rating || 0), 0) / history.filter(h => h.rating).length).toFixed(1)
      : 0,
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading reading history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Reading History</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your reading journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Books</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalBooks}</p>
              </div>
              <BookOpen className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedBooks}</p>
              </div>
              <Eye className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Reading</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.currentlyReading}</p>
              </div>
              <Clock className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageRating}</p>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Filter size={20} />
              Filters & Search
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {showFilters ? 'Hide' : 'Show'}
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Search size={16} className="inline mr-2" />
                  Search Books
                </label>
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusFilter('all')}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${
                        statusFilter === 'all'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      All
                    </button>
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusFilter(status)}
                        className={`px-3 py-1 rounded text-sm font-medium transition capitalize ${
                          statusFilter === status
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rating">Highest Rating</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => handleDateChange('from', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => handleDateChange('to', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition capitalize ${
                        genreFilter.includes(genre)
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={exportHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Items */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <BookOpen className="mx-auto text-slate-400 mb-3" size={48} />
              <p className="text-slate-600 dark:text-slate-400">No books found matching your filters</p>
            </div>
          ) : (
            filteredHistory.map((entry) => (
              <div
                key={entry.book_id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition"
              >
                <div className="flex gap-4">
                  {entry.cover_url && (
                    <img
                      src={entry.cover_url}
                      alt={entry.title}
                      className="w-24 h-32 object-cover rounded-lg hidden sm:block"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">by {entry.author}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        entry.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : entry.status === 'reading'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                      {entry.genre && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Genre</p>
                          <p className="text-slate-900 dark:text-white capitalize">{entry.genre}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Added</p>
                        <p className="text-slate-900 dark:text-white">{new Date(entry.date_added).toLocaleDateString()}</p>
                      </div>
                      {entry.rating && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Rating</p>
                          <p className="text-slate-900 dark:text-white flex items-center gap-1">
                            <Star size={14} className="text-yellow-500" />
                            {entry.rating.toFixed(1)}
                          </p>
                        </div>
                      )}
                      {entry.pages_read && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Progress</p>
                          <p className="text-slate-900 dark:text-white">{entry.pages_read}/{entry.total_pages}</p>
                        </div>
                      )}
                    </div>

                    {entry.review && (
                      <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
                        <p className="font-medium mb-1">Your Review:</p>
                        <p>{entry.review}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Info */}
        {filteredHistory.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredHistory.length} of {history.length} books
          </div>
        )}
      </div>
    </div>
  )
}
