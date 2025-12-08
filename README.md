# 🍪 Sugar Cubed Creations

### A Modern, Full-Stack E-Commerce Platform for Custom Cookies

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Square](https://img.shields.io/badge/Square_Payments-3E4348?style=for-the-badge&logo=square&logoColor=white)

---

## 🚀 Live Demo & Repo

- **🌍 Live Website:** [https://sugar-cubed-creations.vercel.app/](https://sugar-cubed-creations.vercel.app/)
- **💻 GitHub Repository:** [https://github.com/Yagna3903/sugar-cubed-creations](https://github.com/Yagna3903/sugar-cubed-creations)

---

## � Project Structure

A high-level overview of the repository's layout:

```text
sugar-cubed-creations/
├── app/                  # Next.js App Router (Frontend + API)
│   ├── api/              # Backend API Routes (Serverless Functions)
│   │   ├── orders/       # Order Creation & Management
│   │   └── webhooks/     # Square Payment Webhooks
│   ├── admin/            # Secure Admin Dashboard
│   ├── checkout/         # Checkout Logic & Success Pages
│   └── (routes)/         # Public Pages (Home, Shop, Product Details)
├── components/           # Reusable React UI Components
│   ├── admin/            # Admin-specific Components
│   ├── emails/           # React Email Templates
│   └── ui/               # Shared Design System Elements
├── lib/                  # Core Application Logic
│   ├── server/           # Server-Only Logic (DB Access, Payments)
│   ├── supabase/         # Supabase Client Configuration
│   ├── cart-store.ts     # Global Cart State (Zustand)
│   └── email.ts          # Email Sending Utility
├── prisma/               # Database Schema & Migrations
│   └── schema.prisma     # The Source of Truth for Data Models
├── public/               # Static Assets (Images, Logos)
└── tests/                # Unit & Integration Tests (Vitest)
```

## 🧭 Codebase Map

Where to find the key logic for the "Elite" tech stack:

| Logic | File Path | Description |
| :--- | :--- | :--- |
| **Database Schema** | [`prisma/schema.prisma`](prisma/schema.prisma) | Defines `Product`, `Order`, `User` models. |
| **API Endpoints** | [`app/api/`](app/api/) | Rest API for Orders, Payments, and Admin actions. |
| **State Management** | [`lib/cart-store.ts`](lib/cart-store.ts) | Zustand store for managing the Shopping Cart. |
| **Payment Webhook** | [`app/api/webhooks/square`](app/api/webhooks/square/route.ts) | Handles Square payment success/failure events. |
| **Email Templates** | [`components/emails/`](components/emails/) | JSX-based email templates (Order Confirmation, etc). |
| **Auth Middleware** | [`middleware.ts`](middleware.ts) | Protects `/admin` routes using Supabase Auth. |

---

## �📖 About The Project

**Sugar Cubed Creations** is a Capstone Project designed to transform a manual home-baking business into a scalable, automated digital platform.

The existing business operated entirely through Instagram DMs, leading to communication bottlenecks, disorganized orders, and a lack of brand presence. Our solution provides a **modern storefront** that automates order intake, inventory management, and payments, allowing the client to focus on baking rather than administration.

### ✨ Key Features

*   **🛍️ Dynamic Product Catalog:** Server-Side Rendered (SSR) shop page with filtering and real-time inventory.
*   **🛒 Shopping Cart with State Management:** Powered by **Zustand** for a seamless, instant user experience.
*   **💳 Secure Payments:** Full integration with **Square API** for processing real credit card transactions.
*   **🔒 Type-Safe Database:** **Prisma ORM** coupled with **Supabase (PostgreSQL)** ensures data integrity.
*   **🛡️ Robust Validation:** **Zod** schemas utilized throughout to prevent invalid data entry and ensure security.
*   **📧 Automated Notifications:** Transactional emails sent via **Resend** and **Nodemailer** integration.
*   **📱 Responsive UI:** Mobile-first design using **Tailwind CSS**.

---

## 🛠️ The "Elite" Tech Stack

| Component | Technology | Why we chose it |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Best-in-class SEO and Server Components. |
| **Styling** | **Tailwind CSS** | Rapid UI development and consistent design system. |
| **State** | **Zustand** | Lightweight, predictable global state management. |
| **Validation** | **Zod** | Strict schema validation for forms and API routes. |
| **Database** | **Supabase (PostgreSQL)** | Scalable, real-time relational database hosting. |
| **ORM** | **Prisma** | Type-safe database queries and schema migrations. |
| **Payments** | **Square API** | Trusted, secure payment processing for small businesses. |
| **Email** | **React Email / Resend** | Modern tools for designing and sending transactional emails. |
| **Deployment** | **Vercel** | Seamless CI/CD and edge network performance. |

---

## 👨‍👩‍👧‍👦 The Team

**Sheridan College – Capstone Project (2025)**

*   **Yagna Patel** - *Lead Full-Stack Developer & Database Architect*
*   **Shrey Jani** - *Backend Development & Testing Lead*
*   **Reshmi Patel** - *Frontend Developer & UI/UX Design*
*   **Aditya Dave** - *Project Manager & Deployment Coordinator*

---

## ⚡ Getting Started (Run it Locally)

Follow these instructions to run the project on your local machine.

### Prerequisites
*   Node.js 18+
*   npm

### 1. Clone the Repo
```bash
git clone https://github.com/Yagna3903/sugar-cubed-creations.git
cd sugar-cubed-creations
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory. You will need keys for Supabase and Square (see `prisma/.env` for DB connection).

```env
# Example .env.local
DATABASE_URL="your_supabase_pooled_connection_string"
DIRECT_URL="your_supabase_direct_connection_string"

# Square Payments
NEXT_PUBLIC_SQUARE_APPLICATION_ID="your_square_app_id"
NEXT_PUBLIC_SQUARE_LOCATION_ID="your_square_location_id"
SQUARE_ACCESS_TOKEN="your_square_access_token"
```

### 4. Run Database Migrations
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start the Server
```bash
npm run dev
```
Visit `http://localhost:3000` to see the app in action!

---

## 🧪 Testing

We use **Vitest** for unit testing.
```bash
npm run test
```

---

*Built with ❤️ by the Sugar Cubed Team.*
