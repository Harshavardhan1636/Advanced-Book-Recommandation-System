'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { BookDetailModal } from './modals/book-detail-modal';
import { toast } from 'sonner';

interface BookCardProps {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  rating?: number;
  year?: number;
  description?: string;
  onAddToFavorites?: (bookId: string) => void;
  onAddToList?: (bookId: string) => void;
}

export function BookCard({
  id,
  title,
  authors,
  coverUrl,
  rating = 0,
  year,
  description,
  onAddToFavorites,
  onAddToList,
}: BookCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      if (onAddToFavorites) {
        await onAddToFavorites(id);
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
        await onAddToList(id);
        toast.success('Added to reading list');
      }
    } catch (error) {
      toast.error('Failed to add to list');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="group h-full flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 hover:scale-105">
        <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as any).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
              <span className="text-white text-sm text-center px-4">No Cover</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => setShowDetails(true)}
            >
              View Details
            </Button>
          </div>

          {rating > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-slate-900 px-2 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
              <Star size={14} fill="currentColor" />
              {rating.toFixed(1)}
            </div>
          )}

          {year && (
            <div className="absolute top-2 left-2 bg-slate-900/80 text-white px-2 py-1 rounded text-xs font-semibold">
              {year}
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm line-clamp-2 text-slate-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {authors.join(', ')}
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleFavorite}
              disabled={isLoading}
            >
              <Heart
                size={16}
                className={isFavorited ? 'fill-red-500 text-red-500' : ''}
              />
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleAddToList}
              disabled={isLoading}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>

      {showDetails && (
        <BookDetailModal
          book={{
            id,
            title,
            authors,
            coverUrl,
            rating,
            year,
            description,
          }}
          onClose={() => setShowDetails(false)}
          onAddToFavorites={onAddToFavorites}
          onAddToList={onAddToList}
        />
      )}
    </>
  );
}
