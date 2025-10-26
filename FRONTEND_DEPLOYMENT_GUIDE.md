# 🚀 Frontend Deployment Guide

## Quick Start - Local Development

### Prerequisites
- Node.js 18+ (LTS)
- npm or yarn
- Backend running on `http://localhost:8000`

### Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## Development Workflow

### Project Structure
```
frontend/
├── src/
│   ├── app/                    # Pages (home, search, books, etc.)
│   ├── components/             # Reusable components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # API client and utilities
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── package.json                # Dependencies
└── .env.local                  # Local environment vars
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run type-check   # Check TypeScript errors
npm run lint         # Run ESLint

# Production
npm run build        # Create production build
npm run start        # Start production server
npm run build -- --no-cache  # Force rebuild

# Analysis
npm run lint -- --fix   # Auto-fix linting issues
```

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Prettier - Code Formatter
- ESLint
- Thunder Client (for API testing)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Backend API is running and accessible
- [ ] Environment variables are set correctly
- [ ] `npm run build` completes without errors
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] All pages load without errors
- [ ] Search functionality works
- [ ] Dark mode toggle works
- [ ] Responsive design tested on mobile
- [ ] Error boundaries work properly
- [ ] Loading states display correctly

---

## 🔥 Deployment Option 1: Vercel (Recommended)

### Best For
- Automatic deployments
- Zero configuration
- Global CDN
- Preview deployments
- Production monitoring

### Steps

#### 1. Prepare Code
```bash
# Ensure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Connect to Vercel
- Go to https://vercel.com/new
- Select GitHub/GitLab/Bitbucket
- Import repository
- Select root directory: `frontend`

#### 3. Configure Environment
```
Environment Variables:
- NEXT_PUBLIC_API_URL = https://api.yourdomain.com
- NEXT_PUBLIC_APP_NAME = BookHub
- NEXT_PUBLIC_APP_VERSION = 2.0.0
```

#### 4. Deploy
- Click "Deploy"
- Vercel builds and deploys automatically
- Get live URL immediately

#### 5. Set Custom Domain (Optional)
- Go to "Settings" → "Domains"
- Add your custom domain
- Configure DNS settings

### Post-Deployment
- Monitor with Vercel Analytics
- Check Deployment page for logs
- Preview deployments on pull requests
- Rollback if needed

### Pricing
- Free tier: Great for development
- Pro: $20/month for production
- Enterprise: Custom pricing

---

## 🐳 Deployment Option 2: Docker + AWS/GCP/Azure

### Build Docker Image

```bash
# From project root
docker build -f frontend/Dockerfile -t bookhub-frontend:latest .

# Tag for registry
docker tag bookhub-frontend:latest your-registry/bookhub-frontend:latest

# Push to registry
docker push your-registry/bookhub-frontend:latest
```

### Docker Compose (Local)

```bash
# Build and run
docker-compose up frontend

# Access at http://localhost:3000
```

### AWS Deployment

#### Option A: AWS App Runner (Easiest)

```bash
# 1. Create ECR repository
aws ecr create-repository --repository-name bookhub-frontend

# 2. Push image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag bookhub-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/bookhub-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/bookhub-frontend:latest

# 3. Create App Runner service
aws apprunner create-service \
  --service-name bookhub-frontend \
  --source-configuration RepositoryType=ECR,ImageRepository=<account-id>.dkr.ecr.us-east-1.amazonaws.com/bookhub-frontend:latest
```

#### Option B: ECS + ALB

```bash
# Use CloudFormation or AWS Console
# Or use: aws-cli with task definitions
```

---

## 🟦 Deployment Option 3: Netlify

### Easy Setup

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build locally
npm run build

# 3. Deploy
netlify deploy --prod

# Or connect GitHub for automatic deployments
```

### Configuration (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[dev]
  command = "npm run dev"
  targetPort = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env]
  NEXT_PUBLIC_API_URL = "https://api.yourdomain.com"
```

---

## 🖥️ Deployment Option 4: Self-Hosted (VPS)

### Prerequisites
- Ubuntu 20.04+ VPS
- SSH access
- Domain name (optional)
- SSL certificate (optional but recommended)

### Setup Steps

#### 1. Connect to Server
```bash
ssh root@your-server-ip
```

#### 2. Install Node.js
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3. Clone Repository
```bash
cd /opt
git clone https://github.com/yourusername/Book-Recommendation-System.git
cd Book-Recommendation-System/frontend
```

#### 4. Install Dependencies
```bash
npm install --production
npm run build
```

#### 5. Setup PM2 (Process Manager)
```bash
# Install globally
npm install -g pm2

# Start application
pm2 start npm --name "bookhub-frontend" -- start

# Setup auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit
```

#### 6. Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Create config
cat > /etc/nginx/sites-available/bookhub <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/bookhub /etc/nginx/sites-enabled/

# Test and reload
nginx -t
systemctl reload nginx
```

#### 7. Setup SSL with Let's Encrypt
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d your-domain.com

# Auto-renew
certbot renew --dry-run
```

#### 8. Environment Variables
```bash
# Create .env.local in frontend directory
cat > /opt/Book-Recommendation-System/frontend/.env.local <<EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=BookHub
NEXT_PUBLIC_APP_VERSION=2.0.0
EOF
```

#### 9. Update & Redeploy
```bash
# Pull latest code
cd /opt/Book-Recommendation-System/frontend
git pull origin main

# Rebuild
npm run build

# Restart PM2
pm2 restart bookhub-frontend
```

### Monitoring

```bash
# View logs
pm2 logs bookhub-frontend

# System status
pm2 status

# Restart on errors
pm2 restart bookhub-frontend

# View metrics
pm2 monit
```

---

## 📊 Performance Optimization Tips

### 1. Image Optimization
- Use Next.js Image component
- Enable dynamic imports for components
- Compress images before upload

### 2. Caching
- Set cache headers in Nginx/CDN
- Use service workers for offline support
- Cache API responses appropriately

### 3. Code Splitting
- Already implemented with Next.js
- Monitor bundle size: `npm run build`
- Target: < 200KB main bundle

### 4. CDN Integration
```nginx
# Add CDN headers in Nginx
add_header Cache-Control "public, max-age=31536000, immutable" for static assets
```

### 5. Database/API Optimization
- Index frequently queried fields
- Use pagination (already implemented)
- Cache API responses

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# ✅ DO
NEXT_PUBLIC_API_URL=https://secure-api.com

# ❌ DON'T
API_KEY=secret123  # Never in public variables
DATABASE_URL=...   # Use server-side env only
```

### Headers
```tsx
// Set security headers in next.config.js
headers: [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  }
]
```

### HTTPS
- Always use HTTPS in production
- Get SSL certificate (Let's Encrypt free)
- Redirect HTTP to HTTPS

### CSP Headers
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'";
```

---

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### API Connection Issues
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Test API call
curl http://localhost:8000/api/books/search -X POST -H "Content-Type: application/json" -d '{"query":"test"}'
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

## 📈 Monitoring & Logging

### Vercel
- Built-in analytics
- Error tracking
- Performance metrics

### Self-Hosted
```bash
# Using PM2 Plus (optional)
pm2 install pm2-auto-pull
pm2 install pm2-logrotate

# Centralized logging
npm install winston

# Application monitoring
npm install datadog-browser-rum
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run tests
        run: cd frontend && npm run lint && npm run type-check
      
      - name: Build
        run: cd frontend && npm run build
      
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support

- **Documentation**: See FRONTEND_README.md
- **Backend Setup**: See README.md
- **Issues**: GitHub Issues
- **Email**: dpharshavardhan.1636@gmail.com

---

**Happy Deploying! 🚀**
