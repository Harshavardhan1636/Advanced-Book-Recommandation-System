'use client'

import { useState } from 'react'
import { aiAPI } from '@/lib/api'
import { Loader2, MessageCircle, BookOpen, Sparkles, Film, RotateCcw } from 'lucide-react'

type ActiveTab = 'summary' | 'qa' | 'reading-list' | 'compare' | 'adaptations' | 'translate'

interface TabConfig {
  id: ActiveTab
  label: string
  icon: string
  description: string
}

const tabs: TabConfig[] = [
  { id: 'summary', label: 'AI Summaries', icon: '📝', description: 'Get AI-generated book summaries' },
  { id: 'qa', label: 'Ask AI', icon: '❓', description: 'Ask questions about any book' },
  { id: 'reading-list', label: 'AI Reading List', icon: '📚', description: 'Generate personalized reading lists' },
  { id: 'compare', label: 'Compare Books', icon: '⚖️', description: 'Compare books using AI' },
  { id: 'adaptations', label: 'Adaptations', icon: '🎬', description: 'Find movie/TV adaptations' },
  { id: 'translate', label: 'Translate', icon: '🌍', description: 'Translate book content' },
]

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Summary Tab State
  const [summaryInput, setSummaryInput] = useState('')
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [summaryResult, setSummaryResult] = useState<string | null>(null)

  // Q&A Tab State
  const [qaBookId, setQaBookId] = useState('')
  const [qaQuestion, setQaQuestion] = useState('')
  const [qaResult, setQaResult] = useState<string | null>(null)

  // Reading List Tab State
  const [readingMood, setReadingMood] = useState('adventurous')
  const [readingCount, setReadingCount] = useState(10)
  const [readingResults, setReadingResults] = useState<any[]>([])

  // Compare Tab State
  const [compareBook1, setCompareBook1] = useState('')
  const [compareBook2, setCompareBook2] = useState('')
  const [compareResult, setCompareResult] = useState<any | null>(null)

  // Adaptations Tab State
  const [adaptationsInput, setAdaptationsInput] = useState('')
  const [adaptationsResults, setAdaptationsResults] = useState<any[]>([])

  // Translate Tab State
  const [translateText, setTranslateText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [translationResult, setTranslationResult] = useState<string | null>(null)

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ]

  const handleGenerateSummary = async () => {
    if (!summaryInput.trim()) {
      setError('Please enter a book title or ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await aiAPI.generateSummary(summaryInput, summaryLength)
      setSummaryResult(result.summary)
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!qaBookId.trim() || !qaQuestion.trim()) {
      setError('Please enter both a book ID and a question')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await aiAPI.askQuestion(qaBookId, qaQuestion)
      setQaResult(result.answer)
    } catch (err: any) {
      setError(err.message || 'Failed to answer question')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReadingList = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await aiAPI.generateReadingList(readingMood, readingCount)
      setReadingResults(result.suggestions || [])
    } catch (err: any) {
      setError(err.message || 'Failed to generate reading list')
    } finally {
      setLoading(false)
    }
  }

  const handleCompareBooks = async () => {
    if (!compareBook1.trim() || !compareBook2.trim()) {
      setError('Please enter both book IDs')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await aiAPI.compareBooks(compareBook1, compareBook2)
      setCompareResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to compare books')
    } finally {
      setLoading(false)
    }
  }

  const handleFindAdaptations = async () => {
    if (!adaptationsInput.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await aiAPI.findMovieAdaptations(adaptationsInput)
      setAdaptationsResults(result.adaptations || [])
    } catch (err: any) {
      setError(err.message || 'Failed to find adaptations')
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async () => {
    if (!translateText.trim()) {
      setError('Please enter text to translate')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await aiAPI.translateText(translateText, targetLanguage)
      setTranslationResult(result.translated_text)
    } catch (err: any) {
      setError(err.message || 'Failed to translate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="text-purple-500" size={36} />
            AI Features Hub
          </h1>
          <p className="text-muted-foreground">Powered by advanced AI and machine learning technology</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive rounded-lg p-4 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setError(null)
              }}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                activeTab === tab.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <p className="text-xs font-medium text-foreground line-clamp-2">{tab.label}</p>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg border border-border p-8">
          {/* AI Summaries */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen size={28} /> AI-Generated Book Summaries
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book Title or ID</label>
                  <input
                    type="text"
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="e.g., The Great Gatsby or work_id"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Summary Length</label>
                  <div className="flex gap-3">
                    {['short', 'medium', 'long'].map(length => (
                      <button
                        key={length}
                        onClick={() => setSummaryLength(length as any)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                          summaryLength === length
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {length === 'short' && '📄 Short (2-3 min read)'}
                        {length === 'medium' && '📖 Medium (5-7 min read)'}
                        {length === 'long' && '📕 Long (10+ min read)'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate Summary</>
                  )}
                </button>

                {summaryResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border">
                    <p className="text-foreground whitespace-pre-wrap">{summaryResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle size={28} /> Ask Questions About Books
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={qaBookId}
                    onChange={(e) => setQaBookId(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Question</label>
                  <textarea
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                    placeholder="e.g., What are the main themes of this book?"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleAskQuestion}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Answering...
                    </>
                  ) : (
                    <>❓ Get Answer</>
                  )}
                </button>

                {qaResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border">
                    <p className="text-foreground whitespace-pre-wrap">{qaResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reading List */}
          {activeTab === 'reading-list' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                📚 AI Reading List Generator
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Reading Mood</label>
                  <select
                    value={readingMood}
                    onChange={(e) => setReadingMood(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    {['adventurous', 'relaxed', 'thoughtful', 'happy', 'sad'].map(mood => (
                      <option key={mood} value={mood}>
                        {mood === 'adventurous' && '🚀'}
                        {mood === 'relaxed' && '😌'}
                        {mood === 'thoughtful' && '🤔'}
                        {mood === 'happy' && '😊'}
                        {mood === 'sad' && '😢'}
                        {' '}{mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Number of Recommendations</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={readingCount}
                    onChange={(e) => setReadingCount(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleGenerateReadingList}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate List</>
                  )}
                </button>

                {readingResults.length > 0 && (
                  <div className="space-y-3">
                    {readingResults.map((book, idx) => (
                      <div key={idx} className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="font-medium text-foreground">{idx + 1}. {book.title || book}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compare Books */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">⚖️ AI Book Comparison</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Book ID</label>
                  <input
                    type="text"
                    value={compareBook1}
                    onChange={(e) => setCompareBook1(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Second Book ID</label>
                  <input
                    type="text"
                    value={compareBook2}
                    onChange={(e) => setCompareBook2(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
              </div>

              <button
                onClick={handleCompareBooks}
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>⚖️ Compare</>
                )}
              </button>

              {compareResult && (
                <div className="bg-secondary/50 rounded-lg p-6 border border-border">
                  <pre className="text-foreground whitespace-pre-wrap text-sm">{JSON.stringify(compareResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {/* Adaptations */}
          {activeTab === 'adaptations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Film size={28} /> Movie & TV Adaptations
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={adaptationsInput}
                    onChange={(e) => setAdaptationsInput(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleFindAdaptations}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>🔍 Find Adaptations</>
                  )}
                </button>

                {adaptationsResults.length > 0 && (
                  <div className="space-y-3">
                    {adaptationsResults.map((adaptation, idx) => (
                      <div key={idx} className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="font-medium text-foreground">{adaptation.title || adaptation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Translate */}
          {activeTab === 'translate' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">🌍 Translation</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Text to Translate</label>
                  <textarea
                    value={translateText}
                    onChange={(e) => setTranslateText(e.target.value)}
                    placeholder="Enter text to translate..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Target Language</label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>🌐 Translate</>
                  )}
                </button>

                {translationResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border">
                    <p className="text-foreground whitespace-pre-wrap">{translationResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
