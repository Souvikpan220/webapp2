# Kaddu Boost Monorepo

Production-ready mobile-first TikTok services app with a clean frontend/backend split for Vercel.

## Folder Structure

```text
root/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── animations/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── api/
│   │   ├── auth/email.js
│   │   ├── auth/profile.js
│   │   ├── orders/free.js
│   │   ├── orders/premium.js
│   │   ├── tiktok/profile.js
│   │   ├── support/index.js
│   │   └── health.js
│   ├── config/
│   ├── controllers/
│   ├── cooldowns/
│   ├── database/
│   ├── keys/
│   ├── logs/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   └── server.js
├── shared/
├── package.json
├── vercel.json
└── README.md
```

## Local Development

```bash
npm install
npm run dev
```

Frontend: `http://127.0.0.1:5173`
Backend: `http://127.0.0.1:8080/api/health`

Individual commands:

```bash
npm run frontend
npm run backend
npm run build
```

## Environment Variables

Frontend variables go in `frontend/.env.local`:

```bash
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://127.0.0.1:8080
VITE_DISCORD_SUPPORT_URL=https://discord.gg/your-server
```

Backend variables go in `backend/.env` locally or Vercel project settings:

```bash
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_SUPPORT_URL=https://discord.gg/your-server
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=tiktok-scraper7.p.rapidapi.com
SMM_API_URL=https://your-smm-panel.com/api/v2
SMM_API_KEY=your_smm_api_key
```

Webhook failures are caught and logged, so the email screen continues even when Discord is down or misconfigured.

## Vercel Deployment

Use the repository root as the Vercel root directory.

Build settings:

- Framework Preset: `Other`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty when using the included `vercel.json`

The root `vercel.json` does two jobs:

- Builds `frontend/package.json` with `@vercel/static-build`.
- Deploys `backend/api/**/*.js` with `@vercel/node`.

API routes:

- `POST /api/auth/email`
- `POST /api/auth/profile`
- `POST /api/orders/free`
- `POST /api/orders/premium`
- `GET /api/tiktok/profile?url=...`
- `GET /api/support`
- `GET /api/health`

Frontend routing falls back to `frontend/index.html`, so mobile browser refreshes do not 404.

## Demo Premium Keys

- `kaddu1`: `KADDU1-DEMO-2026`
- `kaddu2`: `KADDU2-DEMO-2026`
- `kaddu3`: `KADDU3-DEMO-2026`

The backend stores only SHA-256 hashes in `backend/keys/` and marks keys used after a successful SMM order.
