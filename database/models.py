"""
Database models using SQLAlchemy
Supports PostgreSQL, MySQL, SQLite
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Table, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# Association tables for many-to-many relationships
user_favorites = Table(
    'user_favorites',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('book_id', Integer, ForeignKey('books.id'))
)

reading_list_books = Table(
    'reading_list_books',
    Base.metadata,
    Column('reading_list_id', Integer, ForeignKey('reading_lists.id')),
    Column('book_id', Integer, ForeignKey('books.id'))
)

user_followers = Table(
    'user_followers',
    Base.metadata,
    Column('follower_id', Integer, ForeignKey('users.id')),
    Column('following_id', Integer, ForeignKey('users.id'))
)


class User(Base):
    """User model"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    bio = Column(Text)
    avatar_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reading_history = relationship("ReadingHistoryDB", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Book", secondary=user_favorites, back_populates="favorited_by")
    reading_lists = relationship("ReadingList", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")
    
    # Self-referential many-to-many for followers
    followers = relationship(
        "User",
        secondary=user_followers,
        primaryjoin=id == user_followers.c.following_id,
        secondaryjoin=id == user_followers.c.follower_id,
        backref="following"
    )


class Book(Base):
    """Book model"""
    __tablename__ = 'books'
    
    id = Column(Integer, primary_key=True, index=True)
    work_id = Column(String(100), unique=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    authors = Column(JSON)  # List of authors
    year = Column(Integer, index=True)
    isbn = Column(String(20), index=True)
    publisher = Column(String(100))
    language = Column(String(10))
    page_count = Column(Integer)
    edition_count = Column(Integer, default=0)
    cover_url = Column(String(255))
    description = Column(Text)
    subjects = Column(JSON)  # List of subjects/genres
    rating = Column(Float)
    popularity_score = Column(Float)
    sentiment_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    favorited_by = relationship("User", secondary=user_favorites, back_populates="favorites")
    reading_history = relationship("ReadingHistoryDB", back_populates="book")
    reviews = relationship("Review", back_populates="book", cascade="all, delete-orphan")


class ReadingHistoryDB(Base):
    """Reading history model"""
    __tablename__ = 'reading_history'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)
    status = Column(String(20), default='want_to_read')  # want_to_read, reading, read
    rating = Column(Float)
    review_text = Column(Text)
    started_at = Column(DateTime)
    finished_at = Column(DateTime)
    progress = Column(Integer, default=0)  # Pages read
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reading_history")
    book = relationship("Book", back_populates="reading_history")


class ReadingList(Base):
    """Reading list model"""
    __tablename__ = 'reading_lists'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reading_lists")
    books = relationship("Book", secondary=reading_list_books)


class Review(Base):
    """Book review model"""
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)
    rating = Column(Float, nullable=False)
    title = Column(String(200))
    content = Column(Text)
    likes_count = Column(Integer, default=0)
    is_spoiler = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")


class Activity(Base):
    """User activity feed model"""
    __tablename__ = 'activities'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    activity_type = Column(String(50), nullable=False)  # finished_book, added_review, created_list, etc.
    content = Column(JSON)  # Activity details
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="activities")


class Challenge(Base):
    """Reading challenge model"""
    __tablename__ = 'challenges'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    challenge_type = Column(String(50))  # yearly_goal, genre_challenge, page_challenge, etc.
    target = Column(Integer)  # Target number (books, pages, etc.)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserChallenge(Base):
    """User participation in challenges"""
    __tablename__ = 'user_challenges'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    challenge_id = Column(Integer, ForeignKey('challenges.id'), nullable=False)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)


class BookClub(Base):
    """Book club model"""
    __tablename__ = 'book_clubs'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    is_private = Column(Boolean, default=False)
    member_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class BookClubMember(Base):
    """Book club membership"""
    __tablename__ = 'book_club_members'
    
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey('book_clubs.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    role = Column(String(20), default='member')  # admin, moderator, member
    joined_at = Column(DateTime, default=datetime.utcnow)


class Discussion(Base):
    """Book club discussion model"""
    __tablename__ = 'discussions'
    
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey('book_clubs.id'), nullable=False)
    book_id = Column(Integer, ForeignKey('books.id'))
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    replies_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
