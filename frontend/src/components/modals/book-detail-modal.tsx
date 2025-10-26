'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Star, Heart, Plus, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface BookDetailModalProps {
  book: {
    id: string;
    title: string;
    authors: string[];
    coverUrl?: string;
    rating?: number;
    year?: number;
    description?: string;
  };
  onClose: () => void;
  onAddToFavorites?: (bookId: string) => void;
  onAddToList?: (bookId: string) => void;
}

export function BookDetailModal({
  book,
  onClose,
  onAddToFavorites,
  onAddToList,
}: BookDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      if (onAddToFavorites) {
        await onAddToFavorites(book.id);
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = async () => {
    setIsLoading(true);
    try {
      if (onAddToList) {
        await onAddToList(book.id);
        toast.success('Added to reading list');
      }
    } catch (error) {
      toast.error('Failed to add to list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.authors.join(', ')}`,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {book.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-center md:col-span-1">
              <div className="relative w-40 h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg overflow-hidden">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-center">No Cover</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Authors
                </h3>
                <p className="text-slate-900 dark:text-white">{book.authors.join(', ')}</p>
              </div>

              {book.year && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Published
                  </h3>
                  <p className="text-slate-900 dark:text-white">{book.year}</p>
                </div>
              )}

              {book.rating && book.rating > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rating
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(book.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {book.rating.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleFavorite}
                  disabled={isLoading}
                  variant={isFavorited ? 'default' : 'outline'}
                >
                  <Heart
                    size={18}
                    className={isFavorited ? 'fill-current' : ''}
                  />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleAddToList}
                  disabled={isLoading}
                >
                  <Plus size={18} />
                  Add to List
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>

          {book.description && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-slate-700 dark:text-slate-300 line-clamp-6">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
