'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { ShoppingCart, Search, ExternalLink, DollarSign, Package, Zap } from 'lucide-react'

interface PurchaseOption {
  retailer: string
  price: number
  format: string
  availability: 'in-stock' | 'pre-order' | 'out-of-stock'
  shippingTime: string
  url: string
  icon: string
}

export default function PurchaseLinksPage() {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<string>('dune')

  const books = [
    { id: 'dune', title: 'Dune', author: 'Frank Herbert' },
    { id: 'midnight-library', title: 'The Midnight Library', author: 'Matt Haig' },
    { id: 'educated', title: 'Educated', author: 'Tara Westover' },
  ]

  const purchaseOptions: PurchaseOption[] = [
    {
      retailer: 'Amazon',
      price: 18.99,
      format: 'Paperback',
      availability: 'in-stock',
      shippingTime: '2-3 days',
      url: 'https://amazon.com',
      icon: '📦',
    },
    {
      retailer: 'Amazon Kindle',
      price: 14.99,
      format: 'Ebook',
      availability: 'in-stock',
      shippingTime: 'Instant',
      url: 'https://amazon.com/kindle',
      icon: '📱',
    },
    {
      retailer: 'Audible',
      price: 19.99,
      format: 'Audiobook',
      availability: 'in-stock',
      shippingTime: 'Instant',
      url: 'https://audible.com',
      icon: '🎧',
    },
    {
      retailer: 'Goodreads',
      price: 17.99,
      format: 'Hardcover',
      availability: 'pre-order',
      shippingTime: '1 week',
      url: 'https://goodreads.com',
      icon: '📚',
    },
    {
      retailer: 'Bookshop.org',
      price: 19.99,
      format: 'Paperback',
      availability: 'in-stock',
      shippingTime: '5-7 days',
      url: 'https://bookshop.org',
      icon: '🏪',
    },
    {
      retailer: 'Powell\'s Books',
      price: 16.99,
      format: 'Used - Hardcover',
      availability: 'in-stock',
      shippingTime: '3-5 days',
      url: 'https://powells.com',
      icon: '♻️',
    },
  ]

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const buttonColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'text-green-500 bg-green-500 bg-opacity-20'
      case 'pre-order':
        return 'text-yellow-500 bg-yellow-500 bg-opacity-20'
      case 'out-of-stock':
        return 'text-red-500 bg-red-500 bg-opacity-20'
      default:
        return 'text-gray-500 bg-gray-500 bg-opacity-20'
    }
  }

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Purchase Links</h1>
          </div>
          <p className={`${textColor} text-lg`}>Find where to buy your favorite books at the best prices</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-6 mb-8`}>
          <h2 className="text-2xl font-bold mb-4">Select a Book</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book.id)}
                className={`p-4 rounded-lg border transition text-left ${
                  selectedBook === book.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                }`}
              >
                <p className="font-bold">{book.title}</p>
                <p className="text-sm opacity-75">{book.author}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available at These Retailers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchaseOptions.map((option, idx) => (
              <div
                key={idx}
                className={`border ${cardColor} rounded-lg p-6 hover:shadow-lg transition`}
              >
                <div className="mb-4">
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <h3 className="text-xl font-bold">{option.retailer}</h3>
                </div>

                <div className="mb-4 pb-4 border-b border-slate-700">
                  <p className={`${textColor} text-sm mb-2`}>{option.format}</p>
                  <div className="flex items-baseline gap-1">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-3xl font-bold">{option.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">{option.shippingTime}</span>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getAvailabilityColor(
                        option.availability
                      )}`}
                    >
                      {option.availability.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <button className={`w-full py-2 rounded-lg ${buttonColor} text-white font-semibold transition flex items-center justify-center gap-2`}>
                  <ExternalLink className="w-4 h-4" />
                  Buy on {option.retailer}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`border ${cardColor} rounded-lg p-6`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Pro Tips
          </h2>
          <ul className={`space-y-2 ${textColor}`}>
            <li>• Compare prices across multiple retailers before purchasing</li>
            <li>• Check for library availability - you can often borrow for free</li>
            <li>• Look for ebook deals on platforms like Kindle and Apple Books</li>
            <li>• Consider audiobooks for on-the-go listening</li>
            <li>• Support local bookstores through Bookshop.org</li>
            <li>• Check for subscription services like Scribd or Audible Plus</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
