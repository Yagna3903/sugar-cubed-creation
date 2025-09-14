# Sugar Cubed Creation

Full-stack storefront for a home cookie business — **Next.js (App Router) + Prisma + Supabase Postgres**.  
Frontend & backend live in one repo. Orders are persisted; **Square** will handle payments (hosted checkout + webhooks).

> Sheridan College – CST (Information Systems Engineering) – Capstone (Winter–Fall 2025)

---

## Team

- **Yagna** — Database (Prisma/Supabase)
- **Shrey** — Backend (APIs, payments)
- **Aditya** — Deployment & PM (Vercel, CI/CD)
- **Reshmi** — Frontend / UI-UX

---

## Goal (MVP)

- Product catalog (SSR) + product detail
- Cart + checkout
- Orders stored in Postgres (status = `pending`)
- **Square** hosted checkout + webhook to mark orders **paid** and decrement stock
- (Post-MVP) Admin portal for products, inventory & order limits

---

## Tech Stack

**Frontend**
- Next.js (App Router), TypeScript
- Tailwind CSS (+ optional shadcn/ui)
- Client state: Zustand; Server Components for data fetching

**Backend (same repo)**
- Next.js Route Handlers under `app/api/*`
- **Prisma** ORM

**Database**
- **Supabase Postgres**
- Prisma migrations (versioned & committed)
- Prisma Studio for local DB UI

**Payments (planned)**
- **Square** (replaces earlier Stripe plan)

**Email (planned)**
- Resend (customer receipts, admin notifications)

**Hosting & Ops**
- Vercel (frontend + API)
- Supabase (DB & optional Storage)
- Optional: Sentry (errors), Plausible (analytics)

---

## Repository Structure

<img width="249" height="842" alt="Screenshot 2025-09-14 at 3 00 18 PM" src="https://github.com/user-attachments/assets/086a8802-16ce-4ae6-9261-2d5786721462" />




> Note: We use a **root `app/`** directory (no `src/`). Keep docs & paths consistent.

---

## Environment Variables

We use two env files:

- **`.env.local`** — runtime (Next.js dev & Vercel)
- **`prisma/.env`** — Prisma CLI (migrate / generate / Studio)

**Supabase (Postgres)**
```env
# .env.local (runtime)
DATABASE_URL="postgresql://postgres:<PWD>@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:<PWD>@db.<PROJECT-REF>.supabase.co:5432/postgres?sslmode=require"

# prisma/.env (CLI)
DATABASE_URL="postgresql://postgres:<PWD>@aws-1-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:<PWD>@db.<PROJECT-REF>.supabase.co:5432/postgres?sslmode=require"
```
- DATABASE_URL → pooled port 6543 (pgBouncer) for runtime/serverless
- DIRECT_URL → direct port 5432 for migrations/Studio
- Do not commit secrets. Rotate the Supabase DB password if shared.


## Square (to be set when wiring payments)
SQUARE_ACCESS_TOKEN=""
SQUARE_LOCATION_ID=""
SQUARE_WEBHOOK_SIGNATURE_KEY=""


## Optional
RESEND_API_KEY=""
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""


## Database Schema (Prisma)
### Core models (simplified):
<b>Product:</b> id, slug (unique), name, priceCents, imageUrl, badges (string[]), description, active, timestamps  
<b>Inventory:</b> productId (1:1), stock, maxPerOrder  
<b>Order:</b> id, email, customerName, status ("pending" → "paid"), totalCents, timestamps  
(to add for Square: squareCheckoutId, squareOrderId, squarePaymentId)  
<b>OrderItem:</b> orderId, productId, qty, unitPriceCents  

<b>Indexes:</b>
Unique Product.slug  
Index on Order.createdAt  
Schema is defined in code <b>(prisma/schema.prisma)</b> and applied to Supabase via <b>prisma migrate</b>. Avoid manual table edits in the Supabase UI.

## Getting Started (Local)
### 0) Install & run
```
npm install
npm run dev
# http://localhost:3000
```
## 1) Migrate the database
```
# ensure prisma/.env has both DATABASE_URL and DIRECT_URL
npx prisma migrate dev --name init_schema
```
## 2) Seed (DEV ONLY)
Open once in your browser:
```
http://localhost:3000/api/dev/seed
```
Expected response: { "ok": true, "count": 5 }  

## 3) Test the flow
- /shop → products load from DB (SSR via server helpers)
- Add to cart → /checkout → enter name/email → submit
- Redirects to /checkout/success (pre-Square)
- Inspect DB:
```
npx prisma studio
```
See Order and OrderItem rows.  
Orders are pending until Square is wired (webhook will mark paid + decrement stock).  

## How Data Flows
- /shop and /product/[slug] → server components → call Prisma via lib/server/products.ts (no API hop).
- /checkout (client) → POST /api/orders:
1. Zod validation (lib/server/validators.ts)
2. Fetches product prices from DB (authoritative), computes total
3. Creates Order + OrderItem rows via Prisma
4. Returns a success URL to redirect the browser
- /api/dev/seed (dev-only) upserts demo products (from lib/data.ts) into DB.


## Product Images
Place files in public/images/ and set Product.imageUrl (e.g., /images/holiday-vanilla.jpg).
The seed uses placeholders — update via Prisma Studio or a future Admin UI.  

## Payments — Square (Next Milestone)
Add:
- POST /api/payments/square/checkout — create a hosted checkout link (Square), store checkout/order IDs
- POST /api/webhooks/square — verify signature, mark order paid, decrement inventory, (optional) send receipt via Resend
<b>Required env</b>: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_WEBHOOK_SIGNATURE_KEY.
---
## Deploying to Vercel
1. Add env vars in Vercel → Project Settings → Environment Variables:
- DATABASE_URL (pooled 6543) + Square/Resend keys when ready
2. Run DB migrations from local/CI (using DIRECT_URL):
```
npx prisma migrate deploy
```
3. Push to main → Vercel builds & deploys.
---

## Scripts
```
npm run dev                 # start Next.js (dev)
npm run build               # build
npm run start               # run production build locally
npx prisma generate
npx prisma migrate dev --name <name>
npx prisma migrate reset    # DEV ONLY: drops & reapplies
npx prisma studio           # DB UI
```
---
## Roadmap
```
 Next.js app shell + UI
 Supabase Postgres + Prisma (migrations, seed)
 Orders API (DB-backed)
 /shop loads products from DB
 Square hosted checkout + webhook → mark paid + decrement stock
 Admin portal (Products/Inventory/Orders) with auth (NextAuth)
 Email receipts (Resend)
 Monitoring (Sentry) & analytics (Plausible)
 SEO & accessibility pass
 Staging project + UAT + launch
```
---

## FAQ
### Are we using Supabase or Prisma?
Both. Supabase hosts Postgres; Prisma is the ORM and migrations layer. Prisma connects to your Supabase DB via the URLs in env files.  
### Why two DB URLs?
```
DATABASE_URL (pooled :6543) for runtime/serverless.
DIRECT_URL (direct :5432) for migrations/Studio (avoids pgBouncer issues).
```
### Why do orders say “pending”?
Pre-Square. The Square webhook will set orders to paid after successful checkout and adjust inventory.  

---
## Contributing
- Branches: feat/*, fix/*, chore/*, docs/*
- Small PRs; at least one reviewer; CI must be green
- No commits directly to main
