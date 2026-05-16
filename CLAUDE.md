# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Next.js)
```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build — type-checks and compiles all routes
npm run lint     # ESLint via next lint
```

### Backend (Flask)
```bash
cd backend
.venv/bin/python3 app.py        # start API server on http://localhost:8000
```

The backend **must** be started from inside the `backend/` directory — SQLAlchemy resolves `sqlite:///droposit.db` relative to the working directory and stores it at `backend/instance/droposit.db`.

Port 5000 is taken by macOS AirPlay; the backend runs on **8000**. There are no tests.

### Creating a staff account

The signup page only creates depositor accounts. Staff accounts must be created via:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Staff Name","email":"staff@example.com","password":"pass","role":"staff"}'
```

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

| Role | Root | Bottom nav tabs |
|------|------|-----------------|
| Depositor | `/home` | Home / Batches / QR / Profile |
| Staff | `/staff` | Dashboard / Scan / Batches / Profile |

`useRequireAuth(role?)` in `src/lib/auth-context.tsx` enforces access: redirects to `/login` if unauthenticated, or to the role's root if the wrong role visits a route. Every staff page must call `useRequireAuth("staff")`.

### Auth flow

- JWT stored in `localStorage` as `drp_token`; decoded user object stored as `drp_user`
- `AuthProvider` (`src/components/providers.tsx` → `src/lib/auth-context.tsx`) restores session on mount and listens for a `drp:unauthorized` custom event that triggers auto-logout
- Any `api.ts` request that gets a 401 dispatches `drp:unauthorized` and throws `Error("Unauthorized")`
- JWT payload includes `additional_claims: { role }` — backend role checks use `get_jwt().get('role') == 'staff'`

### Backend structure

```
backend/
  app.py       — factory function, CORS config (origin: localhost:3000), blueprint registration
  config.py    — JWT secret, 24h token expiry, DB URI
  models.py    — User, Batch, Item, ScanLog (SQLAlchemy models)
  auth.py      — POST /auth/register, POST /auth/login
  batches.py   — /batches CRUD (depositor-only)
  scan.py      — GET /scan/<token> (resolve), POST /deposit, POST /checkout (staff-only)
  admin.py     — /admin/batches (staff-only list + detail)
```

`db.create_all()` runs on every startup — schema changes require deleting `instance/droposit.db` or manual migration.

### Frontend data layer

`src/lib/api.ts` is the single API client:
- `request<T>()` attaches the Bearer token and handles 401
- Raw backend shapes (`RawBatch`, `RawItem`, `RawAdminBatch`, etc.) are mapped to frontend types by `mapBatch()`, `mapAdminBatch()`, `mapAdminBatchDetail()`
- Item `status` has no DB column — items inherit batch status via `mapItem(raw, batchId, batchStatus)`
- `qr_token` is **not** returned by admin endpoints; only available on depositor batch endpoints and scan resolve
- All dates use `timeZone: "Asia/Bangkok"` (GMT+7) when formatting for display

### Layout system

Every authenticated screen follows this shell:
```
<MobileShell>         ← 480px max-width cap, ambient gradient bg
  <TopBar />          ← optional back/title/rightAction slots
  <PageBody>          ← px-5, pb-28 (reserves floating nav space), gap-6
    {page content}
  </PageBody>
  <BottomNav role="depositor|staff" />
</MobileShell>
```

**TopBar rules:**
- `<TopBar back />` renders a chevron that calls `router.back()`
- `<TopBar rightAction={<></>} />` suppresses the default depositor shortcut icons on all staff pages — passing an empty fragment is truthy, so `rightAction ?? <DefaultActions />` falls through correctly; `null` would not suppress it
- The default `rightAction` is a QR icon linking to `/qr` — it should never appear on staff pages

**Hero-style pages** (batch creation, item creation, signup) skip `TopBar` and render a full-bleed gradient `<section>` with `rounded-b-[40px]` and a close button inside, with the form card positioned at `-mt-6` below.

### Navigation patterns

- Creation pages (batch, item, signup) use `router.back()` for both the X (cancel) button and after a successful submit — this pops the creation page off the history stack cleanly. Using `router.replace('/batches/123')` instead would duplicate an existing entry in the history stack (`[batches, batch/123, batch/123]`), requiring two back presses to leave the detail page.
- All hooks must appear before any early `return` statements — React rules of hooks violation silently breaks state on re-render

### Design tokens

`tailwind.config.ts` is the single source of truth. Never hardcode hex values or shadow strings.

- **Surfaces:** `bg-gray-950` → `bg-gray-850` → `bg-gray-800` (light to dark within surface hierarchy)
- **Primary:** emerald `primary-500` (`#22c55e`) — actions, confirmations, active states only
- **Secondary:** warm tan `secondary-500` (`#b67f4b`) — staff accent, used sparingly
- **CSS utility classes** defined in `globals.css`: `.surface-card`, `.pressable`, `.glass-nav`, `.mobile-shell`, `.skeleton`, `.divider-soft`, `.status-pill`, `.safe-top`, `.safe-bottom`, `.no-scrollbar`

### StatusPill usage

`<StatusPill status={batch.status} tone="solid" />` — use `tone="solid"` (filled, glowing) for list views and cards. `tone="soft"` (translucent with border) is reserved for detail contexts. Size defaults to `"md"`; pass `size="sm"` for compact chips.

### Item lifecycle

`pending → deposited → claimed` — strictly one-way. Direct status mutation from the UI is only through the scan flow (`/staff/scan → /staff/scan/result`). Do not add statuses.

### Error handling pattern

Pages that call the API use inline error states — never call `notFound()` from a Client Component for API failures:

```tsx
const [error, setError] = React.useState<string | null>(null);
// ...
.catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
// ...
if (!loading && error) return <error card with back button />;
```

### Camera / QR features

- **QR display** (`src/components/qr/qr-display.tsx`): renders to `<canvas>` via the `qrcode` package. Encodes `droposit://scan/{qr_token}`.
- **QR scanner** (`src/components/qr/qr-scanner.tsx`): `getUserMedia` + `BarcodeDetector` API; strips the `droposit://scan/` prefix before navigating to `/staff/scan/result?token=…`
- **Item photo**: `<input type="file" accept="image/*">` — native picker on mobile offers both camera and gallery. No `capture` attribute so the user can choose.

### Image upload

Item photos are uploaded as `multipart/form-data` via `batchesApi.addItem()`. When a `File` is provided, `api.ts` switches from JSON to a `FormData` POST (the `requestForm` helper omits `Content-Type` so the browser sets the correct boundary). The backend (`batches.py`) saves files to `backend/uploads/` and returns a relative path (`/uploads/<uuid>.ext`). The `mapItem()` mapper in `api.ts` prepends `BASE` to relative paths so the full URL is available to the frontend. The `/uploads/<filename>` route is registered in `app.py` via `send_from_directory`. Next.js `<Image>` requires `localhost:8000` in `remotePatterns` (`next.config.mjs`) to load these images.

### Timestamps

All timestamps are stored as **naive Bangkok time (GMT+7)** — `models.py` and `scan.py` use `datetime.now(timezone(timedelta(hours=7))).replace(tzinfo=None)`. The `.replace(tzinfo=None)` strip is required because SQLAlchemy's `DateTime` column converts aware datetimes to UTC before writing to SQLite, which would defeat the purpose. Deleting `backend/instance/droposit.db` is required after this change to clear stale UTC rows.

### Known CSS pitfalls

- `overflow-hidden` on an Input's wrapper div clips the text caret in both Chrome and Safari — the `Input` component intentionally omits it despite using `rounded-full`. Do not add it back.
- Absolutely-positioned badges inside an `overflow-hidden` container get clipped. For icon overlays on circular photo pickers, place the badge as a sibling in a relative wrapper outside the `overflow-hidden` element.
