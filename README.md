# Droposit

## Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build (type-checks and compiles)
npm run start    # serve the production build
npm run lint     # ESLint via next lint
```

There are no tests in this project.

## Architecture

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Radix UI primitives · `qrcode` library · `lucide-react`

### Role split

The app has two user roles with separate route trees and navigation configs:

| Role | Root route | Bottom nav config |
|------|-----------|-------------------|
| Depositor | `/home` | Home / Batches / QR / Profile |
| Staff | `/staff` | Dashboard / Scan / Batches / Profile |

`/` is a public landing page. `/login`, `/signup`, `/forgot-password` are auth screens (no real auth — hardcoded mock users). Role switching is done manually by navigating to `/staff` vs `/home`.

### Layout system

Every authenticated screen follows the same three-layer pattern:

```
<MobileShell>         ← caps width at 480px on desktop, ambient gradient bg
  <TopBar />          ← optional right action slot
  <PageBody>          ← px-5, pb-28 (reserves space for floating nav), gap-6
    {page content}
  </PageBody>
  <BottomNav role="depositor|staff" />   ← fixed floating glass pill
</MobileShell>
```

`BottomNav` is role-aware and selects between `depositorNav` and `staffNav` arrays defined in `bottom-nav.tsx`. The active indicator uses Framer Motion `layoutId="nav-active"` for a shared-element spring animation.

### Design tokens

`tailwind.config.ts` mirrors `Style_guide.jsonc` exactly — this is the single source of truth for all colors, radii, shadows, and motion values. Do not hardcode hex values or shadow strings inline; use the token names (`primary-500`, `shadow-glow`, `rounded-xl`, `duration-fast`, etc.).

Key semantic tokens:
- **Surfaces:** `bg-gray-950` (ink) → `bg-gray-850` (surface) → `bg-gray-800` (elevated)
- **Primary:** emerald (`primary-500 = #22c55e`) — actions, confirmations, active states only
- **Secondary:** warm tan (`secondary-500 = #b67f4b`) — premium warmth, used sparingly
- **CSS component classes** defined in `globals.css`: `.mobile-shell`, `.surface-card`, `.pressable`, `.status-pill`, `.skeleton`, `.glass-nav`, `.divider-soft`

### Data layer

All data is static mock data in `src/lib/mock-data.ts`. There is no backend or state management library. Pages import directly from `mock-data` and render synchronously (no `use client` needed on most pages).

Core types are in `src/lib/types.ts`. The item lifecycle is strictly `pending → deposited → claimed` — the type comment explicitly says not to expand this.

### Camera features

- **QR display** (`src/components/qr/qr-display.tsx`): renders a QR code to a `<canvas>` using the `qrcode` npm package with pulse-glow animation.
- **QR scanner** (`src/components/qr/qr-scanner.tsx`): uses `getUserMedia` + the browser's `BarcodeDetector` API with a graceful fallback to manual entry when the API is unavailable.
- **Item photo capture** (in item creation pages): uses `<input type="file" capture="environment">` so mobile browsers open the rear camera directly.

### Route map

```
/                              Landing (public)
/login  /signup  /forgot-password

Depositor (authenticated):
/home
/batches                       All depositor batches
/batches/new
/batches/[id]                  Batch detail + item list
/batches/[id]/items/new
/batches/[id]/items/[itemId]
/batches/[id]/items/[itemId]/edit
/qr                            QR code display
/notifications
/profile

Staff (authenticated):
/staff                         Dashboard
/staff/scan                    QR scanner
/staff/scan/result
/staff/batches
/staff/batches/[id]
/staff/batches/[id]/items/[itemId]
/staff/profile
```
