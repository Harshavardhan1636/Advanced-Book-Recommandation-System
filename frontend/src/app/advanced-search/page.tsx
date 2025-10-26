'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { bookAPI } from '@/lib/api'
import BookCard from '@/components/book-card'
import Loading from '@/components/loading'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchFilters {
  query: string
  yearMin?: number
  yearMax?: number
  ratingMin?: number
  genres?: string[]
  length?: 'short' | 'medium' | 'long'
  difficulty?: 'easy' | 'medium' | 'hard'
  mood?: string
}

interface Book {
  title: string
  authors: string[]
  year: number
  rating?: number
  cover_url?: string
  work_id?: string
  description?: string
}

const moods = ['happy', 'sad', 'adventurous', 'thoughtful', 'relaxed']
const genres = ['fiction', 'non-fiction', 'mystery', 'romance', 'sci-fi', 'fantasy', 'thriller', 'biography']

export default function AdvancedSearchPage() {
  const router = useRouter()
  const [searchMode, setSearchMode] = useState<'natural' | 'smart' | 'simple'>('natural')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    yearMin: 1900,
    yearMax: new Date().getFullYear(),
    ratingMin: 0,
    genres: [],
    mood: '',
  })

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { setTarget } = useIntersectionObserver(() => loadMore())

  const loadSuggestions = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const data = await bookAPI.getSearchSuggestions(q, 5)
      setSuggestions(data.suggestions || [])
    } catch (err) {
      console.error('Failed to load suggestions:', err)
    }
  }, [])

  const performSearch = useCallback(async (filtersToUse?: SearchFilters, searchOffset: number = 0) => {
    if (!debouncedQuery && !filters.query) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchQuery = debouncedQuery || filters.query
      let results

      if (searchMode === 'natural') {
        results = await bookAPI.naturalLanguageSearch(searchQuery)
      } else if (searchMode === 'smart') {
        const smartFilters: any = {}
        if (filters.genres?.length) smartFilters.genres = filters.genres
        if (filters.yearMin) smartFilters.year_min = filters.yearMin
        if (filters.yearMax) smartFilters.year_max = filters.yearMax
        if (filters.ratingMin) smartFilters.rating_min = filters.ratingMin
        if (filters.length) smartFilters.length = filters.length
        if (filters.difficulty) smartFilters.difficulty = filters.difficulty
        if (filters.mood) smartFilters.mood = filters.mood
        
        results = await bookAPI.smartFilter(searchQuery, smartFilters, 20)
      } else {
        results = await bookAPI.search(
          searchQuery,
          filters.yearMin,
          filters.yearMax,
          filters.ratingMin,
          20
        )
      }

      if (searchOffset === 0) {
        setBooks(results || [])
      } else {
        setBooks(prev => [...prev, ...(results || [])])
      }

      setOffset(searchOffset + 20)
      setHasMore((results || []).length >= 20)
    } catch (err: any) {
      setError(err.message || 'Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, filters, searchMode])

  const loadMore = useCallback(() => {
    if (!loading && hasMore && books.length > 0) {
      performSearch(filters, offset)
    }
  }, [loading, hasMore, books.length, filters, offset, performSearch])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
    setBooks([])
    await performSearch(filters, 0)
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setFilters(prev => ({ ...prev, query: value }))
    loadSuggestions(value)
  }

  const handleYearChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, yearMin: min, yearMax: max }))
  }

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({ ...prev, ratingMin: rating }))
  }

  const handleGenreToggle = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres?.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...(prev.genres || []), genre]
    }))
  }

  const handleMoodSelect = (mood: string) => {
    setFilters(prev => ({ ...prev, mood: prev.mood === mood ? '' : mood }))
  }

  const handleLengthChange = (length: 'short' | 'medium' | 'long' | '') => {
    setFilters(prev => ({ ...prev, length: length as any }))
  }

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard' | '') => {
    setFilters(prev => ({ ...prev, difficulty: difficulty as any }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      yearMin: 1900,
      yearMax: new Date().getFullYear(),
      ratingMin: 0,
      genres: [],
      mood: '',
    })
    setQuery('')
    setSuggestions([])
    setBooks([])
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Advanced Search</h1>
          <p className="text-muted-foreground">Find your next great read with powerful search & filters</p>
        </div>

        {/* Search Mode Selector */}
        <div className="flex gap-4 mb-6">
          {(['natural', 'smart', 'simple'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setSearchMode(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchMode === mode
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {mode === 'natural' ? '🤖 NLP Search' : mode === 'smart' ? '✨ Smart Filters' : '🔍 Simple'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="space-y-6 mb-8">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder={
                searchMode === 'natural'
                  ? 'e.g., "books like Harry Potter but darker"'
                  : 'Search for books, authors, genres...'
              }
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-input rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setQuery(suggestion)
                      setFilters(prev => ({ ...prev, query: suggestion }))
                      setSuggestions([])
                    }}
                    className="px-4 py-2 hover:bg-accent cursor-pointer text-foreground"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-primary hover:underline font-medium"
          >
            {showFilters ? '▼' : '▶'} {showFilters ? 'Hide' : 'Show'} Filters ({filters.genres?.length || 0} applied)
          </button>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-secondary/50 rounded-lg border border-input">
              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Year Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.yearMin}
                    onChange={(e) => handleYearChange(parseInt(e.target.value), filters.yearMax!)}
                    min="1000"
                    max={new Date().getFullYear()}
                    className="flex-1 px-3 py-2 rounded border border-input bg-background text-foreground"
                    placeholder="Min"
                  />
                  <span className="flex items-center text-muted-foreground">-</span>
                  <input
                    type="number"
                    value={filters.yearMax}
                    onChange={(e) => handleYearChange(filters.yearMin!, parseInt(e.target.value))}
                    min="1000"
                    max={new Date().getFullYear()}
                    className="flex-1 px-3 py-2 rounded border border-input bg-background text-foreground"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Minimum Rating</label>
                <select
                  value={filters.ratingMin || 0}
                  onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-foreground"
                >
                  {[0, 3, 3.5, 4, 4.5, 5].map(rating => (
                    <option key={rating} value={rating}>
                      {rating === 0 ? 'Any' : `${rating}⭐ and up`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book Length */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Book Length</label>
                <select
                  value={filters.length || ''}
                  onChange={(e) => handleLengthChange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-foreground"
                >
                  <option value="">Any Length</option>
                  <option value="short">📖 Short (< 200 pages)</option>
                  <option value="medium">📚 Medium (200-400 pages)</option>
                  <option value="long">📕 Long (> 400 pages)</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reading Difficulty</label>
                <select
                  value={filters.difficulty || ''}
                  onChange={(e) => handleDifficultyChange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-foreground"
                >
                  <option value="">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reading Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(mood => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => handleMoodSelect(mood)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filters.mood === mood
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {mood === 'happy' && '😊'}
                      {mood === 'sad' && '😢'}
                      {mood === 'adventurous' && '🚀'}
                      {mood === 'thoughtful' && '🤔'}
                      {mood === 'relaxed' && '😌'}
                      {' '}{mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filters.genres?.includes(genre)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all"
            >
              Clear All
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive rounded-lg p-4 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              {books.length > 0 ? `${books.length} Results` : 'No results yet'}
            </h2>
          </div>

          {books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book, idx) => (
                  <BookCard key={book.work_id || idx} book={book} />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div ref={setTarget} className="mt-8 flex justify-center">
                  {loading && <Loading />}
                </div>
              )}
            </>
          ) : (
            !loading && books.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {query ? 'No books found. Try adjusting your search.' : 'Enter a search query to get started.'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  )
}
