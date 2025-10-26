'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Clock, Zap, Target, Calendar } from 'lucide-react';
import { analyticsAPI } from '@/lib/api';

const readingProgressData = [
  { month: 'Jan', books: 2, pages: 520 },
  { month: 'Feb', books: 3, pages: 680 },
  { month: 'Mar', books: 2, pages: 440 },
  { month: 'Apr', books: 4, pages: 920 },
  { month: 'May', books: 3, pages: 620 },
  { month: 'Jun', books: 4, pages: 1040 },
];

const genreDistribution = [
  { name: 'Fiction', value: 35 },
  { name: 'Mystery', value: 25 },
  { name: 'Science Fiction', value: 20 },
  { name: 'Romance', value: 12 },
  { name: 'Other', value: 8 },
];

const ratingDistribution = [
  { rating: '5 Stars', count: 12 },
  { rating: '4 Stars', count: 8 },
  { rating: '3 Stars', count: 3 },
  { rating: '2 Stars', count: 1 },
];

const authorFrequency = [
  { name: 'Author A', books: 5 },
  { name: 'Author B', books: 3 },
  { name: 'Author C', books: 3 },
  { name: 'Author D', books: 2 },
  { name: 'Author E', books: 2 },
];

const COLORS = ['#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [readingPatterns, setReadingPatterns] = useState<any>(null);
  const [genreEvolution, setGenreEvolution] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = 1;
      const [stats, patterns, evolution, pred] = await Promise.all([
        analyticsAPI.getStats().catch(() => null),
        analyticsAPI.getReadingPatterns(userId).catch(() => null),
        analyticsAPI.getGenreEvolution(userId).catch(() => null),
        analyticsAPI.getPredictions(userId).catch(() => null),
      ]);
      
      setAnalyticsData(stats);
      setReadingPatterns(patterns);
      setGenreEvolution(evolution);
      setPredictions(pred);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <section className="px-4 py-8 border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Reading Analytics Dashboard v2
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Advanced insights into your reading habits and patterns</p>
          </div>
          <TrendingUp className="text-purple-600" size={40} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-8 flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'patterns', label: 'Reading Patterns', icon: Calendar },
                { id: 'evolution', label: 'Genre Evolution', icon: TrendingUp },
                { id: 'predictions', label: 'Predictions', icon: Zap },
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300'
                    }`}
                  >
                    <TabIcon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {/* Time Range Selector */}
            <div className="mb-8 flex gap-2">
              {['month', '3months', '6months', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300'
                  }`}
                >
                  {range === 'month' ? 'Last Month' : range === '3months' ? 'Last 3 Months' : range === '6months' ? 'Last 6 Months' : 'This Year'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Reading Progress Chart */}
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Reading Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={readingProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="books"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: '#a855f7' }}
                  name="Books Read"
                />
                <Line
                  type="monotone"
                  dataKey="pages"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="Pages Read"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Genre Distribution */}
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Genre Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Distribution */}
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Authors */}
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Favorite Authors</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={authorFrequency}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="books" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg text-white">
            <BarChart3 size={32} className="mb-2 opacity-80" />
            <h4 className="text-sm font-semibold opacity-80 mb-1">Total Books Read</h4>
            <p className="text-3xl font-bold">24</p>
            <p className="text-sm opacity-75 mt-2">+2 this month</p>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg text-white">
            <TrendingUp size={32} className="mb-2 opacity-80" />
            <h4 className="text-sm font-semibold opacity-80 mb-1">Average Rating</h4>
            <p className="text-3xl font-bold">4.5</p>
            <p className="text-sm opacity-75 mt-2">Out of 5 stars</p>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg text-white">
            <PieChartIcon size={32} className="mb-2 opacity-80" />
            <h4 className="text-sm font-semibold opacity-80 mb-1">Favorite Genre</h4>
            <p className="text-3xl font-bold">Fiction</p>
            <p className="text-sm opacity-75 mt-2">35% of books read</p>
          </div>
        </div>

            {/* Insights */}
            <div className="mt-12 p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-purple-600">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">📊 Your Reading Insights</h3>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>• You're reading <strong>20% more</strong> this year compared to last year</li>
                <li>• Your favorite genre is <strong>Fiction</strong> with 35% of your reads</li>
                <li>• You read an average of <strong>15 pages per session</strong></li>
                <li>• Your reading streak is <strong>15 days</strong> - keep it going!</li>
                <li>• Most of your reading happens in the <strong>evening</strong></li>
              </ul>
            </div>
            )}

            {/* Reading Patterns Tab */}
            {activeTab === 'patterns' && readingPatterns && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Time of Day Patterns
                  </h3>
                  {readingPatterns?.time_distribution ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={readingPatterns.time_distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="minutes" fill="#a855f7" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">No pattern data available</p>
                  )}
                </div>

                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Weekly Distribution
                  </h3>
                  {readingPatterns?.day_distribution ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={readingPatterns.day_distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="books_read" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">No pattern data available</p>
                  )}
                </div>
              </div>
            )}

            {/* Genre Evolution Tab */}
            {activeTab === 'evolution' && genreEvolution && (
              <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Genre Evolution Over Time
                </h3>
                {genreEvolution?.timeline ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={genreEvolution.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Legend />
                      {Object.keys(genreEvolution.timeline[0] || {})
                        .filter(key => key !== 'month')
                        .map((genre, index) => (
                          <Line
                            key={genre}
                            type="monotone"
                            dataKey={genre}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={{ fill: COLORS[index % COLORS.length] }}
                          />
                        ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No evolution data available</p>
                )}
              </div>
            )}

            {/* Predictions Tab */}
            {activeTab === 'predictions' && predictions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target size={20} />
                    Next Book Prediction
                  </h3>
                  {predictions?.next_book ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Predicted Title</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{predictions.next_book.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Match Score</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${predictions.next_book.match_score * 100}%` }}></div>
                        </div>
                        <p className="text-sm mt-1">{(predictions.next_book.match_score * 100).toFixed(0)}% match</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">No predictions available</p>
                  )}
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap size={20} />
                    Reading Goals
                  </h3>
                  {predictions?.goals ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Current Pace</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{predictions.goals.current_pace} books/month</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Goal</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{predictions.goals.target_goal} books</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Projected Completion</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{predictions.goals.projected_completion}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">No goal data available</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
