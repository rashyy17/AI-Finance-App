# 💸 Cashy — AI-Powered Personal Finance Platform

A full-stack personal-finance web app for tracking accounts, transactions, and budgets, with an AI receipt scanner that turns a photo of a receipt into a structured transaction. Built on the Next.js App Router with server actions, a Prisma/PostgreSQL data layer, Clerk authentication, and background jobs via Inngest.

**Live demo:** [cashy-iota.vercel.app](https://cashy-iota.vercel.app)

> Note: the live demo runs on a shared free-tier database. Sign in with Clerk (Google/email) to create your own accounts and data.

---

## ✨ Features

- **Multiple accounts** — create current/savings accounts, set a default, and track per-account balances.
- **Transactions** — add income/expense entries with categories, dates, and descriptions; edit, delete, and bulk-delete.
- **AI receipt scanner** — upload a receipt image and Google Gemini extracts the amount, date, merchant, and a suggested category into a ready-to-save transaction.
- **Budgets** — set a monthly budget and track spending against it with progress indicators.
- **Recurring transactions** — mark a transaction as recurring (daily/weekly/monthly/yearly); a scheduled Inngest job creates the next occurrence automatically.
- **Dashboard & analytics** — overview cards plus Recharts visualizations of spending by category and over time.
- **Authentication** — full sign-in/sign-up and session handling via Clerk, enforced at the route level with Next.js middleware.
- **Polished UI** — shadcn/ui + Radix primitives, Tailwind CSS, dark mode, form validation with React Hook Form + Zod.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Actions, Turbopack), React 19 |
| Language | JavaScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | Clerk (`@clerk/nextjs`) |
| AI | Google Gemini (`@google/generative-ai`) for receipt parsing |
| Background jobs | Inngest (scheduled + event-driven functions) |
| UI | Tailwind CSS, shadcn/ui, Radix UI, Recharts, Lucide, Sonner, next-themes |
| Forms & validation | React Hook Form, Zod |
| Deployment | Vercel |

---

## 🏗️ Architecture

Cashy uses the Next.js App Router as a single full-stack framework rather than a separate API server:

- **Server Actions** (in `actions/`) hold the mutation logic — creating accounts, recording transactions, scanning receipts, updating budgets — and talk to the database directly through Prisma. This keeps data-access code on the server and out of the client bundle.
- **Prisma** (in `prisma/`) defines the data model and generates a type-safe client. `prisma generate` runs automatically on install via the `postinstall` script.
- **Clerk middleware** (`middleware.js`) protects application routes and exposes the signed-in user; server actions read the Clerk user to scope every query to the owner's data.
- **Inngest** (in `lib/`) runs the asynchronous work that shouldn't block a request — most importantly the scheduled job that materializes the next occurrence of recurring transactions.
- **Gemini** receives the receipt image and returns structured fields, which are validated with Zod before being written as a transaction.

```
Browser (React 19 / shadcn UI)
      │  server action call
      ▼
Next.js Server Action ──► Prisma ──► PostgreSQL
      │                         ▲
      │ receipt image           │ scheduled job
      ▼                         │
  Gemini (parse) ───► Zod ──► Transaction        Inngest (recurring txns)
```

---

## 🗂️ Data Model

The Prisma schema (`prisma/schema.prisma`) is the source of truth; at a high level:

- **User** — mapped to a Clerk user id; owns accounts, transactions, and budgets.
- **Account** — name, type, balance, and a default flag; has many transactions.
- **Transaction** — type (income/expense), amount, category, date, optional receipt URL, and recurring fields (interval + next-run date) for repeating entries.
- **Budget** — a per-user monthly budget amount.

Enums are used for transaction type, account type, and recurring interval so those values are constrained at the database level.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (e.g. Supabase or Neon)
- Accounts for [Clerk](https://clerk.com), [Google AI Studio](https://aistudio.google.com) (Gemini key), and [Inngest](https://www.inngest.com)

### 1. Clone and install

```bash
git clone https://github.com/rashyy17/AI-Finance-App.git
cd AI-Finance-App
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
# Database (Prisma)
DATABASE_URL="postgresql://..."      # pooled connection
DIRECT_URL="postgresql://..."        # direct connection, for migrations

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Google Gemini
GEMINI_API_KEY="..."

# Inngest (production keys; dev uses the Inngest CLI)
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."
```

> Match these names to the ones referenced in your code. Never commit `.env` — it's already covered by `.gitignore`.

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run

```bash
npm run dev                 # Next.js app on http://localhost:3000
npx inngest-cli@latest dev  # (separate terminal) Inngest dev server for background jobs
```

---

## 📌 Scope & Notes

This is a portfolio project built to learn the modern full-stack Next.js workflow — App Router, Server Actions, Prisma, and third-party integrations (auth, AI, background jobs) — end to end. A few things are deliberately scoped as a learning build:

- The AI receipt scanner depends on Gemini's parsing quality and is intended for common receipt formats, not edge cases.
- Budgets are simplified (a single monthly figure per user) rather than per-category budgeting.
- Analytics cover the core spending views rather than an exhaustive reporting suite.

---

## 📄 License

MIT
