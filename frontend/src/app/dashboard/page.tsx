'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Heart, List, TrendingUp, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface DashboardStats {
  booksRead: number;
  currentlyReading: number;
  favorites: number;
  readingStreak: number;
  totalPages: number;
  achievements: number;
}

interface TabType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    booksRead: 24,
    currentlyReading: 3,
    favorites: 8,
    readingStreak: 15,
    totalPages: 5420,
    achievements: 7,
  });

  const tabs: TabType[] = [
    { id: 'overview', name: 'Overview', icon: <BookOpen size={20} /> },
    { id: 'favorites', name: 'Favorites', icon: <Heart size={20} /> },
    { id: 'reading-list', name: 'Reading Lists', icon: <List size={20} /> },
    { id: 'progress', name: 'Progress', icon: <TrendingUp size={20} /> },
    { id: 'achievements', name: 'Achievements', icon: <Trophy size={20} /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <section className="px-4 py-8 border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Your Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Track your reading journey and discover insights</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
          <div className="lg:col-span-1 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Books Read</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.booksRead}</p>
              </div>
              <BookOpen className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="lg:col-span-1 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Currently Reading</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.currentlyReading}</p>
              </div>
              <BookOpen className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="lg:col-span-1 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Favorites</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.favorites}</p>
              </div>
              <Heart className="text-red-600" size={32} />
            </div>
          </div>

          <div className="lg:col-span-1 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Reading Streak</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.readingStreak}</p>
              </div>
              <Flame className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="lg:col-span-1 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Pages</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPages.toLocaleString()}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>

          <div className="lg:col-span-1 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Achievements</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.achievements}</p>
              </div>
              <Trophy className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b dark:border-slate-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'favorites' && <FavoritesTab />}
          {activeTab === 'reading-list' && <ReadingListTab />}
          {activeTab === 'progress' && <ProgressTab stats={stats} />}
          {activeTab === 'achievements' && <AchievementsTab />}
        </div>
      </div>
    </main>
  );
}

function OverviewTab({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Reading Goal 2024</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Books Read</span>
                <span className="font-bold text-slate-900 dark:text-white">24/30</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Pages Read</span>
                <span className="font-bold text-slate-900 dark:text-white">5,420/8,000</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67.75%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { title: 'Added "The Great Gatsby" to favorites', date: '2 hours ago' },
              { title: 'Finished "To Kill a Mockingbird"', date: '1 day ago' },
              { title: 'Started "1984"', date: '2 days ago' },
            ].map((activity, i) => (
              <div key={i} className="text-sm">
                <p className="text-slate-900 dark:text-white font-medium">{activity.title}</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-2">Keep Your Streak Going!</h3>
        <p className="text-purple-100 mb-4">You're on a 15-day reading streak. Keep reading daily to maintain it!</p>
        <Link href="/search">
          <Button className="bg-white text-purple-600 hover:bg-slate-100">Find Your Next Book</Button>
        </Link>
      </div>
    </div>
  );
}

function FavoritesTab() {
  const favorites = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: '2', title: '1984', author: 'George Orwell' },
    { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: '5', title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { id: '6', title: 'The Hobbit', author: 'J.R.R. Tolkien' },
    { id: '7', title: 'Brave New World', author: 'Aldous Huxley' },
    { id: '8', title: 'Jane Eyre', author: 'Charlotte Brontë' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((book) => (
          <div key={book.id} className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded mb-4" />
            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2">{book.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{book.author}</p>
            <Button size="sm" variant="outline" className="w-full mt-4">Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadingListTab() {
  const lists = [
    { name: 'Currently Reading', count: 3, color: 'bg-blue-500' },
    { name: 'Want to Read', count: 12, color: 'bg-purple-500' },
    { name: 'Read', count: 24, color: 'bg-green-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {lists.map((list) => (
          <div key={list.name} className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <div className={`w-12 h-12 rounded-lg ${list.color} mb-4`} />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{list.name}</h4>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{list.count}</p>
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">View List</Button>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Create New List</h3>
        <input
          type="text"
          placeholder="List name..."
          className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-700 mb-4"
        />
        <Button className="bg-purple-600 hover:bg-purple-700">Create List</Button>
      </div>
    </div>
  );
}

function ProgressTab({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Reading This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{day}</p>
              <div className={`w-full aspect-square rounded ${i < 5 ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Genre Distribution</h4>
          <div className="space-y-3">
            {['Fiction', 'Mystery', 'Sci-Fi', 'Romance'].map((genre) => (
              <div key={genre}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{genre}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.floor(Math.random() * 30)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Average Rating by Month</h4>
          <div className="flex gap-2 items-end h-32">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t"
                  style={{ height: `${Math.floor(Math.random() * 100)}%` }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 mt-2">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementsTab() {
  const achievements = [
    { icon: '📚', name: 'Bookworm', description: 'Read 10 books', unlocked: true },
    { icon: '🔥', name: 'On Fire', description: '7-day reading streak', unlocked: true },
    { icon: '⭐', name: 'Rating Master', description: 'Rate 50 books', unlocked: false },
    { icon: '🎉', name: 'Century Club', description: 'Read 100 books', unlocked: false },
    { icon: '🌟', name: 'Diverse Reader', description: 'Read from 5 genres', unlocked: true },
    { icon: '✍️', name: 'Critic', description: 'Write 10 reviews', unlocked: false },
    { icon: '❤️', name: 'Collector', description: 'Add 25 favorites', unlocked: true },
    { icon: '🚀', name: 'Speed Reader', description: 'Read 10 books in a month', unlocked: false },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.name}
            className={`p-6 rounded-lg text-center transition-all ${
              achievement.unlocked
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400'
                : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 opacity-60'
            }`}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h4 className="font-bold text-slate-900 dark:text-white">{achievement.name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
            {achievement.unlocked && (
              <div className="mt-3 text-xs font-bold text-yellow-600">✓ UNLOCKED</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
