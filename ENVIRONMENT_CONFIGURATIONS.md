# Environment Configurations Documentation

This document contains all environment configurations for development and production environments.

## Frontend Configurations

### Development Environment (.env.development)
```env
# Development Environment Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_WS_URL=ws://localhost:3005
NODE_ENV=development
NEXT_PUBLIC_ENV=development
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MOCK_API=false
NEXT_PUBLIC_SHOW_DEV_TOOLS=true
NEXT_PUBLIC_ENABLE_PWA=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=false
NEXT_PUBLIC_APP_NAME=Multi-Vendor E-Commerce (Dev)
NEXT_PUBLIC_APP_DESCRIPTION=A comprehensive multi-vendor e-commerce platform - Development
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com
NEXT_PUBLIC_DEFAULT_THEME=light
NEXT_PUBLIC_PRIMARY_COLOR=#1976d2
NEXT_PUBLIC_SECONDARY_COLOR=#dc004e
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
NEXT_PUBLIC_DEFAULT_COUNTRY=US
NEXT_PUBLIC_ITEMS_PER_PAGE=20
NEXT_PUBLIC_MAX_ITEMS_PER_PAGE=100
NEXT_PUBLIC_IMAGE_QUALITY=80
NEXT_PUBLIC_IMAGE_FORMATS=webp,jpg,png
NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_CACHE_TTL=3600
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

### Production Environment (.env.production)
```env
# Production Environment Configuration
NEXT_PUBLIC_API_URL=https://node-api.skyablyitsolution.com/wise-lifescience/api/v1
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_WS_URL=wss://31.97.207.193
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_nextauth_secret_here
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_MOCK_API=false
NEXT_PUBLIC_SHOW_DEV_TOOLS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_MULTI_LANGUAGE=true
NEXT_PUBLIC_ENABLE_MULTI_CURRENCY=true
NEXT_PUBLIC_ENABLE_WISHLIST=true
NEXT_PUBLIC_ENABLE_COMPARE=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_SOCIAL_SHARE=true
NEXT_PUBLIC_ENABLE_GUEST_CHECKOUT=true
NEXT_PUBLIC_ENABLE_QUICK_VIEW=true
NEXT_PUBLIC_ENABLE_INFINITE_SCROLL=true
NEXT_PUBLIC_ENABLE_LAZY_LOADING=true
NEXT_PUBLIC_APP_NAME=Multi-Vendor E-Commerce
NEXT_PUBLIC_APP_DESCRIPTION=A comprehensive multi-vendor e-commerce platform
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com
NEXT_PUBLIC_DEFAULT_THEME=light
NEXT_PUBLIC_PRIMARY_COLOR=#1976d2
NEXT_PUBLIC_SECONDARY_COLOR=#dc004e
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
```

## Backend Configurations

### Development Environment Template
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=multi_vendor_ecommerce
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=api
API_VERSION=v1

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
CORS_CREDENTIALS=true

# File Upload Configuration
UPLOAD_LOCATION=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@yourcompany.com

# SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Gateway Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

### Production Environment (Server)
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=developer1
DATABASE_PASSWORD=Skyably@411
DATABASE_NAME=wise_lifescience
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# JWT Configuration
JWT_SECRET=production_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=production_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=3001
NODE_ENV=production
API_PREFIX=api
API_VERSION=v1

# CORS Configuration
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true
```

## Server Information

### Production Server Details
- **Server IP**: 31.97.207.193
- **Backend Port**: 3001
- **Frontend Port**: 3002
- **Database**: PostgreSQL
- **Database User**: developer1
- **Database Name**: wise_lifescience
- **PM2 Process**: wise-lifescience-api
- **NGINX Proxy**: node-api.skyablyitsolution.com/wise-lifescience/api/v1

### Development Server Details
- **Backend Port**: 3000
- **Frontend Port**: 3001
- **Database**: PostgreSQL (localhost)
- **WebSocket Port**: 3005

## Important Notes

1. **Security**: Never commit actual production secrets to version control
2. **Environment Variables**: Always use environment-specific files
3. **Database**: Production uses PostgreSQL with specific credentials
4. **CORS**: Configure properly for production domains
5. **SSL**: Production should use HTTPS/WSS protocols
6. **File Uploads**: Configure appropriate file size limits
7. **Logging**: Disable verbose logging in production

## Deployment Checklist

- [ ] Update production environment variables
- [ ] Configure database credentials
- [ ] Set up SSL certificates
- [ ] Configure NGINX reverse proxy
- [ ] Set up PM2 process management
- [ ] Configure file upload directories
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints
- [ ] Verify CORS configuration
- [ ] Check security headers