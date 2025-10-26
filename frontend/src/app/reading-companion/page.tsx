'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { MessageCircle, Send, Loader2, Book, Lightbulb, HelpCircle, Trash2, Plus } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  bookTitle: string
  messages: Message[]
  createdAt: Date
}

export default function ReadingCompanionPage() {
  const { theme } = useTheme()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const mockBooks = [
    { id: '1', title: 'Dune by Frank Herbert' },
    { id: '2', title: 'The Midnight Library by Matt Haig' },
    { id: '3', title: 'It Ends with Us by Colleen Hoover' },
    { id: '4', title: 'Educated by Tara Westover' },
    { id: '5', title: 'Project Hail Mary by Andy Weir' },
  ]

  const suggestedQuestions = [
    'What are the main themes of this book?',
    'Can you explain the character development?',
    'What happens in chapter 5?',
    'How does the ending relate to the beginning?',
    'What is the historical context?',
    'Can you predict what happens next?',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  const handleStartConversation = useCallback(() => {
    if (!selectedBook) return

    const bookData = mockBooks.find((b) => b.id === selectedBook)
    const newConversation: Conversation = {
      id: String(conversations.length + 1),
      bookTitle: bookData?.title || 'Unknown',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm your reading companion for "${bookData?.title}". I'm here to help you explore this book, discuss characters, themes, and answer any questions you have. What would you like to know about this book?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    }

    setCurrentConversation(newConversation)
  }, [selectedBook, conversations])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !currentConversation) return

    const userMessage: Message = {
      id: String(currentConversation.messages.length + 1),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
    }

    setCurrentConversation(updatedConversation)
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(updatedConversation.messages.length + 1),
        role: 'assistant',
        content: `That's a great question about ${currentConversation.bookTitle}! Based on the content, I can tell you that this aspect relates to the broader themes of the book. The author explores this through character interactions and plot development. Would you like me to elaborate on any specific part?`,
        timestamp: new Date(),
      }

      setCurrentConversation({
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
      })

      setLoading(false)
    }, 1500)
  }, [input, currentConversation])

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(conversations.filter((c) => c.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }, [conversations, currentConversation])

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-black'
  const messageBgUser = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
  const messageBgAssistant = theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
  const textColorAssistant = theme === 'dark' ? 'text-slate-200' : 'text-gray-900'

  return (
    <main className={`min-h-screen ${bgColor} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Reading Companion</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Discuss books with your personal AI reading assistant
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`lg:col-span-1 border ${cardColor} rounded-lg p-6 h-fit`}>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Book className="w-5 h-5" />
              Select Book
            </h2>

            <div className="space-y-2 mb-4">
              {mockBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    selectedBook === book.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                        : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{book.title}</span>
                </button>
              ))}
            </div>

            {selectedBook && (
              <button
                onClick={handleStartConversation}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2 mb-6"
              >
                <Plus className="w-4 h-4" />
                Start Chat
              </button>
            )}

            {conversations.length > 0 && (
              <>
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="font-semibold mb-3 text-sm">Previous Chats</h3>
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-2 rounded-lg cursor-pointer transition ${
                          currentConversation?.id === conv.id
                            ? 'bg-blue-600'
                            : theme === 'dark'
                              ? 'bg-slate-700 hover:bg-slate-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{conv.bookTitle}</p>
                        <p className="text-xs opacity-70">
                          {conv.messages.length} messages
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={`lg:col-span-3 border ${cardColor} rounded-lg flex flex-col overflow-hidden`}>
            {currentConversation ? (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex items-center justify-between">
                  <h2 className="font-bold">{currentConversation.bookTitle}</h2>
                  <button
                    onClick={() => {
                      setConversations([...conversations, currentConversation])
                      setCurrentConversation(null)
                    }}
                    className="p-2 hover:bg-blue-500 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-96">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? `${messageBgUser} text-white rounded-br-none`
                            : `${messageBgAssistant} ${textColorAssistant} rounded-bl-none`
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className={`px-4 py-3 rounded-lg ${messageBgAssistant}`}>
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {currentConversation.messages.length <= 1 && (
                  <div className="p-6 border-t border-slate-700">
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Suggested Questions
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInput(question)
                          }}
                          className={`p-3 text-left rounded-lg border text-sm transition ${
                            theme === 'dark'
                              ? 'border-slate-600 hover:bg-slate-700'
                              : 'border-slate-300 hover:bg-gray-100'
                          }`}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-700 p-4 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about this book..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${inputBg}`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-96 flex-col gap-4 p-6">
                <HelpCircle className="w-16 h-16 text-gray-400" />
                <p className="text-xl font-semibold">Select a book to start chatting</p>
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Choose a book from the left sidebar and click "Start Chat" to begin discussing with your AI reading companion
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
