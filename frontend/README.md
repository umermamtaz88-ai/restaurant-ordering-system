# OrderHub — Restaurant Admin Frontend

Premium restaurant ordering system dashboard built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Prerequisites

- Node.js 18+
- FastAPI backend running at `http://127.0.0.1:8000`

## Installation

```bash
npm install
```

## Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** — App Router
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling & design tokens
- **TanStack Query** — Server state management
- **TanStack Table** — Data tables
- **React Hook Form + Zod** — Form validation
- **Framer Motion** — Animations
- **Recharts** — Charts & analytics
- **Sonner** — Toast notifications
- **Lucide React** — Icons
- **next-themes** — Dark/light mode

## Backend Integration

All 36 API endpoints under `/api/v1` are integrated:

| Resource | Endpoints |
|----------|-----------|
| Dashboard | GET stats |
| Orders | CRUD + filters |
| Menu | CRUD + filters |
| Categories | CRUD + filters |
| Customers | CRUD + search |
| Coupons | CRUD + filters |
| Inventory | CRUD + filters |
| Reports | 7 report endpoints |

## Project Structure

```
app/                    # Next.js App Router pages
components/
  ui/                   # Reusable UI components
  layout/               # Sidebar, navbar, mobile nav
  shared/               # Status badges, loading states
hooks/                  # TanStack Query hooks
services/               # API service layer
types/                  # TypeScript types
lib/                    # Utilities & constants
providers/              # React providers
```

## Missing Backend Features

- **Authentication** — No auth endpoints in backend
- **Settings API** — Tax/delivery rates are backend-only via settings.json
- **Real-time notifications** — No WebSocket endpoints
