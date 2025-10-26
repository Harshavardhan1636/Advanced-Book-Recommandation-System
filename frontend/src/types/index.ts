export interface Book {
  id: string
  work_id?: string
  title: string
  authors?: string[]
  author_name?: string
  cover_url?: string
  cover_i?: number
  rating?: number
  average_rating?: number
  ratings_count?: number
  description?: string
  publish_year?: number
  first_publish_year?: number
  isbn?: string[]
  genres?: string[]
  pages?: number
  language?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  reading_preferences?: ReadingPreferences
  stats?: UserStats
}

export interface ReadingPreferences {
  favorite_genres?: string[]
  preferred_length?: 'short' | 'medium' | 'long'
  reading_speed?: 'slow' | 'average' | 'fast'
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface UserStats {
  books_read?: number
  total_pages?: number
  reading_streak?: number
  achievements?: number
  points?: number
  level?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  total?: number
  unlocked_at?: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  user_name: string
  points: number
  books_read: number
  avatar?: string
}

export interface ReadingPattern {
  date: string
  books_read: number
  pages_read: number
  time_spent?: number
}

export interface Recommendation {
  book: Book
  score: number
  reason: string
  algorithm: 'tfidf' | 'collaborative' | 'hybrid' | 'ml'
}
