# 📚 BookHub Frontend - Next.js Application

## Overview

A modern, responsive Next.js 14 frontend for the Advanced Book Recommendation System. Built with TypeScript, Tailwind CSS, and Recharts for beautiful data visualization.

## ✨ Features

### Interactive Components
- ✅ **Book Cards** - Responsive cards with ratings, covers, and quick actions
- ✅ **Book Carousel** - Auto-scrolling carousel with navigation controls
- ✅ **Modal System** - Book details, preview, and list management modals
- ✅ **Live Search** - Real-time search with debouncing and dropdown results
- ✅ **Search Results** - Infinite scroll pagination with filtering

### Pages
- ✅ **Home Page** - Hero section with featured/trending/recommended books
- ✅ **Search Results** - Advanced filtering, sorting, and pagination
- ✅ **Book Details** - Full book info, reviews, recommendations
- ✅ **Recommendations** - 4 ML algorithm recommendations
- ✅ **User Dashboard** - Overview, favorites, reading lists, progress, achievements
- ✅ **Analytics Dashboard** - Charts and visualizations with Recharts

### UI/UX
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Dark Mode** - Full dark mode support with next-themes
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Loading States** - Skeleton loaders and spinners
- ✅ **Global Layout** - Navbar, Footer, error boundary

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── page.tsx                  # Home page
│   │   ├── search/
│   │   │   └── page.tsx              # Search results page
│   │   ├── books/[id]/
│   │   │   └── page.tsx              # Book details page
│   │   ├── recommendations/
│   │   │   └── page.tsx              # Recommendations page
│   │   ├── dashboard/
│   │   │   └── page.tsx              # User dashboard
│   │   ├── analytics/
│   │   │   └── page.tsx              # Analytics dashboard
│   │   ├── layout.tsx                # Root layout with navbar, footer
│   │   ├── providers.tsx             # Theme and query providers
│   │   └── globals.css               # Global styles
│   ├── components/                   # Reusable components
│   │   ├── book-card.tsx             # Book card component
│   │   ├── book-carousel.tsx         # Carousel component
│   │   ├── navbar.tsx                # Navigation bar
│   │   ├── footer.tsx                # Footer
│   │   ├── error-boundary.tsx        # Error boundary
│   │   ├── skeleton.tsx              # Skeleton loaders
│   │   ├── loading.tsx               # Loading spinners
│   │   ├── search-bar-enhanced.tsx   # Advanced search
│   │   └── modals/
│   │       ├── book-detail-modal.tsx
│   │       └── add-to-list-modal.tsx
│   ├── hooks/                        # Custom hooks
│   │   └── use-debounce.ts          # Debounce hook
│   ├── lib/                          # Utilities
│   │   ├── api.ts                    # API client
│   │   └── utils.ts                  # Utility functions
│   └── types/                        # TypeScript types
│       └── index.ts                  # Type definitions
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js               # Tailwind config
├── next.config.js                   # Next.js config
└── .env.example                     # Environment template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Backend running on `http://localhost:8000`

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Update API URL if needed
# Edit .env.local if your backend is running on a different URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start

# Preview build locally
npm run build && npm run start
```

## 📦 Dependencies

### Core
- **next** (14.2.33) - React framework
- **react** (18.2.0) - UI library
- **typescript** (5.3.3) - Type safety

### UI & Styling
- **tailwindcss** (3.4.0) - Utility-first CSS
- **tailwindcss-animate** (1.0.7) - Animation utilities
- **lucide-react** (0.294.0) - Icon library

### Forms & Validation
- **react-hook-form** (7.49.2) - Form management
- **zod** (3.22.4) - Schema validation

### Data & State
- **@tanstack/react-query** (5.14.2) - Data fetching
- **axios** (1.6.2) - HTTP client

### Visualization
- **recharts** (2.10.3) - Charts library
- **framer-motion** (10.16.16) - Animations

### Utilities
- **next-themes** (0.2.1) - Theme management
- **sonner** (1.2.3) - Toast notifications
- **class-variance-authority** (0.7.0) - CSS management
- **clsx** (2.0.0) - Class merging

## 🎨 UI Components

### Button
```tsx
import { Button } from '@/components/ui/button'

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button size="lg">Large Button</Button>
```

### Book Card
```tsx
import { BookCard } from '@/components/book-card'

<BookCard
  id="book_1"
  title="The Great Gatsby"
  authors={["F. Scott Fitzgerald"]}
  coverUrl="/cover.jpg"
  rating={4.5}
  year={1925}
  onAddToFavorites={handleFavorite}
  onAddToList={handleAddToList}
/>
```

### Carousel
```tsx
import { BookCarousel } from '@/components/book-carousel'

<BookCarousel
  title="Featured Books"
  books={books}
  onAddToFavorites={handleFavorite}
  onAddToList={handleAddToList}
/>
```

## 🔌 API Integration

### Book Search
```tsx
import { bookAPI } from '@/lib/api'

const results = await bookAPI.search('python programming', 20)
```

### Recommendations
```tsx
import { recommendationAPI } from '@/lib/api'

const recs = await recommendationAPI.getHybrid('user_1', 'book_123')
```

### Gamification
```tsx
import { gamificationAPI } from '@/lib/api'

const achievements = await gamificationAPI.getAchievements('user_1')
```

## 📊 Pages Overview

### Home Page (`/`)
- Hero section with CTA
- Featured books carousel
- Trending books carousel
- Recommended books carousel
- Info cards section

### Search Results (`/search?q=query`)
- Advanced filtering (year, sort)
- Infinite scroll pagination
- Real-time search suggestions
- Filter panel

### Book Details (`/books/[id]`)
- Full book information
- Rating display
- Reviews section with add review
- Related books carousel
- Share functionality

### Recommendations (`/recommendations`)
- 4 algorithm comparison
- Algorithm description cards
- Educational section
- Algorithm selection

### Dashboard (`/dashboard`)
- **Overview Tab**: Reading goals, recent activity
- **Favorites Tab**: Favorite books grid
- **Reading Lists Tab**: Create and manage lists
- **Progress Tab**: Genre distribution, rating charts
- **Achievements Tab**: Unlocked/locked achievements

### Analytics (`/analytics`)
- Reading progress line chart
- Genre distribution pie chart
- Rating distribution bar chart
- Favorite authors bar chart
- Reading insights

## 🎯 Key Features Implementation

### Live Search
- Debounced API calls (300ms)
- Real-time dropdown suggestions
- Click or press Enter to search
- Clear button functionality

### Infinite Scroll
- Intersection Observer API
- Automatic page loading
- Loading indicator
- End-of-results message

### Theme Switching
- Dark/Light mode toggle
- Persisted to localStorage
- System preference detection
- Applied globally

### Error Handling
- Error Boundary component
- API error toasts
- Fallback error page
- Recovery options

## 🔒 Environment Variables

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=BookHub
NEXT_PUBLIC_APP_VERSION=2.0.0
```

## 📱 Responsive Design

- **Mobile** (< 640px): Single column, full-width
- **Tablet** (640px - 1024px): 2-3 columns
- **Desktop** (1024px - 1280px): 4 columns
- **Large** (> 1280px): 5-6 columns

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect repository to Vercel
# https://vercel.com/new

# 3. Set environment variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# 4. Deploy
# Automatic on push to main
```

### Docker

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Self-Hosted

```bash
# 1. Build production bundle
npm run build

# 2. Install production dependencies
npm ci --only=production

# 3. Start server
npm run start

# 4. Use PM2 for process management
pm2 start npm --name "bookhub" -- start
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Manual testing checklist
- [ ] Home page loads with featured books
- [ ] Search works with debouncing
- [ ] Filters apply correctly
- [ ] Book details modal opens
- [ ] Infinite scroll loads more books
- [ ] Dark mode toggle works
- [ ] Mobile responsive works
- [ ] Error boundary catches errors
- [ ] Loading states display
- [ ] API calls succeed
```

## 📈 Performance Optimization

### Implemented
- ✅ Image optimization with Next.js Image
- ✅ Code splitting with dynamic imports
- ✅ Tailwind CSS purging
- ✅ Debounced search queries
- ✅ Lazy component loading
- ✅ Skeleton loaders for UX

### Recommendations
- Consider: Server-Side Rendering (SSR) for SEO
- Consider: Incremental Static Regeneration (ISR)
- Monitor: Bundle size with `npm run build`
- Optimize: Image sizes and formats

## 🐛 Troubleshooting

### API Connection Error
```
Error: Failed to fetch from backend
Solution: Ensure backend is running on http://localhost:8000
```

### Build Errors
```
Solution: Clear .next folder and node_modules
npm run build -- --no-cache
```

### TypeScript Errors
```
Solution: Check type definitions
npm run type-check
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Harshavardhan**
- GitHub: [@Harshavardhan1636](https://github.com/Harshavardhan1636)
- Email: dpharshavardhan.1636@gmail.com

---

**Made with ❤️ for book lovers everywhere**
