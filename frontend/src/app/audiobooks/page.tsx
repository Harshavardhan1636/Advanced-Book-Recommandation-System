'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Headphones, Play, Download, DollarSign, Star, Loader2, Search, Filter, Volume2, Clock, Users } from 'lucide-react'

interface Audiobook {
  id: string
  title: string
  author: string
  narrator: string
  duration: string
  format: string
  price: number
  rating: number
  reviews: number
  platform: string
  coverUrl: string
  description: string
  languages: string[]
  hasFreeTrial: boolean
}

export default function AudiobooksPage() {
  const { theme } = useTheme()
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([])
  const [filteredAudiobooks, setFilteredAudiobooks] = useState<Audiobook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedPrice, setSelectedPrice] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [selectedAudiobook, setSelectedAudiobook] = useState<Audiobook | null>(null)

  const mockAudiobooks: Audiobook[] = [
    {
      id: '1',
      title: 'Educated',
      author: 'Tara Westover',
      narrator: 'Julia Whelan',
      duration: '12h 58m',
      format: 'MP3',
      price: 14.99,
      rating: 4.8,
      reviews: 2341,
      platform: 'Audible',
      coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150&h=200&fit=crop',
      description: 'A memoir about a woman who leaves her survivalist family to pursue education',
      languages: ['English', 'Spanish', 'French'],
      hasFreeTrial: true,
    },
    {
      id: '2',
      title: 'Dune',
      author: 'Frank Herbert',
      narrator: 'Scott Brick',
      duration: '21h 02m',
      format: 'MP3',
      price: 19.99,
      rating: 4.7,
      reviews: 1856,
      platform: 'Audible',
      coverUrl: 'https://images.unsplash.com/photo-1497206365907-4d71bcdd2085?w=150&h=200&fit=crop',
      description: 'An epic science fiction novel set on the desert planet of Arrakis',
      languages: ['English'],
      hasFreeTrial: true,
    },
    {
      id: '3',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      narrator: 'Carey Mulligan',
      duration: '9h 47m',
      format: 'MP3',
      price: 12.99,
      rating: 4.6,
      reviews: 1203,
      platform: 'Google Play Books',
      coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=150&h=200&fit=crop',
      description: 'A fantastical novel about a woman given the chance to explore alternate lives',
      languages: ['English', 'German'],
      hasFreeTrial: false,
    },
    {
      id: '4',
      title: 'It Ends with Us',
      author: 'Colleen Hoover',
      narrator: 'Vanessa Johansson',
      duration: '10h 22m',
      format: 'MP3',
      price: 13.99,
      rating: 4.9,
      reviews: 3421,
      platform: 'Apple Books',
      coverUrl: 'https://images.unsplash.com/photo-1501979915551-4e8d30928351?w=150&h=200&fit=crop',
      description: 'A contemporary romance with complex emotional themes',
      languages: ['English'],
      hasFreeTrial: true,
    },
    {
      id: '5',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      narrator: 'Ray Porter',
      duration: '13h 34m',
      format: 'MP3',
      price: 16.99,
      rating: 4.8,
      reviews: 2567,
      platform: 'Audible',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=150&h=200&fit=crop',
      description: 'A thrilling science fiction adventure through space',
      languages: ['English'],
      hasFreeTrial: true,
    },
    {
      id: '6',
      title: 'Atomic Habits',
      author: 'James Clear',
      narrator: 'James Clear',
      duration: '5h 51m',
      format: 'MP3',
      price: 11.99,
      rating: 4.7,
      reviews: 4521,
      platform: 'Google Play Books',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=150&h=200&fit=crop',
      description: 'A practical guide to building good habits and breaking bad ones',
      languages: ['English', 'Spanish', 'French', 'German'],
      hasFreeTrial: false,
    },
    {
      id: '7',
      title: 'The Girl on the Train',
      author: 'Paula Hawkins',
      narrator: 'India Fisher',
      duration: '15h 23m',
      format: 'MP3',
      price: 14.99,
      rating: 4.5,
      reviews: 2134,
      platform: 'Apple Books',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=150&h=200&fit=crop',
      description: 'A psychological thriller centered around a mysterious murder',
      languages: ['English'],
      hasFreeTrial: false,
    },
    {
      id: '8',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      narrator: 'Rob Inglis',
      duration: '11h 02m',
      format: 'AAC',
      price: 15.99,
      rating: 4.8,
      reviews: 1987,
      platform: 'Audible',
      coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e3ffe02?w=150&h=200&fit=crop',
      description: 'A fantasy adventure of a hobbit on an unexpected quest',
      languages: ['English'],
      hasFreeTrial: true,
    },
  ]

  useEffect(() => {
    setAudiobooks(mockAudiobooks)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = audiobooks

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter((book) => book.platform === selectedPlatform)
    }

    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number)
      filtered = filtered.filter((book) => book.price >= min && book.price <= max)
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'duration') {
      const durationToMinutes = (duration: string) => {
        const match = duration.match(/(\d+)h\s*(\d+)m/)
        return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0
      }
      filtered.sort((a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration))
    }

    setFilteredAudiobooks(filtered)
  }, [searchQuery, selectedPlatform, selectedPrice, sortBy, audiobooks])

  const platforms = ['all', 'Audible', 'Google Play Books', 'Apple Books', 'Libby']
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: '$0-$10', value: '0-10' },
    { label: '$10-$15', value: '10-15' },
    { label: '$15-$20', value: '15-20' },
    { label: '$20+', value: '20-1000' },
  ]

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-purple-50 to-blue-50'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const buttonColor = theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Headphones className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Audiobooks</h1>
          </div>
          <p className={`${textColor} text-lg`}>Listen to great books anywhere, anytime</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audiobooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-black'
              }`}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-gray-300 text-black'
            }`}
          >
            <option value="rating">Sort by Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`lg:col-span-1 border ${cardColor} rounded-lg p-6 h-fit`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>

            <div className="mb-6">
              <label className="block font-semibold text-sm mb-3">Platform</label>
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <label key={platform} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="platform"
                      value={platform}
                      checked={selectedPlatform === platform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{platform === 'all' ? 'All Platforms' : platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-sm mb-3">Price Range</label>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={selectedPrice === range.value}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAudiobooks.map((audiobook) => (
                  <div
                    key={audiobook.id}
                    className={`border ${cardColor} rounded-lg overflow-hidden hover:shadow-lg transition`}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
                      <img
                        src={audiobook.coverUrl}
                        alt={audiobook.title}
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                        <button className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition transform hover:scale-110">
                          <Play className="w-6 h-6 ml-1" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{audiobook.title}</h3>
                      <p className="text-purple-400 font-medium text-sm mb-2">{audiobook.author}</p>
                      <p className={`${textColor} text-xs mb-3`}>Narrated by {audiobook.narrator}</p>

                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{audiobook.rating}</span>
                        <span className={`${textColor} text-xs`}>({audiobook.reviews.toLocaleString()})</span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span>{audiobook.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-purple-400" />
                          <span>{audiobook.platform}</span>
                        </div>
                        {audiobook.hasFreeTrial && (
                          <div className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded text-xs font-semibold">
                            Free Trial Available
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {audiobook.languages.slice(0, 2).map((lang, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-400 text-xs rounded">
                            {lang}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <span className="text-lg font-bold text-purple-400">${audiobook.price.toFixed(2)}</span>
                        <button
                          onClick={() => setSelectedAudiobook(audiobook)}
                          className={`px-4 py-2 rounded-lg ${buttonColor} text-white text-sm transition flex items-center gap-2`}
                        >
                          <Download className="w-4 h-4" />
                          Get
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedAudiobook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${cardColor} border rounded-lg p-6 max-w-md w-full`}>
              <h2 className="text-2xl font-bold mb-4">{selectedAudiobook.title}</h2>
              <p className={`${textColor} mb-4`}>by {selectedAudiobook.author}</p>
              <p className={`${textColor} mb-6`}>Narrated by {selectedAudiobook.narrator}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={textColor}>Duration:</span>
                  <span className="font-semibold">{selectedAudiobook.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textColor}>Platform:</span>
                  <span className="font-semibold">{selectedAudiobook.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textColor}>Price:</span>
                  <span className="font-bold text-purple-400">${selectedAudiobook.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className={`flex-1 py-2 rounded-lg ${buttonColor} text-white transition flex items-center justify-center gap-2`}>
                  <Download className="w-4 h-4" />
                  Add to Wishlist
                </button>
                <button
                  onClick={() => setSelectedAudiobook(null)}
                  className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
