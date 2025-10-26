# 📚 BookHub Frontend

A modern, responsive Next.js application for the BookHub book recommendation platform.

## 🎯 Overview

The BookHub frontend is built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**. It provides a seamless user experience with:

- 32+ feature-rich pages
- Real-time recommendations
- Gamification system
- AI-powered features
- Beautiful dark/light theme support
- Fully responsive design (mobile, tablet, desktop)
- Comprehensive API integration

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Run development server
npm run dev

# Open browser at http://localhost:3000
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier (if configured)

# Testing
npm test                 # Run tests (if available)
npm run test:watch      # Run tests in watch mode
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory with 32+ pages
│   ├── admin/          # Admin dashboard
│   ├── analytics/      # Analytics and insights
│   ├── ai-features/    # AI-powered features
│   ├── gamification/   # Achievements and leaderboards
│   ├── dashboard/      # User dashboard
│   ├── search/         # Search pages
│   ├── recommendations/ # Recommendations
│   ├── reading-*/      # Reading features
│   ├── integrations/   # Third-party integrations
│   └── ...
│
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── modals/        # Modal components
│   ├── navbar.tsx     # Navigation bar
│   ├── footer.tsx     # Footer
│   └── ...
│
├── lib/               # Utilities and helpers
│   ├── api.ts         # API client (60+ endpoints)
│   └── utils.ts       # Utility functions
│
├── types/             # TypeScript definitions
│   └── index.ts       # Shared interfaces
│
└── hooks/             # Custom React hooks
    ├── use-books.ts
    ├── use-debounce.ts
    └── ...
```

## 🎨 Features

### Pages (32+)

**Core Pages**
- `/` - Home
- `/search` - Book search
- `/explore` - Browse books
- `/recommendations` - Personalized recommendations
- `/dashboard` - User dashboard

**Feature Pages**
- `/analytics` - Reading analytics
- `/year-in-review` - Annual reading report
- `/gamification` - Achievements and leaderboards
- `/ai-features` - AI-powered tools
- `/reading-history` - Reading history
- `/reading-goals` - Goal tracking
- `/book-clubs` - Book club management
- `/movie-adaptations` - Movie/TV adaptations
- `/reading-companion` - AI chat
- `/library-finder` - Library availability
- `/purchase-links` - Book retailer links
- `/translation-tool` - Multi-language translator
- `/book-comparison` - Compare books side-by-side
- `/author-profiles` - Author information
- `/ar-preview` - Augmented reality preview
- `/notifications` - Notification management
- `/personalization` - User preferences
- `/settings` - Account settings
- `/integrations` - Third-party integrations
- `/affiliate` - Affiliate program
- `/subscription` - Premium subscription
- `/developer` - Developer tools
- `/community` - Social features
- `/audiobooks` - Audiobook discovery
- `/gift-recommendations` - Gift suggestions
- `/educational` - Educational content
- `/advanced-search` - Advanced search tools
- `/admin` - Admin dashboard

### Key Features
- ✅ Full TypeScript type safety
- ✅ Dark/Light theme support
- ✅ Responsive design (mobile-first)
- ✅ 60+ API endpoints integrated
- ✅ Loading states and skeletons
- ✅ Error boundaries
- ✅ Toast notifications
- ✅ Accessible components (WCAG AA)
- ✅ SEO optimized
- ✅ Performance optimized

## 🔌 API Integration

The frontend integrates with 60+ backend API endpoints:

### Key Modules

```typescript
// Search & Recommendations
import { bookAPI, recommendationAPI } from '@/lib/api'

// User Management
import { userAPI } from '@/lib/api'

// Analytics
import { analyticsAPI } from '@/lib/api'

// Gamification
import { gamificationAPI } from '@/lib/api'

// AI & Innovation
import { aiAPI } from '@/lib/api'

// And more...
```

### Example Usage

```typescript
import { bookAPI } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function SearchPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const results = await bookAPI.search('science fiction', 10)
        setBooks(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {books.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  )
}
```

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with:
- Custom color scheme (purple brand colors)
- Dark mode support via `next-themes`
- Responsive breakpoints
- Animation utilities

### Theme

```typescript
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

## 📊 Charts & Visualization

The project uses **Recharts** for data visualization:

```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts'

const ChartComponent = () => (
  <LineChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
)
```

## 🔐 Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

Optional:

```
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
NEXT_PUBLIC_GTAG_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Dependencies

Key dependencies:
- **next**: ^14.2.33
- **react**: ^18.2.0
- **typescript**: ^5.3.3
- **tailwindcss**: ^3.4.0
- **recharts**: ^2.10.3
- **lucide-react**: ^0.294.0
- **axios**: ^1.6.2
- **react-hook-form**: ^7.49.2
- **zod**: ^3.22.4
- **framer-motion**: ^10.16.16
- **sonner**: ^1.2.3

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel deploy --prod
```

### Docker

```bash
docker build -t bookhub-frontend .
docker run -p 3000:3000 bookhub-frontend
```

### Self-hosted

```bash
npm run build
npm run start
```

## 📝 Code Style

- **Formatting**: Prettier
- **Linting**: ESLint with Next.js rules
- **Type Safety**: TypeScript strict mode
- **Naming**: camelCase for variables/functions, PascalCase for components

## 🤝 Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

Built with ❤️ using Next.js and TypeScript
