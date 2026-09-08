# Bangladesh Talent Atlas — Architecture & Directory Layout

## 1. System Architecture

### Layer 1 — 3D Canvas
Persistent fullscreen `<Canvas>` (React Three Fiber) rendering the 3D Bangladesh mesh, orbital nodes, and particle constellations.

- **Client-only.** R3F/`three` touch `window`/WebGL and cannot be server-rendered. Loaded via `next/dynamic` with `ssr: false`, wrapped in a `<Suspense>` boundary with a lightweight 2D placeholder.
- **Device tiering.** On mount, detects WebGL2 support and capability signals:
  - *No WebGL / reduced motion / `prefers-reduced-motion`* → serves the 2D fallback instead of the 3D scene entirely.
  - *Low-tier mobile GPU* → same scene, capped particle count, lower DPR.
  - *Desktop/high-tier* → full effect budget as specced in the design system doc.
- **Asset loading.** Preload the Bangladesh mesh behind the Suspense fallback.

### Layer 2 — HTML/DOM Overlay
Zero-pointer-event UI layer with pointer-enabled HUD elements (Header, Category Orbit Selector, Detail Slide-overs, Search Bar).
- Carries the **non-3D fallback UI**: filterable/sortable list view of achievers, so the site is fully usable without WebGL.
- Server-rendered where possible so it doesn't depend on the Canvas mounting.

### Layer 3 — State & Data Engine
- **Zustand store**: synchronized UI/camera state.
- **Data layer**: structured seed data mirroring Supabase schema (`achievers`, `countries`, `awards`, `institutions`, `categories`, and `achiever_connections`).
