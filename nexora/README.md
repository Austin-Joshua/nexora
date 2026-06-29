# Nexora — Communication Intelligence Platform

> AI-powered email intelligence for college students. Sits above Gmail, classifies emails, surfaces deadlines, extracts action items, and answers natural language questions about your inbox.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| State | Zustand + TanStack Query |
| Backend | Spring Boot 3 + Java 17 |
| Database | MySQL |
| AI | Claude API (claude-sonnet-4-5) |
| Email | Gmail API (read-only) |
| Real-time | WebSocket (STOMP) |

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL running locally
- Google Cloud project with Gmail & Calendar APIs enabled
- Anthropic API key

### 1. Database Setup
```sql
CREATE DATABASE nexora_db;
```
Spring Boot auto-creates all tables via `ddl-auto: update`.

### 2. Backend
```bash
cd nexora/backend
cp .env.example .env   # fill in your secrets
# Set env vars or edit application.yml directly
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 3. Frontend
```bash
cd nexora/frontend
cp .env.example .env.local   # fill in your Google Client ID
npm install
npm run dev
# Runs on http://localhost:5173
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **Gmail API** and **Google Calendar API**
3. Create **OAuth 2.0 Credentials** (Web Application)
4. Add Authorized Redirect URI: `http://localhost:8080/api/auth/google/callback`
5. Copy Client ID and Secret into your env files

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/auth/google/callback | No | OAuth callback — returns JWT |
| GET | /api/auth/me | JWT | Current user |
| PUT | /api/auth/profile | JWT | Update role |
| GET | /api/emails | JWT | List with filters |
| GET | /api/emails/{id} | JWT | Email detail |
| POST | /api/emails/sync | JWT | Manual sync |
| GET | /api/emails/categories | JWT | Category counts |
| POST | /api/brain/query | JWT | Natural language Q&A |
| GET | /api/brain/history | JWT | Past conversations |
| GET | /api/dashboard/summary | JWT | Full summary |
| GET | /api/notifications | JWT | Notifications |
| WS | /ws | JWT | Real-time push |

## Project Structure

```
nexora/
├── frontend/          # Vite + React + TypeScript + Tailwind
│   └── src/
│       ├── api/       # Axios API modules
│       ├── components/# Layout, email, brain, notifications
│       ├── hooks/     # useAuth, useEmails, useBrain, useWebSocket
│       ├── pages/     # Landing, Onboarding, Dashboard, Inbox, Brain, Settings
│       ├── store/     # Zustand stores (auth, email, notification)
│       ├── types/     # TypeScript type definitions
│       └── utils/     # Date formatting, category colors, priority utils
└── backend/           # Spring Boot 3 + Java 17
    └── src/main/java/com/nexora/
        ├── config/    # Security, WebSocket, Gmail, Claude
        ├── controller/# Auth, Email, Brain, Dashboard, Notification
        ├── service/   # Auth, GmailSync, Classification, Brain, Notifications
        ├── model/     # JPA entities (User, Email, EmailAction, BrainConversation, Notification)
        ├── repository/# Spring Data JPA repositories
        ├── security/  # JWT provider, auth filter, token encryptor
        └── scheduler/ # Email sync + daily notifications
```

## Security Features

- AES-256 encryption for Gmail tokens at rest
- JWT authentication with 24h expiry
- CORS restricted to known origins
- Rate limiting on Brain queries (20/hour)
- Gmail read-only scope only
- User data isolation — every query scoped to authenticated userId

## Deployment

- **Frontend**: Deploy `nexora/frontend` to [Vercel](https://vercel.com)
- **Backend**: Deploy `nexora/backend` to [Railway](https://railway.app) or [Render](https://render.com)
- **Database**: [Railway MySQL](https://railway.app) or [PlanetScale](https://planetscale.com)

Set environment variables in your hosting platform matching `.env.example`.
