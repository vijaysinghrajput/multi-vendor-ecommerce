# Environment Setup Guide

This guide will help you set up the environment variables for the multi-vendor e-commerce platform.

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

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

# Email Configuration (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@yourcompany.com

# SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Gateway Configuration (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log
```

## Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here

# Payment Gateway (Client-side keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_facebook_pixel_id

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif

# App Configuration
NEXT_PUBLIC_APP_NAME=Multi-Vendor E-Commerce
NEXT_PUBLIC_APP_DESCRIPTION=A comprehensive multi-vendor e-commerce platform
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=false
```

## Mobile App Environment Variables

Create a `.env` file in the `mobile-app` directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_WS_URL=ws://localhost:3000

# App Configuration
EXPO_PUBLIC_APP_NAME=Multi-Vendor E-Commerce
EXPO_PUBLIC_APP_SLUG=multi-vendor-ecommerce
EXPO_PUBLIC_APP_VERSION=1.0.0

# Environment
EXPO_PUBLIC_ENV=development

# Payment Gateway
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Push Notifications
EXPO_PUBLIC_PUSH_NOTIFICATION_KEY=your_expo_push_key

# Analytics
EXPO_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
```

## Database Setup

### PostgreSQL Installation

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Database Creation

1. Connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```

2. Create database and user:
   ```sql
   CREATE DATABASE multi_vendor_ecommerce;
   CREATE USER your_db_username WITH PASSWORD 'your_db_password';
   GRANT ALL PRIVILEGES ON DATABASE multi_vendor_ecommerce TO your_db_username;
   \q
   ```

3. Update the database credentials in your `.env` file

4. Run migrations:
   ```bash
   cd backend
   npm run migration:run
   ```

5. (Optional) Seed initial data:
   ```bash
   npm run seed
   ```

## Development vs Production

### Development Environment
- Use `NODE_ENV=development`
- Enable detailed logging
- Use local database
- Disable rate limiting or use lenient limits
- Use HTTP for local development

### Production Environment
- Use `NODE_ENV=production`
- Use production database with connection pooling
- Enable rate limiting
- Use HTTPS
- Use environment variables from your hosting provider
- Enable monitoring and error tracking

## Security Best Practices

### JWT Secrets
- Use strong, random secrets (minimum 32 characters)
- Use different secrets for access and refresh tokens
- Rotate secrets periodically in production

### Database Security
- Use strong passwords
- Limit database user permissions
- Use SSL connections in production
- Regular backups

### API Security
- Enable CORS with specific origins
- Use rate limiting
- Validate all inputs
- Use HTTPS in production

### File Upload Security
- Limit file sizes
- Validate file types
- Scan for malware
- Use cloud storage in production

## Environment-Specific Configurations

### Local Development
```env
NODE_ENV=development
DB_HOST=localhost
CORS_ORIGIN=http://localhost:3001
LOG_LEVEL=debug
```

### Staging
```env
NODE_ENV=staging
DB_HOST=staging-db.yourcompany.com
CORS_ORIGIN=https://staging.yourcompany.com
LOG_LEVEL=info
```

### Production
```env
NODE_ENV=production
DB_HOST=prod-db.yourcompany.com
CORS_ORIGIN=https://yourcompany.com
LOG_LEVEL=error
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify database credentials
   - Ensure database exists

2. **CORS Errors**
   - Check CORS_ORIGIN configuration
   - Ensure frontend URL is included

3. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration

4. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure allowed file types are correct

### Getting Help

- Check the logs for detailed error messages
- Verify all required environment variables are set
- Ensure services (database, Redis) are running
- Check network connectivity

## Additional Services Setup

### Redis (Optional - for caching and sessions)
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
```

### Email Service Setup
1. Gmail: Enable 2FA and create an App Password
2. SendGrid: Create account and get API key
3. AWS SES: Configure in AWS console

### Payment Gateway Setup
1. **Razorpay**: Create account at razorpay.com
2. **Stripe**: Create account at stripe.com
3. Get API keys from respective dashboards

### Cloud Storage Setup
1. **AWS S3**: Create bucket and IAM user
2. **Google Cloud Storage**: Create bucket and service account
3. **Cloudinary**: Create account for image optimization

Remember to never commit `.env` files to version control and use secure methods to share environment variables with your team.