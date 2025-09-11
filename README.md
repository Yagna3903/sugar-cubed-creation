# Sugar Cubed Creation
Capstone project for Sheridan College - Sugar Cubed Creation. A Full Stack application for Cookie based home business. Winter-Fall 2025.

---

# 🍪 Sugar Cubed Creation – Full Project Plan (2-Month Capstone)

**Team:**  
- **Yagna** – Database Engineer  
- **Shrey** – Backend Developer  
- **Aditya** – Deployment Engineer & PM  
- **Reshmi** – Frontend / UI-UX  

**Goal:** Launch a production-ready, mobile-first cookie storefront with an **admin portal** for product, price, and inventory management; **order limits**; **Stripe** payments; **email receipts** (customer) and **order notifications** (owner).

---

## 1) Tech Stack (To be finalized soon)

### Frontend (Reshmi)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms & Validation:** React Hook Form + Zod
- **Images:** next/image + Supabase Storage (or Cloudinary later)
- **State:** Server Actions + local state

### Backend (Shrey)
- **Runtime:** Next.js API Routes + Server Actions (same repo as frontend)
- **ORM:** Prisma
- **Auth:** NextAuth.js (Email sign-in; Google OAuth optional)
- **Payments:** Stripe Checkout + Webhooks (order confirmation, receipts)
- **Email:** Resend (customer receipt + admin order notification)

### Database (Yagna)
- **DB:** PostgreSQL (Supabase managed)
- **Schema:** Prisma Migrations (versioned)
- **Storage:** Supabase Storage (product images)

### Deployment & PM (Aditya)
- **Hosting:** Vercel (Next frontend + API)
- **DB/Auth/Storage:** Supabase (dev/staging/prod projects)
- **Monitoring:** Sentry (errors) + Plausible (analytics)
- **Project Mgmt:** Trello (Backlog → Sprint Ready → To-Do → In Progress → PR/Code Review → Testing/QA → Done)
- **Version Control:** GitHub (Issues, PRs, Actions)

---

## 2) High-Level Architecture

```
Browser (Customer/Admin)
   │
   ▼
Next.js (SSR/ISR pages, Server Actions, API routes) ── Stripe Checkout
   │                                   │
   │                           Webhook listener
   ▼                                   ▼
PostgreSQL (Supabase) <── Prisma ── Payments, Orders, Inventory
   │
   └─ Supabase Storage (images)
```

- **Single repo, single deploy**: Frontend + backend together → fast iteration, fewer moving parts.
- **Security**: Admin routes protected by role-based access via NextAuth.
- **Stripe Checkout**: Handles card data securely (reduced PCI scope).
- **Email**: Resend sends customer receipt + admin “new order” alert.

---

## 3) Repository Structure (Single Repo)

```
sugar-cubed-creation/
├─ .github/
│  ├─ workflows/ci.yml                # Lint, Typecheck, Test, Build
│  └─ ISSUE_TEMPLATE/
│     ├─ bug.yml
│     └─ feature.yml
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ src/
│  ├─ app/                            # Next.js (App Router)
│  │  ├─ (public)/
│  │  │  ├─ page.tsx                  # Home
│  │  │  ├─ products/                 # listing + filter
│  │  │  ├─ product/[slug]/           # details
│  │  │  ├─ cart/
│  │  │  ├─ checkout/
│  │  │  └─ contact/
│  │  ├─ (admin)/                     # protected via role
│  │  │  ├─ products/
│  │  │  ├─ orders/
│  │  │  └─ inventory/
│  │  ├─ api/
│  │  │  └─ stripe/webhook/route.ts
│  ├─ components/
│  ├─ lib/                            # db.ts, auth.ts, stripe.ts, validators
│  ├─ styles/
│  └─ types/
├─ public/
├─ tests/                             # Playwright e2e
├─ scripts/                           # seed.ts, backup.ts (optional)
├─ .env.example
├─ package.json
└─ README.md
```

---

## 4) Environments & Keys

- **Environments:** `development`, `staging`, `production`
- **Supabase:** create 3 projects (dev/staging/prod)
- **Vercel:** each PR → Preview URL; `main` → staging; tagged release → production

**.env.example**
```
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Supabase Storage
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email
RESEND_API_KEY=
```

---

## 5) Data Model (Practical ERD)

**User**(id, name, email, role[admin|customer], createdAt)  
**Product**(id, name, slug, description, price, active, createdAt, updatedAt)  
**ProductImage**(id, productId, url, alt, sortOrder)  
**Category**(id, name, slug)  
**ProductCategory**(productId, categoryId)  
**Variant**(id, productId, name, priceDelta, sku) *(optional; start simple)*  
**Inventory**(id, productId, stock, maxPerOrder)  
**Cart**(id, userId? | sessionId)  
**CartItem**(id, cartId, productId, qty)  
**Order**(id, userId?, email, firstName, lastName, phone, address?, total, status[pending|paid|fulfilled|cancelled], pickupOrDelivery, pickupDate?, createdAt)  
**OrderItem**(id, orderId, productId, qty, unitPrice)  
**Payment**(id, orderId, provider[stripe], providerRef, amount, status[succeeded|failed|refunded], createdAt)  
**AuditLog**(id, actorId, action, entity, entityId, diff, createdAt)

**Notes**
- Enforce **maxPerOrder** in both UI and server (do not rely on UI alone).
- Index: `Product.slug`, `Category.slug`, `Order.createdAt`.
- Soft-delete for products optional; start with `active` flag.

---

## 6) Feature Details

### Customer Flow
1. Browse products (SSR/ISR for SEO and speed).  
2. Product page → add to cart (respect `maxPerOrder` and `stock`).  
3. Checkout form **collects**: first name, last name, phone, email, address (if delivery), pickup/delivery.  
4. Stripe Checkout (test mode → prod).  
5. On payment success (webhook): create Payment, set Order `paid`.  
6. Emails:
   - **Customer**: receipt + line items + total.
   - **Admin/Owner**: “New Order” with summary.

### Admin Portal
- **Auth + Role**: Only admins access `(admin)` routes.  
- **Products**: create/edit/delete; upload photos; toggle active; change price.  
- **Inventory**: set stock + `maxPerOrder` (e.g., 12).  
- **Orders**: table view, status filters, mark fulfilled/cancelled; notes.  
- **Audit Log**: track changes (price edits, stock updates).

**Validation (Zod + server checks)**
- Phone, email formats; minimum/maximum qty; disallow 0 or negative values.
- Rate limit order creation and login attempts.

---

## 7) 2-Month Timeline (8 Weeks)

> Each “week” is a mini-sprint. Use Trello for tickets. Keep PRs small (1–3 files ideally).

### Week 1 – Foundations
- Repo init (Next.js + TS + Tailwind + shadcn/ui)
- Supabase dev project; Prisma setup; first migration (User, Product, ProductImage, Inventory)
- NextAuth (email) + role field; protect `/admin`
- CI: GitHub Actions for lint, typecheck, build
- Vercel deployment (preview URLs)

**Owners:** All; Aditya sets CI/CD.  
**Deliverable:** Deployed skeleton, auth working, DB connected.

### Week 2 – Core Storefront
- Product listing page (SSR) + pagination
- Product detail page (SSR): images + description + price
- Seed script with 6–8 demo products
- Basic cart (cookie or session-based)

**Owners:** Reshmi (UI), Yagna (seed/DB), Shrey (server actions)

### Week 3 – Checkout + Payments
- Checkout form (name, phone, email, pickup/delivery + address)
- Stripe Checkout integration (test keys)
- Webhook to mark payment → create `Payment`, update `Order` to `paid`
- Email receipts via Resend (customer + admin)

**Owners:** Shrey (Stripe/webhook), Reshmi (form), Aditya (webhook secret/env)

### Week 4 – Admin Portal (Products)
- Admin dashboard shell (layout, nav, auth guard)
- CRUD: Add/edit/delete product; toggle active; upload images
- Price edits with inline validation + toasts
- Audit logging for admin actions

**Owners:** Reshmi (UI), Shrey (APIs), Yagna (schema for audit log)

### Week 5 – Inventory & Limits
- Inventory table UI: set `stock` + `maxPerOrder`
- Enforce limits in server actions + cart/checkout
- Orders admin list: filter by status; detail view

**Owners:** Shrey (server), Reshmi (admin UI), Yagna (indexes/queries)

### Week 6 – QA, Accessibility, SEO
- Playwright e2e: browse → add to cart → pay (mock webhook)
- Lighthouse ≥ 90; alt text, keyboard nav, color contrast
- SEO: sitemap.xml, robots.txt, Open Graph meta
- Error monitoring (Sentry), analytics (Plausible)

**Owners:** All; Aditya wires monitoring

### Week 7 – Staging & Owner UAT
- Set up staging env (separate Supabase + Vercel project)
- Import real product photos & text
- Owner training: add product, change price, set limits
- Fix critical bugs from UAT

**Owners:** All

### Week 8 – Launch
- Production env, domain, TLS
- Backup/restore drill (Supabase)
- Final security pass: rate limiting, input sanitization
- Handoff docs + support playbook

**Owners:** Aditya (infra), All (polish)

---

## 8) GitHub – Team Workflow (Not just Aditya)

### Branching
- **Main rule:** Short-lived feature branches; merge early & often.
- **Prefixes:** `feat/*`, `fix/*`, `chore/*`, `docs/*`, `test/*`
  - e.g., `feat/checkout-form`, `fix/stripe-webhook-retry`

### Commits (Conventional)
- `feat: add product detail page`
- `fix: correct order total calculation`
- `chore: update deps`
- `docs: add admin handbook`

### Pull Requests
- **PR Template includes:**
  - Summary, Changes, Screenshots, Testing, Checklist
- **Review:** At least 1 reviewer (owner of the area via CODEOWNERS).
- **CI Checks:** Lint, typecheck, build, e2e smoke must pass.
- **Preview:** Vercel preview link auto-attached.

### Issues
- Create from Trello card title + link back to card.
- Use labels: `frontend`, `backend`, `database`, `devops`, `priority-high`, `bug`
- Include **acceptance criteria** and **definition of done**.

### Protections & Ownership
- **Branch protection:** Require PR + passing checks for `main`.
- **CODEOWNERS** (example):
  - `/prisma/*` @Yagna
  - `/src/app/api/*` @Shrey
  - `/src/app/(admin)/*` @Reshmi
  - `/.github/workflows/*` @Aditya

### Daily Dev Flow (All Members)
1. `git checkout main && git pull --rebase`
2. `git checkout -b feat/<ticket-name>`
3. Code + commit (small commits)
4. Push branch → Open PR (link Trello card)
5. Request review → Fix comments
6. Merge when green → Vercel deploys automatically

**If you diverge:**  
- `git switch main && git pull --rebase`  
- `git switch your-branch && git rebase main`  
- Resolve conflicts → continue.

---

## 9) Security, Privacy, & Limits

- **Order Limits:** Enforce `Inventory.maxPerOrder` in server actions and Stripe session creation. Never trust client values.
- **Stock Control:** Decrement stock after successful payment (webhook). Prevent oversell by re-checking stock before creating Stripe session.
- **Auth:** Protect admin routes; use `role: "admin"`; consider email-based 2FA later.
- **Inputs:** Validate with Zod + server checks (phone, email, qty, price >= 0).
- **Secrets:** Only in Vercel/Supabase env vars; never commit to Git.
- **Logging:** Don’t log PII or secrets. Use Sentry for error context (scrub data).
- **PCI:** Use Stripe Checkout (hosted) to avoid handling raw card data.

---

## 10) Testing Strategy

- **Unit (Jest + Testing Library):** utilities, components, price calc.
- **Integration:** API route handlers, server actions with mocked Prisma.
- **E2E (Playwright):** happy path: list → detail → cart → checkout (mock payment).
- **Performance:** Lighthouse CI; image optimization via next/image.
- **Smoke on PR:** minimal Playwright run on key flows.

---

## 11) Admin UX Guidelines

- Inline edits for price/active flags with instant feedback.
- Drag-and-drop image upload; reorder gallery.
- Clear stock + `maxPerOrder` controls per product.
- Order list filters: status, date; export CSV (optional).
- Toasts for success/error; optimistic updates with rollback on error.

---

## 12) Owner Handoff & Support

- **Training:** Add/edit product, set price, upload photos, change stock/limits, view orders.
- **Playbook:** Refunds (Stripe Dashboard), resending receipts, editing order notes.
- **Backups:** Verify Supabase daily backups; monthly export to cold storage.
- **Access:** Document who has which roles and platform access.

---

## 13) Optional Enhancements (Post-Launch)

- Coupons & seasonal banners
- Abandoned cart emails
- Reviews (admin-approve)
- Delivery zones + fee
- Cloudinary for advanced image transformation
- Admin analytics dashboard (revenue, top products)

---

## 14) Quick Start (Commands)

```bash
# Setup
pnpm i
cp .env.example .env.local

# DB
pnpm prisma migrate dev
pnpm prisma db seed

# Dev
pnpm dev
```

**Daily:** `git pull --rebase`, then branch for your ticket.  
**Always open a PR** (no commits to main).

---

## 15) Definition of Done (per ticket)

- Acceptance criteria met
- Code reviewed & merged (CI green)
- Tests updated/passing; e2e happy path unaffected
- Accessible UI (labels, keyboard nav)
- Docs updated (README / Trello card notes)
- Staging verified (for user-facing changes)

---

### ✅ Summary

- **Stack:** Next.js full-stack + Prisma + Supabase + Stripe + Resend + Vercel
- **Scope:** Customer storefront, admin portal (pricing, inventory, order limits), payments, emails
- **Plan:** 8 weeks, weekly milestones with clear owners
- **Process:** Trello for tasks, GitHub for code, small PRs, preview deploys
- **Outcome:** Production-ready cookie shop with maintainable codebase and clean ops

---
## ⚡ How Components Integrate

1. **Frontend → Backend:**  
   - User submits order via React form → validated with Zod → API call.  
2. **Backend → Database:**  
   - API routes call Prisma to read/write in Supabase PostgreSQL.  
3. **Backend → Stripe/Email:**  
   - Stripe Checkout session created → on success, webhook stores order → Resend sends receipt.  
4. **Admin Panel:**  
   - Separate admin route (`/admin`) protected by NextAuth.js (role-based access).  
   - Admin can add/remove products, update prices, manage inventory, and set max order limits.  
5. **Deployment:**  
   - Vercel hosts frontend + backend (serverless).  
   - Supabase hosts database + authentication + storage.  

---

## 🌐 Hosting & Deployment

1. **Vercel Setup**  
   - Repo connected to Vercel → every push to `main` triggers redeploy.  
   - Add environment variables (Stripe keys, Supabase URL/keys, Resend API).  

2. **Supabase Setup**  
   - Create Supabase project → get API keys.  
   - Connect Prisma to Supabase (via connection string).  
   - Enable Auth & Storage.  

3. **Stripe Setup**  
   - Create products in Stripe dashboard.  
   - Use webhooks to confirm payment and store order in DB.  

4. **Resend Setup**  
   - Configure email templates for **order receipts** & **admin notifications**.  

---

## 🔀 GitHub Workflow (Collaboration Rules)

Since Yagna is **repo owner**, he controls merging to `main`.  
All work must go through **branches + PRs**.

### ✅ Rules
- `main` → Always production-ready.  
- `dev` → Integration branch (optional).  
- Feature branches → Each developer creates a branch from `dev` or `main`.  

**Branch naming convention:**  
- `feature/frontend-navbar`  
- `feature/backend-orders-api`  
- `feature/database-schema-orders`  
- `fix/bug-cart-calculation`  

### 👨‍💻 Process
1. Pull latest `main` or `dev`.  
2. Create a new branch:  
   ```bash
   git checkout -b feature/frontend-navbar
   ```  
3. Do the work → commit changes with meaningful messages.  
4. Push branch:  
   ```bash
   git push origin feature/frontend-navbar
   ```  
5. Open a Pull Request (PR) → assign reviewer (at least 1 teammate).  
6. Reviewer checks code → add comments if needed.  
7. Yagna (Repo Owner) gives **final approval** → merges into `main`.  

**Note:** Never push directly to `main`.  

### 🔎 Code Review Checklist
- Code runs without breaking existing features.  
- Naming conventions followed.  
- No sensitive info (API keys) in commits.  
- Proper comments & documentation.  
- Unit tested if possible.  

---

## Deployment Guide for CorporateInquiryPage (Next.js + Web3Forms)

### Step 1: Create Web3Forms Access Key
1. Go to [Web3Forms](https://web3forms.com/) and sign up / log in.
2. Navigate to your dashboard and create a new access key.
3. Copy the key — it will be used in your project.

### Step 2: Create Environment File
1. In your Next.js project root, create `.env.local` (if it is not already created):
```bash
touch .env.local

Add your Web3Forms key:

NEXT_PUBLIC_WEB3FORMS_KEY=your-web3forms-key-here


NEXT_PUBLIC_ is required because the key will be used in client-side code.

-------
### Make sure .env.local is added to .gitignore:

.env.local

### Step 3: Update Your Code to Use the Env Variable

In CorporateInquiryPage.tsx (or .jsx), replace the hardcoded key with:

formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");

## Step 4: Test Locally

1. Run your project locally:
```bash
npm run dev

Fill out the form and submit.

Confirm that the submission works and you receive the confirmation email.

Step 5: Prepare for Deployment
If deploying on Vercel (or another hosting service):
1.	Go to Project Settings → Environment Variables.
2.	Add:
o	Key: NEXT_PUBLIC_WEB3FORMS_KEY
o	Value: Your Web3Forms key
3.	Redeploy the project.
The deployed app will now use the environment variable securely.
________________________________________
Step 6: Push Code to Git
1.	Make sure .env.local is not committed.
2.	Push your code:
git add .
git commit -m "Prepare CorporateInquiryPage for deployment"
git push
3.	The API key remains safe because it’s only in .env.local and on your deployment environment.
________________________________________
✅ Step 7: Verify Deployment
1.	Open your deployed site.
2.	Submit the form and confirm:
o	The form sends successfully.
o	Confirmation email is received.
