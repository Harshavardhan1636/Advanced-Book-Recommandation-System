'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Globe, Copy, Volume2, Loader2, CheckCircle } from 'lucide-react'

export default function TranslationToolPage() {
  const { theme } = useTheme()
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
  ]

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return

    setLoading(true)
    setTimeout(() => {
      setTranslatedText(
        `[Translation in ${languages.find((l) => l.code === targetLang)?.name}]: ${sourceText}`
      )
      setLoading(false)
    }, 1500)
  }, [sourceText, targetLang, languages])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [translatedText])

  const swapLanguages = useCallback(() => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    if (translatedText) {
      setSourceText(translatedText)
      setTranslatedText('')
    }
  }, [sourceLang, targetLang, translatedText])

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
  const buttonColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Translation Tool</h1>
          </div>
          <p className={`${textColor} text-lg`}>Translate book excerpts and passages instantly</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-8`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block font-semibold mb-2 text-sm">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-center">
              <button
                onClick={swapLanguages}
                className={`px-4 py-2 rounded-lg ${buttonColor} text-white transition`}
              >
                ⇄ Swap
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputBg}`}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-2">Original Text</label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={10}
                className={`w-full px-4 py-3 rounded-lg border ${inputBg}`}
              />
              <p className={`${textColor} text-xs mt-2`}>
                {sourceText.length} / 5000 characters
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2">Translated Text</label>
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                rows={10}
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} opacity-75`}
              />
              {translatedText && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 px-4 py-2 rounded-lg ${buttonColor} text-white transition flex items-center justify-center gap-2`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button className={`px-4 py-2 rounded-lg ${buttonColor} text-white transition flex items-center gap-2`}>
                    <Volume2 className="w-4 h-4" />
                    Listen
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || loading}
            className={`w-full px-6 py-3 rounded-lg ${buttonColor} text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                Translate
              </>
            )}
          </button>
        </div>

        <div className={`border ${cardColor} rounded-lg p-6 mt-8`}>
          <h2 className="text-xl font-bold mb-4">Supported Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {languages.map((lang) => (
              <div key={lang.code} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <p className="font-semibold text-sm">{lang.name}</p>
                <p className={`${textColor} text-xs`}>{lang.code.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
