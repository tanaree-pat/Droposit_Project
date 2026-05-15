# Droposit — Full Project Documentation

Droposit is a mobile-first web app for managing item deposits at high-volume events (exams, concerts, etc.). Depositors group items into batches, generate a QR code, and hand them over to staff. Staff scan the QR to deposit and later return items. The system tracks every batch through three states: **pending → deposited → claimed**.

---

## How to Run

You need two terminals — one for the backend, one for the frontend.

### Terminal 1 — Backend (Flask API)

```bash
cd "/path/to/Droposit/backend"
.venv/bin/python3 app.py
```

The server starts on **http://localhost:8000**.

> Port 5000 is blocked by macOS AirPlay, so the backend uses 8000.

The SQLite database (`instance/droposit.db`) is created automatically on first startup. You do not need to run any migrations.

### Terminal 2 — Frontend (Next.js)

```bash
cd "/path/to/Droposit"
npm run dev
```

The app opens at **http://localhost:3000**.

### First-time setup

After starting both servers, create your accounts:

**Depositor account** — go to `http://localhost:3000/signup` and register normally.

**Staff account** — the signup page only creates depositor accounts. Run this curl command once:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Staff User","email":"staff@example.com","password":"yourpassword","role":"staff"}'
```

Then log in at `http://localhost:3000/login` — you will be redirected to `/staff` automatically.

### Other commands

```bash
npm run build    # production build — type-checks every page
npm run lint     # ESLint
```

---

## Project Structure

```
Droposit/
├── backend/               Flask API
│   ├── app.py             App factory, CORS, blueprint registration
│   ├── config.py          Config class (secrets, DB URI, JWT expiry)
│   ├── models.py          SQLAlchemy models (User, Batch, Item, ScanLog)
│   ├── auth.py            /auth routes (register, login)
│   ├── batches.py         /batches routes (depositor CRUD)
│   ├── scan.py            /scan routes (QR resolve, deposit, checkout)
│   ├── admin.py           /admin routes (staff batch views)
│   └── instance/
│       └── droposit.db    SQLite database (auto-created)
│
├── src/
│   ├── app/               Next.js App Router pages
│   ├── components/        Reusable UI components
│   └── lib/               Shared logic (api.ts, types.ts, auth-context.tsx)
│
├── .env.local             NEXT_PUBLIC_API_URL=http://localhost:8000
└── tailwind.config.ts     Design tokens (colors, shadows, type scale)
```

---

## The Database

The database is SQLite, managed by SQLAlchemy. It lives at `backend/instance/droposit.db` and is created automatically when the backend first starts.

### Tables

**users**
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | |
| full_name | String | |
| email | String | unique |
| phone | String | optional |
| password_hash | String | Werkzeug pbkdf2 hash |
| role | String | `depositor` or `staff` |
| created_at | DateTime | |

**batches**
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | |
| user_id | FK → users | the depositor who owns it |
| staff_id | FK → users | the staff member who processed it |
| name | String | batch display name |
| description | Text | optional |
| qr_token | String | unique, auto-generated: `drp-{8 hex chars}` |
| status | String | `pending` → `deposited` → `claimed` |
| deposited_at | DateTime | set when staff scans to deposit |
| claimed_at | DateTime | set when staff scans to checkout |
| created_at | DateTime | |

**items**
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | |
| batch_id | FK → batches | |
| name | String | |
| description | Text | optional |
| image_url | String | optional photo URL |
| created_at | DateTime | |

**scan_logs**
| Column | Type | Notes |
|---|---|---|
| id | Integer PK | |
| batch_id | FK → batches | |
| staff_id | FK → users | |
| action | String | `deposit` or `checkout` |
| checkpoint | String | location label e.g. "Checkpoint A" |
| created_at | DateTime | |

### Relationships

- A **user** (depositor) has many **batches**
- A **batch** has many **items** and many **scan_logs**
- **Items** have no independent status — they inherit the status of their parent batch
- **ScanLog** is an immutable audit trail; one entry is written for every deposit and checkout action

### Resetting the database

Delete `backend/instance/droposit.db` and restart the backend. The file will be recreated empty.

---

## The Backend (Flask API)

Base URL: `http://localhost:8000`

All protected routes require `Authorization: Bearer <token>` in the request header.

### Auth routes — `/auth`

**`POST /auth/register`** — Create a new user account.

Request body:
```json
{
  "full_name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "depositor"
}
```
`role` defaults to `depositor` if omitted. Only pass `"role": "staff"` via curl/API — the signup page never sends this.

Response `201`:
```json
{ "message": "User registered successfully", "user_id": 1 }
```

---

**`POST /auth/login`** — Authenticate and receive a JWT.

Request body:
```json
{ "email": "alice@example.com", "password": "secret123" }
```

Response `200`:
```json
{
  "access_token": "eyJ...",
  "user": {
    "id": "1",
    "full_name": "Alice",
    "email": "alice@example.com",
    "role": "depositor"
  }
}
```

The JWT embeds `role` in its payload via `additional_claims`. It expires after 24 hours.

---

### Batch routes — `/batches` (depositor only)

Each route requires a valid JWT. The user's own batches are returned — depositors never see other users' batches.

**`GET /batches`** — List all your batches with their items.

**`POST /batches`** — Create a new batch.

Request body:
```json
{ "name": "Exam Day Bag", "description": "Optional description" }
```

Response `201` — full batch object including the auto-generated `qr_token`.

**`GET /batches/:id`** — Get a single batch and all its items.

**`POST /batches/:id/items`** — Add an item to a batch.

Request body:
```json
{ "name": "Laptop", "description": "Silver MacBook" }
```

**`PATCH /batches/:id/items/:itemId`** — Edit an item's name or description.

---

### Scan routes — `/scan`

**`GET /scan/:qr_token`** — Resolve a QR code. Returns batch info for any authenticated user (depositor or staff). Used by the staff scan screen to preview the batch before confirming.

Response:
```json
{
  "batch_id": 3,
  "batch_name": "Exam Day Bag",
  "status": "pending",
  "owner": { "id": 1, "full_name": "Alice", "email": "alice@example.com" },
  "items": [
    { "id": 1, "name": "Laptop", "description": "Silver MacBook", "image_url": null, "created_at": "..." }
  ]
}
```

**`POST /scan/:qr_token/deposit`** — *(staff only)* Mark a batch as deposited. Batch must be in `pending` state.

Request body:
```json
{ "checkpoint": "Checkpoint A" }
```

**`POST /scan/:qr_token/checkout`** — *(staff only)* Mark a batch as claimed. Batch must be in `deposited` state.

Both write a `ScanLog` entry and update the batch's timestamp (`deposited_at` or `claimed_at`).

---

### Admin routes — `/admin` (staff only)

**`GET /admin/batches`** — List all batches across all users. Optionally filter by status:

```
GET /admin/batches             → all batches
GET /admin/batches?status=pending    → only pending
GET /admin/batches?status=deposited  → only deposited
GET /admin/batches?status=claimed    → only claimed
```

Response — array of summary objects (no full item data, just `item_count`):
```json
[{
  "id": 3,
  "name": "Exam Day Bag",
  "status": "deposited",
  "owner": "Alice",
  "item_count": 2,
  "created_at": "...",
  "deposited_at": "...",
  "claimed_at": null
}]
```

**`GET /admin/batches/:id`** — Full batch detail for staff, including the full items array and owner object (not just name string).

---

### How CORS works

The backend allows requests only from `http://localhost:3000` (configured in `app.py`). If you change the frontend port, update the `origins` list in `app.py` and restart the backend. The backend uses `flask-cors 6.0.2` which handles OPTIONS preflight automatically.

### Role enforcement

Both `scan.py` and `admin.py` define a local `_staff_required()` helper:

```python
def _staff_required():
    return get_jwt().get('role') == 'staff'
```

If the check fails, the endpoint returns `403 { "error": "Staff only" }`. The JWT itself is still validated by the `@jwt_required()` decorator — `_staff_required()` only adds the role check on top.

---

## The Frontend (Next.js)

The frontend is a Next.js 15 app using the App Router. Every page is a Client Component (`"use client"`). There is no server-side rendering of page data — all API calls happen in the browser via `useEffect`.

### Authentication

Authentication state lives in React Context, defined in `src/lib/auth-context.tsx`.

**`AuthProvider`** (mounted in `src/app/layout.tsx` via `src/components/providers.tsx`):
- On mount, reads `drp_user` and `drp_token` from `localStorage` to restore session
- Listens for a `drp:unauthorized` custom event — when fired, clears storage, resets state, and redirects to `/login`
- Exposes `login()`, `logout()`, `user`, and `loading`

**`useRequireAuth(role?)`** — used at the top of every protected page:
```tsx
const { user, loading: authLoading } = useRequireAuth("staff");
if (authLoading || !user) return null;
```
If the user is not logged in → redirect to `/login`.
If the user is the wrong role → redirect to their role's root (`/home` or `/staff`).

**Session flow:**
1. User submits login form
2. Frontend calls `POST /auth/login`
3. Response JWT is stored in `localStorage` as `drp_token`; user object stored as `drp_user`
4. Every subsequent API call reads `drp_token` from localStorage and sends it as `Authorization: Bearer ...`
5. If any API call returns 401, the `drp:unauthorized` event fires and the user is logged out globally

> Important: `localStorage` is shared across all browser tabs. If you log in as a different user in another tab, the token in localStorage is overwritten and all tabs switch to the new session.

### API Client

All API calls go through `src/lib/api.ts`. It defines:

- **`request<T>()`** — base fetch wrapper. Attaches the Bearer token, handles 401 globally, throws errors from non-OK responses
- **Raw types** — TypeScript interfaces matching the exact JSON shape the backend sends (`RawBatch`, `RawAdminBatch`, `RawScanResolve`, etc.)
- **Mapper functions** — convert raw backend shapes to frontend types (`mapBatch()`, `mapAdminBatch()`, `mapAdminBatchDetail()`)
- **Four API objects** — `authApi`, `batchesApi`, `scanApi`, `adminApi`

The mapping step is important because the backend uses snake_case (`name`, `image_url`, `full_name`) while the frontend types use camelCase (`title`, `imageUrl`). The mapper is the only place this translation happens.

One key design decision: **items have no independent status field in the database**. Items inherit their batch's status. `mapItem()` receives the batch's status and applies it to every item it maps.

### Page routes

```
/                                 Landing page (public)
/login                            Sign in
/signup                           Create depositor account
/forgot-password                  Password recovery UI

Depositor (authenticated):
/home                             Dashboard — stats + recent batches
/batches                          All batches, with search and status filters
/batches/new                      Create a batch
/batches/[id]                     Batch detail + item list
/batches/[id]/items/new           Add item to batch
/batches/[id]/items/[itemId]      Item detail (read)
/batches/[id]/items/[itemId]/edit Edit item name/description
/qr                               Display your QR code (encoded as droposit://scan/{qr_token})
/notifications                    Notification list
/profile                          Account info + logout

Staff (authenticated):
/staff                            Dashboard — KPIs + recent activity
/staff/scan                       Live QR camera scanner
/staff/scan/result                Scan result — confirm deposit or checkout
/staff/batches                    All batches across all users (filter by status)
/staff/batches/[id]               Batch detail for staff (read-only)
/staff/batches/[id]/items/[itemId] Item detail for staff (read-only)
/staff/profile                    Staff account info + logout
```

### Layout system

Every authenticated page wraps its content in the same shell:

```tsx
<MobileShell>
  <TopBar />            {/* optional back button, title, right action */}
  <PageBody>            {/* horizontal padding, bottom padding for nav, vertical gap */}
    {/* page content */}
  </PageBody>
  <BottomNav role="depositor" />   {/* fixed floating pill at bottom */}
</MobileShell>
```

`MobileShell` caps the layout at 480px on desktop so it looks like a phone screen. On a real phone it goes full width.

Some pages (create batch, signup, staff batch detail) use a **hero pattern** instead of `TopBar` — a full-bleed gradient section at the top with large display text, and the main card positioned with `-mt-6` to overlap the bottom of the hero.

### Design system

Colors, shadows, type scales, and animations are all defined as Tailwind tokens in `tailwind.config.ts`. This file mirrors `Style_guide.jsonc` exactly.

**Color roles:**
- `primary-500` (`#22c55e`) — emerald green. Used only for primary actions, confirmations, and active states.
- `secondary-500` (`#b67f4b`) — warm tan. Used for staff UI accents and premium highlights.
- `gray-950` / `gray-850` / `gray-800` — the three surface levels (ink → card → elevated).
- `danger` (`#ef4444`) — errors and destructive actions.

**CSS utility classes** (defined in `globals.css`):
- `.surface-card` — rounded card with border and subtle background
- `.pressable` — scale-down tap effect
- `.glass-nav` — frosted glass effect for the bottom nav
- `.mobile-shell` — the full-height container with ambient gradient

**Animations:** Framer Motion is used for page-level fade-ins, the bottom nav active indicator (shared-element spring with `layoutId="nav-active"`), and the scan confirmation overlay.

### QR code flow

**Depositor side:**
1. Depositor creates a batch — the backend auto-generates a `qr_token` (e.g. `drp-a1b2c3d4`)
2. Depositor goes to `/qr` — the QR display component renders a QR code on a `<canvas>` using the `qrcode` npm package
3. The QR encodes the string `droposit://scan/{qr_token}`

**Staff side:**
1. Staff goes to `/staff/scan` — the QR scanner uses `getUserMedia` (camera) and the browser's `BarcodeDetector` API to read QR codes
2. When a code is detected, it strips the `droposit://scan/` prefix and extracts the token
3. Staff is navigated to `/staff/scan/result?token={qr_token}`
4. The result page calls `GET /scan/{qr_token}` to load batch info
5. Staff reviews the batch name, status, owner, and items
6. Staff clicks Confirm — calls `POST /scan/{qr_token}/deposit` or `/checkout` depending on current status
7. On success, a confirmation overlay animates in and the app redirects to `/staff/batches`

If `BarcodeDetector` is unavailable (some browsers), the scanner falls back to a manual text entry sheet where staff can type the token directly.

---

## The Full User Journey

### As a Depositor

1. Sign up at `/signup` — creates your account with role `depositor`
2. Log in — redirected to `/home`
3. Create a batch at `/batches/new` — give it a name and description
4. Add items to the batch — name, optional description, optional photo
5. Go to `/qr` — your QR code is displayed, select which batch to encode
6. Show the QR to staff at the checkpoint
7. Come back later, show the QR again to collect your items

### As Staff

1. Log in (account created via curl with `"role": "staff"`) — redirected to `/staff`
2. The dashboard shows how many batches are currently in the system vs. retrieved
3. Go to `/staff/scan` when a depositor arrives
4. Point the camera at their QR — the scanner reads it automatically
5. Review the scan result: see the depositor's name, batch name, all their items
6. Click "Confirm deposit" — the batch moves to `deposited` state
7. When the depositor returns to collect, scan again and click "Confirm checkout" — moves to `claimed`
8. View all batches at `/staff/batches` — filter by All / Pending / Deposited / Claimed

---

## Common Issues

**"Load failed" or "Failed to fetch"** — The backend is not running. Start it with `.venv/bin/python3 app.py` from inside the `backend/` directory.

**"Staff only" error when depositing** — Your browser's localStorage has a depositor JWT, not a staff JWT. This happens when you log in as a different user in another tab. Log out and log back in as staff.

**"Invalid email or password" for staff account** — The staff account hasn't been created yet. Run the curl registration command above.

**Backend starts but database errors appear** — Make sure you run `app.py` from inside the `backend/` directory, not from the project root. SQLite resolves the database path relative to where the script is run.

**QR scanner shows blank or asks for camera permission repeatedly** — The `BarcodeDetector` API requires HTTPS in some browsers. On localhost it works over HTTP in Chrome and Safari. If it doesn't work, use the "Enter code manually" button and type the token (e.g. `drp-a1b2c3d4`).
