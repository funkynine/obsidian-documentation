# Estimation Reference: Typical Hours per Component

Use these ranges as a baseline. Adjust for complexity, animations, accessibility, and design system reuse.

## Multipliers for Three Columns

| Column | Multiplier | Conditions |
|--------|------------|------------|
| **Optimistic** | 0.6–0.7× base | Clean design specs, familiar stack, no edge cases |
| **Realistic** | 1.0× base | Normal requirements, typical rework, standard a11y |
| **Pessimistic** | 1.4–1.8× base | Complex logic, many edge cases, full a11y |

---

## Layout & Shared Components (hours)

| Component | Simple | Medium | Complex |
|-----------|--------|--------|---------|
| Header / Nav (desktop) | 2–4 | 4–8 | 8–16 |
| Header with mega menu (hover-revealed dropdowns, 5+ sub-pages per nav item) | 8–12 | 12–20 | 20–32 |
| Mobile hamburger menu | 1–2 | 2–4 | 4–8 |
| Footer | 1–2 | 2–4 | 4–6 |
| Sidebar | 2–4 | 4–8 | 8–12 |
| Breadcrumbs | 0.5–1 | 1–2 | 2–3 |
| Layout wrapper (responsive) | 2–4 | 4–6 | 6–10 |

---

## Pages / Views (hours)

| Page Type | Simple | Medium | Complex |
|-----------|--------|--------|---------|
| Landing (hero + sections) | 4–8 | 8–16 | 16–24 |
| List/Grid view | 4–8 | 8–16 | 16–24 |
| Detail view | 2–4 | 4–8 | 8–16 |
| Dashboard | 8–16 | 16–24 | 24–40 |
| Settings | 4–8 | 8–12 | 12–20 |
| Auth (login/register) | 2–4 | 4–8 | 8–12 |
| Auth: Email/Password only | 2–4 | 4–6 | 6–10 |
| Auth: + Social (Google, etc.) | +2–4 | +4–6 | +6–10 per provider |
| Auth: + SSO (SAML/OIDC) | +4–6 | +6–10 | +10–16 |
| Auth: Magic link / OTP | +1–2 | +2–4 | +4–6 |
| 404 / Error pages | 0.5–1 | 1–2 | 2–4 |

---

## Reusable Components (hours)

| Component | Simple | Medium | Complex |
|-----------|--------|--------|---------|
| Button, Badge, Tag | 0.5–1 | 1–2 | 2–3 |
| Input, Select, Checkbox | 1–2 | 2–4 | 4–6 |
| Form (single, basic) | 2–4 | 4–8 | 8–12 |
| Form (multi-step, validation) | 4–8 | 8–16 | 16–24 |
| Modal / Dialog | 1–2 | 2–4 | 4–8 |
| Tabs | 1–2 | 2–4 | 4–6 |
| Table (basic) | 2–4 | 4–8 | 8–12 |
| Table (sorting, filters, pagination) | 4–8 | 8–16 | 16–24 |
| Card | 1–2 | 2–4 | 4–6 |
| Dropdown / Autocomplete | 1–2 | 2–4 | 4–8 |
| File upload | 2–4 | 4–8 | 8–12 |
| Date picker | 2–4 | 4–6 | 6–10 |
| Toast / Notification | 1–2 | 2–3 | 3–5 |
| Skeleton loader | 0.5–1 | 1–2 | 2–3 |

---

## Complexity Factors (adjust estimates up)

- **Animations / micro-interactions**: +10–30%
- **Dark mode / themes**: +15–25%
- **Full accessibility (WCAG AA)**: +20–40%
- **i18n / RTL**: +15–25%
- **Responsive (mobile-first)**: +20–40% over desktop-only
- **Design system from scratch**: add 20–40h for tokens, typography, spacing

## Backend Integration (frontend side)

When user asks to include backend integration (API client, data fetching, forms submission):

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| API client setup | Base HTTP client (fetch/axios), auth interceptors, error handling, request/response types | 4 | 8 | 12 |
| Data-bound pages | Pages that fetch from API (list, detail, dashboard) | +10% | +15% | +20% on those blocks |
| Forms with submission | Forms that POST/PUT to backend (register, contact, demo) | +2–4 h each | +4–6 h each | +6–10 h each |

**Total:** API setup + percentage on data views + per-form overhead. Do not estimate backend API implementation.

---

## Development Operations (always include)

These are standard development activities that should **always** be included in estimates.

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Code review cycles | PR reviews, addressing feedback, iterations, merge conflicts | 8 | 12 | 18 |
| Cross-browser testing | Chrome, Firefox, Safari, Edge + iOS Safari, Android Chrome | 6 | 10 | 14 |
| Deployment/CI-CD setup | Pipeline config (GitHub Actions/GitLab CI), env variables, staging/prod setup | 4 | 8 | 12 |

**Scaling:**
- Small project (< 20 components): use lower ranges
- Medium project (20-50 components): use mid ranges
- Large project (50+ components): use upper ranges or multiply by 1.5×

---

## Optional Add-ons (only if customer requests)

Include these **only** if the customer explicitly requests them. Otherwise, list in Assumptions & Exclusions as excluded.

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Unit tests | Component tests (React Testing Library/Vitest), hooks tests, utility tests | 15 | 25 | 40 |
| E2E tests | Critical user flows with Playwright/Cypress (5-10 flows) | 12 | 20 | 30 |
| Performance optimization | Lighthouse audit fixes, bundle analysis, code splitting, lazy loading, image optimization | 8 | 14 | 22 |

**Scaling for tests:**
- Per 10 components: Unit tests +4-8h realistic
- Per critical flow: E2E tests +2-4h realistic
- For large apps (50+ components): multiply test estimates by 1.5-2×

---

## Risk Factors (adjust pessimistic, sometimes realistic)

- **AI-assisted dev restricted**: +15–25% on pessimistic (and +5–10% on realistic if likely). Many teams or projects prohibit or limit AI tools (privacy, compliance, policy), which slows down boilerplate, refactoring, and repetitive tasks.
- **Unclear requirements / no design specs**: +10–20% pessimistic
- **Legacy codebase integration**: +15–30% realistic and pessimistic

---

## Examples

**Simple shared header (logo + 5 nav links, responsive):**
- Optimistic: 3h | Realistic: 5h | Pessimistic: 8h

**Data table with sorting, filters, pagination:**
- Optimistic: 10h | Realistic: 16h | Pessimistic: 24h

**Landing page (hero, features, testimonials, CTA):**
- Optimistic: 8h | Realistic: 14h | Pessimistic: 22h

**With AI restricted (additive to pessimistic):**
- Same landing: Pessimistic 22h × 1.2 ≈ 26h
