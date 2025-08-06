# 🔌 Reserved Ports for Multi-Vendor E-Commerce Platform

## 🧱 Services & Ports

| Service         | Tech Stack        | Reserved Port | URL                     | Status |
|-----------------|-------------------|---------------|-------------------------|--------|
| Backend API     | NestJS (Node.js)  | 3000          | http://localhost:3000   | ✅ Active |
| Frontend Web    | Next.js / React   | 3001          | http://localhost:3001   | ✅ Active |
| Mobile App Dev  | Expo / Flutter    | 3002          | http://localhost:3002   | 🔄 Reserved |

## 🔐 Configuration Notes

### Backend (Port 3000)
- **Framework**: NestJS with TypeScript
- **Environment**: `.env → PORT=3000`
- **Main File**: `backend/src/main.ts`
- **API Base**: `/api/v1`
- **Full URL**: `http://localhost:3000/api/v1`

### Frontend (Port 3001)
- **Framework**: Next.js with TypeScript
- **Environment**: `.env.local → NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`
- **Script**: `npm run dev` (configured with `-p 3001`)
- **Admin Panel**: `http://localhost:3001/admin/login`

### Mobile App (Port 3002)
- **Framework**: React Native with Expo (Reserved)
- **Environment**: `.env → PORT=3002`
- **Web Preview**: `http://localhost:3002` (when needed)

## 🚀 Quick Start Commands

```bash
# Start Backend (Terminal 1)
cd backend
npm run start:dev

# Start Frontend (Terminal 2)
cd frontend
npm run dev

# Start Mobile (Terminal 3) - Optional
cd mobile-app
npm start
```

## 🔧 Port Configuration Files

### Backend Configuration
- `backend/.env` - Contains `PORT=3000`
- `backend/src/main.ts` - NestJS app listens on port from env
- `backend/package.json` - Contains start scripts

### Frontend Configuration
- `frontend/.env.local` - Contains `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`
- `frontend/.env.development` - Development-specific settings
- `frontend/package.json` - Contains `"dev": "next dev -p 3001"`

## ⚠️ Important Rules

1. **These ports are FIXED** - Do not change without updating this document
2. **No port conflicts** - Always check `lsof -i :3000-3002` before starting
3. **Environment sync** - All env files must reference the correct ports
4. **Team coordination** - All developers must use these exact ports

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Reset All Services
```bash
# Stop all Node processes
pkill -f node

# Start services in order
cd backend && npm run start:dev &
cd frontend && npm run dev &
```

## 📋 Health Check URLs

- Backend Health: `http://localhost:3000/api/v1/health`
- Frontend Home: `http://localhost:3001`
- Admin Login: `http://localhost:3001/admin/login`
- API Documentation: `http://localhost:3000/api/docs`

---
**Last Updated**: January 7, 2025  
**Document Version**: 1.0  
**Team**: Multi-Vendor E-Commerce Development