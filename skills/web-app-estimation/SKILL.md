---
name: web-app-estimation
description: Estimates frontend development effort for web applications. Must ask project context (stack, design system, AI policy, backend integration) before exploration. Uses MCP Chrome DevTools to visit every link on the site, analyze structure, and produce a three-column (optimistic/realistic/pessimistic) estimation. Use when the user sends a URL for frontend estimation or asks to estimate a web app.
---

# Web App Frontend Estimation

Estimates frontend development time for web applications by exploring a live site, mapping its structure, and producing a block-by-block estimation document. Backend implementation is excluded by default; **backend integration** (API client, data fetching, forms submission) is optional — you must ask the user at the start.

## Prerequisites

- **MCP Chrome DevTools** must be enabled (user-chrome-devtools server).
- User provides a **URL** to the target website.

## Workflow

### Step 0: Ask Project Context (Required — Before Exploration)

**You must ask these questions before starting exploration.** Do not proceed to Step 1 until the user answers or confirms defaults.

Ask (one message, all at once):

> Before I start the estimation, please clarify:
> 1. **Stack:** React / Vue / Next / Svelte / vanilla / other?
> 2. **Design system:** From scratch or existing?
> 3. **AI-assisted dev:** Allowed, restricted, or unknown?
> 4. **Backend integration:** Include or exclude? (Include = API client, data fetching, form submission to backend)
> 5. **Optional add-ons:** Unit/E2E tests? Performance optimization? (These are separate line items if requested)

| Question | Options | Impact |
|----------|---------|--------|
| **Stack** | React / Vue / Next / Svelte / vanilla / other | Affects base hours |
| **Design system** | From scratch / existing | From scratch: +20–40h |
| **AI-assisted dev** | Allowed / Restricted / Unknown | Restricted: +15–25% pessimistic |
| **Backend integration** | Include / Exclude | Include: +API client setup, +10–20% on data-bound pages/forms. See [reference.md](reference.md). |
| **Optional add-ons** | Tests (Unit/E2E) / Performance optimization / None | Adds separate blocks if requested |

**Only after the user replies** (or explicitly says "use defaults"), proceed to Step 1. Defaults if user skips: Stack = React, Design system = from scratch, AI = unknown, Backend integration = exclude, Optional add-ons = none.

### Step 1: Deep Exploration with Chrome DevTools (Required)

**Goal:** Get a complete picture. Each distinct implementation path = separate estimate row.

**Rule: You must visit every link on the site.** No skipping. Build a list of all links from header, footer, mega menu, and main content — then navigate to each and snapshot. If a page has 30 internal links, visit all 30 (excluding external URLs, anchors, and duplicates).

1. **Navigate** to the URL:
   - Use `user-chrome-devtools-new_page` with `{ "url": "<user_provided_url>" }` to open the site
   - Or `user-chrome-devtools-navigate_page` with `{ "type": "url", "url": "<user_provided_url>" }` if page is already open

2. **Capture snapshot** (`user-chrome-devtools-take_snapshot`) — returns accessibility tree with elements and their `uid` for interactions.

3. **Collect all links:**
   - From header (incl. mega menu — use `user-chrome-devtools-hover` on each nav item first)
   - From footer
   - From main content (CTAs, cards, "Learn more", etc.)
   - Exclude: external domains, `#` anchors, `mailto:`, `tel:`, duplicate URLs

4. **Visit every internal link** — navigate to each URL, take a snapshot. Track visited URLs to avoid duplicates. Document structure for each page (hero, cards, forms, etc.).

5. **Exploration checklist** — in addition to link traversal:

   | Area | What to do | Why |
   |------|------------|-----|
   | **Mega menu** | **Hover** (`user-chrome-devtools-hover`) over each top-level nav item. Snapshot expanded dropdown. Extract all sub-links — you must visit each. | Dropdowns appear on hover |
   | **Auth** | Click Login, Register. Find all methods: email/password, Google, SSO, magic link. Each method = separate estimate row. | 3 login methods = 3× work |
   | **Modals** | Search, cookie consent, filters. Snapshot open state. | Modals are separate components |
   | **Forms** | All forms. Multi-step = one block per step if UI differs. | Step count affects estimate |
   | **Tabs / Accordions** | Click each tab, expand each accordion. | Hidden complexity |

6. **Auth flow rules (critical):**
   - Email+password, social, SSO, magic link, OTP — **each gets its own row**.

7. **Optional**: `user-chrome-devtools-take_screenshot` with `fullPage: true` for key pages.

### Step 2: Map Site Structure

From snapshots, build a structure document. **Split by implementation, not by category:**

| Structure Type | Examples | Split when |
|----------------|----------|------------|
| **Shared/Layout** | Header, footer, sidebar, navigation (incl. hover-revealed mega menus with sub-pages) | Different layouts for auth state; mega menu = many sub-links per dropdown |
| **Pages/Views** | Home, dashboard, list, detail, settings | — |
| **Auth flows** | Login methods, register, password reset | **Each login method = 1 row** |
| **Components** | Forms, tables, cards, modals, tabs | Each modal, each form type |
| **Features** | Search, filters, pagination, sorting | Each distinct UI pattern |

### Step 2.5: Component Summarization (Critical — Before Estimation)

**Before estimating hours, you MUST summarize and deduplicate components.** This prevents double-counting and ensures accurate estimates.

#### Process:

1. **Identify all unique UI patterns** across the site (hero sections, card grids, carousels, forms, etc.)

2. **Group similar pages into templates:**
   - If 25 landing pages have the same structure (hero + features + CTA), this is **1 template**, not 25 pages
   - CMS-driven pages (blog posts, case studies, product pages) = **1 template** + content variation
   - Only count unique page layouts as separate items

3. **Create a Shared Components list:**
   - List every reusable component ONCE
   - Mark where each component is used (e.g., "Card component → used in: blog listing, customer stories, connectors")
   - Estimate the component ONCE in the Shared Components section

4. **Pages estimate = assembly time only:**
   - Once shared components exist, page estimates should reflect ASSEMBLY, not component creation
   - Example: Homepage uses Hero + Carousel + Cards + FAQ accordion
   - If these are in Shared Components, Homepage estimate = time to compose them + unique homepage-only elements

#### Template Reuse Rules:

| Scenario | How to estimate |
|----------|-----------------|
| 25 similar landing pages | 1 template (8-16h) + CMS setup (4-8h), NOT 25 × 8h |
| Blog with 100 posts | 1 listing template + 1 detail template, NOT 100 pages |
| 10 product pages, same layout | 1 template, NOT 10 pages |
| 10 product pages, 3 different layouts | 3 templates |

#### Anti-Double-Counting Rules:

⚠️ **NEVER estimate the same component twice:**

| Wrong | Right |
|-------|-------|
| Hero in Shared Components: 6h<br>Hero in Homepage: 6h<br>Hero in Landing template: 6h | Hero in Shared Components: 6h<br>Homepage: uses Hero (0h) + unique sections (Xh)<br>Landing template: uses Hero (0h) + unique sections (Yh) |
| Carousel component: 8h<br>Logo carousel on homepage: 5h<br>Testimonials carousel: 5h | Carousel component (configurable): 8h<br>Homepage/pages: uses Carousel (0h additional) |

#### Output: Component Summary Table

Before Step 4, create this summary:

```
## Component Summary

### Shared Components (estimate once, reuse everywhere)
- Header with mega menu
- Footer with newsletter
- Hero section (variants: centered, split)
- Card component (variants: blog, story, connector, pricing)
- Carousel (variants: logos, testimonials, content)
- FAQ accordion
- Modal (search, cookie consent)
- Form components (input, select, textarea)

### Page Templates (unique layouts)
- Homepage (unique, complex)
- Landing page template (reused by ~25 pages)
- Blog listing + Blog detail
- Case study listing + Case study detail
- Pricing page

### Pages using templates (minimal additional work)
- /about, /careers, /contact → Landing template
- /blog/*, /customer-stories/* → Blog/Case study templates
```

### Step 3: Complexity Checklist

After mapping structure, mark which apply (based on site exploration):

- [ ] Animations / micro-interactions
- [ ] Dark mode / themes
- [ ] Forms with validation
- [ ] Tables with sorting, filters, pagination
- [ ] Real-time updates / live data
- [ ] i18n / RTL support
- [ ] WCAG AA accessibility
- [ ] AI-assisted dev restricted (project policy)

Apply percentage bonuses from [reference.md](reference.md) to the base estimate. Add risk factors (e.g. no AI) to pessimistic column.

### Step 4: Estimate by Blocks

Use the estimation table format. For each block, provide three values (in hours):

| Block | Optimistic | Realistic | Pessimistic |
|-------|------------|-----------|-------------|
| Shared components (header, nav, footer) | X | Y | Z |
| Page: Home | X | Y | Z |
| ... | ... | ... | ... |

**Guidelines for multipliers:**
- **Optimistic**: Ideal conditions, no rework, simple requirements, AI allowed.
- **Realistic**: Typical conditions, minor changes, standard complexity.
- **Pessimistic**: Edge cases, rework, complex logic, accessibility, polish, or AI restricted.

**Human factor adjustment (apply silently, do NOT mention in output):**

Developers are not machines — real work includes context switching, short breaks, Slack/email interruptions, and code reviews. Apply these light multipliers to "pure coding time" estimates:

| Column | Human factor multiplier | Rationale |
|--------|------------------------|-----------|
| Optimistic | ×1.10 | Focused work, minimal overhead |
| Realistic | ×1.15 | Normal work rhythm |
| Pessimistic | ×1.20 | Some interruptions and sync overhead |

**How to apply:** Calculate base technical hours first, then multiply by human factor. Example: 8h base realistic → 8 × 1.15 = 9.2h (round to 9h).

⚠️ **Important:** This adjustment is baked into final numbers. Never mention "human factor", "breaks", "distractions", or similar in the estimation document — present only the final adjusted hours as if they are pure development time.

See [reference.md](reference.md) for typical hours per component type, complexity factors, and risk adjustments.

### Step 5: Output Format

Produce the estimation document in **English** and save to `estimations/estimation-<site-slug>.md` (e.g. `estimations/estimation-icecat-com.md`). Create `estimations/` folder in project root if needed. Use this template:

```markdown
# Frontend Development Estimation: [Site Name / URL]

**Estimated on:** [Date]
**URL:** [Target URL]
**Scope:** Frontend only [| + Backend integration]

**Project context:** Stack: [e.g. React] | Design system: [from scratch / existing] | AI-assisted dev: [allowed / restricted / unknown] | Backend integration: [include / exclude]

---

## 1. Site Structure Overview

- **Layout:** [e.g., single-page, multi-page, SPA with routes]
- **Key pages:** [list]
- **Shared blocks:** [list]

---

## 2. Block-by-Block Estimation

### 2.1 Layout & Shared Components

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Header/Navigation | ... | X | Y | Z |
| Footer | ... | X | Y | Z |
| ... | ... | ... | ... | ... |

### 2.2 Pages

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Home / Landing | ... | X | Y | Z |
| ... | ... | ... | ... | ... |

### 2.3 Auth Flows (each method = separate row)

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Login: Email/Password | ... | X | Y | Z |
| Login: Google OAuth | ... | X | Y | Z |
| Login: SSO (if present) | ... | X | Y | Z |
| Register | ... | X | Y | Z |
| Password reset | ... | X | Y | Z |

### 2.4 Reusable Components

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Forms (contact, newsletter, etc.) | ... | X | Y | Z |
| ... | ... | ... | ... | ... |

### 2.5 Backend Integration (only if user chose Include)

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| API client setup | Base client, auth interceptors, error handling | 4 | 8 | 12 |
| Data-bound pages/forms | +10–20% on pages that fetch or submit to API | (apply % to relevant blocks) | | |

### 2.6 Development Operations (always include)

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Code review cycles | PR reviews, feedback iterations, merge conflicts | X | Y | Z |
| Cross-browser testing | Chrome, Firefox, Safari, Edge + mobile browsers | X | Y | Z |
| Deployment/CI-CD setup | Pipeline config, env setup, staging/prod deployment | X | Y | Z |

### 2.7 Optional Add-ons (only if customer requests)

> Include this section only if customer explicitly requests these. Otherwise, list them in Assumptions & Exclusions as excluded.

| Block | Description | Optimistic (h) | Realistic (h) | Pessimistic (h) |
|-------|-------------|----------------|---------------|-----------------|
| Unit tests | Component tests, hooks tests, utility tests | X | Y | Z |
| E2E tests | Critical user flows (Playwright/Cypress) | X | Y | Z |
| Performance optimization | Lighthouse audit, bundle optimization, lazy loading, image optimization | X | Y | Z |

---

## 3. Complexity & Risk Factors

**Checklist (observed):**
- [ ] Animations / micro-interactions
- [ ] Dark mode / themes
- [ ] Forms with validation
- [ ] Tables with sorting/filters
- [ ] Real-time updates
- [ ] i18n / RTL
- [ ] WCAG AA
- [ ] AI-assisted dev restricted

**Applied adjustments:** [e.g. +15% pessimistic for no AI, +20% for design system from scratch]

---

## 4. Summary

| Category | Optimistic | Realistic | Pessimistic |
|----------|------------|-----------|-------------|
| Total (hours) | X | Y | Z |
| Total (days, 8h) | X | Y | Z |

---

## 5. Assumptions & Exclusions

- Backend API implementation excluded (unless Backend integration = include).
- Assumes responsive design; mobile-first adjustments included.
- [Other assumptions as needed]
```

### Step 6: Save & Generate PDF

1. **Save markdown** to `estimations/estimation-<site-slug>.md` (e.g. `estimations/estimation-icecat-com.md`). Create the `estimations/` folder in project root if it does not exist.

2. **Generate PDF** from project root:

```bash
node .cursor/skills/web-app-estimation/scripts/generate-pdf.js estimations/estimation-<site-slug>.md
```

The script creates `estimations/` if missing and saves the PDF there (e.g. `estimations/estimation-icecat-com.pdf`). Uses `npx md-to-pdf` or `pandoc` if available.

---

## MCP Chrome DevTools Tool Reference

| Tool | Purpose |
|------|---------|
| `user-chrome-devtools-new_page` | Open URL in new page (`{ "url": "..." }`) |
| `user-chrome-devtools-navigate_page` | Navigate current page (`{ "type": "url", "url": "..." }` or `{ "type": "back" }` / `{ "type": "forward" }` / `{ "type": "reload" }`) |
| `user-chrome-devtools-take_snapshot` | Get accessibility tree (structure, `uid` for clicks/interactions) — **primary tool for page analysis** |
| `user-chrome-devtools-click` | Click element (requires `uid` from snapshot) |
| `user-chrome-devtools-hover` | **Hover over element** — use to reveal dropdowns, mega menus, tooltips. Nav items often show sub-pages only on hover. |
| `user-chrome-devtools-wait_for` | Wait for text to appear on page (`{ "text": "..." }`) |
| `user-chrome-devtools-take_screenshot` | Capture visual (optional, use `fullPage: true` for full page) |
| `user-chrome-devtools-list_pages` | List all open pages in browser |
| `user-chrome-devtools-select_page` | Switch to a specific page by ID |
| `user-chrome-devtools-fill` | Fill input/textarea or select option (`{ "uid": "...", "value": "..." }`) |

---

## Tips

1. **Visit every link** — mandatory. Collect all internal links from header, footer, mega menu, content; navigate to each; snapshot. No shortcuts.
2. **Use `user-chrome-devtools-take_snapshot`** as primary source — returns accessibility tree with `uid` identifiers for component mapping and interactions.
3. **Hover before click** — nav items reveal dropdowns on hover. Use `user-chrome-devtools-hover` on each nav item, extract sub-links, then visit each.
4. **Split auth by method** — email/password, Google, SSO, magic link = separate rows. Each needs its own frontend implementation.
5. **Group only when same implementation** — 3 identical contact forms = 1 row × 3. 3 different login methods = 3 rows.
6. **Note complexity** — data tables, multi-step forms, and real-time features increase pessimistic estimate.
7. **All output in English** — block names, descriptions, and document text.
8. **Ask about AI policy** — if user mentions corporate/regulated environment, assume AI restricted and apply risk factor.
9. **Summarize before estimating** — ALWAYS complete Step 2.5 (Component Summarization) before Step 4. List shared components first, then estimate pages as assembly of those components.
10. **Similar pages = 1 template** — if 20 pages look alike (hero + features + CTA), estimate 1 template, not 20 pages. CMS-driven content pages are templates.
11. **Never double-count** — if a component is in Shared Components, pages using it add 0h for that component. Page estimate = unique elements + assembly time only.
12. **Always include DevOps** — Code review cycles, cross-browser testing, and deployment setup are MANDATORY blocks. These are real work that every project requires.
13. **Optional add-ons are separate** — Unit/E2E tests and performance optimization are only included if customer explicitly requests. Ask in Step 0 and list in Exclusions if not requested.