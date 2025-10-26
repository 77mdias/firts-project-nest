# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack SaaS/MVP monorepo containing a NestJS backend and Next.js frontend, containerized with Docker. The backend implements a complete JWT authentication system with role-based access control (RBAC), content management, and uses Prisma ORM with SQLite for development (PostgreSQL for production).

**Key Features:**
- Multi-role authentication (ADMIN, EDITOR, VIEWER)
- Content management platform with granular permissions
- Refresh token rotation for enhanced security
- Repository pattern for data access abstraction
- Docker-based development environment
- Multi-environment configuration (dev, test, production)

## Development Commands

### Docker (Preferred Method)
```bash
# Build and start all services
docker compose build
docker compose up -d

# Stop services
docker compose down

# Execute commands inside containers
docker compose exec back npm run <command>
docker compose exec front npm run <command>
```

### Backend (back/)
```bash
# Development (auto-reloads on changes, generates Prisma client)
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test                # Unit tests
npm run test:watch          # Watch mode
npm run test:e2e            # E2E tests
npm run test:cov            # Coverage

# Linting & Formatting
npm run lint                # ESLint with auto-fix
npm run format              # Prettier
```

### Frontend (front/)
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Linting
npm run lint
```

### Prisma (back/prisma/)
```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Push schema to database (dev only)
npx prisma db push

# Create migration (recommended for production)
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Seed database with test data
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio
```

## Architecture

### Backend (NestJS)

**Module Structure:**

1. **AppModule** - Root module that imports all feature modules
2. **AuthModule** - Authentication & authorization (JWT, Passport, Guards)
3. **UsersModule** - User management (ADMIN only)
4. **ContentModule** - Content CRUD with role-based permissions

**Key Patterns:**

1. **Repository Pattern**
   - Abstract repository classes define contracts (e.g., `UsersRepository`, `ContentRepository`)
   - Prisma-specific implementations in `repositories/prisma/`
   - Registered as providers using `provide/useClass` pattern
   - Example: `{ provide: UsersRepository, useClass: PrismaUsersRepository }`

2. **Authentication Architecture**
   - JWT strategy using Passport (`JwtStrategy`)
   - Access tokens: Short-lived (7 days default), managed by `@nestjs/jwt`
   - Refresh tokens: Long-lived (30 days), stored in DB, managed by `jsonwebtoken` directly
   - Token rotation: Refresh tokens are deleted and regenerated on each refresh

3. **Authorization (Guards & Decorators)**
   - `JwtAuthGuard` - Validates JWT and attaches user to request
   - `RolesGuard` - Checks user role against required roles
   - `@Roles(...roles)` - Decorator to specify required roles for endpoints
   - `@CurrentUser()` - Decorator to inject authenticated user into controller methods

**File Organization:**
```
back/src/
├── auth/
│   ├── decorators/          # @Roles(), @CurrentUser()
│   ├── guards/              # JwtAuthGuard, RolesGuard
│   ├── strategies/          # JwtStrategy (Passport)
│   ├── dtos/                # RegisterDto, LoginDto, RefreshTokenDto
│   ├── auth.service.ts      # Authentication logic
│   ├── auth.controller.ts   # Auth endpoints
│   └── auth.module.ts
├── users/
│   ├── repositories/        # UsersRepository (abstract + Prisma impl)
│   ├── dtos/                # UpdateUserDto
│   ├── users.service.ts
│   ├── users.controller.ts
│   └── users.module.ts
├── content/
│   ├── repositories/        # ContentRepository (abstract + Prisma impl)
│   ├── dtos/                # CreateContentDto, UpdateContentDto, QueryContentDto
│   ├── content.service.ts   # Business logic with permission checks
│   ├── content.controller.ts
│   └── content.module.ts
├── database/
│   └── prisma.service.ts    # Prisma connection management
├── main.ts                  # App entry point with CORS & ValidationPipe
└── app.module.ts            # Root module
```

**Configuration:**
- Port: 3001 (5555 for Prisma Studio)
- CORS: http://localhost:3000 (frontend)
- Validation: Global ValidationPipe with class-validator
- Database: SQLite (dev/test), PostgreSQL (production)
- Environment files: `.env.development`, `.env.test`, `.env.production`

### Frontend (Next.js)

**Architecture Overview:**

This is a Next.js 16 App Router application with TypeScript, Tailwind CSS v4, and React 19. The frontend implements client-side authentication with localStorage token persistence and React Context for state management.

**Key Features:**
- Client-side authentication with token storage
- Protected routes via Next.js middleware
- React Context for global auth state
- Type-safe API client with error handling
- Responsive UI with Tailwind CSS v4

**File Organization:**
```
front/src/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Home/landing page
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Register page
│   └── dashboard/page.tsx      # Protected dashboard
├── components/
│   ├── Providers.tsx           # Client-side provider wrapper
│   └── InputField.tsx          # Reusable form input component
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── lib/
│   └── api.ts                  # API client (fetch wrapper)
├── types/
│   └── auth.ts                 # TypeScript interfaces
└── middleware.ts               # Route protection logic
```

**Authentication Flow:**

1. **Token Storage**
   - Access token: Stored in localStorage (`accessToken`)
   - Refresh token: Stored in localStorage (`refreshToken`)
   - User data: Stored in localStorage (`user`) as JSON
   - Note: Also sets cookies for middleware checks (optional enhancement)

2. **AuthContext (`contexts/AuthContext.tsx`)**
   - Manages authentication state (user, tokens, loading)
   - Provides methods: `login()`, `register()`, `logout()`, `refreshAuth()`
   - Auto-loads auth state from localStorage on mount
   - Validates tokens by calling `/auth/me` endpoint
   - Automatically attempts token refresh on validation failure

3. **Route Protection (`middleware.ts`)**
   - Protected routes: `/dashboard`, `/content`, `/users`
   - Auth-only routes: `/login`, `/register` (redirect to dashboard if authenticated)
   - Checks for `accessToken` cookie (middleware can't access localStorage)
   - Redirects unauthenticated users to `/login?redirect=<original-path>`

4. **API Client (`lib/api.ts`)**
   - Centralized fetch wrapper with error handling
   - Methods: `login()`, `register()`, `refreshToken()`, `logout()`, `getMe()`
   - `authenticatedRequest()` helper for protected endpoints
   - Configurable base URL via `NEXT_PUBLIC_API_URL`

**Key Patterns:**

1. **Client Components with "use client"**
   - Required for components using React hooks (useState, useEffect, useContext)
   - All pages and components that use AuthContext must be client components

2. **Type Safety**
   - All API requests/responses typed via `types/auth.ts`
   - Interfaces: `User`, `LoginRequest`, `LoginResponse`, `RefreshTokenRequest`, etc.

3. **Error Handling**
   - API client throws errors with descriptive messages
   - Components should wrap auth methods in try-catch blocks
   - Failed token refresh triggers logout and clears state

**Configuration:**
- Port: 3000
- API URL: http://localhost:3001 (configurable via `NEXT_PUBLIC_API_URL`)
- React Compiler: Enabled (babel-plugin-react-compiler)
- Webpack: Explicitly enabled in dev/build scripts

## Authentication & Authorization

### JWT Tokens

**Access Token:**
- Expiration: 7 days (configurable via `JWT_EXPIRES_IN`)
- Managed by: `@nestjs/jwt` (JwtModule)
- Payload: `{ sub: userId, email, role }`

**Refresh Token:**
- Expiration: 30 days (configurable via `JWT_REFRESH_EXPIRES_IN`)
- Managed by: `jsonwebtoken` library directly
- Stored in: `refresh_tokens` table with userId and expiresAt
- Rotation: Old token deleted when refreshing

### Roles & Permissions

**ADMIN:**
- Full access to all resources
- User management (CRUD)
- Content management (CRUD all content)
- Can modify any user's role

**EDITOR:**
- Create, read, update, delete own content
- View published content from others
- Cannot manage users

**VIEWER:**
- Read-only access to published content
- Cannot create or modify content
- Cannot manage users

### Guards Usage

```typescript
@Controller('resource')
@UseGuards(JwtAuthGuard, RolesGuard)  // Apply both guards
export class ResourceController {

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR)  // Only ADMIN and EDITOR can access
  findAll(@CurrentUser() user: CurrentUserData) {
    // user object contains: { id, email, name, role }
  }
}
```

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user (default role: VIEWER) |
| POST | `/auth/login` | Public | Login and get access + refresh tokens |
| POST | `/auth/refresh` | Public | Refresh access token using refresh token |
| POST | `/auth/logout` | JWT | Invalidate refresh token |
| GET | `/auth/me` | JWT | Get current user profile |

### Users (`/users`)

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/users` | JWT | ADMIN | List all users |
| GET | `/users/:id` | JWT | ADMIN | Get user by ID |
| PATCH | `/users/:id` | JWT | ADMIN | Update user (name, role, isActive) |
| DELETE | `/users/:id` | JWT | ADMIN | Delete user |

### Content (`/content`)

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/content` | JWT | ADMIN, EDITOR | Create new content |
| GET | `/content` | JWT | ALL | List content (filtered by role permissions) |
| GET | `/content/:id` | JWT | ALL | Get content by ID (if allowed) |
| GET | `/content/slug/:slug` | JWT | ALL | Get content by slug (if allowed) |
| PATCH | `/content/:id` | JWT | ADMIN, EDITOR (own) | Update content |
| DELETE | `/content/:id` | JWT | ADMIN, EDITOR (own) | Delete content |

**Query Parameters for GET `/content`:**
- `status` - Filter by ContentStatus (DRAFT, PUBLISHED, ARCHIVED)
- `authorId` - Filter by author
- `categoryId` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## Database

### Prisma Schema

**Models:**

1. **User**
   - `id`, `email`, `password`, `name`, `role`, `isActive`
   - Roles: ADMIN, EDITOR, VIEWER (enum)
   - Relations: contents (one-to-many), refreshTokens (one-to-many)

2. **RefreshToken**
   - `id`, `token`, `userId`, `expiresAt`, `createdAt`
   - Unique token per user session
   - Cascade delete when user is deleted

3. **Category**
   - `id`, `name`, `slug`, `description`
   - Relations: contents (one-to-many)

4. **Content**
   - `id`, `title`, `slug`, `body`, `excerpt`, `status`, `publishedAt`
   - Status: DRAFT, PUBLISHED, ARCHIVED (enum)
   - Relations: author (User), category (Category)
   - `authorId` and `categoryId` foreign keys

**Enums:**
- `Role`: ADMIN, EDITOR, VIEWER
- `ContentStatus`: DRAFT, PUBLISHED, ARCHIVED

**Data Flow:**
1. Controllers inject abstract repository interfaces
2. Services contain business logic and permission checks
3. Repositories handle data access (Prisma)
4. PrismaService manages connection lifecycle

## Development & Testing

### Test Users (Seeded Data)

```
Admin:
  Email: admin@example.com
  Password: admin123

Editor:
  Email: editor@example.com
  Password: editor123

Viewer:
  Email: viewer@example.com
  Password: viewer123
```

### Example API Calls

**Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**List Content:**
```bash
curl -X GET "http://localhost:3001/content?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Create Content (ADMIN/EDITOR):**
```bash
curl -X POST http://localhost:3001/content \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Article",
    "slug": "my-article",
    "body": "Article content...",
    "status": "DRAFT"
  }'
```

## Environment Variables

### Backend (.env.development, .env.test, .env.production)

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="file:./dev.db"  # SQLite for dev
# DATABASE_URL="postgresql://user:pass@host:5432/db" # PostgreSQL for prod

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.development, .env.test, .env.production)

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Key Notes

### Backend

1. **Repository Pattern** - Always create abstract repository interface first, then Prisma implementation
2. **Module Registration** - New modules must be imported in `AppModule`
3. **Guards Order** - Apply `JwtAuthGuard` before `RolesGuard` (guards execute in order)
4. **Type Imports with Decorators** - Use separate imports: `import { X }` for decorators, `import type { Y }` for types
5. **Environment Variables** - Access via `process.env.*`, with fallback defaults for type safety
6. **Prisma Generate** - Run after schema changes; `start:dev` includes it automatically
7. **SQLite vs PostgreSQL** - Change `provider` in schema.prisma for production (SQLite → postgresql)
8. **Token Storage (Backend)** - Refresh tokens stored in DB for revocation; access tokens are stateless
9. **Permission Checks** - Content service checks permissions in business logic, not just at guard level
10. **Password Hashing** - Uses bcryptjs with salt rounds of 10

### Frontend

1. **"use client" Directive** - Required at top of any file using React hooks or browser APIs (useState, useEffect, localStorage, etc.)
2. **Middleware Limitation** - Next.js middleware runs on edge runtime and cannot access localStorage. Current implementation checks cookies as a workaround. For production, consider:
   - Setting httpOnly cookies on login/refresh (requires backend changes)
   - OR accept that middleware only provides basic protection (client-side AuthContext provides actual security)
3. **Token Refresh** - AuthContext automatically attempts token refresh when access token validation fails. Components should handle auth errors gracefully.
4. **Type-First Development** - Always update `types/auth.ts` before implementing new API methods
5. **API Client Extensions** - Use `apiClient.authenticatedRequest()` for new protected endpoints instead of duplicating auth header logic
6. **Protected Pages** - New protected pages must be added to `protectedRoutes` array in `middleware.ts`
7. **Environment Variables** - Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser (e.g., `NEXT_PUBLIC_API_URL`)
8. **SSR Considerations** - Authentication state is client-only. Use `isLoading` state from AuthContext before rendering protected content to avoid hydration mismatches

## Common Development Workflows

### Adding a New Protected API Endpoint (Backend)

1. Create DTO in appropriate module's `dtos/` folder
2. Add method to repository interface and Prisma implementation
3. Add method to service with permission checks
4. Add endpoint to controller with appropriate guards:
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   ```
5. Test endpoint with seeded user credentials

### Adding a New Protected Page (Frontend)

1. Create page component in `app/<route>/page.tsx`
2. Add `"use client"` directive if using hooks
3. Use `useAuth()` hook to access authentication state
4. Add route to `protectedRoutes` array in `middleware.ts`
5. Handle loading state while auth initializes:
   ```typescript
   const { isLoading, isAuthenticated } = useAuth();
   if (isLoading) return <div>Loading...</div>;
   ```

### Making Authenticated API Requests (Frontend)

1. Add TypeScript interfaces to `types/auth.ts` (or create new type file)
2. Add method to `ApiClient` class in `lib/api.ts`:
   ```typescript
   async getResource(accessToken: string, id: string) {
     return this.authenticatedRequest<Resource>(`/resource/${id}`, accessToken);
   }
   ```
3. Use in components via `useAuth()`:
   ```typescript
   const { accessToken } = useAuth();
   const data = await apiClient.getResource(accessToken!, id);
   ```

### Database Schema Changes

1. Edit `back/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <description>` (creates migration)
3. Prisma client auto-generates on `npm run start:dev`
4. Update repository interfaces and implementations
5. Run `npx prisma db seed` to refresh test data if needed

### Running Tests

```bash
# Backend unit tests
cd back && npm run test

# Backend E2E tests
cd back && npm run test:e2e

# Watch mode for TDD
cd back && npm run test:watch

# Coverage report
cd back && npm run test:cov
```

## Production Deployment

For production with PostgreSQL:

1. Update `back/prisma/schema.prisma` provider to "postgresql"
2. Set `DATABASE_URL` in `.env.production` to PostgreSQL connection string
3. Use `docker-compose.production.yml` (to be created)
4. Run migrations: `npx prisma migrate deploy`
5. Seed production data if needed
6. Set secure JWT secrets (min 32 characters)
7. Enable HTTPS and update CORS origins
8. Consider implementing httpOnly cookies for token storage (more secure than localStorage)
