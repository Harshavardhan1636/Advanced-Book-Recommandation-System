'use client'

import { useState } from 'react'
import { educationalAPI } from '@/lib/api'
import { BookOpen, User, BookMarked, HelpCircle, Timeline, Zap, Loader2 } from 'lucide-react'

type ContentType = 'summary' | 'author' | 'analysis' | 'guide' | 'timeline' | 'vocabulary'

interface ContentConfig {
  type: ContentType
  label: string
  icon: string
  description: string
  color: string
}

const contentTypes: ContentConfig[] = [
  { type: 'summary', label: 'Book Summaries', icon: '📖', description: 'AI-generated book summaries', color: 'bg-blue-500/20 border-blue-500/50' },
  { type: 'author', label: 'Author Profiles', icon: '✍️', description: 'Learn about book authors', color: 'bg-purple-500/20 border-purple-500/50' },
  { type: 'analysis', label: 'Literary Analysis', icon: '🎓', description: 'Deep literary analysis', color: 'bg-green-500/20 border-green-500/50' },
  { type: 'guide', label: 'Reading Guides', icon: '📚', description: 'Discussion questions & guides', color: 'bg-orange-500/20 border-orange-500/50' },
  { type: 'timeline', label: 'Timeline', icon: '📅', description: 'Historical context timeline', color: 'bg-pink-500/20 border-pink-500/50' },
  { type: 'vocabulary', label: 'Vocabulary', icon: '📕', description: 'Key terms & vocabulary', color: 'bg-indigo-500/20 border-indigo-500/50' },
]

export default function EducationalPage() {
  const [activeContent, setActiveContent] = useState<ContentType>('summary')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Summary State
  const [summaryInput, setSummaryInput] = useState('')
  const [summaryType, setSummaryType] = useState('comprehensive')
  const [summaryResult, setSummaryResult] = useState<any | null>(null)

  // Author State
  const [authorInput, setAuthorInput] = useState('')
  const [authorResult, setAuthorResult] = useState<any | null>(null)

  // Analysis State
  const [analysisInput, setAnalysisInput] = useState('')
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)

  // Guide State
  const [guideInput, setGuideInput] = useState('')
  const [guideAudience, setGuideAudience] = useState('general')
  const [guideResult, setGuideResult] = useState<any | null>(null)

  // Timeline State
  const [timelineInput, setTimelineInput] = useState('')
  const [timelineResult, setTimelineResult] = useState<any | null>(null)

  // Vocabulary State
  const [vocabInput, setVocabInput] = useState('')
  const [vocabDifficulty, setVocabDifficulty] = useState('intermediate')
  const [vocabResult, setVocabResult] = useState<any[]>([])

  const handleGenerateSummary = async () => {
    if (!summaryInput.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await educationalAPI.getBookSummary(summaryInput, summaryType)
      setSummaryResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAuthorProfile = async () => {
    if (!authorInput.trim()) {
      setError('Please enter an author name')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await educationalAPI.getAuthorProfile(authorInput)
      setAuthorResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch author profile')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAnalysis = async () => {
    if (!analysisInput.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await educationalAPI.getLiteraryAnalysis(analysisInput)
      setAnalysisResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to get analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleGetReadingGuide = async () => {
    if (!guideInput.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await educationalAPI.getReadingGuide(guideInput, guideAudience)
      setGuideResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to get reading guide')
    } finally {
      setLoading(false)
    }
  }

  const handleGetTimeline = async () => {
    if (!timelineInput.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await educationalAPI.getTimeline(timelineInput)
      setTimelineResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to get timeline')
    } finally {
      setLoading(false)
    }
  }

  const handleGetVocabulary = async () => {
    if (!vocabInput.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await educationalAPI.getVocabulary(vocabInput, vocabDifficulty)
      setVocabResult(result.vocabulary || [])
    } catch (err: any) {
      setError(err.message || 'Failed to get vocabulary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BookMarked className="text-green-500" size={36} />
            Educational Center
          </h1>
          <p className="text-muted-foreground">Comprehensive learning resources for every book</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive rounded-lg p-4 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Content Type Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {contentTypes.map(content => (
            <button
              key={content.type}
              onClick={() => {
                setActiveContent(content.type)
                setError(null)
              }}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                activeContent === content.type ? `${content.color} border-2` : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-1">{content.icon}</div>
              <p className="text-xs font-medium text-foreground line-clamp-2">{content.label}</p>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-lg border border-border p-8">
          {/* Book Summaries */}
          {activeContent === 'summary' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen size={28} /> Book Summaries
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Summary Type</label>
                  <select
                    value={summaryType}
                    onChange={(e) => setSummaryType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="brief">Brief Summary</option>
                    <option value="comprehensive">Comprehensive Summary</option>
                    <option value="chapter-by-chapter">Chapter by Chapter</option>
                    <option value="key-points">Key Points Only</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>📖 Get Summary</>
                  )}
                </button>

                {summaryResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
                    <p className="text-foreground whitespace-pre-wrap text-sm">{JSON.stringify(summaryResult, null, 2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Author Profiles */}
          {activeContent === 'author' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <User size={28} /> Author Profiles
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Author Name</label>
                  <input
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    placeholder="e.g., J.K. Rowling"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleGetAuthorProfile}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>✍️ Get Profile</>
                  )}
                </button>

                {authorResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
                    <p className="text-foreground whitespace-pre-wrap text-sm">{JSON.stringify(authorResult, null, 2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Literary Analysis */}
          {activeContent === 'analysis' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                🎓 Literary Analysis
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={analysisInput}
                    onChange={(e) => setAnalysisInput(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleGetAnalysis}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>📚 Analyze</>
                  )}
                </button>

                {analysisResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Themes</h3>
                        <p className="text-sm text-foreground">{analysisResult.themes?.join(', ') || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Writing Style</h3>
                        <p className="text-sm text-foreground">{analysisResult.writing_style || 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Character Development</h3>
                        <p className="text-sm text-foreground">{analysisResult.characters || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reading Guides */}
          {activeContent === 'guide' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <HelpCircle size={28} /> Reading Guides
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={guideInput}
                    onChange={(e) => setGuideInput(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Target Audience</label>
                  <select
                    value={guideAudience}
                    onChange={(e) => setGuideAudience(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="general">General Readers</option>
                    <option value="students">High School Students</option>
                    <option value="college">College Students</option>
                    <option value="educators">Educators</option>
                  </select>
                </div>

                <button
                  onClick={handleGetReadingGuide}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>📚 Get Guide</>
                  )}
                </button>

                {guideResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Discussion Questions</h3>
                        {guideResult.questions?.map((q: string, idx: number) => (
                          <p key={idx} className="text-sm text-foreground mb-2">• {q}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeContent === 'timeline' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Timeline size={28} /> Historical Timeline
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={timelineInput}
                    onChange={(e) => setTimelineInput(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleGetTimeline}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>📅 Get Timeline</>
                  )}
                </button>

                {timelineResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
                    <p className="text-foreground whitespace-pre-wrap text-sm">{JSON.stringify(timelineResult, null, 2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vocabulary */}
          {activeContent === 'vocabulary' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Zap size={28} /> Key Vocabulary
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={vocabInput}
                    onChange={(e) => setVocabInput(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Difficulty Level</label>
                  <select
                    value={vocabDifficulty}
                    onChange={(e) => setVocabDifficulty(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <button
                  onClick={handleGetVocabulary}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>📕 Get Vocabulary</>
                  )}
                </button>

                {vocabResult.length > 0 && (
                  <div className="space-y-3">
                    {vocabResult.map((word, idx) => (
                      <div key={idx} className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="font-bold text-foreground">{word.word || word}</p>
                        <p className="text-sm text-muted-foreground mt-1">{word.definition || ''}</p>
                      </div>
                    ))}
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
