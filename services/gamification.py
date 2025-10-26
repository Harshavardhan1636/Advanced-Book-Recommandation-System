"""
Gamification Service
Achievements, Leaderboards, Streaks, Points, Rewards, Competitions
"""

import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict
from enum import Enum

logger = logging.getLogger(__name__)


# ============================================================================
# ACHIEVEMENT SYSTEM
# ============================================================================

class AchievementType(str, Enum):
    """Achievement categories"""
    READING = "reading"
    SOCIAL = "social"
    COLLECTION = "collection"
    STREAK = "streak"
    SPECIAL = "special"


class Achievement:
    """Achievement definition"""
    
    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        category: AchievementType,
        points: int,
        icon: str,
        requirement: Dict[str, Any]
    ):
        self.id = id
        self.name = name
        self.description = description
        self.category = category
        self.points = points
        self.icon = icon
        self.requirement = requirement


class AchievementSystem:
    """Achievement and badge system"""
    
    def __init__(self):
        self.achievements = self._initialize_achievements()
        logger.info(f"✅ Achievement system initialized ({len(self.achievements)} achievements)")
    
    def _initialize_achievements(self) -> Dict[str, Achievement]:
        """Initialize all achievements"""
        achievements = {
            # Reading achievements
            "first_book": Achievement(
                "first_book",
                "First Steps",
                "Complete your first book",
                AchievementType.READING,
                10,
                "📖",
                {"books_read": 1}
            ),
            "bookworm": Achievement(
                "bookworm",
                "Bookworm",
                "Read 10 books",
                AchievementType.READING,
                50,
                "🐛",
                {"books_read": 10}
            ),
            "bibliophile": Achievement(
                "bibliophile",
                "Bibliophile",
                "Read 50 books",
                AchievementType.READING,
                200,
                "📚",
                {"books_read": 50}
            ),
            "century_club": Achievement(
                "century_club",
                "Century Club",
                "Read 100 books",
                AchievementType.READING,
                500,
                "💯",
                {"books_read": 100}
            ),
            
            # Streak achievements
            "week_streak": Achievement(
                "week_streak",
                "Week Warrior",
                "Maintain a 7-day reading streak",
                AchievementType.STREAK,
                30,
                "🔥",
                {"streak_days": 7}
            ),
            "month_streak": Achievement(
                "month_streak",
                "Monthly Master",
                "Maintain a 30-day reading streak",
                AchievementType.STREAK,
                100,
                "⚡",
                {"streak_days": 30}
            ),
            "year_streak": Achievement(
                "year_streak",
                "Yearly Legend",
                "Maintain a 365-day reading streak",
                AchievementType.STREAK,
                1000,
                "👑",
                {"streak_days": 365}
            ),
            
            # Social achievements
            "first_review": Achievement(
                "first_review",
                "Critic",
                "Write your first review",
                AchievementType.SOCIAL,
                10,
                "✍️",
                {"reviews_written": 1}
            ),
            "social_butterfly": Achievement(
                "social_butterfly",
                "Social Butterfly",
                "Join 5 book clubs",
                AchievementType.SOCIAL,
                50,
                "🦋",
                {"clubs_joined": 5}
            ),
            
            # Collection achievements
            "genre_explorer": Achievement(
                "genre_explorer",
                "Genre Explorer",
                "Read books from 10 different genres",
                AchievementType.COLLECTION,
                75,
                "🌍",
                {"unique_genres": 10}
            ),
            "author_fan": Achievement(
                "author_fan",
                "Author Fan",
                "Read 5 books by the same author",
                AchievementType.COLLECTION,
                40,
                "⭐",
                {"same_author": 5}
            ),
            
            # Special achievements
            "speed_reader": Achievement(
                "speed_reader",
                "Speed Reader",
                "Finish a 300+ page book in one day",
                AchievementType.SPECIAL,
                100,
                "⚡",
                {"pages_per_day": 300}
            ),
            "night_owl": Achievement(
                "night_owl",
                "Night Owl",
                "Read after midnight 10 times",
                AchievementType.SPECIAL,
                30,
                "🦉",
                {"late_night_sessions": 10}
            ),
        }
        
        return achievements
    
    def check_achievements(
        self,
        user_id: int,
        user_stats: Dict[str, Any]
    ) -> List[Achievement]:
        """
        Check which achievements user has earned
        
        Args:
            user_id: User ID
            user_stats: User statistics
        
        Returns:
            List of newly earned achievements
        """
        newly_earned = []
        
        for achievement in self.achievements.values():
            if self._check_requirement(achievement, user_stats):
                newly_earned.append(achievement)
        
        logger.info(f"User {user_id} earned {len(newly_earned)} new achievements")
        return newly_earned
    
    def _check_requirement(
        self,
        achievement: Achievement,
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check if achievement requirement is met"""
        for key, required_value in achievement.requirement.items():
            user_value = user_stats.get(key, 0)
            if user_value < required_value:
                return False
        return True
    
    def get_progress(
        self,
        achievement: Achievement,
        user_stats: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Get progress towards an achievement"""
        progress = {}
        
        for key, required_value in achievement.requirement.items():
            user_value = user_stats.get(key, 0)
            progress[key] = {
                "current": user_value,
                "required": required_value,
                "percentage": min(100, (user_value / required_value) * 100)
            }
        
        return progress


# ============================================================================
# LEADERBOARDS
# ============================================================================

class LeaderboardType(str, Enum):
    """Leaderboard types"""
    BOOKS_READ = "books_read"
    POINTS = "points"
    STREAK = "streak"
    REVIEWS = "reviews"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    ALL_TIME = "all_time"


class LeaderboardSystem:
    """Leaderboards and rankings"""
    
    def __init__(self):
        self.leaderboards: Dict[str, List[Dict]] = defaultdict(list)
        logger.info("✅ Leaderboard system initialized")
    
    def update_leaderboard(
        self,
        leaderboard_type: LeaderboardType,
        user_id: int,
        username: str,
        score: int
    ):
        """Update user's position on leaderboard"""
        leaderboard = self.leaderboards[leaderboard_type.value]
        
        # Remove existing entry
        leaderboard = [entry for entry in leaderboard if entry["user_id"] != user_id]
        
        # Add new entry
        leaderboard.append({
            "user_id": user_id,
            "username": username,
            "score": score,
            "updated_at": datetime.now().isoformat()
        })
        
        # Sort by score descending
        leaderboard.sort(key=lambda x: x["score"], reverse=True)
        
        # Keep top 100
        self.leaderboards[leaderboard_type.value] = leaderboard[:100]
    
    def get_leaderboard(
        self,
        leaderboard_type: LeaderboardType,
        limit: int = 10
    ) -> List[Dict]:
        """Get top users on leaderboard"""
        leaderboard = self.leaderboards[leaderboard_type.value]
        
        # Add ranks
        for i, entry in enumerate(leaderboard[:limit], 1):
            entry["rank"] = i
        
        return leaderboard[:limit]
    
    def get_user_rank(
        self,
        leaderboard_type: LeaderboardType,
        user_id: int
    ) -> Optional[Dict]:
        """Get user's rank on leaderboard"""
        leaderboard = self.leaderboards[leaderboard_type.value]
        
        for i, entry in enumerate(leaderboard, 1):
            if entry["user_id"] == user_id:
                return {
                    "rank": i,
                    "score": entry["score"],
                    "total_users": len(leaderboard)
                }
        
        return None


# ============================================================================
# STREAK SYSTEM
# ============================================================================

class StreakTracker:
    """Daily reading streak tracking"""
    
    def __init__(self):
        self.user_streaks: Dict[int, Dict] = {}
        logger.info("✅ Streak tracker initialized")
    
    def record_activity(self, user_id: int, activity_date: datetime):
        """Record reading activity for streak"""
        if user_id not in self.user_streaks:
            self.user_streaks[user_id] = {
                "current_streak": 0,
                "longest_streak": 0,
                "last_activity": None,
                "streak_start": None
            }
        
        streak_data = self.user_streaks[user_id]
        last_activity = streak_data["last_activity"]
        
        if last_activity is None:
            # First activity
            streak_data["current_streak"] = 1
            streak_data["longest_streak"] = 1
            streak_data["streak_start"] = activity_date
        else:
            days_diff = (activity_date.date() - last_activity.date()).days
            
            if days_diff == 1:
                # Consecutive day
                streak_data["current_streak"] += 1
                if streak_data["current_streak"] > streak_data["longest_streak"]:
                    streak_data["longest_streak"] = streak_data["current_streak"]
            elif days_diff > 1:
                # Streak broken
                streak_data["current_streak"] = 1
                streak_data["streak_start"] = activity_date
        
        streak_data["last_activity"] = activity_date
        
        logger.info(f"User {user_id} streak: {streak_data['current_streak']} days")
    
    def get_streak(self, user_id: int) -> Dict[str, Any]:
        """Get user's streak information"""
        if user_id not in self.user_streaks:
            return {
                "current_streak": 0,
                "longest_streak": 0,
                "streak_start": None,
                "days_until_milestone": None
            }
        
        streak_data = self.user_streaks[user_id]
        current = streak_data["current_streak"]
        
        # Calculate next milestone
        milestones = [7, 30, 100, 365]
        next_milestone = next((m for m in milestones if m > current), None)
        
        return {
            "current_streak": current,
            "longest_streak": streak_data["longest_streak"],
            "streak_start": streak_data["streak_start"].isoformat() if streak_data["streak_start"] else None,
            "next_milestone": next_milestone,
            "days_until_milestone": next_milestone - current if next_milestone else None
        }


# ============================================================================
# POINTS SYSTEM
# ============================================================================

class PointsSystem:
    """Earn points for activities"""
    
    POINT_VALUES = {
        "book_read": 10,
        "review_written": 5,
        "book_rated": 2,
        "list_created": 3,
        "club_joined": 5,
        "friend_added": 2,
        "goal_achieved": 20,
        "streak_milestone": 50,
        "achievement_earned": 10
    }
    
    def __init__(self):
        self.user_points: Dict[int, int] = defaultdict(int)
        self.point_history: Dict[int, List[Dict]] = defaultdict(list)
        logger.info("✅ Points system initialized")
    
    def award_points(
        self,
        user_id: int,
        activity: str,
        multiplier: float = 1.0
    ) -> int:
        """
        Award points for an activity
        
        Args:
            user_id: User ID
            activity: Activity type
            multiplier: Point multiplier (e.g., 2.0 for double points)
        
        Returns:
            Points awarded
        """
        base_points = self.POINT_VALUES.get(activity, 1)
        points = int(base_points * multiplier)
        
        self.user_points[user_id] += points
        
        # Record in history
        self.point_history[user_id].append({
            "activity": activity,
            "points": points,
            "timestamp": datetime.now().isoformat()
        })
        
        logger.info(f"User {user_id} earned {points} points for {activity}")
        return points
    
    def get_points(self, user_id: int) -> int:
        """Get user's total points"""
        return self.user_points[user_id]
    
    def get_point_history(
        self,
        user_id: int,
        limit: int = 10
    ) -> List[Dict]:
        """Get recent point history"""
        return self.point_history[user_id][-limit:]


# ============================================================================
# VIRTUAL REWARDS
# ============================================================================

class RewardType(str, Enum):
    """Reward types"""
    THEME = "theme"
    BADGE = "badge"
    FEATURE = "feature"
    AVATAR = "avatar"
    TITLE = "title"


class VirtualReward:
    """Virtual reward definition"""
    
    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        reward_type: RewardType,
        cost_points: int,
        icon: str
    ):
        self.id = id
        self.name = name
        self.description = description
        self.reward_type = reward_type
        self.cost_points = cost_points
        self.icon = icon


class RewardSystem:
    """Virtual rewards and unlockables"""
    
    def __init__(self):
        self.rewards = self._initialize_rewards()
        self.user_rewards: Dict[int, List[str]] = defaultdict(list)
        logger.info(f"✅ Reward system initialized ({len(self.rewards)} rewards)")
    
    def _initialize_rewards(self) -> Dict[str, VirtualReward]:
        """Initialize all rewards"""
        return {
            "dark_theme": VirtualReward(
                "dark_theme",
                "Dark Theme",
                "Unlock dark mode theme",
                RewardType.THEME,
                100,
                "🌙"
            ),
            "ocean_theme": VirtualReward(
                "ocean_theme",
                "Ocean Theme",
                "Beautiful ocean-inspired theme",
                RewardType.THEME,
                200,
                "🌊"
            ),
            "golden_badge": VirtualReward(
                "golden_badge",
                "Golden Badge",
                "Prestigious golden profile badge",
                RewardType.BADGE,
                500,
                "🏆"
            ),
            "advanced_stats": VirtualReward(
                "advanced_stats",
                "Advanced Statistics",
                "Unlock detailed reading analytics",
                RewardType.FEATURE,
                300,
                "📊"
            ),
            "bookworm_title": VirtualReward(
                "bookworm_title",
                "Bookworm Title",
                "Display 'Bookworm' title on profile",
                RewardType.TITLE,
                150,
                "📚"
            )
        }
    
    def unlock_reward(
        self,
        user_id: int,
        reward_id: str,
        points_system: PointsSystem
    ) -> Dict[str, Any]:
        """
        Unlock a reward using points
        
        Args:
            user_id: User ID
            reward_id: Reward ID
            points_system: Points system instance
        
        Returns:
            Unlock result
        """
        if reward_id not in self.rewards:
            return {"success": False, "message": "Reward not found"}
        
        reward = self.rewards[reward_id]
        user_points = points_system.get_points(user_id)
        
        if user_points < reward.cost_points:
            return {
                "success": False,
                "message": f"Not enough points. Need {reward.cost_points}, have {user_points}"
            }
        
        if reward_id in self.user_rewards[user_id]:
            return {"success": False, "message": "Already unlocked"}
        
        # Deduct points
        points_system.user_points[user_id] -= reward.cost_points
        
        # Unlock reward
        self.user_rewards[user_id].append(reward_id)
        
        logger.info(f"User {user_id} unlocked reward: {reward.name}")
        
        return {
            "success": True,
            "reward": reward.name,
            "points_spent": reward.cost_points,
            "remaining_points": points_system.get_points(user_id)
        }
    
    def get_unlocked_rewards(self, user_id: int) -> List[VirtualReward]:
        """Get user's unlocked rewards"""
        reward_ids = self.user_rewards[user_id]
        return [self.rewards[rid] for rid in reward_ids if rid in self.rewards]


# ============================================================================
# SOCIAL COMPETITIONS
# ============================================================================

class Competition:
    """Reading competition definition"""
    
    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        start_date: datetime,
        end_date: datetime,
        goal_type: str,
        goal_value: int
    ):
        self.id = id
        self.name = name
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.goal_type = goal_type
        self.goal_value = goal_value
        self.participants: Dict[int, int] = {}


class CompetitionSystem:
    """Friend challenges and competitions"""
    
    def __init__(self):
        self.competitions: Dict[str, Competition] = {}
        logger.info("✅ Competition system initialized")
    
    def create_competition(
        self,
        name: str,
        description: str,
        duration_days: int,
        goal_type: str,
        goal_value: int
    ) -> Competition:
        """Create a new competition"""
        import uuid
        
        competition_id = str(uuid.uuid4())[:8]
        start_date = datetime.now()
        end_date = start_date + timedelta(days=duration_days)
        
        competition = Competition(
            competition_id,
            name,
            description,
            start_date,
            end_date,
            goal_type,
            goal_value
        )
        
        self.competitions[competition_id] = competition
        
        logger.info(f"Created competition: {name}")
        return competition
    
    def join_competition(self, competition_id: str, user_id: int) -> bool:
        """Join a competition"""
        if competition_id not in self.competitions:
            return False
        
        competition = self.competitions[competition_id]
        competition.participants[user_id] = 0
        
        logger.info(f"User {user_id} joined competition: {competition.name}")
        return True
    
    def update_progress(
        self,
        competition_id: str,
        user_id: int,
        progress: int
    ):
        """Update user's competition progress"""
        if competition_id not in self.competitions:
            return
        
        competition = self.competitions[competition_id]
        if user_id in competition.participants:
            competition.participants[user_id] = progress
    
    def get_leaderboard(self, competition_id: str) -> List[Dict]:
        """Get competition leaderboard"""
        if competition_id not in self.competitions:
            return []
        
        competition = self.competitions[competition_id]
        
        leaderboard = [
            {"user_id": uid, "progress": progress}
            for uid, progress in competition.participants.items()
        ]
        
        leaderboard.sort(key=lambda x: x["progress"], reverse=True)
        
        for i, entry in enumerate(leaderboard, 1):
            entry["rank"] = i
        
        return leaderboard


# Global instances
achievement_system = AchievementSystem()
leaderboard_system = LeaderboardSystem()
streak_tracker = StreakTracker()
points_system = PointsSystem()
reward_system = RewardSystem()
competition_system = CompetitionSystem()
