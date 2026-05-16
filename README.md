# Droposit

A mobile-first web app for managing item deposits at high-volume events. Depositors group items into batches, generate a QR code, and hand them over to staff. Staff scan the QR to accept and return items. Every batch is tracked through three states: **pending → deposited → claimed**.

> For full project context — goals, design decisions, and feature rationale — see **[PROJECT.md](./PROJECT.md)**.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion |
| Backend | Flask 3 · Flask-JWT-Extended · Flask-SQLAlchemy · flask-cors |
| Database | SQLite (auto-created on first run) |
| UI | Radix UI · lucide-react · `qrcode` |

---

## Running the project

You need two terminals running simultaneously.

### Backend

```bash
cd backend
.venv/bin/python3 app.py
```

Runs on **http://localhost:8000**. The database (`instance/droposit.db`) is created automatically on first startup — no migrations needed.

### Frontend

```bash
npm run dev
```

Runs on **http://localhost:3000**.

### Other commands

```bash
npm run build    # production build + type check
npm run lint     # ESLint
```

---

## First-time setup

**Depositor account** — go to `/signup` and register normally.

**Staff account** — the signup page only creates depositor accounts. Create a staff account via:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Staff Name","email":"staff@example.com","password":"yourpassword","role":"staff"}'
```

Then log in at `/login` — staff users are redirected to `/staff` automatically.

---

## How it works

### Two roles

| Role | Entry point | Can do |
|---|---|---|
| Depositor | `/home` | Create batches, add items, view QR code |
| Staff | `/staff` | Scan QR codes, deposit and check out batches, view all batches |

### Depositor flow

1. Create a batch and add items to it
2. Go to `/qr` — a QR code is generated for the batch
3. Show the QR at the checkpoint to deposit items
4. Return later, show the QR again to collect items

### Staff flow

1. Open `/staff/scan` when a depositor arrives
2. Point the camera at their QR code
3. Review the batch details and confirm deposit
4. When the depositor returns, scan again and confirm checkout

### Batch lifecycle

```
pending  →  deposited  →  claimed
(created)   (staff scans)  (staff returns)
```

Status only moves forward — it cannot be reversed.

---

## Project structure

```
Droposit/
├── backend/
│   ├── app.py          App factory, CORS, blueprint registration
│   ├── config.py       Secrets, DB URI, JWT expiry (24h)
│   ├── models.py       User, Batch, Item, ScanLog
│   ├── auth.py         POST /auth/register  POST /auth/login
│   ├── batches.py      Depositor batch and item CRUD
│   ├── scan.py         QR resolve, deposit, checkout
│   ├── admin.py        Staff-only batch views
│   └── instance/
│       └── droposit.db SQLite database
│
├── src/
│   ├── app/            Next.js pages (App Router)
│   ├── components/     UI components (layout, batch cards, QR, primitives)
│   └── lib/
│       ├── api.ts      Typed API client + backend→frontend mappers
│       ├── types.ts    Shared TypeScript types
│       └── auth-context.tsx  Auth state, JWT storage, useRequireAuth
│
├── .env.local          NEXT_PUBLIC_API_URL=http://localhost:8000
└── tailwind.config.ts  Design tokens (colors, shadows, type scale)
```

---

## API overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Get JWT |
| GET | `/batches` | depositor | List own batches |
| POST | `/batches` | depositor | Create batch |
| GET | `/batches/:id` | depositor | Get batch + items |
| POST | `/batches/:id/items` | depositor | Add item |
| PATCH | `/batches/:id/items/:itemId` | depositor | Edit item |
| GET | `/scan/:token` | any | Resolve QR token |
| POST | `/scan/:token/deposit` | staff | Mark as deposited |
| POST | `/scan/:token/checkout` | staff | Mark as claimed |
| GET | `/admin/batches` | staff | List all batches |
| GET | `/admin/batches/:id` | staff | Batch detail |

Full documentation in [`PROJECT.md`](./PROJECT.md).
