'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { User, Book, Calendar, MapPin, Globe, Award, Loader2 } from 'lucide-react'

interface AuthorProfile {
  id: string
  name: string
  biography: string
  birthYear: number
  birthPlace: string
  website: string
  twitter: string
  booksWritten: number
  totalRating: number
  notableBoks: string[]
  awards: string[]
  genres: string[]
  imageUrl: string
}

export default function AuthorProfilesPage() {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('1')
  const [loading, setLoading] = useState(false)

  const mockAuthors: AuthorProfile[] = [
    {
      id: '1',
      name: 'Frank Herbert',
      biography:
        'Frank Herbert was an American science fiction author famous for creating the Dune universe, one of the most influential science fiction series of all time.',
      birthYear: 1920,
      birthPlace: 'Tacoma, Washington',
      website: 'https://www.frankherbertbooks.com',
      twitter: '@FrankHerbert',
      booksWritten: 26,
      totalRating: 4.8,
      notableBoks: ['Dune', 'Dune Messiah', 'Children of Dune'],
      awards: ['Hugo Award', 'Nebula Award', 'Locus Award'],
      genres: ['Science Fiction', 'Space Opera'],
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      id: '2',
      name: 'Tara Westover',
      biography:
        'Tara Westover is an American author best known for her memoir "Educated," which chronicles her journey from survivalism to academia and self-discovery.',
      birthYear: 1986,
      birthPlace: 'Fishlake, Idaho',
      website: 'https://www.tarawestover.com',
      twitter: '@tarawestover',
      booksWritten: 3,
      totalRating: 4.7,
      notableBoks: ['Educated', 'The Reckoning'],
      awards: ['Goodreads Choice Award', 'Publishers Weekly Nonfiction Prize'],
      genres: ['Memoir', 'Non-Fiction', 'Biography'],
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      id: '3',
      name: 'Colleen Hoover',
      biography:
        'Colleen Hoover is an American author of romance and emotional fiction novels. Her works often explore complex relationships and personal growth.',
      birthYear: 1985,
      birthPlace: 'Sloan, Iowa',
      website: 'https://www.colleenhoover.com',
      twitter: '@colleenhoover',
      booksWritten: 14,
      totalRating: 4.6,
      notableBoks: ['It Ends with Us', 'Ugly Love', 'November 9'],
      awards: ['Goodreads Choice Award', 'Storytelling Award'],
      genres: ['Romance', 'Contemporary Fiction', 'Drama'],
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
  ]

  const author = mockAuthors.find((a) => a.id === selectedAuthor)

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Author Profiles</h1>
          </div>
          <p className={`${textColor} text-lg`}>Discover more about your favorite authors</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-6 mb-8`}>
          <h2 className="text-2xl font-bold mb-4">Select an Author</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockAuthors.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAuthor(a.id)}
                className={`p-4 rounded-lg border transition text-left ${
                  selectedAuthor === a.id
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                }`}
              >
                <p className="font-bold">{a.name}</p>
                <p className="text-sm opacity-75">{a.booksWritten} books</p>
              </button>
            ))}
          </div>
        </div>

        {author && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 border ${cardColor} rounded-lg p-8`}>
              <div className="flex gap-6 mb-8">
                <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex-shrink-0 flex items-center justify-center text-6xl">
                  👤
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>Born {author.birthYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{author.birthPlace}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Book className="w-5 h-5 text-gray-400" />
                      <span>{author.booksWritten} books written</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8 pb-8 border-b border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Biography</h2>
                <p className={`${textColor} leading-relaxed`}>{author.biography}</p>
              </div>

              <div className="mb-8 pb-8 border-b border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Notable Works</h2>
                <div className="space-y-3">
                  {author.notableBoks.map((book, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <p className="font-semibold">{book}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Awards & Recognition</h2>
                <div className="space-y-3">
                  {author.awards.map((award, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`border ${cardColor} rounded-lg p-6`}>
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className={`${textColor} text-sm mb-1`}>Average Rating</p>
                    <p className="text-2xl font-bold text-yellow-500">⭐ {author.totalRating}</p>
                  </div>
                  <div>
                    <p className={`${textColor} text-sm mb-1`}>Total Books</p>
                    <p className="text-2xl font-bold text-blue-500">{author.booksWritten}</p>
                  </div>
                  <div>
                    <p className={`${textColor} text-sm mb-1`}>Genres</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {author.genres.map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-600 bg-opacity-20 text-purple-400 rounded-full text-xs font-semibold"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`border ${cardColor} rounded-lg p-6`}>
                <h3 className="text-lg font-bold mb-4">Social Media</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-semibold">
                    Twitter
                  </button>
                  <button className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition text-sm font-semibold">
                    Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
