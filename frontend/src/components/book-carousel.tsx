'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { BookCard } from './book-card';

interface CarouselBook {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  rating?: number;
  year?: number;
  description?: string;
}

interface BookCarouselProps {
  title: string;
  books: CarouselBook[];
  onAddToFavorites?: (bookId: string) => void;
  onAddToList?: (bookId: string) => void;
}

export function BookCarousel({
  title,
  books,
  onAddToFavorites,
  onAddToList,
}: BookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 768) setVisibleCount(2);
      else if (width < 1024) setVisibleCount(3);
      else if (width < 1280) setVisibleCount(4);
      else setVisibleCount(5);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, books.length - visibleCount + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, books.length, visibleCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, books.length - visibleCount) : prev - 1));
    setAutoScroll(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, books.length - visibleCount + 1));
    setAutoScroll(false);
  };

  if (books.length === 0) return null;

  const maxIndex = Math.max(0, books.length - visibleCount);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="flex-shrink-0"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <BookCard
                {...book}
                onAddToFavorites={onAddToFavorites}
                onAddToList={onAddToList}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.max(1, Math.ceil(books.length / visibleCount)) }).map(
          (_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setAutoScroll(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === Math.floor(currentIndex)
                  ? 'bg-purple-600'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
}
