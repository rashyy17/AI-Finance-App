# Cashy — AI-Assisted Personal Finance Tracker

A full-stack personal finance web app for tracking income and expenses across multiple accounts, with monthly budgets, spending charts, and an **AI-powered receipt scanner** that auto-fills transactions from a photo.

Built with **Next.js 15 (App Router)**, **Prisma + PostgreSQL**, **Clerk** authentication, and **Google Gemini** for receipt parsing.

---

## Features

- **Authentication** — email/social sign-in via Clerk; each user's data is scoped to their account.
- **Accounts** — create multiple accounts (current/savings), set a default, track per-account balances.
- **Transactions** — add, edit, and delete income/expense transactions; balances update atomically with each change.
- **Transaction table** — search, filter (by type/recurring), sort, and bulk-delete transactions.
- **Budgets** — set a monthly budget and track spending against it with a live progress bar.
- **Charts** — per-account income vs. expense bar chart with selectable date ranges (Recharts).
- **AI receipt scanner** — upload a receipt photo and Google Gemini extracts the amount, date, merchant, and category to pre-fill the transaction form.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Backend logic | Next.js Server Actions |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Clerk |
| AI | Google Generative AI (Gemini) — receipt image → structured data |
| UI | Tailwind CSS, shadcn/ui (Radix primitives), Recharts |
| Forms & validation | React Hook Form + Zod |

---

## How it works

- **Server Components** fetch data directly from the database on the server; **Client Components** handle interactivity.
- **Server Actions** (in `actions/`) handle all mutations — there is almost no separate API layer.
- On first sign-in, a Clerk user is synced into the app's own `users` table, and every server action re-checks auth and scopes queries to that user.
- Transaction writes and the corresponding account-balance update run inside a single database transaction so balances stay consistent.
- The receipt scanner sends the image to Gemini with a prompt requesting structured JSON, then parses the result and populates the form fields.

---

## Data model (Prisma)

`User` → many `Account` → many `Transaction`, plus one `Budget` per user. Money is stored as `Decimal` and converted to a number at the client boundary. Foreign keys are indexed and use cascade deletes.

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables in .env
#    DATABASE_URL / DIRECT_URL      (PostgreSQL)
#    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
#    GEMINI_API_KEY

# 3. Apply the database schema
npx prisma migrate deploy

# 4. Run the dev server
npm run dev
```

App runs at `http://localhost:3000`.

---

## Status & notes

This is a learning project focused on building a complete, authenticated, database-backed full-stack app with a practical AI feature.

- The core flows (auth, accounts, transactions, budgets, charts, and the receipt scanner) are functional.
- Some fields exist in the schema for **recurring transactions** and **budget alerts**; the background-job wiring (Inngest) for automatically processing these is scaffolded but not fully implemented.

---

## Acknowledgements

Built while learning modern full-stack development with Next.js. UI components are based on [shadcn/ui](https://ui.shadcn.com/).
