# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Next.js)
```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build — type-checks and compiles all 23 routes
npm run lint     # ESLint via next lint
```

### Backend (Flask)
```bash
cd backend
.venv/bin/python3 app.py        # start API server on http://localhost:8000
```

The backend **must** be started from inside the `backend/` directory — SQLAlchemy resolves `sqlite:///droposit.db` relative to the working directory and Flask stores it under `backend/instance/droposit.db`.

Port 5000 is taken by macOS AirPlay; the backend runs on **8000**.

There are no tests in this project.

## Architecture

### Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion |
| Backend | Flask 3 · Flask-JWT-Extended · Flask-SQLAlchemy · flask-cors 6 |
| Database | SQLite via `backend/instance/droposit.db` (auto-created on first startup) |
| UI primitives | Radix UI · lucide-react · `qrcode` npm package |

### Role split

Two user roles with entirely separate route trees:

| Role | Root | Bottom nav |
|------|------|------------|
| Depositor | `/home` | Home / Batches / QR / Profile |
| Staff | `/staff` | Dashboard / Scan / Batches / Profile |

`useRequireAuth(role?)` in `src/lib/auth-context.tsx` enforces access: redirects to `/login` if unauthenticated, or to the correct role root if the wrong role tries to access a route. All staff pages **must** call `useRequireAuth("staff")`.

### Auth flow

- JWT stored in `localStorage` as `drp_token`; decoded user object stored as `drp_user`
- `AuthProvider` (`src/components/providers.tsx` → `src/lib/auth-context.tsx`) restores session from localStorage on mount and listens for a `drp:unauthorized` custom event that triggers auto-logout
- Any `api.ts` request that gets a 401 dispatches `drp:unauthorized` and throws `Error("Unauthorized")`
- JWT payload includes `additional_claims: { role }` — backend role checks use `get_jwt().get('role') == 'staff'`
- The staff role can only be created via `POST /auth/register` with `"role": "staff"` in the body; the signup page always creates `depositor` accounts

### Backend structure

```
backend/
  app.py       — factory function, CORS config (origin: localhost:3000), blueprint registration
  config.py    — Config class: JWT secret, 24h token expiry, DB URI
  models.py    — User, Batch, Item, ScanLog (SQLAlchemy models)
  auth.py      — /auth/register, /auth/login
  batches.py   — /batches (depositor CRUD: list, create, get, add item, edit item)
  scan.py      — /scan/<qr_token> (resolve), /deposit, /checkout (staff-only POSTs)
  admin.py     — /admin/batches (staff-only: list all, get detail)
```

`db.create_all()` runs on every startup — schema changes require manual migration or deleting `instance/droposit.db`.

### Frontend data layer

`src/lib/api.ts` is the single API client. Key points:
- `request<T>()` base function attaches Bearer token and handles 401
- Raw backend shapes (`RawBatch`, `RawItem`, `RawAdminBatch`, etc.) are mapped to frontend `Batch`/`Item` types by `mapBatch()`, `mapAdminBatch()`, `mapAdminBatchDetail()`
- Item `status` has no independent column in the DB — items inherit their batch's status via `mapItem(raw, batchId, batchStatus)`
- Admin list response (`RawAdminBatch`) uses `owner` as a plain string; admin detail (`RawAdminBatchDetail`) uses `owner: { id, full_name, email }`
- QR tokens (`qr_token`) are NOT returned by admin list/detail endpoints; they're only available on depositor batch endpoints and scan resolve

### Layout system

Every authenticated screen:
```
<MobileShell>         ← 480px max-width cap, ambient gradient bg
  <TopBar />          ← optional back/title/right-action slots
  <PageBody>          ← px-5, pb-28 (reserves floating nav space), gap-6, accepts className
    {page content}
  </PageBody>
  <BottomNav role="depositor|staff" />
</MobileShell>
```

Hero-style pages (create batch, signup, staff batch detail) skip `TopBar` and use a custom header + full-bleed gradient `<section>` instead, with the card positioned at `-mt-6` below the hero.

### Design tokens

`tailwind.config.ts` mirrors `Style_guide.jsonc` exactly — single source of truth. Never hardcode hex values or shadow strings.

- **Surfaces:** `bg-gray-950` → `bg-gray-850` → `bg-gray-800`
- **Primary:** emerald `primary-500` (`#22c55e`) — actions, confirmations, active states only
- **Secondary:** warm tan `secondary-500` (`#b67f4b`) — staff accent color, used sparingly
- **CSS classes** in `globals.css`: `.surface-card`, `.pressable`, `.glass-nav`, `.mobile-shell`, `.skeleton`, `.divider-soft`

### Item lifecycle

`pending → deposited → claimed` — strictly one-way. Do not add statuses. Staff deposit/checkout is done via QR scan; direct status mutation from the UI is intentional only through the scan flow (`/staff/scan → /staff/scan/result`).

### Error handling pattern

Pages that call the API use inline error states — never `notFound()` from a Client Component for API failures. The pattern:

```tsx
const [error, setError] = React.useState<string | null>(null);
// ...
.catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
// ...
if (!loading && error) return <error card with back button />;
```

### Camera / QR features

- **QR display** (`src/components/qr/qr-display.tsx`): renders to `<canvas>` using the `qrcode` package. Encodes `droposit://scan/{qr_token}`.
- **QR scanner** (`src/components/qr/qr-scanner.tsx`): `getUserMedia` + `BarcodeDetector` API; strips the `droposit://scan/` prefix before navigating to `/staff/scan/result?token=…`
- **Item photo**: `<input type="file" capture="environment">` — opens rear camera directly on mobile
