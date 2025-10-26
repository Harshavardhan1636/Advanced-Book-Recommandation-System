'use client'

interface Book {
  id: string
  title: string
  authors?: string[]
  cover_url?: string
  rating?: number
}

interface BookGridProps {
  books: Book[]
  isLoading: boolean
  error: string | null
}

export function BookGrid({ books, isLoading, error }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-64 rounded-lg mb-2"></div>
            <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-muted h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No books found. Try searching for something!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book.id} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg mb-2 aspect-[2/3] bg-muted">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                📚
              </div>
            )}
          </div>
          <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
          {book.authors && book.authors.length > 0 && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {book.authors.join(', ')}
            </p>
          )}
          {book.rating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
