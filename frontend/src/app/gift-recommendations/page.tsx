'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Gift, Loader2, Star, DollarSign, Heart, Zap, Search, ArrowRight } from 'lucide-react'

interface BookRecommendation {
  id: string
  title: string
  author: string
  coverUrl: string
  rating: number
  price: number
  reason: string
  genres: string[]
  suitabilityScore: number
}

export default function GiftRecommendationsPage() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([])
  const [showForm, setShowForm] = useState(true)
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('0-25')
  const [recipientInterests, setRecipientInterests] = useState<string[]>([])
  const [recipientAge, setRecipientAge] = useState('')

  const occasions = [
    'Birthday',
    'Anniversary',
    'Graduation',
    'Wedding',
    'Holiday',
    'New Job',
    'Retirement',
    'Just Because',
  ]

  const budgetRanges = [
    { label: '$0-$25', value: '0-25', max: 25 },
    { label: '$25-$50', value: '25-50', max: 50 },
    { label: '$50-$75', value: '50-75', max: 75 },
    { label: '$75-$100', value: '75-100', max: 100 },
    { label: '$100+', value: '100+', max: 500 },
  ]

  const interestOptions = [
    'Romance',
    'Mystery',
    'Science Fiction',
    'Fantasy',
    'Self-Help',
    'Memoir',
    'History',
    'Food & Cooking',
    'Travel',
    'Business',
    'Psychology',
    'Art & Design',
  ]

  const mockRecommendations: BookRecommendation[] = [
    {
      id: '1',
      title: 'It Ends with Us',
      author: 'Colleen Hoover',
      coverUrl: 'https://images.unsplash.com/photo-1501979915551-4e8d30928351?w=200&h=300&fit=crop',
      rating: 4.8,
      price: 18.99,
      reason: 'Perfect emotional journey for someone who appreciates deep stories',
      genres: ['Romance', 'Contemporary'],
      suitabilityScore: 95,
    },
    {
      id: '2',
      title: 'Educated',
      author: 'Tara Westover',
      coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop',
      rating: 4.7,
      price: 19.99,
      reason: 'Inspiring memoir that will spark meaningful conversations',
      genres: ['Memoir', 'Non-Fiction'],
      suitabilityScore: 92,
    },
    {
      id: '3',
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1497206365907-4d71bcdd2085?w=200&h=300&fit=crop',
      rating: 4.9,
      price: 22.99,
      reason: 'Epic science fiction masterpiece for imaginative readers',
      genres: ['Science Fiction', 'Fantasy'],
      suitabilityScore: 88,
    },
    {
      id: '4',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=300&fit=crop',
      rating: 4.6,
      price: 18.99,
      reason: 'Uplifting and thought-provoking for anyone at a crossroads',
      genres: ['Fantasy', 'Contemporary'],
      suitabilityScore: 90,
    },
    {
      id: '5',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=200&h=300&fit=crop',
      rating: 4.8,
      price: 21.99,
      reason: 'Thrilling sci-fi adventure with humor and heart',
      genres: ['Science Fiction', 'Adventure'],
      suitabilityScore: 93,
    },
    {
      id: '6',
      title: 'Atomic Habits',
      author: 'James Clear',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=200&h=300&fit=crop',
      rating: 4.7,
      price: 17.99,
      reason: 'Perfect for someone looking to improve their life',
      genres: ['Self-Help', 'Non-Fiction'],
      suitabilityScore: 85,
    },
  ]

  const handleGenerateRecommendations = useCallback(async () => {
    if (!selectedOccasion || !selectedBudget || recipientInterests.length === 0) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setLoading(false)
      setShowForm(false)
    }, 2000)
  }, [selectedOccasion, selectedBudget, recipientInterests])

  const toggleInterest = (interest: string) => {
    if (recipientInterests.includes(interest)) {
      setRecipientInterests(recipientInterests.filter((i) => i !== interest))
    } else {
      setRecipientInterests([...recipientInterests, interest])
    }
  }

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-pink-50 to-purple-50'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const buttonColor = theme === 'dark' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold">Gift Recommendations</h1>
          </div>
          <p className={`${textColor} text-lg`}>Find the perfect book gift for any occasion</p>
        </div>

        {showForm && (
          <div className={`border ${cardColor} rounded-lg p-8 mb-8`}>
            <h2 className="text-2xl font-bold mb-6">Tell Us About Your Gift</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-semibold mb-3">Occasion</label>
                <div className="space-y-2">
                  {occasions.map((occasion) => (
                    <label key={occasion} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="occasion"
                        value={occasion}
                        checked={selectedOccasion === occasion}
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{occasion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Budget Range</label>
                <div className="space-y-2">
                  {budgetRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        value={range.value}
                        checked={selectedBudget === range.value}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-3">Recipient's Interests (Select at least one)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      recipientInterests.includes(interest)
                        ? theme === 'dark'
                          ? 'bg-pink-600 border-pink-500 text-white'
                          : 'bg-pink-500 border-pink-400 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                          : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-3">Recipient's Age (Optional)</label>
              <select
                value={recipientAge}
                onChange={(e) => setRecipientAge(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              >
                <option value="">Select age range</option>
                <option value="teen">13-19</option>
                <option value="young-adult">20-30</option>
                <option value="adult">31-50</option>
                <option value="senior">50+</option>
              </select>
            </div>

            <button
              onClick={handleGenerateRecommendations}
              className={`w-full md:w-auto px-8 py-3 rounded-lg ${buttonColor} text-white font-semibold transition flex items-center justify-center gap-2`}
            >
              <Zap className="w-5 h-5" />
              Generate Recommendations
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        )}

        {!showForm && recommendations.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Perfect Matches for {selectedOccasion}</h2>
              <button
                onClick={() => {
                  setShowForm(true)
                  setRecommendations([])
                }}
                className={`px-4 py-2 rounded-lg ${buttonColor} text-white transition`}
              >
                New Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((book) => (
                <div
                  key={book.id}
                  className={`border ${cardColor} rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1`}
                >
                  <div className="relative h-64 bg-gradient-to-b from-pink-300 to-purple-300 flex items-center justify-center overflow-hidden">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition"
                    />
                    <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {book.suitabilityScore}% Match
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                    <p className="text-pink-500 font-medium mb-3">{book.author}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                          }`}
                        />
                      ))}
                      <span className={`${textColor} text-sm ml-2`}>({book.rating})</span>
                    </div>

                    <p className={`${textColor} text-sm mb-4`}>{book.reason}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {book.genres.map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-pink-500 bg-opacity-20 text-pink-500 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <span className="text-2xl font-bold text-pink-500">${book.price.toFixed(2)}</span>
                      <button className={`px-4 py-2 rounded-lg ${buttonColor} text-white transition flex items-center gap-2`}>
                        Add to Cart
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!showForm && recommendations.length === 0 && !loading && (
          <div className={`border ${cardColor} rounded-lg p-8 text-center`}>
            <p className={`${textColor} mb-4`}>No recommendations yet. Start by filling out the form.</p>
            <button
              onClick={() => setShowForm(true)}
              className={`px-6 py-2 rounded-lg ${buttonColor} text-white transition`}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
