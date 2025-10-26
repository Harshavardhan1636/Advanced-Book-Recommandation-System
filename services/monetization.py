"""
Monetization & Scalability Service
Freemium, Affiliate marketing, Subscriptions, API access, White-label, Microservices
"""

import os
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from enum import Enum
import hashlib
import secrets

logger = logging.getLogger(__name__)


# ============================================================================
# SUBSCRIPTION TIERS
# ============================================================================

class SubscriptionTier(str, Enum):
    """Subscription tier levels"""
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class SubscriptionService:
    """Freemium model with premium features"""
    
    TIER_FEATURES = {
        SubscriptionTier.FREE: {
            "price": 0,
            "features": [
                "Basic book search",
                "10 recommendations per day",
                "Basic reading list",
                "Community features"
            ],
            "limits": {
                "recommendations_per_day": 10,
                "reading_lists": 3,
                "api_calls_per_day": 100
            }
        },
        SubscriptionTier.BASIC: {
            "price": 4.99,
            "features": [
                "All Free features",
                "Unlimited recommendations",
                "Advanced filters",
                "Reading statistics",
                "Ad-free experience",
                "10 reading lists"
            ],
            "limits": {
                "recommendations_per_day": -1,  # Unlimited
                "reading_lists": 10,
                "api_calls_per_day": 1000
            }
        },
        SubscriptionTier.PREMIUM: {
            "price": 9.99,
            "features": [
                "All Basic features",
                "AI-powered insights",
                "Predictive recommendations",
                "Advanced analytics",
                "Priority support",
                "Unlimited reading lists",
                "Export reports (PDF/Excel)",
                "Early access to new features"
            ],
            "limits": {
                "recommendations_per_day": -1,
                "reading_lists": -1,
                "api_calls_per_day": 10000
            }
        },
        SubscriptionTier.ENTERPRISE: {
            "price": 49.99,
            "features": [
                "All Premium features",
                "API access",
                "White-label solution",
                "Custom integrations",
                "Dedicated support",
                "SLA guarantee",
                "Custom analytics",
                "Multi-user accounts"
            ],
            "limits": {
                "recommendations_per_day": -1,
                "reading_lists": -1,
                "api_calls_per_day": 100000
            }
        }
    }
    
    def __init__(self):
        self.subscriptions: Dict[int, Dict] = {}
        logger.info("✅ Subscription Service initialized")
    
    def get_tier_info(self, tier: SubscriptionTier) -> Dict[str, Any]:
        """Get subscription tier information"""
        return self.TIER_FEATURES.get(tier, self.TIER_FEATURES[SubscriptionTier.FREE])
    
    def subscribe(
        self,
        user_id: int,
        tier: SubscriptionTier,
        payment_method: str
    ) -> Dict[str, Any]:
        """
        Subscribe user to a tier
        
        Args:
            user_id: User ID
            tier: Subscription tier
            payment_method: Payment method (stripe, paypal, etc.)
        
        Returns:
            Subscription details
        """
        tier_info = self.get_tier_info(tier)
        
        subscription = {
            "user_id": user_id,
            "tier": tier.value,
            "price": tier_info["price"],
            "features": tier_info["features"],
            "limits": tier_info["limits"],
            "start_date": datetime.now().isoformat(),
            "end_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "payment_method": payment_method,
            "status": "active",
            "auto_renew": True
        }
        
        self.subscriptions[user_id] = subscription
        
        logger.info(f"User {user_id} subscribed to {tier.value}")
        return subscription
    
    def check_feature_access(
        self,
        user_id: int,
        feature: str
    ) -> bool:
        """Check if user has access to a feature"""
        if user_id not in self.subscriptions:
            tier = SubscriptionTier.FREE
        else:
            tier = SubscriptionTier(self.subscriptions[user_id]["tier"])
        
        tier_info = self.get_tier_info(tier)
        return feature in tier_info["features"]
    
    def check_limit(
        self,
        user_id: int,
        limit_type: str,
        current_usage: int
    ) -> Dict[str, Any]:
        """Check if user is within limits"""
        if user_id not in self.subscriptions:
            tier = SubscriptionTier.FREE
        else:
            tier = SubscriptionTier(self.subscriptions[user_id]["tier"])
        
        tier_info = self.get_tier_info(tier)
        limit = tier_info["limits"].get(limit_type, 0)
        
        if limit == -1:  # Unlimited
            return {"allowed": True, "remaining": -1}
        
        remaining = max(0, limit - current_usage)
        allowed = current_usage < limit
        
        return {
            "allowed": allowed,
            "limit": limit,
            "current_usage": current_usage,
            "remaining": remaining
        }


# ============================================================================
# AFFILIATE MARKETING
# ============================================================================

class AffiliateService:
    """Book purchase commissions"""
    
    def __init__(self):
        self.affiliates: Dict[str, Dict] = {}
        self.commission_rates = {
            "amazon": 0.04,  # 4%
            "book_depository": 0.05,  # 5%
            "audible": 0.06  # 6%
        }
        logger.info("✅ Affiliate Service initialized")
    
    def generate_affiliate_link(
        self,
        book_id: str,
        retailer: str,
        affiliate_id: str
    ) -> str:
        """
        Generate affiliate link
        
        Args:
            book_id: Book identifier
            retailer: Retailer name
            affiliate_id: Affiliate ID
        
        Returns:
            Affiliate link
        """
        base_urls = {
            "amazon": f"https://www.amazon.com/dp/{book_id}",
            "book_depository": f"https://www.bookdepository.com/book/{book_id}",
            "audible": f"https://www.audible.com/pd/{book_id}"
        }
        
        base_url = base_urls.get(retailer, f"https://example.com/{book_id}")
        affiliate_link = f"{base_url}?tag={affiliate_id}"
        
        return affiliate_link
    
    def track_click(
        self,
        affiliate_id: str,
        book_id: str,
        retailer: str
    ):
        """Track affiliate link click"""
        if affiliate_id not in self.affiliates:
            self.affiliates[affiliate_id] = {
                "clicks": 0,
                "conversions": 0,
                "revenue": 0.0
            }
        
        self.affiliates[affiliate_id]["clicks"] += 1
        logger.info(f"Affiliate click tracked: {affiliate_id}")
    
    def track_conversion(
        self,
        affiliate_id: str,
        book_id: str,
        retailer: str,
        sale_amount: float
    ) -> float:
        """
        Track affiliate conversion
        
        Returns:
            Commission earned
        """
        commission_rate = self.commission_rates.get(retailer, 0.04)
        commission = sale_amount * commission_rate
        
        if affiliate_id in self.affiliates:
            self.affiliates[affiliate_id]["conversions"] += 1
            self.affiliates[affiliate_id]["revenue"] += commission
        
        logger.info(f"Affiliate conversion: {affiliate_id}, commission: ${commission:.2f}")
        return commission
    
    def get_affiliate_stats(self, affiliate_id: str) -> Dict[str, Any]:
        """Get affiliate statistics"""
        if affiliate_id not in self.affiliates:
            return {"clicks": 0, "conversions": 0, "revenue": 0.0, "conversion_rate": 0.0}
        
        stats = self.affiliates[affiliate_id]
        conversion_rate = (stats["conversions"] / stats["clicks"] * 100) if stats["clicks"] > 0 else 0
        
        return {
            "clicks": stats["clicks"],
            "conversions": stats["conversions"],
            "revenue": stats["revenue"],
            "conversion_rate": round(conversion_rate, 2)
        }


# ============================================================================
# SPONSORED RECOMMENDATIONS
# ============================================================================

class SponsoredRecommendationService:
    """Ethical partnerships for sponsored content"""
    
    def __init__(self):
        self.campaigns: Dict[str, Dict] = {}
        logger.info("✅ Sponsored Recommendation Service initialized")
    
    def create_campaign(
        self,
        publisher: str,
        book_ids: List[str],
        budget: float,
        target_audience: Dict[str, Any]
    ) -> str:
        """
        Create sponsored campaign
        
        Args:
            publisher: Publisher name
            book_ids: Books to promote
            budget: Campaign budget
            target_audience: Targeting criteria
        
        Returns:
            Campaign ID
        """
        campaign_id = secrets.token_hex(8)
        
        campaign = {
            "campaign_id": campaign_id,
            "publisher": publisher,
            "book_ids": book_ids,
            "budget": budget,
            "spent": 0.0,
            "target_audience": target_audience,
            "impressions": 0,
            "clicks": 0,
            "conversions": 0,
            "start_date": datetime.now().isoformat(),
            "status": "active",
            "disclosure": "Sponsored recommendation - we may earn a commission"
        }
        
        self.campaigns[campaign_id] = campaign
        
        logger.info(f"Created sponsored campaign: {campaign_id}")
        return campaign_id
    
    def get_sponsored_recommendations(
        self,
        user_profile: Dict[str, Any],
        limit: int = 3
    ) -> List[Dict]:
        """Get sponsored recommendations for user"""
        recommendations = []
        
        for campaign_id, campaign in self.campaigns.items():
            if campaign["status"] != "active":
                continue
            
            if campaign["spent"] >= campaign["budget"]:
                continue
            
            # Check if user matches target audience
            if self._matches_audience(user_profile, campaign["target_audience"]):
                for book_id in campaign["book_ids"][:limit]:
                    recommendations.append({
                        "book_id": book_id,
                        "campaign_id": campaign_id,
                        "sponsored": True,
                        "disclosure": campaign["disclosure"]
                    })
        
        return recommendations[:limit]
    
    def _matches_audience(
        self,
        user_profile: Dict[str, Any],
        target_audience: Dict[str, Any]
    ) -> bool:
        """Check if user matches target audience"""
        # Simple matching logic
        return True  # In production, implement sophisticated targeting
    
    def track_impression(self, campaign_id: str):
        """Track sponsored content impression"""
        if campaign_id in self.campaigns:
            self.campaigns[campaign_id]["impressions"] += 1
            self.campaigns[campaign_id]["spent"] += 0.01  # $0.01 per impression


# ============================================================================
# API ACCESS
# ============================================================================

class APIAccessService:
    """Paid API tiers for developers"""
    
    API_TIERS = {
        "free": {
            "price": 0,
            "requests_per_month": 1000,
            "rate_limit": "10 req/min",
            "features": ["Basic endpoints"]
        },
        "developer": {
            "price": 29,
            "requests_per_month": 100000,
            "rate_limit": "100 req/min",
            "features": ["All endpoints", "Webhooks"]
        },
        "business": {
            "price": 99,
            "requests_per_month": 1000000,
            "rate_limit": "1000 req/min",
            "features": ["All endpoints", "Webhooks", "Priority support", "SLA"]
        },
        "enterprise": {
            "price": "Custom",
            "requests_per_month": "Unlimited",
            "rate_limit": "Custom",
            "features": ["All features", "Dedicated support", "Custom SLA", "On-premise option"]
        }
    }
    
    def __init__(self):
        self.api_keys: Dict[str, Dict] = {}
        logger.info("✅ API Access Service initialized")
    
    def generate_api_key(
        self,
        user_id: int,
        tier: str = "free"
    ) -> Dict[str, Any]:
        """Generate API key for user"""
        api_key = f"br_{secrets.token_hex(16)}"
        
        key_data = {
            "api_key": api_key,
            "user_id": user_id,
            "tier": tier,
            "tier_info": self.API_TIERS.get(tier, self.API_TIERS["free"]),
            "created_at": datetime.now().isoformat(),
            "requests_used": 0,
            "status": "active"
        }
        
        self.api_keys[api_key] = key_data
        
        logger.info(f"Generated API key for user {user_id}: {tier} tier")
        return key_data
    
    def validate_api_key(self, api_key: str) -> Dict[str, Any]:
        """Validate API key and return tier info"""
        if api_key not in self.api_keys:
            return {"valid": False, "error": "Invalid API key"}
        
        key_data = self.api_keys[api_key]
        
        if key_data["status"] != "active":
            return {"valid": False, "error": "API key inactive"}
        
        # Check usage limits
        tier_info = key_data["tier_info"]
        monthly_limit = tier_info["requests_per_month"]
        
        if isinstance(monthly_limit, int) and key_data["requests_used"] >= monthly_limit:
            return {"valid": False, "error": "Monthly limit exceeded"}
        
        return {
            "valid": True,
            "tier": key_data["tier"],
            "requests_remaining": monthly_limit - key_data["requests_used"] if isinstance(monthly_limit, int) else "Unlimited"
        }


# ============================================================================
# WHITE-LABEL SOLUTION
# ============================================================================

class WhiteLabelService:
    """B2B offering for libraries and institutions"""
    
    def __init__(self):
        self.clients: Dict[str, Dict] = {}
        logger.info("✅ White-Label Service initialized")
    
    def create_white_label_instance(
        self,
        client_name: str,
        domain: str,
        customization: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create white-label instance
        
        Args:
            client_name: Client organization name
            domain: Custom domain
            customization: Branding and customization options
        
        Returns:
            Instance details
        """
        instance_id = secrets.token_hex(8)
        
        instance = {
            "instance_id": instance_id,
            "client_name": client_name,
            "domain": domain,
            "customization": {
                "logo": customization.get("logo", "default_logo.png"),
                "primary_color": customization.get("primary_color", "#3b82f6"),
                "secondary_color": customization.get("secondary_color", "#1e40af"),
                "custom_css": customization.get("custom_css", ""),
                "features": customization.get("features", [])
            },
            "created_at": datetime.now().isoformat(),
            "status": "active",
            "users": 0,
            "api_endpoint": f"https://api.bookrec.com/{instance_id}"
        }
        
        self.clients[instance_id] = instance
        
        logger.info(f"Created white-label instance for {client_name}")
        return instance
    
    def get_instance_config(self, instance_id: str) -> Dict[str, Any]:
        """Get white-label instance configuration"""
        if instance_id not in self.clients:
            return {"error": "Instance not found"}
        
        return self.clients[instance_id]


# ============================================================================
# MICROSERVICES ARCHITECTURE
# ============================================================================

class MicroserviceRegistry:
    """Service registry for microservices architecture"""
    
    def __init__(self):
        self.services: Dict[str, Dict] = {}
        logger.info("✅ Microservice Registry initialized")
    
    def register_service(
        self,
        service_name: str,
        host: str,
        port: int,
        health_check_url: str
    ):
        """Register a microservice"""
        service_id = f"{service_name}_{secrets.token_hex(4)}"
        
        self.services[service_id] = {
            "service_name": service_name,
            "host": host,
            "port": port,
            "health_check_url": health_check_url,
            "status": "healthy",
            "registered_at": datetime.now().isoformat(),
            "last_heartbeat": datetime.now().isoformat()
        }
        
        logger.info(f"Registered service: {service_name} at {host}:{port}")
        return service_id
    
    def discover_service(self, service_name: str) -> Optional[Dict]:
        """Discover service by name"""
        for service_id, service in self.services.items():
            if service["service_name"] == service_name and service["status"] == "healthy":
                return service
        return None
    
    def heartbeat(self, service_id: str):
        """Update service heartbeat"""
        if service_id in self.services:
            self.services[service_id]["last_heartbeat"] = datetime.now().isoformat()


# Global instances
subscription_service = SubscriptionService()
affiliate_service = AffiliateService()
sponsored_service = SponsoredRecommendationService()
api_access_service = APIAccessService()
white_label_service = WhiteLabelService()
microservice_registry = MicroserviceRegistry()
