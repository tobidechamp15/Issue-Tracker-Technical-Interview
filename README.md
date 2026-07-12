# Mini Issue Tracking System

A lightweight issue tracker built with Next.js, TypeScript, and MongoDB. Track tasks, manage priorities, and monitor progress through a clean dashboard.

> **Live demo:** [issue-tracker-technical-interview.vercel.app](https://issue-tracker-technical-interview.vercel.app)

## Overview

This application allows users to:

- Register and authenticate securely with JWT
- Create, view, update, and delete issues
- Search, filter, and sort issues by status, priority, and text
- View dashboard metrics (total, open, in progress, closed, overdue)
- Responsive design works on mobile, tablet, and desktop

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend    | Next.js Route Handlers (`/app/api/**`)            |
| Database   | MongoDB with Mongoose ODM                         |
| Auth       | JWT (jsonwebtoken) + bcrypt (httpOnly cookies)    |
| Validation | Zod (server + client-side)                        |
| Testing    | Vitest (18 unit tests)                            |

## Project Structure

```
├── public/                          # Static assets
├── src/
│   ├── __tests__/                   # Unit tests (Vitest)
│   │   ├── auth.service.test.ts
│   │   └── issue.service.test.ts
│   ├── app/                         # Next.js App Router
│   │   ├── api/                     # Route Handlers (backend)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts   #   POST — authenticate
│   │   │   │   ├── register/route.ts#   POST — create account
│   │   │   │   ├── logout/route.ts  #   POST — clear session
│   │   │   │   ├── refresh/route.ts #   POST — rotate tokens
│   │   │   │   └── me/route.ts      #   GET  — current user
│   │   │   ├── dashboard/
│   │   │   │   └── metrics/route.ts #   GET  — aggregation
│   │   │   └── issues/
│   │   │       ├── route.ts         #   GET, POST
│   │   │       └── [id]/route.ts    #   GET, PUT, DELETE
│   │   ├── dashboard/page.tsx       # Protected dashboard view
│   │   ├── issues/
│   │   │   ├── page.tsx             # Issue list (with filters)
│   │   │   ├── [id]/page.tsx        # Issue detail
│   │   │   └── new/page.tsx         # Issue creation form
│   │   ├── login/page.tsx           # Login page
│   │   ├── register/page.tsx        # Registration page
│   │   ├── layout.tsx               # Root layout (AuthProvider)
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Tailwind + custom styles
│   │   └── not-found.tsx            # 404 page
│   ├── components/                  # Shared UI components
│   │   ├── landing/                 # Landing page components
│   │   └── ...                      # Badge, IssueCard, NavBar, etc.
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # Client-side fetch wrapper
│   │   ├── auth.ts                  # JWT sign/verify helpers
│   │   ├── auth-context.tsx         # React context for auth state
│   │   ├── db.ts                    # MongoDB connection
│   │   ├── with-auth.ts             # Server-side auth middleware
│   │   └── validation/             # Zod schemas
│   ├── models/                      # Mongoose schemas
│   │   ├── Issue.ts
│   │   └── User.ts
│   └── services/                    # Business logic layer
│       ├── auth.service.ts
│       └── issue.service.ts
├── .env.example                     # Environment template
├── next.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd issue-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your MongoDB Atlas connection string and a JWT secret.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. **Run tests**
   ```bash
   npm test
   ```

## Environment Variables

| Variable               | Description                               |
| ---------------------- | ----------------------------------------- |
| `MONGODB_URI`          | MongoDB Atlas connection string           |
| `JWT_SECRET`           | Secret key for signing access JWT tokens  |
| `JWT_EXPIRES_IN`       | Access token TTL (default: `15m`)         |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh JWT tokens |
| `REFRESH_EXPIRES_IN`   | Refresh token TTL (default: `7d`)         |

## API Documentation

| Method | Route                    | Auth | Description                                                                    |
| ------ | ------------------------ | ---- | ------------------------------------------------------------------------------ |
| POST   | `/api/auth/register`     | —    | Register new user; sets `token` + `refreshToken` httpOnly cookies              |
| POST   | `/api/auth/login`        | —    | Login; sets `token` + `refreshToken` httpOnly cookies                          |
| POST   | `/api/auth/logout`       | —    | Clears both `token` and `refreshToken` cookies                                 |
| POST   | `/api/auth/refresh`      | —    | Rotates tokens using existing `refreshToken` cookie; returns new pair          |
| GET    | `/api/auth/me`           | ✓    | Returns current user from `token` cookie                                       |
| GET    | `/api/issues`            | ✓    | List issues (`?search=&status=&priority=&sort=newest\|oldest&page=1&limit=10`) |
| GET    | `/api/issues/:id`        | ✓    | Get single issue                                                               |
| POST   | `/api/issues`            | ✓    | Create issue (Zod-validated body)                                              |
| PUT    | `/api/issues/:id`        | ✓    | Update issue (partial update allowed)                                          |
| DELETE | `/api/issues/:id`        | ✓    | Delete issue                                                                   |
| GET    | `/api/dashboard/metrics` | ✓    | Dashboard metrics (single `$facet` aggregation)                                |

### Response Envelope

```json
// Success
{ "success": true, "data": { ... }, "meta": { "page": 1, "total": 42, "limit": 10, "totalPages": 5 } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Architecture Decisions

### Why a Next.js Monolith?

A modular monolith reduces deployment risk and lets development time focus on correctness instead of infrastructure. The internal layering (routes → services → data access) means it can be split into separate services later with minimal rework.

### Layered Architecture

```
Request → Route Handler (HTTP only)
        → Middleware (JWT auth check)
        → Service Layer (business logic)
        → Data Access Layer (Mongoose models)
        → MongoDB
```

Each layer has exactly one responsibility. Route handlers parse requests and format responses. Services contain business rules. Data access is isolated in Mongoose models.

### Why These Indexes?

- **`{ status: 1, priority: 1 }`** — compound index for the two most common filter combinations
- **Text index on `title`** — supports search without a regex table scan
- **`dueDate: 1`** — the Overdue metric needs `dueDate < now AND status != closed`
- **`createdAt: -1`** — supports both sort directions cheaply

### Why JWT in httpOnly Cookie?

httpOnly cookies mitigate XSS token theft compared to localStorage. Same-site cookie configuration provides CSRF protection.

The app uses a **dual-token strategy**: a short-lived access token (`token`, default 15 min) for API authentication, and a long-lived refresh token (`refreshToken`, default 7 days) stored in a separate httpOnly cookie. When an API call receives a 401, the client can call `POST /api/auth/refresh` to silently rotate both tokens without interrupting the user. The refresh token itself rotates on each use, limiting the window for replay attacks.

## Assumptions

- `assignee` is a free-text field rather than a full user-lookup, to fit the 4-day scope
- MongoDB Atlas is used for database hosting
- Vercel is used for application deployment

## Trade-offs

- Skipped real-time updates (WebSockets) in favor of hardening core CRUD + auth given the time budget
- Skipped email notifications and file attachments — these don't map to scored rubric categories
- Used a single deployment unit (Next.js monolith) instead of separate frontend/backend repos

## Future Improvements

- Redis caching on dashboard metrics
- Role-based permissions (owner/assignee-based edit/delete)
- Real-time updates via WebSockets
- Full integration test suite
- CI/CD pipeline
- Split into separate API service if traffic demands it
