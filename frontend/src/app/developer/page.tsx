'use client'

import { useState } from 'react'
import { Copy, Eye, EyeOff, Plus, Trash2, Code, RefreshCw, Download, Settings } from 'lucide-react'

interface APIKey {
  id: string
  name: string
  key: string
  masked: string
  created_at: string
  last_used?: string
  requests: number
}

interface Webhook {
  id: string
  url: string
  events: string[]
  active: boolean
  created_at: string
  last_triggered?: string
}

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'webhooks' | 'sdks'>('overview')
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'api_key_demo_production_replace_with_real_key_12345',
      masked: 'api_key_demo_***************************y_12345',
      created_at: '2025-01-15',
      last_used: '2025-10-26',
      requests: 15234,
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'api_key_demo_development_replace_with_real_key_67890',
      masked: 'api_key_demo_***************************y_67890',
      created_at: '2025-09-10',
      requests: 45678,
    },
  ])
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      url: 'https://yourapp.com/webhooks/book-completed',
      events: ['book.completed', 'achievement.unlocked'],
      active: true,
      created_at: '2025-10-01',
      last_triggered: '2025-10-26',
    },
    {
      id: '2',
      url: 'https://yourapp.com/webhooks/recommendations',
      events: ['recommendation.generated'],
      active: false,
      created_at: '2025-09-15',
    },
  ])
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [showNewKeyForm, setShowNewKeyForm] = useState(false)
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
  }

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Developer Console</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage API keys, webhooks, and integrations</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Settings },
            { id: 'keys', label: 'API Keys', icon: Code },
            { id: 'webhooks', label: 'Webhooks', icon: RefreshCw },
            { id: 'sdks', label: 'SDKs', icon: Download },
          ].map(tab => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <TabIcon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'API Requests', value: '2.5M', change: '+12%' },
              { label: 'Webhooks', value: apiKeys.length, change: 'Active' },
              { label: 'API Keys', value: apiKeys.length, change: 'Managed' },
              { label: 'Uptime', value: '99.99%', change: 'Excellent' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{stat.change}</p>
              </div>
            ))}

            {/* Documentation Card */}
            <div className="col-span-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Getting Started</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Check our comprehensive documentation to integrate BookHub API into your application
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                  Read Docs
                </button>
                <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium">
                  View Examples
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">API Keys</h2>
              <button
                onClick={() => setShowNewKeyForm(!showNewKeyForm)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <Plus size={18} />
                Create Key
              </button>
            </div>

            {showNewKeyForm && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New API Key</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Mobile App, Web Client"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Environment</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                      <option>Production</option>
                      <option>Development</option>
                      <option>Testing</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewKeyForm(false)}
                      className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {apiKeys.map(apiKey => (
                <div
                  key={apiKey.id}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{apiKey.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Created {apiKey.created_at}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <code className="text-sm text-slate-900 dark:text-white font-mono">
                      {showKey[apiKey.id] ? apiKey.key : apiKey.masked}
                    </code>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
                      >
                        {showKey[apiKey.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Requests</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{apiKey.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Last Used</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{apiKey.last_used || 'Never'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium text-sm">
                      Rotate
                    </button>
                    <button
                      onClick={() => deleteKey(apiKey.id)}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Webhooks</h2>
              <button
                onClick={() => setShowNewWebhookForm(!showNewWebhookForm)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <Plus size={18} />
                Add Webhook
              </button>
            </div>

            {showNewWebhookForm && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Webhook Endpoint</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://yourapp.com/webhooks/events"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Events</label>
                    <div className="space-y-2">
                      {['book.completed', 'achievement.unlocked', 'recommendation.generated', 'reading.paused'].map(event => (
                        <label key={event} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewWebhookForm(false)}
                      className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {webhooks.map(webhook => (
                <div
                  key={webhook.id}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono text-sm">{webhook.url}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Created {webhook.created_at}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        webhook.active
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Events</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map(event => (
                        <span key={event} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded text-xs">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  {webhook.last_triggered && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">Last triggered: {webhook.last_triggered}</p>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium text-sm">
                      Test
                    </button>
                    <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 transition font-medium text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWebhook(webhook.id)}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SDKs Tab */}
        {activeTab === 'sdks' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">SDKs & Libraries</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { lang: 'Python', desc: 'Official Python SDK', code: 'pip install bookhub' },
                { lang: 'JavaScript', desc: 'Node.js & Browser', code: 'npm install @bookhub/sdk' },
                { lang: 'Go', desc: 'Go client library', code: 'go get github.com/bookhub/go-sdk' },
                { lang: 'Java', desc: 'Java client library', code: 'gradle add "com.bookhub:sdk"' },
                { lang: 'Ruby', desc: 'Ruby gem', code: 'gem install bookhub-sdk' },
                { lang: 'PHP', desc: 'PHP composer package', code: 'composer require bookhub/sdk' },
              ].map((sdk, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{sdk.lang}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{sdk.desc}</p>

                  <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <code className="text-sm text-white font-mono">{sdk.code}</code>
                    <button
                      onClick={() => copyToClipboard(sdk.code)}
                      className="p-2 hover:bg-slate-700 rounded transition text-white"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* REST API Docs */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">REST API Documentation</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Full API documentation with examples and interactive playground
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Browse API Docs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
