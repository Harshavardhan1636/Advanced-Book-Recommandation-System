# 🆓 FREE API Keys Guide for Students

## Get All 6 API Keys for FREE!

**All these services offer FREE tiers - perfect for students!**

---

## 1. 🎬 TMDB (The Movie Database) - Movie Matcher

### **100% FREE Forever!**

#### **How to Get:**
1. Go to: https://www.themoviedb.org/signup
2. Create a FREE account (just email + password)
3. Verify your email
4. Go to: https://www.themoviedb.org/settings/api
5. Click "Request an API Key"
6. Choose "Developer" (it's free!)
7. Fill the form:
   - **Application Name**: "Book Recommendation System"
   - **Application URL**: http://localhost:8000
   - **Application Summary**: "Personal book recommendation project"
8. Accept terms
9. **Get your API key instantly!**

#### **Limits:**
- ✅ **FREE Forever**
- ✅ 40 requests per 10 seconds
- ✅ Unlimited daily requests
- ✅ Perfect for students!

#### **Add to .env:**
```env
TMDB_API_KEY=your_tmdb_api_key_here
```

---

## 2. 📧 Email Service - Gmail SMTP (FREE)

### **100% FREE with Gmail!**

#### **How to Get:**
1. Use your existing Gmail account
2. Enable 2-Factor Authentication:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
3. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Book Recommendation System"
   - Click "Generate"
   - **Copy the 16-character password**

#### **Limits:**
- ✅ **FREE Forever**
- ✅ 500 emails per day
- ✅ Perfect for notifications!

#### **Add to .env:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
SMTP_FROM=your.email@gmail.com
```

---

## 3. 📚 Goodreads API - Book Integration

### **Status: Goodreads API is CLOSED** ❌

**BUT** - We have FREE alternatives!

### **Alternative 1: Google Books API (FREE)**
#### **How to Get:**
1. Go to: https://console.cloud.google.com/
2. Create a FREE account (Google account)
3. Create a new project: "Book Recommendation"
4. Enable "Google Books API"
5. Go to "Credentials"
6. Click "Create Credentials" → "API Key"
7. **Copy your API key**

#### **Limits:**
- ✅ **FREE Forever**
- ✅ 1,000 requests per day
- ✅ No credit card required

#### **Add to .env:**
```env
GOOGLE_BOOKS_API_KEY=your_google_books_key
```

### **Alternative 2: Open Library API (NO KEY NEEDED!)**
- ✅ **Completely FREE**
- ✅ **No API key required**
- ✅ Already integrated in the system!

---

## 4. 🎨 AI Cover Generator - FREE Alternatives

### **Option 1: Stability AI (FREE Tier)**
#### **How to Get:**
1. Go to: https://platform.stability.ai/
2. Sign up for FREE account
3. Go to API Keys section
4. **Get $25 FREE credits** (no credit card!)
5. Copy your API key

#### **Limits:**
- ✅ $25 FREE credits (generates ~250 images)
- ✅ Perfect for testing!

#### **Add to .env:**
```env
STABILITY_API_KEY=your_stability_key
```

### **Option 2: Hugging Face (100% FREE)**
#### **How to Get:**
1. Go to: https://huggingface.co/join
2. Create FREE account
3. Go to: https://huggingface.co/settings/tokens
4. Create "New token" (Read access)
5. Copy your token

#### **Limits:**
- ✅ **100% FREE Forever**
- ✅ Unlimited generations (with rate limits)
- ✅ No credit card needed

#### **Add to .env:**
```env
HUGGINGFACE_API_KEY=your_huggingface_token
```

---

## 5. 📖 Library Integration - OverDrive

### **Status: Requires Library Partnership** ❌

**BUT** - We have FREE alternatives!

### **Alternative: Open Library API (NO KEY NEEDED!)**
- ✅ **Completely FREE**
- ✅ **No API key required**
- ✅ **Already integrated!**
- ✅ Access to millions of books

### **Alternative 2: LibraryThing API (FREE)**
#### **How to Get:**
1. Go to: https://www.librarything.com/
2. Create FREE account
3. Go to: https://www.librarything.com/services/keys.php
4. Request a developer key (instant approval)
5. Copy your API key

#### **Limits:**
- ✅ **FREE Forever**
- ✅ 1,000 requests per day
- ✅ Perfect for students!

#### **Add to .env:**
```env
LIBRARYTHING_API_KEY=your_librarything_key
```

---

## 6. 🔐 Encryption Key (Auto-Generated)

### **Already Working!** ✅

The system **automatically generates** an encryption key if you don't provide one.

#### **Optional: Set Your Own Key**
```bash
# Generate a secure key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

#### **Add to .env:**
```env
ENCRYPTION_KEY=your_generated_key_here
```

**Note**: If you don't set this, the system auto-generates one (which is fine for development!)

---

## 📝 **Complete .env File Template**

Create a file named `.env` in your project root:

```env
# =============================================================================
# FREE API KEYS - All services below are FREE for students!
# =============================================================================

# 1. TMDB - Movie Matcher (FREE Forever)
TMDB_API_KEY=your_tmdb_key_here

# 2. Email Service - Gmail SMTP (FREE)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
SMTP_FROM=your.email@gmail.com

# 3. Google Books API (FREE - Alternative to Goodreads)
GOOGLE_BOOKS_API_KEY=your_google_books_key

# 4. AI Cover Generator - Choose ONE:
# Option A: Stability AI (FREE $25 credits)
STABILITY_API_KEY=your_stability_key

# Option B: Hugging Face (100% FREE Forever)
HUGGINGFACE_API_KEY=your_huggingface_token

# 5. Library Integration - LibraryThing (FREE Alternative)
LIBRARYTHING_API_KEY=your_librarything_key

# 6. Encryption Key (Optional - auto-generated if not set)
# ENCRYPTION_KEY=your_encryption_key

# =============================================================================
# BONUS: Gemini AI (Already FREE!)
# =============================================================================
# You already have this - Google Gemini is FREE!
GEMINI_API_KEY=your_gemini_key

# =============================================================================
# Database & Cache (Optional - using defaults)
# =============================================================================
# DATABASE_URL=sqlite:///./bookrec.db
# REDIS_URL=redis://localhost:6379/0
```

---

## 🚀 **Quick Setup Steps**

### **Step 1: Get API Keys (15 minutes)**
1. ✅ TMDB: https://www.themoviedb.org/settings/api (2 min)
2. ✅ Gmail SMTP: https://myaccount.google.com/apppasswords (3 min)
3. ✅ Google Books: https://console.cloud.google.com/ (5 min)
4. ✅ Hugging Face: https://huggingface.co/settings/tokens (2 min)
5. ✅ LibraryThing: https://www.librarything.com/services/keys.php (3 min)

### **Step 2: Create .env File**
```bash
# Copy the example
copy .env.example .env

# Or create new file
notepad .env
```

### **Step 3: Add Your Keys**
Paste the keys you got from Step 1 into the `.env` file.

### **Step 4: Restart Server**
```bash
# Stop current server (CTRL+C)
# Start again
python start.py
```

### **Step 5: Verify**
```bash
python final_check.py
```

---

## 💰 **Cost Breakdown**

| Service | Cost | Limit | Perfect For |
|---------|------|-------|-------------|
| TMDB | **FREE** | 40 req/10s | ✅ Students |
| Gmail SMTP | **FREE** | 500/day | ✅ Students |
| Google Books | **FREE** | 1,000/day | ✅ Students |
| Hugging Face | **FREE** | Unlimited* | ✅ Students |
| LibraryThing | **FREE** | 1,000/day | ✅ Students |
| Encryption | **FREE** | Unlimited | ✅ Everyone |

**Total Monthly Cost: $0.00** 🎉

---

## 🎓 **Student Tips**

### **Best FREE Options:**
1. **TMDB** - Get this first! (Easiest)
2. **Gmail SMTP** - Use your existing Gmail
3. **Hugging Face** - Best free AI image generation
4. **Google Books** - Better than Goodreads anyway
5. **LibraryThing** - Great book data

### **Skip These (Not Needed):**
- ❌ Stability AI - Use Hugging Face instead (100% free)
- ❌ OverDrive - Use Open Library (already integrated)
- ❌ Goodreads - API is closed, use Google Books

### **Priority Order:**
1. **High Priority**: TMDB (movie matching)
2. **Medium Priority**: Gmail SMTP (notifications)
3. **Low Priority**: Others (nice to have)

---

## 🔧 **Troubleshooting**

### **"API key not working"**
- Check if you copied the full key (no spaces)
- Make sure .env file is in the project root
- Restart the server after adding keys

### **"Gmail SMTP not working"**
- Enable 2-Factor Authentication first
- Use App Password, not your regular password
- Check if "Less secure app access" is enabled

### **"Rate limit exceeded"**
- All free tiers have rate limits
- Wait a few minutes and try again
- Consider caching responses

---

## 📚 **Additional FREE Resources**

### **More FREE APIs:**
1. **OpenLibrary** - Already integrated! (No key needed)
2. **Google Gemini** - You already have this! (FREE)
3. **Project Gutenberg** - Free books (No key needed)
4. **Archive.org** - Free books (No key needed)

### **Learning Resources:**
- TMDB Docs: https://developers.themoviedb.org/3
- Google Books Docs: https://developers.google.com/books
- Hugging Face Docs: https://huggingface.co/docs

---

## ✅ **Checklist**

- [ ] Get TMDB API key
- [ ] Set up Gmail SMTP
- [ ] Get Google Books API key
- [ ] Get Hugging Face token
- [ ] Get LibraryThing API key
- [ ] Create .env file
- [ ] Add all keys to .env
- [ ] Restart server
- [ ] Test with final_check.py
- [ ] Enjoy your FREE services! 🎉

---

## 🎉 **You're All Set!**

With these FREE API keys, you'll have:
- ✅ Movie recommendations
- ✅ Email notifications
- ✅ Book data from Google Books
- ✅ AI-generated book covers
- ✅ Library integration
- ✅ Full encryption

**All for $0.00!** Perfect for students! 🎓

---

**Need help? All these services have great documentation and FREE support!**

*Last updated: October 25, 2025*
