# Verus Newsletter Site

A standalone marketing and waitlist site for Verus — separate from the main Verus application. Includes the home page, team page, and a waitlist signup form backed by Supabase.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Edit `.env.local` with your Supabase credentials:

```
# Supabase project: verus-newsletter
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from your Supabase project → **Settings → API**.

### 3. Run the Supabase migration

Before the waitlist form works, run the SQL in `supabase/migrations/001_waitlist.sql` in the **Supabase SQL editor** for the `verus-newsletter` project:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your `verus-newsletter` project
3. Open **SQL Editor**
4. Paste and run the contents of `supabase/migrations/001_waitlist.sql`

This creates the `waitlist` table and sets up row-level security so only inserts are allowed via the anon key.

### 4. Run locally

```bash
npm run dev
```

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import `verus-newsletter`.
3. Add environment variables in Vercel's project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. The `vercel.json` handles SPA routing automatically.

---

## Notes

- This is a **standalone** newsletter/waitlist site — it does not include the main Verus analysis platform.
- No backend required — Supabase handles all data storage via the anon key and RLS policies.
- All Supabase credentials are loaded from environment variables; nothing is hardcoded.

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home page |
| `/team` | Team page |
| `/waitlist` | Waitlist signup form |
