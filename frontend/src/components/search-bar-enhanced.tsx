'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { searchBooks } from '@/lib/api';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  year?: number;
}

interface SearchBarEnhancedProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showResults?: boolean;
}

export function SearchBarEnhanced({
  onSearch,
  placeholder = 'Search books, authors, genres...',
  showResults = true,
}: SearchBarEnhancedProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    if (!debouncedQuery.trim() || !showResults) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await searchBooks({ query: debouncedQuery, limit: 8 });
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (error) {
        toast.error('Failed to search books');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, showResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      onSearch?.(query);
    }
  };

  const handleResultClick = (book: SearchResult) => {
    router.push(`/books/${book.id}`);
    setQuery('');
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-slate-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && showResults && setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
          )}
          {isLoading && (
            <Loader className="absolute right-3 animate-spin text-purple-500" size={20} />
          )}
        </div>
      </form>

      {showDropdown && showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {results.map((book) => (
              <button
                key={book.id}
                onClick={() => handleResultClick(book)}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700 last:border-b-0"
              >
                <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                  {book.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {book.authors.join(', ')}
                </p>
                {book.year && (
                  <p className="text-xs text-slate-500 dark:text-slate-500">{book.year}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDropdown && showResults && debouncedQuery && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-slate-600 dark:text-slate-400">No books found for "{debouncedQuery}"</p>
          <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
