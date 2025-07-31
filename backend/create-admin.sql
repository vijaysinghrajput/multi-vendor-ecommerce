-- Create Admin User for Testing
-- This script creates a default admin user for testing the login system
-- Password: admin123 (hashed with bcrypt)

INSERT INTO users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    status,
    email_verified,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin@example.com',
    '$2b$12$dT1MBDmigVxK/5n14tNjLOMCDjec1vlQRakywSCef/OF/5zZsqlMa', -- bcrypt hash of 'admin123'
    'Admin',
    'User',
    'admin',
    'active',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Display the created admin user
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    status,
    email_verified,
    created_at
FROM users 
WHERE email = 'admin@example.com';