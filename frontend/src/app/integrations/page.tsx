'use client'

import { useState } from 'react'
import { integrationAPI } from '@/lib/api'
import { Loader2, ShoppingCart, Library, Mail, Calendar, Download, Share2 } from 'lucide-react'

type IntegrationType = 'purchase' | 'library' | 'kindle' | 'goodreads' | 'schedule' | 'email'

interface IntegrationConfig {
  id: IntegrationType
  label: string
  icon: string
  description: string
  color: string
}

const integrations: IntegrationConfig[] = [
  { id: 'purchase', label: 'Purchase Links', icon: '🛒', description: 'Buy books online', color: 'bg-blue-500/20' },
  { id: 'library', label: 'Library Availability', icon: '📚', description: 'Check local libraries', color: 'bg-green-500/20' },
  { id: 'kindle', label: 'Send to Kindle', icon: '📱', description: 'Send to your device', color: 'bg-orange-500/20' },
  { id: 'goodreads', label: 'Goodreads Import', icon: '⭐', description: 'Import your library', color: 'bg-purple-500/20' },
  { id: 'schedule', label: 'Reading Schedule', icon: '📅', description: 'Plan your reading', color: 'bg-pink-500/20' },
  { id: 'email', label: 'Email List', icon: '📧', description: 'Get recommendations', color: 'bg-red-500/20' },
]

export default function IntegrationsPage() {
  const [activeIntegration, setActiveIntegration] = useState<IntegrationType>('purchase')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Purchase Links State
  const [purchaseBookId, setPurchaseBookId] = useState('')
  const [purchaseLinks, setPurchaseLinks] = useState<any[]>([])

  // Library State
  const [libraryIsbn, setLibraryIsbn] = useState('')
  const [libraryZip, setLibraryZip] = useState('')
  const [libraryResult, setLibraryResult] = useState<any | null>(null)

  // Kindle State
  const [kindleBookId, setKindleBookId] = useState('')
  const [kindleEmail, setKindleEmail] = useState('')

  // Goodreads State
  const [goodreadsUserId, setGoodreadsUserId] = useState('')

  // Schedule State
  const [scheduleBookId, setScheduleBookId] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [schedulePages, setSchedulePages] = useState(50)

  // Email State
  const [emailInput, setEmailInput] = useState('')
  const [emailName, setEmailName] = useState('')

  const handleGetPurchaseLinks = async () => {
    if (!purchaseBookId.trim()) {
      setError('Please enter a book ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await integrationAPI.getPurchaseLinks(purchaseBookId)
      setPurchaseLinks(result.purchase_links || [])
      setSuccess('Purchase links loaded!')
    } catch (err: any) {
      setError(err.message || 'Failed to get purchase links')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckLibrary = async () => {
    if (!libraryIsbn.trim()) {
      setError('Please enter an ISBN')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await integrationAPI.checkLibraryAvailability(libraryIsbn, libraryZip)
      setLibraryResult(result)
      setSuccess('Library information loaded!')
    } catch (err: any) {
      setError(err.message || 'Failed to check library availability')
    } finally {
      setLoading(false)
    }
  }

  const handleSendToKindle = async () => {
    if (!kindleBookId.trim() || !kindleEmail.trim()) {
      setError('Please enter both book ID and Kindle email')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await integrationAPI.sendToKindle(kindleBookId, kindleEmail)
      setSuccess('Book sent to Kindle successfully!')
      setKindleBookId('')
      setKindleEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed to send to Kindle')
    } finally {
      setLoading(false)
    }
  }

  const handleImportGoodreads = async () => {
    if (!goodreadsUserId.trim()) {
      setError('Please enter your Goodreads user ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await integrationAPI.importGoodreads(goodreadsUserId)
      setSuccess('Goodreads library imported successfully!')
      setGoodreadsUserId('')
    } catch (err: any) {
      setError(err.message || 'Failed to import Goodreads')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = async () => {
    if (!scheduleBookId.trim() || !scheduleDate.trim()) {
      setError('Please enter book ID and start date')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await integrationAPI.createReadingSchedule(scheduleBookId, scheduleDate, schedulePages)
      setSuccess('Reading schedule created successfully!')
      setScheduleBookId('')
      setScheduleDate('')
    } catch (err: any) {
      setError(err.message || 'Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      setError('Please enter an email address')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await integrationAPI.sendRecommendationsEmail(emailInput, emailName || 'Friend')
      setSuccess('Recommendations sent to email!')
      setEmailInput('')
      setEmailName('')
    } catch (err: any) {
      setError(err.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🔗 Integrations</h1>
          <p className="text-muted-foreground">Connect with your favorite book platforms and services</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive rounded-lg p-4 mb-6">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-600 rounded-lg p-4 mb-6">
            ✓ {success}
          </div>
        )}

        {/* Integration Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {integrations.map(integration => (
            <button
              key={integration.id}
              onClick={() => {
                setActiveIntegration(integration.id)
                setError(null)
                setSuccess(null)
              }}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                activeIntegration === integration.id
                  ? `${integration.color} border-primary`
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-1">{integration.icon}</div>
              <p className="text-xs font-medium text-foreground line-clamp-2">{integration.label}</p>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-lg border border-border p-8">
          {/* Purchase Links */}
          {activeIntegration === 'purchase' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart size={28} /> Buy Books Online
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={purchaseBookId}
                    onChange={(e) => setPurchaseBookId(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleGetPurchaseLinks}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>🛍️ Get Purchase Links</>
                  )}
                </button>

                {purchaseLinks.length > 0 && (
                  <div className="space-y-3">
                    {purchaseLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border hover:bg-secondary transition-all"
                      >
                        <ShoppingCart size={20} className="text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{link.retailer || link.name}</p>
                          <p className="text-sm text-muted-foreground">{link.price && `$${link.price}`}</p>
                        </div>
                        <span className="text-primary font-medium">→</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Library Availability */}
          {activeIntegration === 'library' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Library size={28} /> Check Library Availability
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ISBN</label>
                  <input
                    type="text"
                    value={libraryIsbn}
                    onChange={(e) => setLibraryIsbn(e.target.value)}
                    placeholder="Enter ISBN-13"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ZIP Code (Optional)</label>
                  <input
                    type="text"
                    value={libraryZip}
                    onChange={(e) => setLibraryZip(e.target.value)}
                    placeholder="Enter ZIP code for local libraries"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleCheckLibrary}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>📚 Check Availability</>
                  )}
                </button>

                {libraryResult && (
                  <div className="bg-secondary/50 rounded-lg p-6 border border-border">
                    {libraryResult.available ? (
                      <div>
                        <p className="text-green-600 font-medium mb-2">✓ Available at your library!</p>
                        <p className="text-foreground">{libraryResult.location}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Not currently available at your library</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Send to Kindle */}
          {activeIntegration === 'kindle' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">📱 Send to Kindle</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={kindleBookId}
                    onChange={(e) => setKindleBookId(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Kindle Email</label>
                  <input
                    type="email"
                    value={kindleEmail}
                    onChange={(e) => setKindleEmail(e.target.value)}
                    placeholder="your-name@kindle.com"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleSendToKindle}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>📤 Send to Kindle</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Goodreads Import */}
          {activeIntegration === 'goodreads' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">⭐ Import from Goodreads</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Goodreads User ID</label>
                  <input
                    type="text"
                    value={goodreadsUserId}
                    onChange={(e) => setGoodreadsUserId(e.target.value)}
                    placeholder="Find at goodreads.com/user/show/{user_id}"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleImportGoodreads}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>📚 Import Library</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Reading Schedule */}
          {activeIntegration === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar size={28} /> Create Reading Schedule
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Book ID</label>
                  <input
                    type="text"
                    value={scheduleBookId}
                    onChange={(e) => setScheduleBookId(e.target.value)}
                    placeholder="Enter book ID"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pages Per Day</label>
                  <input
                    type="number"
                    min="10"
                    value={schedulePages}
                    onChange={(e) => setSchedulePages(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleCreateSchedule}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>📅 Create Schedule</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Email Recommendations */}
          {activeIntegration === 'email' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Mail size={28} /> Send Recommendations
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Recipient Name (Optional)</label>
                  <input
                    type="text"
                    value={emailName}
                    onChange={(e) => setEmailName(e.target.value)}
                    placeholder="Name of the recipient"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <button
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>📧 Send Email</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
