'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, Moon, Sun, Home, Search, Sparkles, BarChart3, User, Trophy, Lightbulb, BookMarked, Zap, Settings, TrendingUp, Users, Link as LinkIcon, Code, Headphones, Gift, Target, DollarSign, Film, MessageCircle, Sliders, Bell, MapPin, ShoppingCart, GitCompare, Globe, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href) && href !== '/';

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Explore', icon: Search },
    { href: '/advanced-search', label: 'Advanced Search', icon: Zap },
    { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/gamification', label: 'Achievements', icon: Trophy },
    { href: '/ai-features', label: 'AI Hub', icon: Lightbulb },
    { href: '/educational', label: 'Learn', icon: BookMarked },
    { href: '/reading-history', label: 'Reading History', icon: BookOpen },
    { href: '/reading-goals', label: 'Reading Goals', icon: Target },
    { href: '/year-in-review', label: 'Year Review', icon: TrendingUp },
    { href: '/book-clubs', label: 'Book Clubs', icon: Users },
    { href: '/audiobooks', label: 'Audiobooks', icon: Headphones },
    { href: '/gift-recommendations', label: 'Gift Ideas', icon: Gift },
    { href: '/movie-adaptations', label: 'Movies', icon: Film },
    { href: '/reading-companion', label: 'Companion', icon: MessageCircle },
    { href: '/personalization', label: 'Personalize', icon: Sliders },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/library-finder', label: 'Libraries', icon: MapPin },
    { href: '/purchase-links', label: 'Buy', icon: ShoppingCart },
    { href: '/author-profiles', label: 'Authors', icon: User },
    { href: '/book-comparison', label: 'Compare', icon: GitCompare },
    { href: '/reading-guides', label: 'Guides', icon: BookMarked },
    { href: '/translation-tool', label: 'Translate', icon: Globe },
    { href: '/ar-preview', label: 'AR', icon: Sparkles },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/integrations', label: 'Integrations', icon: LinkIcon },
    { href: '/affiliate', label: 'Affiliate', icon: DollarSign },
    { href: '/subscription', label: 'Premium', icon: Sparkles },
    { href: '/developer', label: 'Developer', icon: Code },
    { href: '/admin', label: 'Admin', icon: Shield },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
            <BookOpen className="text-purple-600" size={28} />
            <span className="hidden sm:inline">BookHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className={`gap-2 ${isActive(item.href) ? 'bg-purple-600' : ''}`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User size={20} />
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t dark:border-slate-800">
            <div className="space-y-2 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive(item.href) ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-2 ${isActive(item.href) ? 'bg-purple-600' : ''}`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
