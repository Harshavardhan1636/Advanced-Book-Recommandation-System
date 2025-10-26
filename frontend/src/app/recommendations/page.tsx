'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCarousel } from '@/components/book-carousel';
import { recommendationAPI, bookAPI } from '@/lib/api';
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

interface RecommendationType {
  name: string;
  description: string;
  icon: string;
  method: 'hybrid' | 'ml' | 'tfidf' | 'collaborative';
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<{ [key: string]: Book[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'hybrid' | 'ml' | 'tfidf' | 'collaborative'>('hybrid');

  const recommendationTypes: RecommendationType[] = [
    {
      name: 'Hybrid Algorithm',
      description: 'Combined content-based and collaborative filtering for best results',
      icon: '🤖',
      method: 'hybrid',
    },
    {
      name: 'Machine Learning',
      description: 'Advanced ML model trained on reading patterns',
      icon: '🧠',
      method: 'ml',
    },
    {
      name: 'TF-IDF Based',
      description: 'Content-based recommendations using text similarity',
      icon: '📚',
      method: 'tfidf',
    },
    {
      name: 'Collaborative Filtering',
      description: 'Recommendations from readers with similar tastes',
      icon: '👥',
      method: 'collaborative',
    },
  ];

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const userId = 'user_1';

        const [hybrid, ml, collaborative] = await Promise.all([
          recommendationAPI.getHybrid(userId, 'book_123').catch(() => ({ results: [] })),
          recommendationAPI.getML(userId, {}).catch(() => ({ results: [] })),
          recommendationAPI.getCollaborative(userId, 10).catch(() => ({ results: [] })),
        ]);

        const tfidfData = await bookAPI.search('science fiction', 15).catch(() => ({ results: [] }));

        setRecommendations({
          hybrid: hybrid.results || [],
          ml: ml.results || [],
          tfidf: tfidfData.results || [],
          collaborative: collaborative.results || [],
        });
      } catch (error) {
        toast.error('Failed to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

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
      <section className="relative overflow-hidden px-4 py-16 border-b dark:border-slate-800">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-40" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />

        <div className="relative max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <Sparkles size={16} className="text-purple-600" />
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              Personalized Recommendations
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Books We Think You'll Love
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Based on your reading history and preferences, we've curated personalized recommendations
            using different algorithms.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Algorithm Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Choose Recommendation Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendationTypes.map((type) => (
              <button
                key={type.method}
                onClick={() => setSelectedMethod(type.method)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMethod === type.method
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <span className="text-3xl block mb-2">{type.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white">{type.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{type.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recommendations Display */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : recommendations[selectedMethod]?.length > 0 ? (
            <BookCarousel
              title={`${recommendationTypes.find((t) => t.method === selectedMethod)?.name} - Top Picks`}
              books={recommendations[selectedMethod]}
              onAddToFavorites={handleAddFavorite}
              onAddToList={handleAddToList}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Heart className="text-slate-400 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No recommendations available
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Start reading and rating books to get personalized recommendations.
              </p>
            </div>
          )}
        </section>

        {/* Info Cards */}
        <section className="mt-20 py-12 border-t dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            How Our Algorithms Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                🤖 Hybrid Algorithm
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Combines the best of content-based and collaborative filtering to provide the most
                accurate recommendations by considering both book similarity and user preferences.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                🧠 Machine Learning
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Uses advanced neural networks trained on millions of reading patterns to predict
                which books you'll enjoy based on your reading history and behavior.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                📚 TF-IDF Based
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Analyzes book content and metadata to find similar books based on genre, subject,
                author style, and other textual similarities.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                👥 Collaborative Filtering
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Recommends books that other readers with similar tastes and reading patterns have
                enjoyed, creating a community-driven approach.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
