'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Zap, Eye, Download, Share2, RotateCcw, Maximize2, Info } from 'lucide-react'

interface ARBook {
  id: string
  title: string
  author: string
  markerUrl: string
  description: string
  features: string[]
}

export default function ARPreviewPage() {
  const { theme } = useTheme()
  const [selectedBook, setSelectedBook] = useState<string>('1')
  const [arActive, setArActive] = useState(false)
  const [scale, setScale] = useState(1)

  const arBooks: ARBook[] = [
    {
      id: '1',
      title: 'Dune',
      author: 'Frank Herbert',
      markerUrl: 'https://example.com/marker1',
      description: 'Experience the desert planet Arrakis in immersive AR',
      features: [
        'Interactive 3D desert landscape',
        'Character models and scenes',
        'Spice transport vehicles',
        '360° book cover display',
      ],
    },
    {
      id: '2',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      markerUrl: 'https://example.com/marker2',
      description: 'Explore the infinite library between life and death',
      features: [
        'Library interior visualization',
        'Infinite door animations',
        'Book shelf exploration',
        'Character appearance in AR',
      ],
    },
    {
      id: '3',
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      markerUrl: 'https://example.com/marker3',
      description: 'Bring Hogwarts to life with AR magic',
      features: [
        'Hogwarts castle visualization',
        'Spell animations',
        'Character encounters',
        'Interactive scenes',
      ],
    },
  ]

  const selectedARBook = arBooks.find((b) => b.id === selectedBook)

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const buttonColor = theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">AR Preview</h1>
          </div>
          <p className={`${textColor} text-lg`}>
            Experience books in augmented reality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 border ${cardColor} rounded-lg overflow-hidden`}>
            <div className="relative h-96 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center overflow-hidden">
              {!arActive ? (
                <div className="text-center text-white">
                  <Eye className="w-20 h-20 mx-auto mb-4 opacity-80" />
                  <p className="text-xl font-semibold mb-2">AR Preview</p>
                  <p className="text-sm opacity-75 mb-6">
                    {selectedARBook?.description}
                  </p>
                  <button
                    onClick={() => setArActive(true)}
                    className={`px-6 py-2 rounded-lg ${buttonColor} text-white transition`}
                  >
                    Activate AR
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div
                    className="relative w-64 h-80 rounded-lg shadow-2xl transition-transform"
                    style={{
                      transform: `scale(${scale})`,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <p className="text-2xl font-bold text-center mb-2">
                        {selectedARBook?.title}
                      </p>
                      <p className="text-sm opacity-80">{selectedARBook?.author}</p>
                      <div className="mt-auto text-xs text-center opacity-60">
                        AR Model
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                      className="p-2 bg-white/20 hover:bg-white/40 rounded transition text-white"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                      className="p-2 bg-white/20 hover:bg-white/40 rounded transition text-white"
                    >
                      +
                    </button>
                    <button
                      onClick={() => setScale(1)}
                      className="p-2 bg-white/20 hover:bg-white/40 rounded transition text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {arActive && (
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className="flex gap-2">
                  <button
                    onClick={() => setArActive(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Exit AR
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-lg font-bold mb-4">Select Book</h2>
              <div className="space-y-2">
                {arBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book.id)
                      setArActive(false)
                      setScale(1)
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedBook === book.id
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                          : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    <p className="font-bold text-sm">{book.title}</p>
                    <p className="text-xs opacity-75">{book.author}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedARBook && (
              <div className={`border ${cardColor} rounded-lg p-6`}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  AR Features
                </h2>
                <ul className="space-y-2">
                  {selectedARBook.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-2 ${textColor} text-sm`}>
                      <span className="text-purple-500 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`border ${cardColor} rounded-lg p-6`}>
              <h2 className="text-lg font-bold mb-4">Requirements</h2>
              <ul className={`space-y-2 text-sm ${textColor}`}>
                <li>✓ iOS 14+ or Android 8+</li>
                <li>✓ ARKit or ARCore</li>
                <li>✓ Camera access</li>
                <li>✓ Internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
