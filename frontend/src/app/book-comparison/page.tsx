'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { GitCompare, Plus, X, BarChart3, Star, Book } from 'lucide-react'

interface BookForComparison {
  id: string
  title: string
  author: string
  rating: number
  pages: number
  yearPublished: number
  genre: string
  themes: string[]
  averageReadTime: number
  complexity: number
}

export default function BookComparisonPage() {
  const { theme } = useTheme()
  const [selectedBooks, setSelectedBooks] = useState<string[]>(['1', '2'])

  const allBooks: BookForComparison[] = [
    {
      id: '1',
      title: 'Dune',
      author: 'Frank Herbert',
      rating: 4.8,
      pages: 688,
      yearPublished: 1965,
      genre: 'Science Fiction',
      themes: ['Politics', 'Religion', 'Ecology', 'Power'],
      averageReadTime: 28,
      complexity: 9,
    },
    {
      id: '2',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      rating: 4.6,
      pages: 304,
      yearPublished: 2020,
      genre: 'Fantasy',
      themes: ['Life choices', 'Regret', 'Second chances', 'Hope'],
      averageReadTime: 12,
      complexity: 5,
    },
    {
      id: '3',
      title: 'It Ends with Us',
      author: 'Colleen Hoover',
      rating: 4.7,
      pages: 376,
      yearPublished: 2016,
      genre: 'Contemporary',
      themes: ['Relationships', 'Abuse', 'Family', 'Love'],
      averageReadTime: 15,
      complexity: 6,
    },
    {
      id: '4',
      title: 'Educated',
      author: 'Tara Westover',
      rating: 4.8,
      pages: 352,
      yearPublished: 2018,
      genre: 'Memoir',
      themes: ['Education', 'Family', 'Identity', 'Freedom'],
      averageReadTime: 14,
      complexity: 7,
    },
  ]

  const books = selectedBooks.map((id) => allBooks.find((b) => b.id === id)).filter(Boolean) as BookForComparison[]

  const removeBook = (id: string) => {
    setSelectedBooks(selectedBooks.filter((bid) => bid !== id))
  }

  const addBook = (id: string) => {
    if (!selectedBooks.includes(id) && selectedBooks.length < 4) {
      setSelectedBooks([...selectedBooks, id])
    }
  }

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const cellColor = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Book Comparison</h1>
          </div>
          <p className={`${textColor} text-lg`}>Compare books side by side to make better reading choices</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-6 mb-8`}>
          <h2 className="text-2xl font-bold mb-4">Add Books to Compare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => addBook(book.id)}
                disabled={selectedBooks.includes(book.id) || selectedBooks.length >= 4}
                className={`p-3 rounded-lg border transition text-left text-sm ${
                  selectedBooks.includes(book.id)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 disabled:opacity-50'
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300 disabled:opacity-50'
                }`}
              >
                <p className="font-bold truncate">{book.title}</p>
                <p className="opacity-75 truncate">{book.author}</p>
              </button>
            ))}
          </div>
        </div>

        {books.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {[
                  { label: 'Title', key: 'title' },
                  { label: 'Author', key: 'author' },
                  { label: 'Rating', key: 'rating' },
                  { label: 'Pages', key: 'pages' },
                  { label: 'Year Published', key: 'yearPublished' },
                  { label: 'Genre', key: 'genre' },
                  { label: 'Average Read Time (hours)', key: 'averageReadTime' },
                  { label: 'Complexity', key: 'complexity' },
                ].map((row) => (
                  <tr key={row.key} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <td className={`px-4 py-4 font-semibold min-w-48 ${cellColor}`}>{row.label}</td>
                    {books.map((book) => (
                      <td
                        key={book.id}
                        className={`px-4 py-4 min-w-40 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
                      >
                        <div className="flex items-center justify-between group">
                          <span>
                            {row.key === 'rating' ? (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {book.rating}
                              </div>
                            ) : row.key === 'complexity' ? (
                              <div className="flex items-center gap-1">
                                <div className="flex">
                                  {[...Array(10)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full mx-0.5 ${
                                        i < book.complexity ? 'bg-blue-500' : 'bg-gray-400'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              book[row.key as keyof BookForComparison]
                            )}
                          </span>
                          <button
                            onClick={() => removeBook(book.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition"
                          >
                            <X className="w-4 h-4 text-red-500 hover:text-white" />
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}

                <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <td className={`px-4 py-4 font-semibold ${cellColor}`}>Themes</td>
                  {books.map((book) => (
                    <td key={book.id} className={`px-4 py-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                      <div className="flex flex-wrap gap-2">
                        {book.themes.map((theme, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded-full"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {books.length === 0 && (
          <div className={`border ${cardColor} rounded-lg p-12 text-center`}>
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold">Select books to compare</p>
            <p className={`${textColor}`}>Choose up to 4 books from the list above to see a detailed comparison</p>
          </div>
        )}
      </div>
    </main>
  )
}
