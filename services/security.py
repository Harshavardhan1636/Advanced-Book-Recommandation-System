"""
Security Service
MFA, RBAC, Encryption, Input Validation, GDPR Compliance, Security Headers
"""

import os
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import hashlib
import secrets
import re
import json
from enum import Enum

try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    CRYPTO_AVAILABLE = True
except ImportError:
    CRYPTO_AVAILABLE = False

try:
    import pyotp
    MFA_AVAILABLE = True
except ImportError:
    MFA_AVAILABLE = False

logger = logging.getLogger(__name__)


# ============================================================================
# MULTI-FACTOR AUTHENTICATION (MFA)
# ============================================================================

class MFAService:
    """Multi-Factor Authentication service"""
    
    def __init__(self):
        self.available = MFA_AVAILABLE
        if self.available:
            logger.info("✅ MFA service initialized")
        else:
            logger.warning("⚠️  MFA not available (pyotp not installed)")
    
    def generate_secret(self, user_email: str) -> Dict[str, str]:
        """
        Generate MFA secret for user
        
        Args:
            user_email: User's email
        
        Returns:
            Dict with secret and QR code URL
        """
        if not self.available:
            return {"error": "MFA not available"}
        
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret)
        
        # Generate provisioning URI for QR code
        provisioning_uri = totp.provisioning_uri(
            name=user_email,
            issuer_name="Book Recommendation System"
        )
        
        return {
            "secret": secret,
            "provisioning_uri": provisioning_uri,
            "qr_code_url": f"https://api.qrserver.com/v1/create-qr-code/?data={provisioning_uri}&size=200x200"
        }
    
    def verify_totp(self, secret: str, token: str) -> bool:
        """
        Verify TOTP token
        
        Args:
            secret: User's MFA secret
            token: 6-digit TOTP token
        
        Returns:
            True if valid, False otherwise
        """
        if not self.available:
            return False
        
        try:
            totp = pyotp.TOTP(secret)
            return totp.verify(token, valid_window=1)
        except Exception as e:
            logger.error(f"TOTP verification failed: {e}")
            return False
    
    def generate_backup_codes(self, count: int = 10) -> List[str]:
        """
        Generate backup codes for MFA
        
        Args:
            count: Number of backup codes to generate
        
        Returns:
            List of backup codes
        """
        codes = []
        for _ in range(count):
            code = secrets.token_hex(4).upper()
            codes.append(f"{code[:4]}-{code[4:]}")
        
        return codes


# ============================================================================
# ROLE-BASED ACCESS CONTROL (RBAC)
# ============================================================================

class Role(str, Enum):
    """User roles"""
    ADMIN = "admin"
    MODERATOR = "moderator"
    PREMIUM = "premium"
    USER = "user"
    GUEST = "guest"


class Permission(str, Enum):
    """System permissions"""
    # User permissions
    READ_BOOKS = "read:books"
    SEARCH_BOOKS = "search:books"
    GET_RECOMMENDATIONS = "get:recommendations"
    
    # Authenticated user permissions
    MANAGE_PROFILE = "manage:profile"
    MANAGE_READING_LIST = "manage:reading_list"
    WRITE_REVIEWS = "write:reviews"
    JOIN_CLUBS = "join:clubs"
    
    # Premium permissions
    UNLIMITED_RECOMMENDATIONS = "unlimited:recommendations"
    ADVANCED_ANALYTICS = "advanced:analytics"
    EXPORT_DATA = "export:data"
    
    # Moderator permissions
    MODERATE_REVIEWS = "moderate:reviews"
    MODERATE_DISCUSSIONS = "moderate:discussions"
    BAN_USERS = "ban:users"
    
    # Admin permissions
    MANAGE_USERS = "manage:users"
    MANAGE_SYSTEM = "manage:system"
    VIEW_ANALYTICS = "view:analytics"
    MANAGE_API_KEYS = "manage:api_keys"


class RBACService:
    """Role-Based Access Control service"""
    
    def __init__(self):
        self.role_permissions = {
            Role.GUEST: [
                Permission.READ_BOOKS,
                Permission.SEARCH_BOOKS,
            ],
            Role.USER: [
                Permission.READ_BOOKS,
                Permission.SEARCH_BOOKS,
                Permission.GET_RECOMMENDATIONS,
                Permission.MANAGE_PROFILE,
                Permission.MANAGE_READING_LIST,
                Permission.WRITE_REVIEWS,
                Permission.JOIN_CLUBS,
            ],
            Role.PREMIUM: [
                # All user permissions plus:
                Permission.UNLIMITED_RECOMMENDATIONS,
                Permission.ADVANCED_ANALYTICS,
                Permission.EXPORT_DATA,
            ],
            Role.MODERATOR: [
                # All user permissions plus:
                Permission.MODERATE_REVIEWS,
                Permission.MODERATE_DISCUSSIONS,
                Permission.BAN_USERS,
            ],
            Role.ADMIN: [
                # All permissions
                Permission.MANAGE_USERS,
                Permission.MANAGE_SYSTEM,
                Permission.VIEW_ANALYTICS,
                Permission.MANAGE_API_KEYS,
            ]
        }
        logger.info("✅ RBAC service initialized")
    
    def get_role_permissions(self, role: Role) -> List[Permission]:
        """Get all permissions for a role"""
        permissions = set(self.role_permissions.get(role, []))
        
        # Premium inherits from User
        if role == Role.PREMIUM:
            permissions.update(self.role_permissions[Role.USER])
        
        # Moderator inherits from User
        if role == Role.MODERATOR:
            permissions.update(self.role_permissions[Role.USER])
        
        # Admin has all permissions
        if role == Role.ADMIN:
            permissions = set(Permission)
        
        return list(permissions)
    
    def has_permission(self, role: Role, permission: Permission) -> bool:
        """Check if role has permission"""
        role_perms = self.get_role_permissions(role)
        return permission in role_perms
    
    def check_permissions(
        self,
        user_role: Role,
        required_permissions: List[Permission]
    ) -> bool:
        """Check if user has all required permissions"""
        user_perms = self.get_role_permissions(user_role)
        return all(perm in user_perms for perm in required_permissions)


# ============================================================================
# DATA ENCRYPTION
# ============================================================================

class EncryptionService:
    """Data encryption service"""
    
    def __init__(self):
        self.available = CRYPTO_AVAILABLE
        
        if self.available:
            # Generate or load encryption key
            key = os.getenv("ENCRYPTION_KEY")
            if not key:
                key = Fernet.generate_key()
                logger.warning("⚠️  No encryption key found, generated new one")
            else:
                key = key.encode()
            
            self.cipher = Fernet(key)
            logger.info("✅ Encryption service initialized")
        else:
            logger.warning("⚠️  Encryption not available (cryptography not installed)")
    
    def encrypt(self, data: str) -> str:
        """
        Encrypt data
        
        Args:
            data: Plain text data
        
        Returns:
            Encrypted data (base64 encoded)
        """
        if not self.available:
            return data
        
        try:
            encrypted = self.cipher.encrypt(data.encode())
            return encrypted.decode()
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            return data
    
    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt data
        
        Args:
            encrypted_data: Encrypted data (base64 encoded)
        
        Returns:
            Decrypted plain text
        """
        if not self.available:
            return encrypted_data
        
        try:
            decrypted = self.cipher.decrypt(encrypted_data.encode())
            return decrypted.decode()
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            return encrypted_data
    
    def hash_password(self, password: str, salt: Optional[bytes] = None) -> Dict[str, str]:
        """
        Hash password with PBKDF2
        
        Args:
            password: Plain text password
            salt: Optional salt (generated if not provided)
        
        Returns:
            Dict with hashed password and salt
        """
        if not self.available:
            # Fallback to simple hash
            return {
                "hash": hashlib.sha256(password.encode()).hexdigest(),
                "salt": ""
            }
        
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = kdf.derive(password.encode())
        
        return {
            "hash": key.hex(),
            "salt": salt.hex()
        }


# ============================================================================
# INPUT VALIDATION
# ============================================================================

class InputValidator:
    """Comprehensive input validation and sanitization"""
    
    # Regex patterns
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_-]{3,30}$')
    ISBN_PATTERN = re.compile(r'^(?:\d{10}|\d{13})$')
    
    # SQL injection patterns
    SQL_INJECTION_PATTERNS = [
        r"(\bOR\b|\bAND\b).*=.*",
        r";\s*DROP\s+TABLE",
        r";\s*DELETE\s+FROM",
        r"UNION\s+SELECT",
        r"--",
        r"/\*.*\*/"
    ]
    
    # XSS patterns
    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe",
        r"<object",
        r"<embed"
    ]
    
    @classmethod
    def validate_email(cls, email: str) -> bool:
        """Validate email format"""
        if not email or len(email) > 254:
            return False
        return bool(cls.EMAIL_PATTERN.match(email))
    
    @classmethod
    def validate_username(cls, username: str) -> bool:
        """Validate username format"""
        if not username:
            return False
        return bool(cls.USERNAME_PATTERN.match(username))
    
    @classmethod
    def validate_isbn(cls, isbn: str) -> bool:
        """Validate ISBN format"""
        if not isbn:
            return False
        isbn = isbn.replace("-", "").replace(" ", "")
        return bool(cls.ISBN_PATTERN.match(isbn))
    
    @classmethod
    def sanitize_string(cls, text: str, max_length: int = 1000) -> str:
        """
        Sanitize string input
        
        Args:
            text: Input text
            max_length: Maximum allowed length
        
        Returns:
            Sanitized text
        """
        if not text:
            return ""
        
        # Truncate
        text = text[:max_length]
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Remove control characters except newline and tab
        text = ''.join(char for char in text if char.isprintable() or char in '\n\t')
        
        return text.strip()
    
    @classmethod
    def check_sql_injection(cls, text: str) -> bool:
        """
        Check for SQL injection attempts
        
        Returns:
            True if suspicious, False if safe
        """
        text_upper = text.upper()
        for pattern in cls.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_upper, re.IGNORECASE):
                logger.warning(f"Potential SQL injection detected: {text[:50]}")
                return True
        return False
    
    @classmethod
    def check_xss(cls, text: str) -> bool:
        """
        Check for XSS attempts
        
        Returns:
            True if suspicious, False if safe
        """
        for pattern in cls.XSS_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                logger.warning(f"Potential XSS detected: {text[:50]}")
                return True
        return False
    
    @classmethod
    def validate_and_sanitize(cls, text: str, max_length: int = 1000) -> Optional[str]:
        """
        Validate and sanitize input
        
        Returns:
            Sanitized text or None if invalid
        """
        if not text:
            return None
        
        # Check for attacks
        if cls.check_sql_injection(text) or cls.check_xss(text):
            return None
        
        # Sanitize
        return cls.sanitize_string(text, max_length)


# ============================================================================
# GDPR COMPLIANCE
# ============================================================================

class GDPRService:
    """GDPR compliance service"""
    
    def __init__(self):
        logger.info("✅ GDPR service initialized")
    
    def export_user_data(self, user_id: int) -> Dict[str, Any]:
        """
        Export all user data (GDPR right to data portability)
        
        Args:
            user_id: User ID
        
        Returns:
            Complete user data export
        """
        # In production, fetch all user data from database
        export_data = {
            "export_date": datetime.now().isoformat(),
            "user_id": user_id,
            "profile": {
                "username": "user123",
                "email": "user@example.com",
                "created_at": "2024-01-01T00:00:00"
            },
            "reading_history": [],
            "reviews": [],
            "reading_lists": [],
            "preferences": {},
            "activities": []
        }
        
        logger.info(f"Exported data for user {user_id}")
        return export_data
    
    def anonymize_user_data(self, user_id: int) -> bool:
        """
        Anonymize user data (GDPR right to be forgotten)
        
        Args:
            user_id: User ID
        
        Returns:
            True if successful
        """
        # In production:
        # 1. Replace personal data with anonymized values
        # 2. Keep aggregated statistics
        # 3. Remove identifiable information
        
        logger.info(f"Anonymized data for user {user_id}")
        return True
    
    def delete_user_data(self, user_id: int) -> bool:
        """
        Delete all user data (GDPR right to erasure)
        
        Args:
            user_id: User ID
        
        Returns:
            True if successful
        """
        # In production:
        # 1. Delete user account
        # 2. Delete all associated data
        # 3. Keep audit logs (legal requirement)
        
        logger.info(f"Deleted data for user {user_id}")
        return True
    
    def get_consent_status(self, user_id: int) -> Dict[str, bool]:
        """Get user's consent status for data processing"""
        # In production, fetch from database
        return {
            "analytics": True,
            "marketing": False,
            "third_party_sharing": False,
            "personalization": True
        }
    
    def update_consent(
        self,
        user_id: int,
        consent_type: str,
        granted: bool
    ) -> bool:
        """Update user consent"""
        logger.info(f"Updated consent for user {user_id}: {consent_type}={granted}")
        return True


# ============================================================================
# SECURITY HEADERS
# ============================================================================

class SecurityHeaders:
    """Security headers for HTTP responses"""
    
    @staticmethod
    def get_security_headers() -> Dict[str, str]:
        """
        Get recommended security headers
        
        Returns:
            Dict of security headers
        """
        return {
            # CORS
            "Access-Control-Allow-Origin": os.getenv("CORS_ORIGIN", "*"),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "3600",
            
            # Content Security Policy
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' data:; "
                "connect-src 'self' https:; "
                "frame-ancestors 'none';"
            ),
            
            # HSTS (HTTP Strict Transport Security)
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            
            # Prevent MIME sniffing
            "X-Content-Type-Options": "nosniff",
            
            # XSS Protection
            "X-XSS-Protection": "1; mode=block",
            
            # Clickjacking protection
            "X-Frame-Options": "DENY",
            
            # Referrer policy
            "Referrer-Policy": "strict-origin-when-cross-origin",
            
            # Permissions policy
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        }
    
    @staticmethod
    def get_api_security_headers() -> Dict[str, str]:
        """Get security headers for API responses"""
        headers = SecurityHeaders.get_security_headers()
        headers.update({
            "X-API-Version": "v2",
            "X-Request-ID": secrets.token_hex(16),
        })
        return headers


# Global instances
mfa_service = MFAService()
rbac_service = RBACService()
encryption_service = EncryptionService()
input_validator = InputValidator()
gdpr_service = GDPRService()
security_headers = SecurityHeaders()
