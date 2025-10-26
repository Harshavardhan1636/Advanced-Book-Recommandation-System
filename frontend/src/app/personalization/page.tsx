'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  Sliders,
  BookOpen,
  Clock,
  Lightbulb,
  Target,
  Palette,
  AlertCircle,
  CheckCircle,
  Save,
  RotateCcw,
} from 'lucide-react'

interface PersonalizationSettings {
  favoriteGenres: string[]
  readingSpeed: 'slow' | 'medium' | 'fast'
  readingTime: string
  recommendationStyle: 'relaxed' | 'challenging' | 'varied'
  themePreference: 'light' | 'dark' | 'auto'
  languagePreference: string
  contentMaturity: 'all-ages' | 'teen' | 'adult'
  notifyNewReleases: boolean
  notifyRecommendations: boolean
  showRatings: boolean
  showReviews: boolean
}

export default function PersonalizationPage() {
  const { theme } = useTheme()
  const [settings, setSettings] = useState<PersonalizationSettings>({
    favoriteGenres: ['Science Fiction', 'Mystery', 'Fantasy'],
    readingSpeed: 'medium',
    readingTime: '60',
    recommendationStyle: 'varied',
    themePreference: 'dark',
    languagePreference: 'en',
    contentMaturity: 'adult',
    notifyNewReleases: true,
    notifyRecommendations: true,
    showRatings: true,
    showReviews: true,
  })
  const [savedSettings, setSavedSettings] = useState(settings)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const genres = [
    'Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Historical',
    'Non-Fiction',
    'Biography',
    'Self-Help',
    'Thriller',
  ]

  const handleGenreToggle = useCallback(
    (genre: string) => {
      setSettings((prev) => {
        const updated = prev.favoriteGenres.includes(genre)
          ? prev.favoriteGenres.filter((g) => g !== genre)
          : [...prev.favoriteGenres, genre]

        return { ...prev, favoriteGenres: updated }
      })
      setHasChanges(true)
    },
    []
  )

  const handleSettingChange = useCallback((key: keyof PersonalizationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }, [])

  const handleSaveSettings = useCallback(() => {
    setSavedSettings(settings)
    setHasChanges(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }, [settings])

  const handleReset = useCallback(() => {
    setSettings(savedSettings)
    setHasChanges(false)
  }, [savedSettings])

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sliders className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Personalization Settings</h1>
          </div>
          <p className={`${textColor} text-lg`}>Customize your reading experience</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 font-semibold">Settings saved successfully!</p>
          </div>
        )}

        <div className="space-y-6">
          <div className={`border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              Reading Preferences
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-3">Favorite Genres</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        settings.favoriteGenres.includes(genre)
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                            : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Reading Speed
                  </label>
                  <select
                    value={settings.readingSpeed}
                    onChange={(e) =>
                      handleSettingChange('readingSpeed', e.target.value as any)
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                  >
                    <option value="slow">Slow (30-50 pages/day)</option>
                    <option value="medium">Medium (50-100 pages/day)</option>
                    <option value="fast">Fast (100+ pages/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Reading Time per Day (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.readingTime}
                    onChange={(e) =>
                      handleSettingChange('readingTime', e.target.value)
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Recommendation Style
                </label>
                <div className="space-y-2">
                  {['relaxed', 'challenging', 'varied'].map((style) => (
                    <label key={style} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recommendation-style"
                        value={style}
                        checked={settings.recommendationStyle === style}
                        onChange={(e) =>
                          handleSettingChange('recommendationStyle', e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{style}</span>
                      <span className={`${textColor} text-sm`}>
                        {style === 'relaxed' &&
                          '- Recommend similar to books you love'}
                        {style === 'challenging' &&
                          '- Recommend different genres and styles'}
                        {style === 'varied' &&
                          '- Mix of similar and new recommendations'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Palette className="w-6 h-6 text-pink-500" />
              Display Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Theme Preference</label>
                <div className="space-y-2">
                  {['light', 'dark', 'auto'].map((themeMode) => (
                    <label key={themeMode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={themeMode}
                        checked={settings.themePreference === themeMode}
                        onChange={(e) =>
                          handleSettingChange('themePreference', e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{themeMode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Language</label>
                <select
                  value={settings.languagePreference}
                  onChange={(e) =>
                    handleSettingChange('languagePreference', e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Content Maturity</label>
                <div className="space-y-2">
                  {['all-ages', 'teen', 'adult'].map((maturity) => (
                    <label
                      key={maturity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="maturity"
                        value={maturity}
                        checked={settings.contentMaturity === maturity}
                        onChange={(e) =>
                          handleSettingChange('contentMaturity', e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{maturity.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`border ${cardColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-500" />
              Content Preferences
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showRatings}
                  onChange={(e) =>
                    handleSettingChange('showRatings', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span>Show book ratings</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showReviews}
                  onChange={(e) =>
                    handleSettingChange('showReviews', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span>Show user reviews</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyNewReleases}
                  onChange={(e) =>
                    handleSettingChange('notifyNewReleases', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span>Notify me about new releases from favorite authors</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyRecommendations}
                  onChange={(e) =>
                    handleSettingChange(
                      'notifyRecommendations',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4"
                />
                <span>Notify me about personalized recommendations</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
