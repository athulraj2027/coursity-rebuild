# Coursity - Online Learning Platform

A modern, full-stack online learning platform built with Next.js, Express, PostgreSQL, and real-time WebSocket communication. Coursity enables educators to create and manage courses while students can enroll, learn, and participate in live lectures with complete payment and wallet management systems.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Architecture](#architecture)
- [Key Features Details](#key-features-details)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### For Students

- **Course Discovery & Browsing** - Browse available courses with detailed information
- **Course Enrollment** - Enroll in courses with Razorpay payment integration
- **Live Lectures** - Join real-time lectures with HD video streaming
- **Attendance Tracking** - Automatic attendance marking during lecture participation
- **Wallet System** - Manage course credits and refunds through a digital wallet
- **Progress Tracking** - Monitor course completion and lecture attendance
- **Dashboard** - Personalized student dashboard with enrolled courses

### For Teachers

- **Course Management** - Create, edit, and manage courses
- **Lecture Management** - Schedule and conduct live lectures
- **Student Management** - View enrolled students and track attendance
- **Wallet & Payouts** - View earnings and request payouts
- **Analytics** - Course enrollment and student participation statistics

### For Admins

- **Full Platform Management** - Manage users, courses, and lectures
- **Payment Management** - Monitor transactions and payments
- **Wallet Administration** - Process payouts and manage wallet transactions
- **User Management** - Add, edit, and remove users with role assignment

## 📁 Project Structure

`coursity-client-server/
+-- readme.MD                  # This README file
+-- .gitignore                 # Git ignore rules
+-- components.json            # Next.js components configuration (used by the build)
+-- eslint.config.mjs          # ESLint configuration for the monorepo
+-- proxy.ts                   # Development proxy setup for the frontend
+-- frontend/                  # Next.js client application
�   +-- app/                   # Route handlers and layouts
�   �   +-- (auth)/            # Authentication pages (sign-in, sign-up)
�   �   +-- (role)/            # Role-based layouts (admin, teacher, student)
�   �   +-- lecture/           # Live lecture pages
�   �   +-- layout.tsx         # Root layout with providers
�   +-- components/            # React components grouped by domain
�   �   +-- admin/             # Admin dashboard components
�   �   +-- teacher/           # Teacher dashboard components
�   �   +-- student/           # Student dashboard components
�   �   +-- common/            # Shared components (modals, tables, loaders)
�   �   +-- public/            # Public landing page components
�   �   +-- ui/                # Reusable UI widgets (buttons, inputs)
�   +-- constants/             # Shared constant values
�   +-- features/              # Feature-specific hooks and helpers
�   +-- hooks/                 # Custom React hooks
�   +-- lib/                   # Utilities (API client, socket, uploads)
�   +-- services/              # API service functions
�   +-- queries/               # React Query configuration
�   +-- mutations/             # React Query mutation helpers
�   +-- store/                 # Zustand state management
�   +-- validations/           # Zod form schemas
�   +-- public/                # Static assets served by Next.js
�   +-- providers/             # Context and provider components
�   +-- types/                 # TypeScript global/type definitions
�   +-- utils/                 # Miscellaneous helpers
�   +-- .env.local             # Local environment variables (not checked in)
�   +-- next.config.ts         # Next.js configuration
�   +-- tsconfig.json          # TypeScript configuration
�   +-- postcss.config.mjs     # PostCSS configuration
�   +-- ...other config files
�
+-- http/                      # Express backend API
�   +-- src/
�   �   +-- controllers/       # Route controllers
�   �   +-- services/          # Business logic
�   �   +-- repositories/      # Database queries
�   �   +-- routes/            # API endpoint definitions
�   �   +-- middlewares/       # Authentication, validation, etc.
�   �   +-- helpers/           # Helper functions (e.g. email, auth)
�   �   +-- lib/               # Utilities (razorpay client, prisma client)
�   �   +-- types/             # Shared TypeScript interfaces
�   �   +-- utils/             # Misc utilities
�   �   +-- index.ts           # Server entry point
�   +-- prisma/                # Prisma schema and migrations
�   �   +-- schema.prisma      # Database schema definition
�   �   +-- migrations/        # Generated migration files
�   +-- package.json
�   +-- tsconfig.json
�   +-- .env                   # Backend environment variables
�
+-- socket/                    # WebSocket server for real-time features
    +-- src/
    �   +-- handlers/         # Socket event handlers
    �   +-- services/         # Business logic for real-time features
    �   +-- mediasoup/        # MediaSoup video streaming setup
    �   +-- middlewares/      # Socket authentication
    �   +-- socket/           # Event management utilities
    �   +-- config/           # Configuration helpers
    �   +-- store/            # In-memory data storage
    �   +-- types/            # TypeScript interfaces
    �   +-- index.ts          # Server entry point
    +-- package.json
    +-- tsconfig.json
    +-- .env                  # Socket server environment variables`

> **Note:** there are additional configuration files at the root and in each package (.eslintrc, sconfig.json, package.json, etc.) that are used by the build tools.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) - React meta-framework
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Server State**: [React Query/TanStack Query 5](https://tanstack.com/query/latest)
- **Real-time Communication**: [Socket.IO Client 4.8](https://socket.io/)
- **Video Streaming**: [MediaSoup Client 3.18](https://mediasoup.org/)
- **Animations**: [Motion](https://motion.dev/)
- **Forms & Validation**: [Zod](https://zod.dev/)
- **Payment**: [Razorpay SDK](https://razorpay.com/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend API
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM 6.19](https://www.prisma.io/)
- **Authentication**: [JWT](https://jwt.io/) with [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- **Password Hashing**: [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **Payment Gateway**: [Razorpay Node SDK](https://github.com/razorpay/razorpay-node)
- **Database Driver**: [pg (node-postgres)](https://node-postgres.com/)
- **Development**: [tsx](https://tsx.is/) for running TypeScript

### WebSocket Server
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Real-time**: [Socket.IO 4.8](https://socket.io/)
- **Video Streaming**: [MediaSoup 3.19](https://mediasoup.org/)
- **Authentication**: [JWT](https://jwt.io/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL**: v12.0 or higher
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/coursity-client-server.git
cd coursity-client-server
```

### 2. Install Dependencies

Install dependencies for all packages in the monorepo:

```bash
# Frontend
cd frontend
npm install

# Backend API
cd ../http
npm install

# WebSocket Server
cd ../socket
npm install
```

## ⚙️ Configuration

### 1. Environment Variables

Each service has its own .env (or .env.local for Next.js) file. Below are the complete, correct variable names used by the codebase today.

**http/.env** (Backend API)
`ash

# Database

DATABASE_URL= postgresql://user:password@localhost:5432/coursity

# Server

PORT=5000
NODE_ENV=development

# JWT

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Razorpay (keys used in http/lib/razorpay.ts)

RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret

# OAuth & uploads

GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Network/URLs

FRONTEND_URL=http://localhost:3000 # used for CORS and redirects
SOCKET_URL=http://localhost:3001 # advertised to clients for sockets
BACKEND_URL=http://localhost:5000 # internal URL used by socket service helpers

# Misc

ANNOUNCED_IP=127.0.0.1 # MediaSoup public IP (optional)
INTERNAL_SECRET=some_internal_key # used for authenticated internal HTTP requests
`

**socket/.env** (WebSocket Server)
`ash

# Server

PORT=3001
NODE_ENV=development

# JWT

JWT_SECRET=your_jwt_secret_key_here # same secret as backend

# URLs / CORS

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
BACKEND_URL=http://localhost:5000 # used by socket/src/lib/http.ts
API_URL=http://localhost:5000 # alias for the same

# Secrets

INTERNAL_SECRET=some_internal_key
ANNOUNCED_IP=127.0.0.1 # for MediaSoup configuration
`

**rontend/.env.local** (Next.js Frontend)
`ash

# API Configuration

NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Third-party integrations

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_public_key
`

> ?? The frontend never exposes secret keys (no RAZORPAY*SECRET, JWT_SECRET etc.). Use NEXT_PUBLIC* prefix for values consumed in browser code.

### 2. Database Setup

`ash
cd http
npx prisma migrate deploy
npx prisma generate         # optional
npx prisma studio           # explore data
`

## ▶️ Running the Application

### Development Mode

Run each service in separate terminals:

**Terminal 1: Backend API**
```bash
cd http
npm run dev
```
The API server will start at `http://localhost:5000`

**Terminal 2: WebSocket Server**
```bash
cd socket
npm run dev
```
The WebSocket server will start at `http://localhost:3001`

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
```
The frontend will start at `http://localhost:3000`

### Production Build

```bash
# Backend API
cd http
npm run build
npm start

# WebSocket Server
cd socket
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│              Frontend (Next.js + React)                      │
└────────────────┬────────────────────────────┬────────────────┘
                 │                            │
        REST API │                            │ WebSocket
                 │                            │
         ┌───────▼──────────┐    ┌──────────▼─────────┐
         │  Express API     │    │  Socket.IO Server  │
         │  (Port 5000)     │    │   (Port 3001)      │
         │  - Auth          │    │  - Live Lectures   │
         │  - Courses       │<───│  - Real-time Data  │
         │  - Payments      │    │  - MediaSoup       │
         │  - Wallet        │    │  - Attendance      │
         └────────┬─────────┘    └────────────────────┘
                  │                       
                  └───┬
                      │
           ┌────────▼────────┐
           │  PostgreSQL DB  │
           │  - Users        │
           │  - Courses      │
           │  - Lectures     │
           │  - Payments     │
           │  - Wallets      │
           └─────────────────┘
```

### Authentication Flow

1. User signs up/logs in via frontend
2. Frontend sends credentials to backend API
3. Backend validates and returns JWT token
4. Frontend stores token in local storage
5. Subsequent requests include token in Authorization header
6. WebSocket server validates token on connection

### Payment Flow (Razorpay Integration)

1. Student initiates course enrollment
2. Frontend requests payment order from backend
3. Backend creates Razorpay order
4. Frontend displays Razorpay payment gateway
5. Student completes payment
6. Razorpay confirms payment to backend webhook
7. Backend updates enrollment and wallet records
8. Frontend redirects to enrollment success page

## 📚 Key Features Details

### Real-time Lectures

- Teachers can schedule and start live lectures
- Students join lectures with real-time video/audio using MediaSoup
- Automatic attendance tracking
- Real-time chat and participant list (via Socket.IO)
- Lecture status management (NOT_STARTED, STARTED, COMPLETED)

### Wallet System

- Students and teachers have digital wallets
- Money stored in paise (100 paise = 1 rupee)
- Transaction types: CREDIT, DEBIT, REFUND, PURCHASE, PAYOUT
- Teachers can request payouts
- Admins process payouts with proof screenshots
- All transactions tracked with timestamps and descriptions

### Course Management

- Teachers create courses with descriptions and pricing
- Students browse available courses
- Enrollment creates payment orders
- Course completion tracking
- Student list per course for teachers

## 🔌 API Documentation

### Authentication Endpoints

```
POST   /api/auth/sign-up          - Register new user
POST   /api/auth/sign-in          - Login user
POST   /api/auth/refresh-token    - Refresh JWT token
POST   /api/auth/logout           - Logout user
```

### Course Endpoints

```
GET    /api/courses               - Get all courses
GET    /api/courses/:id           - Get course details
POST   /api/courses               - Create course (teacher/admin)
PUT    /api/courses/:id           - Update course (teacher/admin)
DELETE /api/courses/:id           - Delete course (teacher/admin)
```

### Lecture Endpoints

```
GET    /api/lectures              - Get lectures
GET    /api/lectures/:id          - Get lecture details
POST   /api/lectures              - Create lecture (teacher)
PUT    /api/lectures/:id          - Update lecture (teacher)
POST   /api/lectures/:id/start    - Start lecture (teacher)
POST   /api/lectures/:id/end      - End lecture (teacher)
```

### Enrollment Endpoints

```
GET    /api/enrollments           - Get user enrollments
POST   /api/enrollments           - Create enrollment
GET    /api/enrollments/:id       - Get enrollment details
```

### Payment Endpoints

```
POST   /api/payments/create-order - Create Razorpay order
POST   /api/payments/verify       - Verify payment
GET    /api/payments              - Get user payments
```

### Wallet Endpoints

```
GET    /api/wallet                - Get wallet balance
GET    /api/wallet/transactions   - Get transaction history
POST   /api/wallet/payout-request - Request payout (teacher)
```

### Admin Endpoints

```
GET    /api/admin/users           - Get all users
GET    /api/admin/courses         - Get all courses
GET    /api/admin/wallets         - Get all wallets
POST   /api/admin/wallets/:id/approve-payout - Process payout
```

For detailed API documentation, refer to the backend implementation in `http/src/routes/`.

## 🗄️ Database Schema

### Key Models

**User**
- id, name, email, password, role (TEACHER, STUDENT, ADMIN)
- Relationships: courses, enrollments, payments, wallet, attendance

**Course**
- id, title, description, price, teacherId
- Relationships: lectures, enrollments, teacher

**Lecture**
- id, courseId, startTime, endTime, status
- Relationships: course, attendance, participants

**Enrollment**
- id, studentId, courseId, enrolledAt
- Relationships: student, course, payment

**Payment**
- id, userId, courseId, amount, razorpayOrderId, status
- Tracks course purchases and Razorpay transactions

**Wallet**
- id, userId, balance (in paise)
- Relationships: user, transactions

**WalletTransaction**
- id, walletId, amount, type, description, referenceId
- Tracks all wallet movements

**Attendance**
- id, studentId, lectureId, status (PRESENT, LATE, ABSENT)
- Records student attendance in lectures

**Participant**
- id, userId, lectureId, joinedAt, leftAt
- Tracks active participants in live lectures

For complete schema details, see [http/prisma/schema.prisma](http/prisma/schema.prisma).

## 🐛 Troubleshooting

### Environment variable names

- Make sure you are using the names shown above � older docs used RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET and NEXT_PUBLIC_API_URL, but the code now expects RAZORPAY_KEY/RAZORPAY_SECRET and NEXT_PUBLIC_BACKEND_URL.

### Database Connection Issues

**Problem**: `PrismaClientInitializationError`

**Solution**:
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Ensure database exists
- Run `npx prisma db push` to sync schema

### Socket Connection Issues

**Problem**: Socket not connecting to WebSocket server

**Solution**:
- Verify Socket.IO server is running on port 3001
- Check CORS configuration in socket server
- Ensure NEXT_PUBLIC_SOCKET_URL is correct in frontend env
- Check browser console for connection errors

### JWT Token Issues

**Problem**: "Invalid token" or 401 errors

**Solution**:
- Verify JWT_SECRET is same across all services
- Check token is included in Authorization header
- Verify token hasn't expired (check JWT_EXPIRE setting)
- Clear local storage and re-login

### Build Failures

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Clear build artifacts
rm -rf dist/ .next/

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Payment Gateway Issues

**Problem**: Razorpay payment fails

**Solution**:
- Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Check Razorpay is in correct environment (test/production)
- Verify payment amount is > 0 in paise
- Check browser console for Razorpay script errors

## 📖 Development Guidelines

(_unchanged_)

## 🤝 Contributing

(_unchanged_)

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ?? for online learning**
