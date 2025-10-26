"""
Educational Features Service
Book summaries, Author profiles, Literary analysis, Reading guides, Timelines, Related content, Language learning
"""

import os
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime
import re
from collections import Counter

try:
    from services.gemini_service import gemini_service
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

from models.book import Book

logger = logging.getLogger(__name__)


# ============================================================================
# BOOK SUMMARIES
# ============================================================================

class BookSummaryService:
    """AI-generated and curated book summaries"""
    
    def __init__(self):
        self.ai_service = gemini_service if GEMINI_AVAILABLE else None
        logger.info("✅ Book Summary Service initialized")
    
    def generate_summary(
        self,
        book: Book,
        summary_type: str = "comprehensive"
    ) -> Dict[str, Any]:
        """
        Generate book summary
        
        Args:
            book: Book object
            summary_type: comprehensive, quick, chapter-by-chapter
        
        Returns:
            Summary data
        """
        if summary_type == "comprehensive":
            return self._generate_comprehensive_summary(book)
        elif summary_type == "quick":
            return self._generate_quick_summary(book)
        elif summary_type == "chapter":
            return self._generate_chapter_summaries(book)
        else:
            return self._generate_comprehensive_summary(book)
    
    def _generate_comprehensive_summary(self, book: Book) -> Dict[str, Any]:
        """Generate comprehensive summary"""
        if self.ai_service and self.ai_service.available:
            prompt = f"""Generate a comprehensive summary of "{book.title}" by {', '.join(book.authors)}.

Include:
1. Plot overview (without major spoilers)
2. Main characters and their roles
3. Key themes and messages
4. Writing style and tone
5. Historical/cultural context
6. Critical reception

Keep it informative and engaging."""

            summary_text = self.ai_service.model.generate_content(prompt).text.strip()
        else:
            summary_text = book.description or f"A book titled '{book.title}' by {', '.join(book.authors)}."
        
        return {
            "book_id": book.work_id,
            "title": book.title,
            "type": "comprehensive",
            "summary": summary_text,
            "word_count": len(summary_text.split()),
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_quick_summary(self, book: Book) -> Dict[str, Any]:
        """Generate quick 2-3 sentence summary"""
        if self.ai_service and self.ai_service.available:
            summary = self.ai_service.generate_summary(book, length="short")
        else:
            summary = book.description[:200] if book.description else f"A book by {', '.join(book.authors)}."
        
        return {
            "book_id": book.work_id,
            "title": book.title,
            "type": "quick",
            "summary": summary,
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_chapter_summaries(self, book: Book) -> Dict[str, Any]:
        """Generate chapter-by-chapter summaries"""
        # Mock chapter summaries
        chapters = []
        for i in range(1, 11):  # Mock 10 chapters
            chapters.append({
                "chapter": i,
                "title": f"Chapter {i}",
                "summary": f"Summary of chapter {i} of {book.title}."
            })
        
        return {
            "book_id": book.work_id,
            "title": book.title,
            "type": "chapter-by-chapter",
            "chapters": chapters,
            "total_chapters": len(chapters)
        }


# ============================================================================
# AUTHOR PROFILES
# ============================================================================

class AuthorProfileService:
    """Author biography, bibliography, interviews"""
    
    def __init__(self):
        self.ai_service = gemini_service if GEMINI_AVAILABLE else None
        logger.info("✅ Author Profile Service initialized")
    
    def get_author_profile(self, author_name: str) -> Dict[str, Any]:
        """
        Get comprehensive author profile
        
        Args:
            author_name: Author's name
        
        Returns:
            Author profile data
        """
        # Generate biography
        biography = self._generate_biography(author_name)
        
        # Get bibliography
        bibliography = self._get_bibliography(author_name)
        
        # Get interviews/quotes
        interviews = self._get_interviews(author_name)
        
        return {
            "author_name": author_name,
            "biography": biography,
            "bibliography": bibliography,
            "interviews": interviews,
            "writing_style": self._analyze_writing_style(author_name),
            "influences": self._get_influences(author_name),
            "awards": self._get_awards(author_name)
        }
    
    def _generate_biography(self, author_name: str) -> Dict[str, str]:
        """Generate author biography"""
        if self.ai_service and self.ai_service.available:
            prompt = f"""Write a comprehensive biography of author {author_name}.

Include:
1. Early life and education
2. Career highlights
3. Major works and achievements
4. Writing style and themes
5. Legacy and influence

Keep it factual and informative."""

            bio_text = self.ai_service.model.generate_content(prompt).text.strip()
        else:
            bio_text = f"{author_name} is an acclaimed author known for their contributions to literature."
        
        return {
            "full_biography": bio_text,
            "short_bio": bio_text[:200] + "..." if len(bio_text) > 200 else bio_text,
            "birth_year": "Unknown",
            "nationality": "Unknown"
        }
    
    def _get_bibliography(self, author_name: str) -> List[Dict]:
        """Get author's complete works"""
        # Mock bibliography
        return [
            {
                "title": f"Book 1 by {author_name}",
                "year": 2020,
                "genre": "Fiction",
                "rating": 4.2
            },
            {
                "title": f"Book 2 by {author_name}",
                "year": 2022,
                "genre": "Fiction",
                "rating": 4.5
            }
        ]
    
    def _get_interviews(self, author_name: str) -> List[Dict]:
        """Get author interviews and quotes"""
        return [
            {
                "source": "Literary Magazine",
                "date": "2023-01-15",
                "excerpt": f"Interview with {author_name} about their writing process.",
                "url": f"https://interviews.com/{author_name.replace(' ', '-').lower()}"
            }
        ]
    
    def _analyze_writing_style(self, author_name: str) -> Dict[str, Any]:
        """Analyze author's writing style"""
        return {
            "characteristics": ["Descriptive", "Character-driven", "Lyrical"],
            "common_themes": ["Identity", "Relationships", "Society"],
            "narrative_style": "Third-person omniscient"
        }
    
    def _get_influences(self, author_name: str) -> List[str]:
        """Get author's literary influences"""
        return ["Classic Literature", "Contemporary Fiction", "Poetry"]
    
    def _get_awards(self, author_name: str) -> List[Dict]:
        """Get author's awards and honors"""
        return [
            {
                "award": "Literary Prize",
                "year": 2021,
                "work": f"Book by {author_name}"
            }
        ]


# ============================================================================
# LITERARY ANALYSIS
# ============================================================================

class LiteraryAnalysisService:
    """Themes, symbols, context analysis"""
    
    def __init__(self):
        self.ai_service = gemini_service if GEMINI_AVAILABLE else None
        logger.info("✅ Literary Analysis Service initialized")
    
    def analyze_book(self, book: Book) -> Dict[str, Any]:
        """
        Comprehensive literary analysis
        
        Args:
            book: Book object
        
        Returns:
            Literary analysis
        """
        return {
            "book_id": book.work_id,
            "title": book.title,
            "themes": self._identify_themes(book),
            "symbols": self._identify_symbols(book),
            "context": self._analyze_context(book),
            "literary_devices": self._identify_devices(book),
            "character_analysis": self._analyze_characters(book)
        }
    
    def _identify_themes(self, book: Book) -> List[Dict]:
        """Identify major themes"""
        if self.ai_service and self.ai_service.available:
            prompt = f"""Identify and explain the major themes in "{book.title}" by {', '.join(book.authors)}.

List 3-5 major themes with brief explanations."""

            response = self.ai_service.model.generate_content(prompt).text.strip()
            
            # Parse themes from response
            themes = []
            for line in response.split('\n'):
                if line.strip() and (line[0].isdigit() or line.startswith('-')):
                    themes.append({
                        "theme": line.strip(),
                        "explanation": "Analysis of this theme in the book."
                    })
            
            return themes if themes else [{"theme": "Coming of age", "explanation": "The protagonist's journey to maturity."}]
        
        return [
            {"theme": "Coming of age", "explanation": "The protagonist's journey to maturity."},
            {"theme": "Identity", "explanation": "Exploration of self-discovery."}
        ]
    
    def _identify_symbols(self, book: Book) -> List[Dict]:
        """Identify symbols and their meanings"""
        return [
            {
                "symbol": "The Journey",
                "meaning": "Represents personal growth and transformation",
                "significance": "Central to the narrative arc"
            },
            {
                "symbol": "Light and Darkness",
                "meaning": "Represents knowledge vs ignorance",
                "significance": "Recurring motif throughout"
            }
        ]
    
    def _analyze_context(self, book: Book) -> Dict[str, Any]:
        """Analyze historical and cultural context"""
        return {
            "historical_period": f"{book.year}s" if book.year else "Contemporary",
            "cultural_context": "Reflects the social dynamics of its time",
            "literary_movement": "Contemporary Fiction",
            "influences": ["Historical events", "Social movements"]
        }
    
    def _identify_devices(self, book: Book) -> List[str]:
        """Identify literary devices used"""
        return [
            "Metaphor",
            "Foreshadowing",
            "Symbolism",
            "Irony",
            "Imagery"
        ]
    
    def _analyze_characters(self, book: Book) -> List[Dict]:
        """Analyze main characters"""
        return [
            {
                "name": "Protagonist",
                "role": "Main character",
                "development": "Dynamic character with significant growth",
                "relationships": "Central to all major plot points"
            }
        ]


# ============================================================================
# READING GUIDES
# ============================================================================

class ReadingGuideService:
    """Discussion questions and study guides"""
    
    def __init__(self):
        self.ai_service = gemini_service if GEMINI_AVAILABLE else None
        logger.info("✅ Reading Guide Service initialized")
    
    def generate_reading_guide(
        self,
        book: Book,
        audience: str = "general"
    ) -> Dict[str, Any]:
        """
        Generate comprehensive reading guide
        
        Args:
            book: Book object
            audience: general, students, book_club
        
        Returns:
            Reading guide
        """
        return {
            "book_id": book.work_id,
            "title": book.title,
            "audience": audience,
            "discussion_questions": self._generate_discussion_questions(book, audience),
            "study_guide": self._generate_study_guide(book),
            "activities": self._generate_activities(book),
            "further_reading": self._suggest_further_reading(book)
        }
    
    def _generate_discussion_questions(
        self,
        book: Book,
        audience: str
    ) -> List[Dict]:
        """Generate discussion questions"""
        if self.ai_service and self.ai_service.available:
            prompt = f"""Generate 10 thought-provoking discussion questions for "{book.title}" by {', '.join(book.authors)}.

Audience: {audience}

Questions should encourage deep thinking and meaningful discussion."""

            response = self.ai_service.model.generate_content(prompt).text.strip()
            
            questions = []
            for line in response.split('\n'):
                if line.strip() and (line[0].isdigit() or line.startswith('-') or '?' in line):
                    questions.append({
                        "question": line.strip(),
                        "category": "thematic"
                    })
            
            return questions if questions else self._default_questions(book)
        
        return self._default_questions(book)
    
    def _default_questions(self, book: Book) -> List[Dict]:
        """Default discussion questions"""
        return [
            {
                "question": f"What are the main themes in {book.title}?",
                "category": "thematic"
            },
            {
                "question": "How do the characters develop throughout the story?",
                "category": "character"
            },
            {
                "question": "What is the significance of the setting?",
                "category": "setting"
            },
            {
                "question": "How does the author's writing style contribute to the story?",
                "category": "style"
            },
            {
                "question": "What message or lesson does the book convey?",
                "category": "message"
            }
        ]
    
    def _generate_study_guide(self, book: Book) -> Dict[str, Any]:
        """Generate study guide"""
        return {
            "overview": f"Study guide for {book.title}",
            "key_points": [
                "Plot summary and structure",
                "Character analysis",
                "Theme exploration",
                "Historical context",
                "Literary devices"
            ],
            "vocabulary": self._extract_vocabulary(book),
            "timeline": "Chronological events in the narrative"
        }
    
    def _generate_activities(self, book: Book) -> List[Dict]:
        """Generate reading activities"""
        return [
            {
                "activity": "Character Map",
                "description": "Create a visual map of character relationships",
                "difficulty": "Easy"
            },
            {
                "activity": "Theme Essay",
                "description": "Write an essay analyzing a major theme",
                "difficulty": "Medium"
            },
            {
                "activity": "Creative Response",
                "description": "Write an alternate ending or missing chapter",
                "difficulty": "Medium"
            }
        ]
    
    def _suggest_further_reading(self, book: Book) -> List[Dict]:
        """Suggest related books"""
        return [
            {
                "title": "Similar Book 1",
                "author": "Author Name",
                "reason": "Similar themes and style"
            },
            {
                "title": "Similar Book 2",
                "author": "Author Name",
                "reason": "Same genre and period"
            }
        ]
    
    def _extract_vocabulary(self, book: Book) -> List[Dict]:
        """Extract important vocabulary"""
        return [
            {"word": "Example", "definition": "A representative sample", "context": "Used in chapter 3"},
            {"word": "Metaphor", "definition": "A figure of speech", "context": "Literary device"}
        ]


# ============================================================================
# BOOK TIMELINES
# ============================================================================

class BookTimelineService:
    """Historical context visualization"""
    
    def __init__(self):
        logger.info("✅ Book Timeline Service initialized")
    
    def create_timeline(self, book: Book) -> Dict[str, Any]:
        """
        Create historical timeline for book
        
        Args:
            book: Book object
        
        Returns:
            Timeline data
        """
        return {
            "book_id": book.work_id,
            "title": book.title,
            "publication_timeline": self._create_publication_timeline(book),
            "historical_events": self._get_historical_events(book),
            "author_timeline": self._create_author_timeline(book),
            "literary_context": self._get_literary_context(book)
        }
    
    def _create_publication_timeline(self, book: Book) -> List[Dict]:
        """Create publication history timeline"""
        year = book.year or 2020
        return [
            {
                "date": f"{year-2}",
                "event": "Writing began",
                "type": "creation"
            },
            {
                "date": f"{year}",
                "event": "First published",
                "type": "publication"
            },
            {
                "date": f"{year+1}",
                "event": "Paperback release",
                "type": "publication"
            }
        ]
    
    def _get_historical_events(self, book: Book) -> List[Dict]:
        """Get relevant historical events"""
        year = book.year or 2020
        return [
            {
                "date": f"{year}",
                "event": "Historical event relevant to the book's context",
                "significance": "Influenced the themes and setting"
            }
        ]
    
    def _create_author_timeline(self, book: Book) -> List[Dict]:
        """Create author's career timeline"""
        return [
            {
                "date": "Early career",
                "event": f"{book.authors[0] if book.authors else 'Author'} began writing",
                "type": "career"
            },
            {
                "date": "Mid career",
                "event": f"Published {book.title}",
                "type": "publication"
            }
        ]
    
    def _get_literary_context(self, book: Book) -> Dict[str, Any]:
        """Get literary movement context"""
        return {
            "movement": "Contemporary Literature",
            "contemporaries": ["Other authors of the period"],
            "influences": ["Literary movements that influenced the work"]
        }


# ============================================================================
# RELATED CONTENT
# ============================================================================

class RelatedContentService:
    """Podcasts, videos, articles"""
    
    def __init__(self):
        logger.info("✅ Related Content Service initialized")
    
    def find_related_content(self, book: Book) -> Dict[str, Any]:
        """
        Find related content
        
        Args:
            book: Book object
        
        Returns:
            Related content
        """
        return {
            "book_id": book.work_id,
            "title": book.title,
            "podcasts": self._find_podcasts(book),
            "videos": self._find_videos(book),
            "articles": self._find_articles(book),
            "interviews": self._find_interviews(book)
        }
    
    def _find_podcasts(self, book: Book) -> List[Dict]:
        """Find related podcasts"""
        return [
            {
                "title": f"Discussion of {book.title}",
                "host": "Book Podcast",
                "duration": "45 minutes",
                "url": f"https://podcasts.com/{book.work_id}",
                "description": f"In-depth discussion of {book.title}"
            }
        ]
    
    def _find_videos(self, book: Book) -> List[Dict]:
        """Find related videos"""
        return [
            {
                "title": f"Book Review: {book.title}",
                "platform": "YouTube",
                "duration": "15 minutes",
                "url": f"https://youtube.com/watch?v={book.work_id}",
                "views": "10K"
            }
        ]
    
    def _find_articles(self, book: Book) -> List[Dict]:
        """Find related articles"""
        return [
            {
                "title": f"Analysis of {book.title}",
                "publication": "Literary Magazine",
                "author": "Critic Name",
                "date": "2024-01-15",
                "url": f"https://articles.com/{book.work_id}"
            }
        ]
    
    def _find_interviews(self, book: Book) -> List[Dict]:
        """Find author interviews"""
        return [
            {
                "title": f"Interview with {book.authors[0] if book.authors else 'Author'}",
                "source": "Book Review",
                "date": "2024-02-01",
                "url": f"https://interviews.com/{book.work_id}"
            }
        ]


# ============================================================================
# LANGUAGE LEARNING
# ============================================================================

class LanguageLearningService:
    """Vocabulary builder from books"""
    
    def __init__(self):
        logger.info("✅ Language Learning Service initialized")
    
    def extract_vocabulary(
        self,
        book: Book,
        difficulty_level: str = "intermediate"
    ) -> Dict[str, Any]:
        """
        Extract vocabulary for language learning
        
        Args:
            book: Book object
            difficulty_level: beginner, intermediate, advanced
        
        Returns:
            Vocabulary data
        """
        return {
            "book_id": book.work_id,
            "title": book.title,
            "difficulty_level": difficulty_level,
            "vocabulary_list": self._generate_vocabulary_list(book, difficulty_level),
            "phrases": self._extract_phrases(book),
            "grammar_points": self._identify_grammar_points(book),
            "exercises": self._create_exercises(book)
        }
    
    def _generate_vocabulary_list(
        self,
        book: Book,
        difficulty_level: str
    ) -> List[Dict]:
        """Generate vocabulary list"""
        # Mock vocabulary based on difficulty
        vocab_count = {"beginner": 50, "intermediate": 100, "advanced": 200}
        count = vocab_count.get(difficulty_level, 100)
        
        return [
            {
                "word": f"Word{i}",
                "definition": f"Definition of word {i}",
                "part_of_speech": "noun",
                "example": f"Example sentence using word{i} from {book.title}",
                "frequency": "common",
                "difficulty": difficulty_level
            }
            for i in range(1, min(count, 21))  # Limit to 20 for demo
        ]
    
    def _extract_phrases(self, book: Book) -> List[Dict]:
        """Extract common phrases"""
        return [
            {
                "phrase": "Common phrase",
                "meaning": "Meaning of the phrase",
                "usage": "How it's used in context",
                "example": f"Example from {book.title}"
            }
        ]
    
    def _identify_grammar_points(self, book: Book) -> List[Dict]:
        """Identify grammar points"""
        return [
            {
                "grammar_point": "Past tense",
                "explanation": "Use of past tense in narrative",
                "examples": ["Example 1", "Example 2"]
            },
            {
                "grammar_point": "Complex sentences",
                "explanation": "Use of subordinate clauses",
                "examples": ["Example 1", "Example 2"]
            }
        ]
    
    def _create_exercises(self, book: Book) -> List[Dict]:
        """Create language learning exercises"""
        return [
            {
                "type": "vocabulary_quiz",
                "title": "Vocabulary Quiz",
                "questions": 10,
                "difficulty": "intermediate"
            },
            {
                "type": "fill_in_blank",
                "title": "Complete the Sentences",
                "questions": 15,
                "difficulty": "intermediate"
            },
            {
                "type": "comprehension",
                "title": "Reading Comprehension",
                "questions": 5,
                "difficulty": "intermediate"
            }
        ]


# Global instances
book_summary_service = BookSummaryService()
author_profile_service = AuthorProfileService()
literary_analysis_service = LiteraryAnalysisService()
reading_guide_service = ReadingGuideService()
book_timeline_service = BookTimelineService()
related_content_service = RelatedContentService()
language_learning_service = LanguageLearningService()
