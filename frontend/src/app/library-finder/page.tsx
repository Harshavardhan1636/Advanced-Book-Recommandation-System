'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  BookOpen,
  MapPin,
  Search,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react'

interface LibraryAvailability {
  bookTitle: string
  author: string
  libraryName: string
  city: string
  state: string
  available: number
  onHold: number
  waitTime: number
  format: string
  isbn: string
}

export default function LibraryFinderPage() {
  const { theme } = useTheme()
  const [isbn, setIsbn] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [results, setResults] = useState<LibraryAvailability[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const mockResults: LibraryAvailability[] = [
    {
      bookTitle: 'Dune',
      author: 'Frank Herbert',
      libraryName: 'Central Public Library',
      city: 'San Francisco',
      state: 'CA',
      available: 3,
      onHold: 2,
      waitTime: 1,
      format: 'Hardcover',
      isbn: '9780553382578',
    },
    {
      bookTitle: 'Dune',
      author: 'Frank Herbert',
      libraryName: 'Downtown Branch',
      city: 'San Francisco',
      state: 'CA',
      available: 1,
      onHold: 5,
      waitTime: 3,
      format: 'Paperback',
      isbn: '9780553382578',
    },
    {
      bookTitle: 'Dune',
      author: 'Frank Herbert',
      libraryName: 'Marina District Library',
      city: 'San Francisco',
      state: 'CA',
      available: 2,
      onHold: 1,
      waitTime: 0,
      format: 'Ebook',
      isbn: '9780553382578',
    },
    {
      bookTitle: 'Dune',
      author: 'Frank Herbert',
      libraryName: 'Sunset Branch',
      city: 'San Francisco',
      state: 'CA',
      available: 0,
      onHold: 8,
      waitTime: 5,
      format: 'Audiobook',
      isbn: '9780553382578',
    },
  ]

  const handleSearch = useCallback(() => {
    if (!isbn && !zipCode) {
      alert('Please enter ISBN or ZIP code')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
      setSearched(true)
    }, 1500)
  }, [isbn, zipCode])

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-emerald-500" />
            <h1 className="text-4xl font-bold">Library Finder</h1>
          </div>
          <p className={`${textColor} text-lg`}>Find books available at your local libraries</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-8 mb-8`}>
          <h2 className="text-2xl font-bold mb-6">Search for Books</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block font-semibold mb-2">ISBN</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Enter ISBN-10 or ISBN-13"
                className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">ZIP Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your ZIP code"
                maxLength={5}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          <p className={`${textColor} text-sm`}>
            Enter an ISBN number and your location to find availability at nearby libraries.
          </p>
        </div>

        {searched && results.length === 0 && !loading && (
          <div className={`border ${cardColor} rounded-lg p-8 text-center`}>
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-xl font-semibold">No results found</p>
            <p className={textColor}>
              The book may not be available in your area libraries at this time.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Found {results.length} location{results.length !== 1 ? 's' : ''}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`border ${cardColor} rounded-lg p-6 hover:shadow-lg transition`}
                >
                  <div className="mb-4 pb-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold">{result.libraryName}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>
                        {result.city}, {result.state}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className={`${textColor} text-sm font-semibold mb-3`}>
                      {result.bookTitle}
                    </p>
                    <p className={`${textColor} text-sm`}>by {result.author}</p>
                    <p className="text-xs text-gray-500 mt-1">Format: {result.format}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className={`${textColor} text-xs font-semibold mb-1`}>Available</p>
                      <p className="text-2xl font-bold text-green-500">{result.available}</p>
                    </div>
                    <div>
                      <p className={`${textColor} text-xs font-semibold mb-1`}>On Hold</p>
                      <p className="text-2xl font-bold text-yellow-500">{result.onHold}</p>
                    </div>
                    <div>
                      <p className={`${textColor} text-xs font-semibold mb-1`}>Wait Time</p>
                      <p className="text-2xl font-bold text-blue-500">{result.waitTime}</p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    {result.available > 0 ? (
                      <div className="flex items-center gap-2 text-green-500 text-sm font-semibold">
                        <Check className="w-4 h-4" />
                        Available to borrow now
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-500 text-sm font-semibold">
                        <Clock className="w-4 h-4" />
                        {result.waitTime} week wait time
                      </div>
                    )}
                  </div>

                  <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Check Library Website
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
