'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCarousel } from '@/components/book-carousel';
import { SearchBarEnhanced } from '@/components/search-bar-enhanced';
import { bookAPI, recommendationAPI } from '@/lib/api';
import Link from 'next/link';
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

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const [featured, trending] = await Promise.all([
          bookAPI.search('science fiction', 10),
          bookAPI.getTrending(),
        ]);

        setFeaturedBooks(featured.results || []);
        setTrendingBooks(trending.results || []);
        setRecommendedBooks((featured.results || []).slice(5, 15));
      } catch (error) {
        toast.error('Failed to load books');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleSearch = (query: string) => {
    toast.success(`Searching for "${query}"`);
  };

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
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-40" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Welcome to Your Reading Journey
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Discover Your Next{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Favorite Book
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Explore millions of books, get personalized recommendations powered by AI, and connect
              with fellow readers in our vibrant community.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchBarEnhanced onSearch={handleSearch} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/search">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <BookOpen size={20} />
                Explore Books
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button size="lg" variant="outline">
                <Sparkles size={20} />
                Get Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {!isLoading && featuredBooks.length > 0 && (
        <section className="px-4 py-16 max-w-7xl mx-auto">
          <BookCarousel
            title="✨ Featured Books"
            books={featuredBooks}
            onAddToFavorites={handleAddFavorite}
            onAddToList={handleAddToList}
          />
        </section>
      )}

      {/* Trending Section */}
      {!isLoading && trendingBooks.length > 0 && (
        <section className="px-4 py-16 max-w-7xl mx-auto">
          <BookCarousel
            title="🔥 Trending Now"
            books={trendingBooks}
            onAddToFavorites={handleAddFavorite}
            onAddToList={handleAddToList}
          />
        </section>
      )}

      {/* Recommended Section */}
      {!isLoading && recommendedBooks.length > 0 && (
        <section className="px-4 py-16 max-w-7xl mx-auto">
          <BookCarousel
            title="📚 Recommended for You"
            books={recommendedBooks}
            onAddToFavorites={handleAddFavorite}
            onAddToList={handleAddToList}
          />
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="px-4 py-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        </section>
      )}

      {/* Info Cards Section */}
      <section className="px-4 py-20 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Recommendations',
                description: 'Get personalized book suggestions using advanced machine learning algorithms.',
              },
              {
                icon: '📚',
                title: 'Millions of Books',
                description: 'Access to millions of books across all genres and languages.',
              },
              {
                icon: '👥',
                title: 'Community Driven',
                description: 'Join thousands of readers, share reviews, and discuss your favorites.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-white dark:bg-slate-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          Ready to Start Reading?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
          Join our community of book lovers today and discover your next favorite book.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Go to Dashboard
            <ArrowRight size={20} />
          </Button>
        </Link>
      </section>
    </main>
  );
}
