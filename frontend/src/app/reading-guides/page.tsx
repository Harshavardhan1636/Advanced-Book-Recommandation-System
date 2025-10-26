'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { BookOpen, Lightbulb, HelpCircle, BarChart3, Clock, Users } from 'lucide-react'

interface ReadingGuide {
  id: string
  bookTitle: string
  author: string
  chapters: number
  themes: string[]
  discussionQuestions: string[]
  literaryAnalysis: string
  historicalContext: string
  vocabulary: string[]
  readingTime: number
}

export default function ReadingGuidesPage() {
  const { theme } = useTheme()
  const [selectedGuide, setSelectedGuide] = useState<string>('1')
  const [expandedSection, setExpandedSection] = useState<string>('analysis')

  const guides: ReadingGuide[] = [
    {
      id: '1',
      bookTitle: 'Dune',
      author: 'Frank Herbert',
      chapters: 26,
      themes: ['Politics', 'Religion', 'Ecology', 'Power', 'Technology'],
      discussionQuestions: [
        'What is Paul Atreides\'s real goal throughout the novel?',
        'How does the environment shape the culture of Arrakis?',
        'Discuss the role of women in the novel. How does Bene Gesserit power operate?',
        'What are the consequences of prophecy and expectation?',
      ],
      literaryAnalysis:
        'Dune is a complex science fiction epic that explores themes of politics, religion, and ecology. Herbert uses a richly detailed world to examine how prophecy shapes individual and collective destinies. The novel employs layered narration and multiple perspectives to create a nuanced political narrative.',
      historicalContext:
        'Written in 1965 during the Cold War, Dune reflects contemporary anxieties about power, resources, and environmental sustainability. The novel prefigures modern concerns about climate change and resource depletion through its portrayal of the harsh desert environment.',
      vocabulary: [
        'Spice melange - A fictional hallucinogenic drug crucial to space travel',
        'Bene Gesserit - An ancient order of women trained to develop superhuman abilities',
        'Kwisatz Haderach - The prophesied messiah figure',
      ],
      readingTime: 28,
    },
    {
      id: '2',
      bookTitle: 'The Midnight Library',
      author: 'Matt Haig',
      chapters: 38,
      themes: ['Regret', 'Choice', 'Identity', 'Hope', 'Second chances'],
      discussionQuestions: [
        'What does the library represent psychologically?',
        'Discuss the concept of regret and how it shapes our lives.',
        'What makes Nora\'s journey towards self-acceptance meaningful?',
      ],
      literaryAnalysis:
        'Haig uses the metaphor of a library between life and death to explore existential themes. The novel employs magical realism to create a space where characters can explore alternate lives, leading to profound insights about acceptance and gratitude.',
      historicalContext:
        'Published in 2020 during the pandemic, The Midnight Library resonates with themes of isolation, contemplation, and the search for meaning during uncertain times.',
      vocabulary: [
        'Infinite regret - The feeling that countless other choices were possible',
        'Quantum possibility - The idea that many versions of ourselves exist',
      ],
      readingTime: 12,
    },
  ]

  const guide = guides.find((g) => g.id === selectedGuide)

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Reading Guides & Analysis</h1>
          </div>
          <p className={`${textColor} text-lg`}>Deep dive into literary analysis and discussion guides</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-6 mb-8`}>
          <h2 className="text-2xl font-bold mb-4">Select a Book</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGuide(g.id)}
                className={`p-4 rounded-lg border transition text-left ${
                  selectedGuide === g.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                }`}
              >
                <p className="font-bold text-lg">{g.bookTitle}</p>
                <p className="text-sm opacity-75">{g.author}</p>
              </button>
            ))}
          </div>
        </div>

        {guide && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 border ${cardColor} rounded-lg p-8`}>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
                <div>
                  <h1 className="text-4xl font-bold">{guide.bookTitle}</h1>
                  <p className={`${textColor} text-lg mt-2`}>{guide.author}</p>
                </div>
                <div className="text-right">
                  <p className={`${textColor} text-sm mb-1`}>Reading Time</p>
                  <p className="text-2xl font-bold text-blue-500">{guide.readingTime}h</p>
                </div>
              </div>

              <div className="space-y-6">
                <div
                  className={`border ${cardColor === 'bg-slate-800 border-slate-700' ? 'border-slate-700' : 'border-slate-200'} rounded-lg p-6 cursor-pointer hover:shadow-lg transition`}
                  onClick={() =>
                    setExpandedSection(expandedSection === 'analysis' ? '' : 'analysis')
                  }
                >
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    Literary Analysis
                  </h2>
                  {expandedSection === 'analysis' && (
                    <p className={`${textColor} leading-relaxed`}>
                      {guide.literaryAnalysis}
                    </p>
                  )}
                </div>

                <div
                  className={`border ${cardColor === 'bg-slate-800 border-slate-700' ? 'border-slate-700' : 'border-slate-200'} rounded-lg p-6 cursor-pointer hover:shadow-lg transition`}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === 'context' ? '' : 'context'
                    )
                  }
                >
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-green-500" />
                    Historical Context
                  </h2>
                  {expandedSection === 'context' && (
                    <p className={`${textColor} leading-relaxed`}>
                      {guide.historicalContext}
                    </p>
                  )}
                </div>

                <div
                  className={`border ${cardColor === 'bg-slate-800 border-slate-700' ? 'border-slate-700' : 'border-slate-200'} rounded-lg p-6 cursor-pointer hover:shadow-lg transition`}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === 'questions' ? '' : 'questions'
                    )
                  }
                >
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-purple-500" />
                    Discussion Questions
                  </h2>
                  {expandedSection === 'questions' && (
                    <ol className="space-y-2 list-decimal list-inside">
                      {guide.discussionQuestions.map((q, idx) => (
                        <li key={idx} className={`${textColor}`}>
                          {q}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`border ${cardColor} rounded-lg p-6`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Book Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className={`${textColor} text-sm mb-1`}>Chapters</p>
                    <p className="text-2xl font-bold">{guide.chapters}</p>
                  </div>
                  <div>
                    <p className={`${textColor} text-sm mb-1`}>Main Themes</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {guide.themes.map((theme, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-xs font-semibold"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`border ${cardColor} rounded-lg p-6`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Key Vocabulary
                </h3>
                <div className="space-y-3">
                  {guide.vocabulary.map((vocab, idx) => (
                    <div key={idx}>
                      <p className="font-semibold text-sm text-blue-400">
                        {vocab.split(' - ')[0]}
                      </p>
                      <p className={`${textColor} text-xs mt-1`}>
                        {vocab.split(' - ')[1]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
