# 📡 Dead API Detector

> Real-time public API health monitoring. Know which APIs are up, down, and how fast they respond — before you depend on them.

![Dead API Detector Dashboard](https://via.placeholder.com/900x400/1a1a2e/60a5fa?text=Dead+API+Detector+%E2%80%94+Dashboard+Preview)

## ✨ Features

- **50+ Public APIs** monitored across 9 categories
- **Green/Red status indicators** — instantly see what's up or down
- **Response time tracking** — colour-coded (green < 500ms, yellow < 2s, red > 2s)
- **Category filter** — narrow down by Weather, Finance, Crypto, etc.
- **Search** — debounced live search by API name
- **Check Now button** — trigger an on-demand health sweep
- **Hourly auto-checks** via GitHub Actions cron
- **URL-synced filters** — shareable filtered links
- **Fully free** — Vercel + Render + Supabase + GitHub Actions free tiers

---

## 🏗️ Architecture

```
User Browser → Next.js (Vercel) → FastAPI (Render) → PostgreSQL (Supabase)
                                       ↑
                              GitHub Actions (Hourly cron)
```

| Layer     | Technology | Hosting |
|-----------|-----------|---------|
| Frontend  | Next.js 14 + Tailwind CSS | Vercel (free) |
| Backend   | FastAPI + SQLAlchemy + httpx | Render (free) |
| Database  | PostgreSQL | Supabase (free) |
| Scheduler | Cron job | GitHub Actions (free) |

---

## 🚀 Setup Guide (Zero to Deployed)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) and npm
- [Python 3.11+](https://python.org/)
- A [GitHub](https://github.com) account (free)
- A [Vercel](https://vercel.com) account (free)
- A [Render](https://render.com) account (free)
- A [Supabase](https://supabase.com) account (free)

---

### Step 1 — Fork & Clone

```bash
git clone https://github.com/yourusername/dead-api-detector.git
cd dead-api-detector
```

---

### Step 2 — Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `dead-api-detector`, choose a strong password, pick a region
3. Once created, go to **SQL Editor**
4. Paste and run `database/schema.sql`
5. Then paste and run `database/seed.sql` (inserts 50 APIs)
6. Go to **Settings → Database → Connection string → URI**
7. Copy the URI — you'll need it as `DATABASE_URL`

---

### Step 3 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo, select the `backend/` folder as root directory
3. Set the following:
   - **Environment**: Python 3
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   ```
   DATABASE_URL   = postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
   ALLOWED_ORIGIN = https://your-app.vercel.app   ← (fill in after Vercel deploy)
   ```
5. Click **Deploy** and wait ~2 minutes
6. Copy your Render URL (e.g., `https://dead-api-detector-xxxx.onrender.com`)

> ⚠️ **Free tier note**: Render's free tier spins down after 15 minutes of inactivity. The first request after idle will be slow (~10s). This is fine for MVP.

---

### Step 4 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend/`
3. Add **Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
   ```
4. Click **Deploy**
5. Copy your Vercel URL (e.g., `https://dead-api-detector.vercel.app`)
6. **Go back to Render** and update `ALLOWED_ORIGIN` with your Vercel URL

---

### Step 5 — Set Up GitHub Actions (Hourly Checks)

1. In your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add a secret:
   ```
   Name:  BACKEND_URL
   Value: https://your-backend.onrender.com
   ```
3. The workflow file is already at `.github/workflows/hourly-check.yml`
4. It will run automatically every hour on the hour
5. You can test it manually via **Actions → Hourly API Health Check → Run workflow**

---

### Step 6 — Verify Everything Works

```bash
# Test backend directly
curl https://your-backend.onrender.com/
# Should return: {"status":"ok","service":"Dead API Detector",...}

curl https://your-backend.onrender.com/apis
# Should return: JSON array of 50 APIs

curl -X POST https://your-backend.onrender.com/check-all
# Should return: summary with up/down counts (takes ~30s)
```

Visit your Vercel URL and you should see the live dashboard! 🎉

---

## 🖥️ Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL

uvicorn main:app --reload --port 8000
```

API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
dead-api-detector/
├── .github/
│   └── workflows/
│       └── hourly-check.yml    # GitHub Actions cron
├── backend/
│   ├── main.py                 # FastAPI app, all routes
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── database.py             # DB connection & session
│   ├── checker.py              # Async health check engine
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root HTML layout
│   │   ├── page.tsx            # Server component (SSR)
│   │   ├── DashboardClient.tsx # Interactive client component
│   │   └── globals.css
│   ├── components/
│   │   ├── ApiTable.tsx        # Main data table
│   │   ├── FilterBar.tsx       # Search, filter, check button
│   │   ├── StatusBadge.tsx     # Green/red/gray dot + label
│   │   └── StatsBar.tsx        # Summary stats (total/up/down/%)
│   ├── lib/
│   │   ├── api.ts              # Fetch functions
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── utils.ts            # Helpers (time, color coding)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
├── database/
│   ├── schema.sql              # Table definitions + indexes
│   └── seed.sql                # 50 seed APIs
└── README.md
```

---

## 🔌 API Reference

The FastAPI backend auto-generates interactive docs at `/docs`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health ping |
| GET | `/apis` | List all APIs. Query params: `?category=Weather&search=json` |
| GET | `/categories` | List distinct categories |
| POST | `/check-all` | Trigger concurrent health check for all APIs |

---

## 🗺️ Roadmap

**Phase 1 (MVP — current)**
- [x] 50 APIs monitored
- [x] Status dashboard with filtering/search
- [x] Hourly automated checks
- [x] Manual "Check Now" trigger

**Phase 2 (Next)**
- [ ] Email alerts when API goes down
- [ ] 7-day uptime percentage per API
- [ ] API detail page with history graph
- [ ] Add custom APIs to monitor

**Phase 3**
- [ ] User accounts (Supabase Auth)
- [ ] Real-time updates (WebSocket/SSE)
- [ ] Slack/Discord notifications
- [ ] 1000+ APIs in database

---

## ⚖️ Legal Note

This tool sends HTTP GET requests to public API endpoints to check if they respond. Most public APIs allow this. However:
- Respect each API's rate limits
- Don't use this to scrape private data
- Check each API's Terms of Service if in doubt

---

## 📄 License

MIT — free to use, modify, and deploy.
