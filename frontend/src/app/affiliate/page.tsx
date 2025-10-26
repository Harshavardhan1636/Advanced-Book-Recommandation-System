'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  DollarSign,
  Link as LinkIcon,
  Copy,
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  BarChart3,
  Calendar,
  Download,
  Plus,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AffiliateLink {
  id: string
  bookId: string
  bookTitle: string
  url: string
  clicks: number
  conversions: number
  earnings: number
  createdDate: string
  status: 'active' | 'inactive'
}

interface AffiliateStats {
  totalEarnings: number
  thisMonthEarnings: number
  totalClicks: number
  totalConversions: number
  conversionRate: number
  averageOrderValue: number
}

interface EarningsData {
  week: string
  earnings: number
  clicks: number
  conversions: number
}

export default function AffiliatePage() {
  const { theme } = useTheme()
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [earningsData, setEarningsData] = useState<EarningsData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'links' | 'performance'>('overview')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showNewLinkForm, setShowNewLinkForm] = useState(false)
  const [newLinkData, setNewLinkData] = useState({ bookId: '', retailer: 'amazon' })

  const mockLinks: AffiliateLink[] = [
    {
      id: '1',
      bookId: 'book123',
      bookTitle: 'Educated - Tara Westover',
      url: 'https://bookhub.io/aff/link1',
      clicks: 1250,
      conversions: 87,
      earnings: 435.5,
      createdDate: '2025-08-15',
      status: 'active',
    },
    {
      id: '2',
      bookId: 'book456',
      bookTitle: 'Dune - Frank Herbert',
      url: 'https://bookhub.io/aff/link2',
      clicks: 980,
      conversions: 62,
      earnings: 310.0,
      createdDate: '2025-09-01',
      status: 'active',
    },
    {
      id: '3',
      bookId: 'book789',
      bookTitle: 'The Midnight Library - Matt Haig',
      url: 'https://bookhub.io/aff/link3',
      clicks: 2100,
      conversions: 156,
      earnings: 728.0,
      createdDate: '2025-07-20',
      status: 'active',
    },
    {
      id: '4',
      bookId: 'book012',
      bookTitle: 'It Ends with Us - Colleen Hoover',
      url: 'https://bookhub.io/aff/link4',
      clicks: 450,
      conversions: 31,
      earnings: 155.0,
      createdDate: '2025-09-15',
      status: 'inactive',
    },
  ]

  const mockStats: AffiliateStats = {
    totalEarnings: 1628.5,
    thisMonthEarnings: 580.0,
    totalClicks: 4780,
    totalConversions: 336,
    conversionRate: 7.03,
    averageOrderValue: 21.5,
  }

  const mockEarningsData: EarningsData[] = [
    { week: 'Week 1', earnings: 185, clicks: 950, conversions: 72 },
    { week: 'Week 2', earnings: 245, clicks: 1200, conversions: 89 },
    { week: 'Week 3', earnings: 210, clicks: 1050, conversions: 81 },
    { week: 'Week 4', earnings: 320, clicks: 1580, conversions: 94 },
    { week: 'Week 5', earnings: 280, clicks: 1380, conversions: 102 },
    { week: 'Week 6', earnings: 388, clicks: 1580, conversions: 98 },
  ]

  useEffect(() => {
    setLinks(mockLinks)
    setStats(mockStats)
    setEarningsData(mockEarningsData)
    setLoading(false)
  }, [])

  const copyToClipboard = useCallback((text: string, linkId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(linkId)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleCreateLink = useCallback(() => {
    if (newLinkData.bookId) {
      const newLink: AffiliateLink = {
        id: String(links.length + 1),
        bookId: newLinkData.bookId,
        bookTitle: `Book ${links.length + 1}`,
        url: `https://bookhub.io/aff/link${links.length + 1}`,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active',
      }
      setLinks([...links, newLink])
      setNewLinkData({ bookId: '', retailer: 'amazon' })
      setShowNewLinkForm(false)
    }
  }, [links, newLinkData])

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const accentColor = theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'
  const buttonColor = theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-500" />
              <h1 className="text-4xl font-bold">Affiliate Program</h1>
            </div>
            <button
              onClick={() => setShowNewLinkForm(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${accentColor} text-white transition`}
            >
              <Plus className="w-5 h-5" />
              Create Link
            </button>
          </div>
          <p className={`${textColor} text-lg`}>Earn commissions by sharing your favorite books</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`border ${cardColor} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`${textColor} text-sm font-medium`}>Total Earnings</p>
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-3xl font-bold text-emerald-500">${stats?.totalEarnings.toFixed(2)}</p>
                <p className={`${textColor} text-xs mt-2`}>This month: ${stats?.thisMonthEarnings.toFixed(2)}</p>
              </div>

              <div className={`border ${cardColor} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`${textColor} text-sm font-medium`}>Total Clicks</p>
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-500">{stats?.totalClicks.toLocaleString()}</p>
                <p className={`${textColor} text-xs mt-2`}>Traffic generated</p>
              </div>

              <div className={`border ${cardColor} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`${textColor} text-sm font-medium`}>Conversions</p>
                  <ShoppingCart className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-500">{stats?.totalConversions.toLocaleString()}</p>
                <p className={`${textColor} text-xs mt-2`}>{stats?.conversionRate.toFixed(2)}% conversion rate</p>
              </div>

              <div className={`border ${cardColor} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`${textColor} text-sm font-medium`}>Avg Order Value</p>
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-orange-500">${stats?.averageOrderValue.toFixed(2)}</p>
                <p className={`${textColor} text-xs mt-2`}>Per transaction</p>
              </div>
            </div>

            {showNewLinkForm && (
              <div className={`border ${cardColor} rounded-lg p-6 mb-8`}>
                <h2 className="text-2xl font-bold mb-4">Create New Affiliate Link</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Book ID"
                    value={newLinkData.bookId}
                    onChange={(e) => setNewLinkData({ ...newLinkData, bookId: e.target.value })}
                    className={`px-4 py-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                    }`}
                  />
                  <select
                    value={newLinkData.retailer}
                    onChange={(e) => setNewLinkData({ ...newLinkData, retailer: e.target.value })}
                    className={`px-4 py-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
                    }`}
                  >
                    <option value="amazon">Amazon</option>
                    <option value="goodreads">Goodreads</option>
                    <option value="bookshop">Bookshop.org</option>
                    <option value="audible">Audible</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateLink}
                    className={`px-6 py-2 rounded-lg ${accentColor} text-white transition`}
                  >
                    Create Link
                  </button>
                  <button
                    onClick={() => setShowNewLinkForm(false)}
                    className={`px-6 py-2 rounded-lg ${buttonColor} text-gray-700 transition`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex gap-2 mb-6">
                {['overview', 'links', 'performance'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab as any)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedTab === tab
                        ? `${accentColor} text-white`
                        : theme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {selectedTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`border ${cardColor} rounded-lg p-6`}>
                    <h2 className="text-xl font-bold mb-4">Earnings Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                        <XAxis dataKey="week" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                            border: `1px solid ${theme === 'dark' ? '#475569' : '#cbd5e1'}`,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={`border ${cardColor} rounded-lg p-6`}>
                    <h2 className="text-xl font-bold mb-4">Clicks vs Conversions</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                        <XAxis dataKey="week" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                            border: `1px solid ${theme === 'dark' ? '#475569' : '#cbd5e1'}`,
                          }}
                        />
                        <Bar dataKey="clicks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="conversions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {selectedTab === 'links' && (
                <div className="space-y-4">
                  {links.map((link) => (
                    <div key={link.id} className={`border ${cardColor} rounded-lg p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{link.bookTitle}</h3>
                          <p className={`${textColor} text-sm mt-1`}>Created {new Date(link.createdDate).toLocaleDateString()}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            link.status === 'active'
                              ? 'bg-green-500 bg-opacity-20 text-green-500'
                              : 'bg-gray-500 bg-opacity-20 text-gray-500'
                          }`}
                        >
                          {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                          <LinkIcon className="w-5 h-5 text-emerald-500" />
                          <input
                            type="text"
                            value={link.url}
                            readOnly
                            className="flex-1 bg-transparent text-sm text-white outline-none"
                          />
                          <button
                            onClick={() => copyToClipboard(link.url, link.id)}
                            className="p-2 hover:bg-slate-600 rounded transition"
                          >
                            {copiedId === link.id ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Copy className="w-5 h-5 text-emerald-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className={`${textColor} text-xs font-medium mb-1`}>Clicks</p>
                          <p className="text-2xl font-bold text-blue-500">{link.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className={`${textColor} text-xs font-medium mb-1`}>Conversions</p>
                          <p className="text-2xl font-bold text-purple-500">{link.conversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className={`${textColor} text-xs font-medium mb-1`}>Conv. Rate</p>
                          <p className="text-2xl font-bold text-orange-500">
                            {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : 0}%
                          </p>
                        </div>
                        <div>
                          <p className={`${textColor} text-xs font-medium mb-1`}>Earnings</p>
                          <p className="text-2xl font-bold text-emerald-500">${link.earnings.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'performance' && (
                <div className={`border ${cardColor} rounded-lg p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Performance Report</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                      <Download className="w-4 h-4" />
                      Download CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 font-semibold">Book</th>
                          <th className="text-left py-3 px-4 font-semibold">Clicks</th>
                          <th className="text-left py-3 px-4 font-semibold">Conversions</th>
                          <th className="text-left py-3 px-4 font-semibold">Earnings</th>
                          <th className="text-left py-3 px-4 font-semibold">Avg Order Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {links.map((link) => (
                          <tr key={link.id} className="border-b border-slate-700 hover:bg-slate-700">
                            <td className="py-3 px-4">{link.bookTitle}</td>
                            <td className="py-3 px-4 text-blue-500 font-semibold">{link.clicks}</td>
                            <td className="py-3 px-4 text-purple-500 font-semibold">{link.conversions}</td>
                            <td className="py-3 px-4 text-emerald-500 font-bold">${link.earnings.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              ${link.conversions > 0 ? (link.earnings / link.conversions).toFixed(2) : 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
