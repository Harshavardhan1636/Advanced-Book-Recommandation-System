'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Heart, Plus, Share2, BookOpen, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCarousel } from '@/components/book-carousel';
import { bookAPI, recommendationAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  rating?: number;
  year?: number;
  description?: string;
  pageCount?: number;
  publisher?: string;
  language?: string;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });

  useEffect(() => {
    const loadBookData = async () => {
      setIsLoading(true);
      try {
        const bookData = await bookAPI.getDetails(bookId);
        setBook(bookData.data || bookData);

        const recsData = await recommendationAPI.getTFIDF(bookId, 10);
        setRecommendations(recsData.results || []);

        setReviews([
          {
            id: '1',
            author: 'John Reader',
            rating: 5,
            title: 'Amazing book!',
            content: 'This book exceeded my expectations. Highly recommended!',
            date: '2024-10-20',
          },
          {
            id: '2',
            author: 'Jane BookLover',
            rating: 4,
            title: 'Great story',
            content: 'Engaging plot with well-developed characters. A must-read!',
            date: '2024-10-18',
          },
        ]);
      } catch (error) {
        toast.error('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookData();
  }, [bookId]);

  const handleFavorite = async () => {
    try {
      await bookAPI.addFavorite(bookId, 'user_1');
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book?.title,
          text: `Check out "${book?.title}" by ${book?.authors.join(', ')}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  const handleSubmitReview = () => {
    if (newReview.title.trim() && newReview.content.trim()) {
      toast.success('Review submitted!');
      setReviews([
        ...reviews,
        {
          id: Date.now().toString(),
          author: 'You',
          ...newReview,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewReview({ rating: 5, title: '', content: '' });
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Book not found
          </h1>
          <p className="text-slate-600 dark:text-slate-400">The book you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Book Header */}
      <section className="px-4 py-12 border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Cover */}
          <div className="flex justify-center md:col-span-1">
            <div className="relative w-48 h-72 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg overflow-hidden shadow-2xl">
              {book.coverUrl ? (
                <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="text-white" size={64} />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">{book.authors.join(', ')}</p>
            </div>

            {/* Rating & Stats */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(book.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {(book.rating || 0).toFixed(1)}/5
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">({reviews.length} reviews)</span>
              </div>

              {book.year && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar size={20} />
                  <span>{book.year}</span>
                </div>
              )}

              {book.pageCount && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <BookOpen size={20} />
                  <span>{book.pageCount} pages</span>
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y dark:border-slate-700">
              {book.publisher && (
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Publisher</p>
                  <p className="text-slate-900 dark:text-white">{book.publisher}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Language</p>
                  <p className="text-slate-900 dark:text-white">{book.language}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={20} />
                Add to List
              </Button>
              <Button
                size="lg"
                variant={isFavorited ? 'default' : 'outline'}
                onClick={handleFavorite}
              >
                <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Description */}
        {book.description && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Description</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{book.description}</p>
          </section>
        )}

        {/* Reviews Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Reviews</h2>

          {/* Add Review */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview({ ...newReview, rating: i })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={
                          i <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your review"
                  className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Review
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="Share your thoughts about this book"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Submit Review
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b dark:border-slate-700 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{review.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      by {review.author} on {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{review.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="py-12 border-t dark:border-slate-800">
            <BookCarousel
              title="📚 Readers Also Loved"
              books={recommendations}
            />
          </section>
        )}
      </div>
    </main>
  );
}
