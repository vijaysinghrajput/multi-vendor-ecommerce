#!/bin/bash

# PostgreSQL Database Setup Script
echo "Setting up PostgreSQL database and user..."

# Create database
sudo -u postgres createdb wise_lifescience_db
if [ $? -eq 0 ]; then
    echo "Database 'wise_lifescience_db' created successfully"
else
    echo "Database creation failed or already exists"
fi

# Create user and set permissions
sudo -u postgres psql -c "CREATE USER wise_admin WITH PASSWORD 'WiseAdmin@411';"
if [ $? -eq 0 ]; then
    echo "User 'wise_admin' created successfully"
else
    echo "User creation failed or already exists"
fi

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE wise_lifescience_db TO wise_admin;"
sudo -u postgres psql -c "ALTER USER wise_admin WITH SUPERUSER;"

echo "Database setup completed!"

# Update .env file
echo "Updating .env file..."
cd /var/www/wise-lifescience/backend

# Backup current .env
cp .env .env.backup

# Update DATABASE_URL
sed -i 's|DATABASE_URL=.*|DATABASE_URL=postgresql://wise_admin:WiseAdmin@411@localhost:5432/wise_lifescience_db|' .env

echo ".env file updated with new database credentials"

# Test database connection
echo "Testing database connection..."
npm run migration:run

echo "Setup script completed!"