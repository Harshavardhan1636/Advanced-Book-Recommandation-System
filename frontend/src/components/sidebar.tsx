'use client'

import { Home, Search, TrendingUp, Heart, User } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <nav className="space-y-2">
        <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </a>
        <a href="/search" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </a>
        <a href="/trending" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
          <TrendingUp className="w-5 h-5" />
          <span>Trending</span>
        </a>
        <a href="/favorites" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
          <Heart className="w-5 h-5" />
          <span>Favorites</span>
        </a>
        <a href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </a>
      </nav>
    </aside>
  )
}
