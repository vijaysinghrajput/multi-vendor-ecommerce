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

## 🚀 Deployment

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