-- Basic schema for admin login functionality
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'customer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    last_login_at TIMESTAMP,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    status,
    email_verified
) VALUES (
    'admin@example.com',
    '$2b$12$dT1MBDmigVxK/5n14tNjLOMCDjec1vlQRakywSCef/OF/5zZsqlMa',
    'Admin',
    'User',
    'admin',
    'active',
    true
) ON CONFLICT (email) DO NOTHING;