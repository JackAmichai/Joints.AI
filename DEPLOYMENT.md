# Deployment Guide

Joints.AI runs on a free-tier-friendly stack:

| Piece | Free host | Why |
| --- | --- | --- |
| Next.js frontend | **Vercel** Hobby | zero-config for Next.js, global CDN, auto HTTPS, preview deploys |
| Auth + Postgres | **Supabase** Free | 500 MB DB, 50k MAU, built-in auth + storage |
| Python FastAPI backend | **Render** Free / **Railway** Hobby / **Fly.io** | 750 hrs/mo free, sleeps on idle |

Total cost to go live: **$0**.

---

## 1. Prerequisites

- GitHub account with access to [`JackAmichai/Joints.AI`](https://github.com/JackAmichai/Joints.AI)
- Free Supabase account — <https://supabase.com>
- Free Vercel account — <https://vercel.com>
- (Optional) Free Render or Railway account for the Python backend

---

## 2. Supabase — one-time setup

1. Create a new project at <https://supabase.com/dashboard>.
2. In **Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server only)
3. In **SQL editor**, run each file in `supabase/migrations/` in order:
   - `001_initial_schema.sql`
   - `002_user_feedback.sql`

---

## 3. Frontend — deploy to Vercel

### Option A: via the Vercel dashboard (easiest)

1. Go to <https://vercel.com/new>.
2. Import the `JackAmichai/Joints.AI` repo.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_BACKEND_URL` (your backend URL — see §4)
   - `OPENAI_API_KEY` (optional)
5. Click **Deploy**. First deploy takes ~2 minutes.

### Option B: via the Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link              # connect this folder to a Vercel project
vercel env pull          # sync production env vars into .env.local
vercel --prod            # deploy to production
```

---

## 4. Python backend — deploy to Render (free)

The `backend/` folder is a FastAPI app. Any of these work for $0:

### Render (recommended — always-on free tier with cold starts)

1. Push the repo to GitHub (already done).
2. Go to <https://render.com/new/web-service>.
3. Select the `Joints.AI` repo.
4. Root directory: `backend`
5. Runtime: **Python 3.11**
6. Build command: `pip install -e .` (or `pip install -r requirements.txt` if you have one)
7. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
8. Plan: **Free**
9. Environment variables (copy the same ones from Vercel):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, etc.
10. Once deployed, copy the public URL (e.g. `https://joints-ai-backend.onrender.com`) and set it as `NEXT_PUBLIC_BACKEND_URL` in Vercel.

### Railway alternative

```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
railway variables set SUPABASE_URL=... OPENAI_API_KEY=...
railway domain         # get a public URL
```

### Fly.io alternative

```bash
brew install flyctl
fly auth signup
cd backend
fly launch
fly secrets set SUPABASE_URL=... OPENAI_API_KEY=...
fly deploy
```

---

## 5. Post-deploy checklist

- [ ] Visit the Vercel URL — the landing page loads, the "Find a therapist" section shows.
- [ ] Sign up a test user; you should land in `/dashboard/onboarding`.
- [ ] Create an assessment in `/assess/method` and confirm polling works at `/results/[id]`.
- [ ] Click the **Feedback** button (bottom-left) — Supabase `user_feedback` should get a new row.
- [ ] Open `/dashboard/therapists` — the curated directory should render even without backend.
- [ ] In Vercel → Settings → Domains, add your custom domain if you have one.

---

## 6. Auto-deploys

Vercel deploys every push to `main` automatically. Preview URLs are generated for every PR.

To roll back a deploy, go to **Vercel → Deployments → Promote** on any previous successful build.
