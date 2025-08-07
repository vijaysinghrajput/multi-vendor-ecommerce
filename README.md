# Multi-Vendor E-Commerce Platform

A comprehensive multi-vendor e-commerce platform built with modern technologies, supporting multiple vendors, customers, and administrators with advanced features like returns, exchanges, and analytics.

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

### Frontend
- **Framework**: Next.js (React)
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Styling**: CSS-in-JS (Emotion)
- **SSR**: Server-Side Rendering

### Mobile App
- **Framework**: React Native
- **Platform**: Expo
- **Navigation**: React Navigation

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
ROOT/
├── backend/         # NestJS API server
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── config/      # Configuration files
│   │   └── common/      # Shared utilities
│   ├── package.json
│   └── .env.example
├── frontend/        # Next.js web application
│   ├── pages/          # Next.js pages
│   ├── components/     # React components
│   ├── store/          # Redux store
│   ├── services/       # API services
│   └── package.json
├── mobile-app/      # React Native mobile app
│   ├── src/
│   ├── package.json
│   └── app.json
├── docs/            # Documentation
│   └── ENV_SETUP.md
├── .gitignore
└── README.md
```

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/vijaysinghrajput/multi-vendor-ecommerce.git
cd multi-vendor-ecommerce

# 2. Install dependencies
npm run setup

# 3. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp .env.database.example .env.database

# 4. Start development servers
npm run dev:full

# 5. Deploy to production (when ready)
npm run deploy:full
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- Git

## 🔌 Port Configuration (Local Dev)

**Reserved Ports - NEVER CHANGE:**
- **Backend API**: `http://localhost:3000`
- **Web Frontend**: `http://localhost:3001`
- **Mobile App Preview**: `http://localhost:3002`

> 📋 See [PORTS.md](./PORTS.md) for detailed port configuration documentation.

### 1. Clone the Repository
```bash
git clone https://github.com/vijaysinghrajput/multi-vendor-ecommerce.git
cd multi-vendor-ecommerce
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials and other settings

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`
API documentation at `http://localhost:3000/api`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your API endpoints

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

### 4. Mobile App Setup
```bash
cd mobile-app
npm install

# Install Expo CLI globally (if not already installed)
npm install -g @expo/cli

# Start Expo development server
npm start
```

### 5. Database Setup

1. Create a PostgreSQL database
2. Update the database configuration in `backend/.env`
3. Run migrations: `npm run migration:run`
4. (Optional) Seed data: `npm run seed`

## 🔧 Environment Configuration

Refer to `docs/ENV_SETUP.md` for detailed environment variable setup instructions.

## 🌟 Features

### Core Features
- **Multi-vendor marketplace** with vendor registration and management
- **Product catalog** with categories, variants, and inventory management
- **Shopping cart** and checkout process
- **Order management** with status tracking
- **Payment integration** (multiple payment gateways)
- **User authentication** and role-based access control
- **Returns and exchanges** management system
- **Review and rating** system
- **Wishlist** functionality
- **Analytics dashboard** for vendors and admins

### Admin Features
- Vendor approval and management
- Order oversight and management
- Analytics and reporting
- User management
- System configuration

### Vendor Features
- Product management
- Order fulfillment
- Analytics dashboard
- Payout management
- Customer communication

### Customer Features
- Product browsing and search
- Shopping cart and checkout
- Order tracking
- Returns and exchanges
- Reviews and ratings
- Wishlist management

## 🤝 Contributing

### Branch Naming Convention
- `feature/{feature-name}` - New features
- `fix/{bug-description}` - Bug fixes
- `hotfix/{critical-fix}` - Critical production fixes
- `chore/{task-description}` - Maintenance tasks

### Development Workflow
1. Create a new branch from `dev`
2. Make your changes
3. Test thoroughly
4. Create a pull request to `dev`
5. Code review and approval
6. Merge to `dev`
7. Deploy to staging for testing
8. Merge to `main` for production

### Code Standards
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow TypeScript best practices

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Request appropriate reviewers

## 📚 Documentation

- [Environment Setup](docs/ENV_SETUP.md)
- [API Documentation](http://localhost:3000/api) (when backend is running)
- [Database Schema](backend/schema.sql)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test          # Jest tests
npm run test:watch    # Watch mode 
```

## 📦 Available Scripts

```bash
# Development
npm run dev:backend      # Start backend development server
npm run dev:frontend     # Start frontend development server
npm run dev:full         # Start both backend and frontend

# Building
npm run build:backend    # Build backend for production
npm run build:frontend   # Build frontend for production

# Database Deployment
npm run deploy:db        # Deploy database schema and migrations
npm run deploy:db:schema # Deploy only database schema
npm run deploy:db:data   # Deploy database data (use with caution)
npm run deploy:db:migrations # Run only TypeORM migrations
npm run deploy:db:seed   # Insert seed data (admin user, demo data)

# Full Deployment
npm run deploy:full      # Deploy database + application (recommended)
npm run deploy           # Deploy application (includes database sync)
npm run deploy:dry-run   # Preview deployment without executing
npm run deploy:help      # Show deployment help
```

## 🗄️ Database Deployment & Development-Production Correlation

This project features an advanced database deployment system that automatically correlates your development database with production when you deploy to the server.

### 🎯 Key Features

- **Automatic Schema Sync**: Your development database schema is automatically deployed to production
- **Migration Management**: TypeORM migrations run automatically during deployment
- **Backup Protection**: Production database is backed up before any changes
- **Seed Data**: Automatically creates admin users and demo data
- **Verification**: Ensures deployment success with health checks

### ⚡ Quick Database Deployment

```bash
# Configure database settings (one-time setup)
cp .env.database.example .env.database
nano .env.database

# Deploy everything (database + application)
npm run deploy:full

# Or deploy database only
npm run deploy:db
```

### 🔄 Development to Production Workflow

1. **Develop Locally**: Make changes to your local database
2. **Create Migrations**: Generate TypeORM migrations for schema changes
3. **Deploy**: Run `npm run deploy:full` to sync everything to production
4. **Verify**: Check that your changes are live on the server

```bash
# Example workflow
cd backend
npm run migration:generate -- -n AddNewFeature
npm run migration:run  # Test locally
cd ..
npm run deploy:full    # Deploy to production
```

### 📋 Database Deployment Options

```bash
npm run deploy:db:schema     # Deploy only database schema
npm run deploy:db:migrations # Run only TypeORM migrations
npm run deploy:db:data       # Sync data from development (use with caution)
npm run deploy:db:seed       # Insert admin user and demo data
```

For detailed database deployment instructions, see [DATABASE_DEPLOYMENT_GUIDE.md](DATABASE_DEPLOYMENT_GUIDE.md).

## 🚀 Application Deployment

This project includes automated deployment scripts for easy production deployment.

### Quick Deploy

```bash
# Deploy everything (recommended)
npm run deploy:full

# Deploy application only
npm run deploy
```

### Deployment Options

```bash
npm run deploy:dry-run   # Preview what will be deployed
npm run deploy:help      # Show deployment options
npm run deploy:config    # Show current configuration
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are properly configured before deployment.

## 👥 Contributors

- **Project Lead**: [Your Name]
- **Backend Developer**: [Developer Name]
- **Frontend Developer**: [Developer Name]
- **Mobile Developer**: [Developer Name]
- **DevOps Engineer**: [Engineer Name]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**Happy Coding! 🎉**