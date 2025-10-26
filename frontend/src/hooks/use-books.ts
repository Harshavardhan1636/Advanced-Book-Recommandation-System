'use client'

import { useState, useEffect } from 'react'

interface Book {
  id: string
  title: string
  authors?: string[]
  cover_url?: string
  rating?: number
}

export function useBooks(query: string) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setBooks([])
      return
    }

    const fetchBooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('http://localhost:8000/api/books/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }

        const data = await response.json()
        setBooks(data.books || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setBooks([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchBooks, 500)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return { books, isLoading, error }
}
