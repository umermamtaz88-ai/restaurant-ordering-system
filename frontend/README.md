# Solenne Café — Premium Frontend

Frontend-only Next.js website for **Solenne Café**: a warm, luxury coffee house experience with menu browsing, cart/checkout UI, reservations, and full marketing pages. No mock APIs — local static data and client state, ready for backend integration.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion, Embla Carousel, Lucide React
- React Hook Form + Zod
- next-themes (light/dark, persisted)
- Sonner toasts
- clsx + tailwind-merge

## Installation

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, categories, menu, offers, about, gallery, testimonials, reservation, newsletter) |
| `/menu` | Full menu with search, filters, sort, grid/list |
| `/menu/[slug]` | Product detail |
| `/cart` | Cart + coupon + order summary |
| `/checkout` | Delivery/pickup + payment UI |
| `/about` | Story, team, timeline, achievements |
| `/gallery` | Masonry gallery + lightbox |
| `/testimonials` | Guest reviews |
| `/blog`, `/blog/[slug]` | Journal |
| `/reservation` | Table booking form |
| `/contact` | Map placeholder + contact form |
| `/login`, `/signup` | Auth UI (demo toasts) |
| `/profile` | Favorites + account shell |
| `/privacy`, `/terms` | Legal |
| 404 | Custom not-found |

## Architecture

```
src/
  app/           # Next.js routes
  components/    # ui, layout, sections, shared
  features/      # cart, menu, gallery, forms
  data/          # static menu, categories, content
  hooks/
  lib/           # theme, zod schemas
  types/
  constants/
  utils/
  styles/        # design tokens + theme
```

## Theme

Warm coffee palette (espresso, cream, latte, olive) with Fraunces + Outfit typography. Theme preference is stored via `next-themes` (`solenne-theme`). Cart/favorites persist in `localStorage`.

## Backend-ready

Forms validate with Zod and resolve with demo toasts — swap toasts for API calls. Cart context mirrors a typical cart API shape (`addItem`, `updateQuantity`, etc.). Menu data lives in `src/data/menu.ts` for easy replacement with fetchers.

## Production status

`npm run build` completes successfully. The frontend is production-ready for static/UI delivery and prepared for backend integration.
