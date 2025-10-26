'use client'

import { useState, useEffect } from 'react'
import { analyticsAPI } from '@/lib/api'
import { BookOpen, Flame, TrendingUp, Award, Calendar, Heart, Clock, Target } from 'lucide-react'

interface YearReviewData {
  year: number
  total_books_read: number
  total_pages_read: number
  average_rating: number
  favorite_genre: string
  most_read_author: string
  longest_streak: number
  reading_time_hours: number
  mood_distribution: { mood: string; count: number }[]
  genre_distribution: { genre: string; count: number }[]
  reading_timeline: { month: string; books_read: number }[]
  top_rated_books: Array<{ title: string; rating: number }>
  reading_goals_met: number
  total_reading_goals: number
  achievements_unlocked: number
  completion_rate: number
}

export default function YearInReviewPage() {
  const [yearReview, setYearReview] = useState<YearReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  useEffect(() => {
    loadYearReview()
  }, [selectedYear])

  const loadYearReview = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await analyticsAPI.getYearReview(selectedYear)
      setYearReview(data)
    } catch (err) {
      setError('Failed to load year in review data')
      console.error('Year review error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading your year in review...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!yearReview) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
          <p className="text-slate-600 dark:text-slate-400">No data available for this year</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Your {selectedYear} in Books
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">A year-long journey through stories and imagination</p>
        </div>

        {/* Year Selector */}
        <div className="flex justify-center gap-2 mb-12">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedYear === year
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-600 dark:text-slate-400 font-medium">Books Read</h3>
              <BookOpen className="text-blue-500" size={28} />
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{yearReview.total_books_read}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {yearReview.total_pages_read} pages total
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-600 dark:text-slate-400 font-medium">Average Rating</h3>
              <Star className="text-yellow-500" size={28} />
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{yearReview.average_rating.toFixed(1)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">out of 5.0</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-600 dark:text-slate-400 font-medium">Reading Streak</h3>
              <Flame className="text-orange-500" size={28} />
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{yearReview.longest_streak}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">days longest streak</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-600 dark:text-slate-400 font-medium">Reading Time</h3>
              <Clock className="text-purple-500" size={28} />
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{Math.round(yearReview.reading_time_hours)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">hours reading</p>
          </div>
        </div>

        {/* Goal & Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900 dark:text-white">Goals Met</h3>
              <Target className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {yearReview.reading_goals_met}/{yearReview.total_reading_goals}
            </p>
            <div className="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(yearReview.reading_goals_met / yearReview.total_reading_goals) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900 dark:text-white">Achievements</h3>
              <Award className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{yearReview.achievements_unlocked}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">badges earned</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900 dark:text-white">Completion Rate</h3>
              <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{(yearReview.completion_rate * 100).toFixed(0)}%</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">of started books</p>
          </div>
        </div>

        {/* Favorite Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="text-red-500" size={20} />
              Favorite Genre
            </h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white capitalize mb-2">{yearReview.favorite_genre}</p>
            <p className="text-slate-600 dark:text-slate-400">Your most explored genre this year</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-purple-500" size={20} />
              Most Read Author
            </h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{yearReview.most_read_author}</p>
            <p className="text-slate-600 dark:text-slate-400">Your favorite author by books read</p>
          </div>
        </div>

        {/* Genre Distribution */}
        {yearReview.genre_distribution && yearReview.genre_distribution.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-12">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Genre Breakdown</h3>
            <div className="space-y-4">
              {yearReview.genre_distribution.map((genre, index) => {
                const maxCount = Math.max(...yearReview.genre_distribution.map(g => g.count))
                const percentage = (genre.count / maxCount) * 100
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 dark:text-slate-300 font-medium capitalize">{genre.genre}</span>
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">{genre.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Mood Distribution */}
        {yearReview.mood_distribution && yearReview.mood_distribution.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-12">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Your Reading Moods</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {yearReview.mood_distribution.map((mood, index) => {
                const colors = ['from-yellow-400 to-orange-400', 'from-blue-400 to-indigo-400', 'from-pink-400 to-red-400', 'from-green-400 to-emerald-400', 'from-purple-400 to-pink-400']
                return (
                  <div key={index} className={`bg-gradient-to-br ${colors[index % colors.length]} rounded-lg p-4 text-white shadow-lg`}>
                    <p className="text-sm font-medium opacity-90 capitalize">{mood.mood}</p>
                    <p className="text-2xl font-bold">{mood.count}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Top Rated Books */}
        {yearReview.top_rated_books && yearReview.top_rated_books.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-12">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Your Top Rated Books</h3>
            <div className="space-y-3">
              {yearReview.top_rated_books.slice(0, 5).map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400 w-6">{index + 1}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{book.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold text-slate-900 dark:text-white">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Reading Timeline */}
        {yearReview.reading_timeline && yearReview.reading_timeline.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar size={20} />
              Your Reading Timeline
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {yearReview.reading_timeline.map((month, index) => {
                const maxBooks = Math.max(...yearReview.reading_timeline.map(m => m.books_read))
                const height = (month.books_read / maxBooks) * 100
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="w-8 bg-slate-200 dark:bg-slate-700 rounded-t relative overflow-hidden" style={{ height: '100px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all"
                        style={{ height: `${Math.max(height, 10)}%`, minHeight: '10px' }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{month.books_read}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 text-center">{month.month.slice(0, 3)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
