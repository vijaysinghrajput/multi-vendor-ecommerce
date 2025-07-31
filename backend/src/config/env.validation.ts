import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),
  APP_NAME: Joi.string().default('Multi-Vendor E-Commerce'),
  APP_URL: Joi.string().uri().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3001'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3001'),

  // Database
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.optional().allow(''),
    otherwise: Joi.required(),
  }),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().uri(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // OTP
  OTP_PROVIDER: Joi.string().valid('twilio', 'firebase').default('twilio'),
  OTP_EXPIRES_IN: Joi.number().default(300),
  OTP_LENGTH: Joi.number().default(6),

  // Twilio
  TWILIO_ACCOUNT_SID: Joi.string().when('OTP_PROVIDER', {
    is: 'twilio',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  TWILIO_AUTH_TOKEN: Joi.string().when('OTP_PROVIDER', {
    is: 'twilio',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  TWILIO_PHONE_NUMBER: Joi.string().when('OTP_PROVIDER', {
    is: 'twilio',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Firebase
  FIREBASE_PROJECT_ID: Joi.string().when('OTP_PROVIDER', {
    is: 'firebase',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  FIREBASE_PRIVATE_KEY: Joi.string().when('OTP_PROVIDER', {
    is: 'firebase',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().when('OTP_PROVIDER', {
    is: 'firebase',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Email
  SMTP_HOST: Joi.string().default('smtp.gmail.com'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASS: Joi.string().required(),
  FROM_EMAIL: Joi.string().email().required(),
  FROM_NAME: Joi.string().default('Multi-Vendor E-Commerce'),

  // Payment Gateways
  RAZORPAY_KEY_ID: Joi.string().optional(),
  RAZORPAY_KEY_SECRET: Joi.string().optional(),
  STRIPE_PUBLISHABLE_KEY: Joi.string().optional(),
  STRIPE_SECRET_KEY: Joi.string().optional(),
  CASHFREE_APP_ID: Joi.string().optional(),
  CASHFREE_SECRET_KEY: Joi.string().optional(),
  CASHFREE_ENVIRONMENT: Joi.string().valid('TEST', 'PROD').default('TEST'),

  // AWS S3
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().default('us-east-1'),
  S3_BUCKET_NAME: Joi.string().optional(),
  S3_ENDPOINT: Joi.string().uri().optional(),

  // Google Maps
  GOOGLE_MAPS_API_KEY: Joi.string().optional(),

  // Analytics
  GA_MEASUREMENT_ID: Joi.string().optional(),
  FB_PIXEL_ID: Joi.string().optional(),

  // FCM
  FCM_SERVER_KEY: Joi.string().optional(),
  FCM_PROJECT_ID: Joi.string().optional(),

  // Security
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_LIMIT: Joi.number().default(100),
  SESSION_SECRET: Joi.string().min(32).required(),

  // File Upload
  MAX_FILE_SIZE: Joi.number().default(10485760),
  ALLOWED_FILE_TYPES: Joi.string().default('image/jpeg,image/png,image/webp'),
  UPLOAD_PATH: Joi.string().default('uploads'),
  IMAGE_QUALITY: Joi.number().min(1).max(100).default(80),
  IMAGE_MAX_WIDTH: Joi.number().default(1920),
  IMAGE_MAX_HEIGHT: Joi.number().default(1080),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().default(0),

  // Feature Flags
  ENABLE_ANALYTICS: Joi.boolean().default(true),
  ENABLE_PUSH_NOTIFICATIONS: Joi.boolean().default(true),
  ENABLE_EMAIL_NOTIFICATIONS: Joi.boolean().default(true),
  ENABLE_SMS_NOTIFICATIONS: Joi.boolean().default(true),
  ENABLE_SOCIAL_LOGIN: Joi.boolean().default(false),
  ENABLE_MULTI_CURRENCY: Joi.boolean().default(true),
  ENABLE_MULTI_LANGUAGE: Joi.boolean().default(true),

  // Defaults
  DEFAULT_CURRENCY: Joi.string().default('USD'),
  DEFAULT_LANGUAGE: Joi.string().default('en'),
  DEFAULT_TIMEZONE: Joi.string().default('UTC'),
  DEFAULT_PAGE_SIZE: Joi.number().default(20),
  MAX_PAGE_SIZE: Joi.number().default(100),

  // Commission
  DEFAULT_COMMISSION_RATE: Joi.number().min(0).max(100).default(5),
  MIN_COMMISSION_RATE: Joi.number().min(0).default(1),
  MAX_COMMISSION_RATE: Joi.number().max(100).default(30),

  // Orders
  ORDER_CANCELLATION_WINDOW: Joi.number().default(24),
  AUTO_CONFIRM_ORDER_AFTER: Joi.number().default(72),
  RETURN_WINDOW: Joi.number().default(7),
  REFUND_PROCESSING_DAYS: Joi.number().default(5),
});