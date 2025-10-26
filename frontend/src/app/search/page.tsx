'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/book-card';
import { SearchBarEnhanced } from '@/components/search-bar-enhanced';
import { bookAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  rating?: number;
  year?: number;
  description?: string;
}

interface FilterOptions {
  sortBy: 'relevance' | 'rating' | 'year' | 'popularity';
  yearFrom: string;
  yearTo: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'relevance',
    yearFrom: '1900',
    yearTo: new Date().getFullYear().toString(),
  });
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    if (!query) return;
    setBooks([]);
    setPage(1);
    loadBooks(1);
  }, [query]);

  const loadBooks = async (pageNum: number) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await bookAPI.search(query, itemsPerPage);
      const newBooks = response.results || [];

      if (pageNum === 1) {
        setBooks(newBooks);
      } else {
        setBooks((prev) => [...prev, ...newBooks]);
      }

      setHasMore(newBooks.length === itemsPerPage);
    } catch (error) {
      toast.error('Failed to search books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...books];

    if (filters.yearFrom) {
      filtered = filtered.filter((b) => !b.year || b.year >= parseInt(filters.yearFrom));
    }
    if (filters.yearTo) {
      filtered = filtered.filter((b) => !b.year || b.year <= parseInt(filters.yearTo));
    }

    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === 'year') {
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    setFilteredBooks(filtered);
  }, [books, filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && page > 0) {
          setPage((prev) => prev + 1);
          loadBooks(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, page]);

  const handleAddFavorite = async (bookId: string) => {
    try {
      await bookAPI.addFavorite(bookId, 'user_1');
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to add favorite');
    }
  };

  const handleAddToList = async (bookId: string) => {
    try {
      toast.success('Added to reading list!');
    } catch (error) {
      toast.error('Failed to add to list');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <section className="px-4 py-8 border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Search className="text-slate-400" size={24} />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Search Results
            </h1>
          </div>

          <div className="max-w-2xl">
            <SearchBarEnhanced showResults={false} />
          </div>

          {query && (
            <p className="text-slate-600 dark:text-slate-400">
              Results for "<span className="font-semibold">{query}</span>" ({filteredBooks.length}{' '}
              books found)
            </p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 w-full p-3 rounded-lg border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Filter size={20} />
                <span>Filters</span>
                <ChevronDown size={20} className={`ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`space-y-6 mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">Sort By</h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sortBy: e.target.value as FilterOptions['sortBy'],
                      })
                    }
                    className="w-full p-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rated</option>
                    <option value="year">Newest</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">Published Year</h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={filters.yearFrom}
                      onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
                      placeholder="From"
                      className="w-full p-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      value={filters.yearTo}
                      onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
                      placeholder="To"
                      className="w-full p-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      sortBy: 'relevance',
                      yearFrom: '1900',
                      yearTo: new Date().getFullYear().toString(),
                    })
                  }
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {filteredBooks.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      onAddToFavorites={handleAddFavorite}
                      onAddToList={handleAddToList}
                    />
                  ))}
                </div>

                {hasMore && (
                  <>
                    <div ref={observerTarget} className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                    </div>
                  </>
                )}

                {!hasMore && filteredBooks.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">
                      No more books to load. You've reached the end!
                    </p>
                  </div>
                )}
              </>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="text-slate-400 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No books found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
