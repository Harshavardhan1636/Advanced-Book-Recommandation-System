'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Film, Search, Star, Calendar, Users, Play, Info, Loader2, Filter } from 'lucide-react'

interface MovieAdaptation {
  id: string
  bookTitle: string
  author: string
  movieTitle: string
  releaseYear: number
  director: string
  rating: number
  runtime: number
  platform: string
  genres: string[]
  cast: string[]
  synopsis: string
  imdbRating: number
  rottenTomatoesScore: number
}

export default function MovieAdaptationsPage() {
  const { theme } = useTheme()
  const [adaptations, setAdaptations] = useState<MovieAdaptation[]>([])
  const [filteredAdaptations, setFilteredAdaptations] = useState<MovieAdaptation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')

  const mockAdaptations: MovieAdaptation[] = [
    {
      id: '1',
      bookTitle: 'The Midnight Library',
      author: 'Matt Haig',
      movieTitle: 'The Midnight Library',
      releaseYear: 2024,
      director: 'Joe Talbot',
      rating: 4.8,
      runtime: 128,
      platform: 'Netflix',
      genres: ['Fantasy', 'Drama', 'Romance'],
      cast: ['Thomasin McKenzie', 'Jack Cheevers', 'Simon Pegg'],
      synopsis: 'A woman discovers a mysterious library where each book allows her to experience alternate versions of her life.',
      imdbRating: 8.2,
      rottenTomatoesScore: 87,
    },
    {
      id: '2',
      bookTitle: 'It Ends with Us',
      author: 'Colleen Hoover',
      movieTitle: 'It Ends with Us',
      releaseYear: 2024,
      director: 'Justin Baldoni',
      rating: 4.6,
      runtime: 130,
      platform: 'Sony Pictures',
      genres: ['Romance', 'Drama', 'Thriller'],
      cast: ['Blake Lively', 'Justin Baldoni', 'Brandon Sklenar'],
      synopsis: 'A woman must choose between love and safety when she falls for a man with a troubled past.',
      imdbRating: 7.4,
      rottenTomatoesScore: 58,
    },
    {
      id: '3',
      bookTitle: 'Dune',
      author: 'Frank Herbert',
      movieTitle: 'Dune: Part Two',
      releaseYear: 2024,
      director: 'Denis Villeneuve',
      rating: 4.9,
      runtime: 166,
      platform: 'Warner Bros',
      genres: ['Science Fiction', 'Adventure', 'Epic'],
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
      synopsis: 'Paul Atreides travels to the dangerous planet Arrakis in this epic science fiction adaptation.',
      imdbRating: 8.5,
      rottenTomatoesScore: 92,
    },
    {
      id: '4',
      bookTitle: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      movieTitle: 'The Hobbit: The Battle of Five Armies',
      releaseYear: 2014,
      director: 'Peter Jackson',
      rating: 4.7,
      runtime: 144,
      platform: 'Warner Bros',
      genres: ['Fantasy', 'Adventure', 'Epic'],
      cast: ['Martin Freeman', 'Ian McKellen', 'Richard Armitage'],
      synopsis: 'The final battle of the hobbit\'s epic journey across Middle-earth unfolds in stunning detail.',
      imdbRating: 7.5,
      rottenTomatoesScore: 60,
    },
    {
      id: '5',
      bookTitle: 'The Girl on the Train',
      author: 'Paula Hawkins',
      movieTitle: 'The Girl on the Train',
      releaseYear: 2016,
      director: 'Tate Taylor',
      rating: 4.5,
      runtime: 112,
      platform: 'Universal',
      genres: ['Thriller', 'Mystery', 'Drama'],
      cast: ['Emily Blunt', 'Haley Bennett', 'Rebecca Ferguson'],
      synopsis: 'A woman with memory problems becomes entangled in a murder investigation.',
      imdbRating: 7.1,
      rottenTomatoesScore: 53,
    },
    {
      id: '6',
      bookTitle: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      movieTitle: 'Where the Crawdads Sing',
      releaseYear: 2022,
      director: 'Olivia Newman',
      rating: 4.7,
      runtime: 125,
      platform: 'Reese Witherspoon',
      genres: ['Drama', 'Romance', 'Mystery'],
      cast: ['Daisy Edgar-Jones', 'Taylor Swift', 'Harris Dickinson'],
      synopsis: 'An isolated girl grows up alone in the marshes and becomes entangled in a murder mystery.',
      imdbRating: 7.3,
      rottenTomatoesScore: 69,
    },
  ]

  useEffect(() => {
    setAdaptations(mockAdaptations)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = adaptations

    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter((movie) => movie.platform === selectedPlatform)
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter((movie) => movie.genres.includes(selectedGenre))
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'year') {
      filtered.sort((a, b) => b.releaseYear - a.releaseYear)
    } else if (sortBy === 'imdb') {
      filtered.sort((a, b) => b.imdbRating - a.imdbRating)
    }

    setFilteredAdaptations(filtered)
  }, [searchQuery, selectedPlatform, selectedGenre, sortBy, adaptations])

  const platforms = Array.from(new Set(adaptations.map((m) => m.platform)))
  const genres = Array.from(new Set(adaptations.flatMap((m) => m.genres)))

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const buttonColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Movie Adaptations</h1>
          </div>
          <p className={`${textColor} text-lg`}>Discover movie and TV adaptations of your favorite books</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books or movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-black'
              }`}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-slate-300 text-black'
            }`}
          >
            <option value="rating">Sort by Book Rating</option>
            <option value="year">Sort by Release Year</option>
            <option value="imdb">Sort by IMDB Rating</option>
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-slate-300 text-black'
            }`}
          >
            <option value="all">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-3 text-sm">Filter by Genre</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('all')}
              className={`px-4 py-2 rounded-lg border transition ${
                selectedGenre === 'all'
                  ? buttonColor + ' text-white border-transparent'
                  : theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                    : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
              }`}
            >
              All Genres
            </button>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedGenre === g
                    ? buttonColor + ' text-white border-transparent'
                    : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdaptations.map((movie) => (
              <div
                key={movie.id}
                className={`border ${cardColor} rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1`}
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                  <Film className="w-20 h-20 text-white opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <button className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition transform hover:scale-110">
                      <Play className="w-6 h-6 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <p className={`${textColor} text-xs font-semibold mb-1`}>BASED ON</p>
                    <h3 className="text-lg font-bold text-blue-400">{movie.bookTitle}</h3>
                    <p className={`${textColor} text-sm`}>by {movie.author}</p>
                  </div>

                  <div className="mb-3">
                    <h2 className="text-xl font-bold mb-1">{movie.movieTitle}</h2>
                    <p className={`${textColor} text-sm mb-2`}>Directed by {movie.director}</p>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{movie.releaseYear}</span>
                      <span className={textColor}>•</span>
                      <span>{movie.runtime} min</span>
                    </div>
                  </div>

                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <div className="flex gap-3 mb-2">
                      <div>
                        <p className={`${textColor} text-xs mb-1`}>Book Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{movie.rating}</span>
                        </div>
                      </div>
                      <div>
                        <p className={`${textColor} text-xs mb-1`}>IMDB</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{movie.imdbRating}</span>
                        </div>
                      </div>
                      <div>
                        <p className={`${textColor} text-xs mb-1`}>Rotten Tomatoes</p>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-red-500">{movie.rottenTomatoesScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className={`${textColor} text-xs font-semibold mb-2`}>GENRES</p>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className={`${textColor} text-xs font-semibold mb-2`}>CAST</p>
                    <p className={`${textColor} text-sm`}>{movie.cast.slice(0, 2).join(', ')}</p>
                  </div>

                  <p className={`${textColor} text-sm mb-4 line-clamp-3`}>{movie.synopsis}</p>

                  <div className="flex gap-3">
                    <button className={`flex-1 py-2 rounded-lg ${buttonColor} text-white transition flex items-center justify-center gap-2`}>
                      <Play className="w-4 h-4" />
                      Watch
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" />
                      Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
