# Obsidian Document Templates

## \_index.md template

```markdown
---
project: { { project_name } }
updated: { { date } }
type: index
---

# {{project_name}}

> {{one_line_description}}

## Quick Navigation

| Document             | Description                 |
| -------------------- | --------------------------- |
| [[agent-context]]    | 🤖 Start here for agent use |
| [[architecture]]     | System design & diagrams    |
| [[features]]         | Feature map                 |
| [[projects]]         | Apps & libs (Nx)            |
| [[api-surface]]      | Services & endpoints        |
| [[state-management]] | Stores & state              |
| [[conventions]]      | Coding conventions          |

## Stack

**Framework**: {{framework}}  
**Language**: {{language}}  
**State**: {{state_management}}  
**Monorepo**: {{nx_version or "N/A"}}

## At a glance

- **Apps**: {{app_count}}
- **Libs**: {{lib_count}}
- **Features**: {{feature_count}}
- **Last analyzed**: {{date}}
```

---

## agent-context.md template

````markdown
---
project: { { project_name } }
updated: { { date } }
type: agent-context
---

# Agent Context: {{project_name}}

> Load this file first. Everything an agent needs to work in this project.

## Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Framework | {{e.g. Angular 17}}      |
| Language  | TypeScript {{version}}   |
| State     | {{e.g. NgRx}}            |
| Styling   | {{e.g. Tailwind + SCSS}} |
| Build     | {{e.g. Nx 18, Vite}}     |
| Testing   | {{e.g. Jest, Cypress}}   |
| API       | {{e.g. REST, GraphQL}}   |

## Project Map (Nx)

| Name        | Type | Role                 | Tags                       |
| ----------- | ---- | -------------------- | -------------------------- |
| `app-web`   | app  | Main web app         | scope:web                  |
| `app-admin` | app  | Admin panel          | scope:admin                |
| `lib-auth`  | lib  | Auth logic           | scope:shared, type:feature |
| `lib-ui`    | lib  | Shared UI components | scope:shared, type:ui      |

## Feature Map

| Feature   | Path                      | Routes                | Key Files                          |
| --------- | ------------------------- | --------------------- | ---------------------------------- |
| Auth      | `libs/auth/`              | `/login`, `/register` | `auth.service.ts`, `auth.store.ts` |
| Dashboard | `apps/web/src/dashboard/` | `/dashboard`          | `dashboard.component.ts`           |

## Critical Files

| File                                | Why It Matters      |
| ----------------------------------- | ------------------- |
| `apps/web/src/app/app.routes.ts`    | All routes          |
| `libs/auth/src/lib/auth.service.ts` | Auth logic          |
| `nx.json`                           | Nx workspace config |
| `tsconfig.base.json`                | Path aliases        |

## Path Aliases

| Alias         | Resolves To              |
| ------------- | ------------------------ |
| `@myapp/auth` | `libs/auth/src/index.ts` |
| `@myapp/ui`   | `libs/ui/src/index.ts`   |

## Naming Conventions

- Files: `kebab-case.type.ts` (e.g. `user-profile.component.ts`)
- Classes: `PascalCase`
- Interfaces: `IPascalCase` or `PascalCase` (note which one!)
- Stores: `{{entity}}.store.ts` in `libs/{{entity}}/src/lib/`

## Common Commands

```bash
# Run app
nx serve web

# Build
nx build web --configuration=production

# Test
nx test lib-auth

# Generate component (Angular)
nx g @nx/angular:component my-comp --project=web

# Affected
nx affected --target=test
```
````

## Gotchas & Notes

- {{e.g. "Always import from barrel index.ts, never from deep paths"}}
- {{e.g. "Auth guard must be added to all private routes"}}
- {{e.g. "API base URL is in environment.ts, not hardcoded"}}

## Shared Libs (used everywhere)

| Lib         | Exports                    | Used By    |
| ----------- | -------------------------- | ---------- |
| `lib-ui`    | Button, Input, Modal, etc. | all apps   |
| `lib-auth`  | AuthService, AuthGuard     | web, admin |
| `lib-utils` | pipes, validators          | all libs   |

````

---

## architecture.md template

```markdown
---
project: {{project_name}}
updated: {{date}}
type: architecture
---

# Architecture: {{project_name}}

## Pattern
{{e.g. "Feature-based Nx monorepo with domain-driven libs. Apps are thin shells, features live in libs."}}

## High-Level Diagram

```mermaid
graph TB
    subgraph Apps
        WEB[app-web<br/>Angular SPA]
        ADMIN[app-admin<br/>Angular Admin]
    end

    subgraph Shared Libs
        AUTH[lib-auth<br/>Auth & Guards]
        UI[lib-ui<br/>UI Components]
        UTILS[lib-utils<br/>Utilities]
    end

    subgraph Feature Libs
        DASH[lib-dashboard<br/>Dashboard Feature]
        PROFILE[lib-profile<br/>User Profile]
    end

    WEB --> AUTH
    WEB --> DASH
    WEB --> PROFILE
    WEB --> UI
    ADMIN --> AUTH
    ADMIN --> UI
    DASH --> UI
    DASH --> UTILS
    AUTH --> UTILS
````

## Layers

| Layer        | Responsibility                | Examples                       |
| ------------ | ----------------------------- | ------------------------------ |
| Apps         | Routing, shell, bootstrapping | `app-web`, `app-admin`         |
| Feature libs | Business features             | `lib-dashboard`, `lib-profile` |
| Shared libs  | Cross-cutting concerns        | `lib-auth`, `lib-ui`           |
| Data libs    | API calls, state              | `lib-api`, `lib-store`         |

## Data Flow

```mermaid
sequenceDiagram
    Component->>Store: dispatch(action)
    Store->>Effects: action$
    Effects->>API Service: http call
    API Service-->>Effects: response
    Effects-->>Store: dispatch(success)
    Store-->>Component: select(state)
```

## Key Decisions

- {{e.g. "NgRx for global state, component state for local UI only"}}
- {{e.g. "All API calls go through libs/api, never from components"}}

````

---

## features.md template

```markdown
---
project: {{project_name}}
updated: {{date}}
type: features
---

# Features: {{project_name}}

## Feature Overview
| Feature | Status | Path | Description |
|---------|--------|------|-------------|
| Auth | ✅ | `libs/auth/` | Login, register, JWT refresh |
| Dashboard | ✅ | `libs/dashboard/` | Main overview, charts |
| Profile | ✅ | `apps/web/src/profile/` | User settings |
| Notifications | 🚧 | `libs/notifications/` | Real-time alerts |

## Route Map
| Route | Feature | Guard | Component |
|-------|---------|-------|-----------|
| `/login` | Auth | — | LoginComponent |
| `/dashboard` | Dashboard | AuthGuard | DashboardComponent |
| `/profile/:id` | Profile | AuthGuard | ProfileComponent |
| `/admin/*` | Admin | AdminGuard | (lazy loaded) |

## Feature Details

### Auth
- **Purpose**: Handles user authentication and session management
- **Key files**:
  - `libs/auth/src/lib/auth.service.ts` — JWT logic
  - `libs/auth/src/lib/auth.guard.ts` — Route guard
  - `libs/auth/src/lib/auth.store.ts` — User state
- **Dependencies**: `lib-api`, `lib-utils`
- **Notes**: Token refresh happens automatically via HTTP interceptor

### Dashboard
...
````

---

## conventions.md template

```markdown
---
project: { { project_name } }
updated: { { date } }
type: conventions
---

# Conventions: {{project_name}}

## File Naming

| Type            | Pattern                   | Example                  |
| --------------- | ------------------------- | ------------------------ |
| Component       | `kebab-case.component.ts` | `user-card.component.ts` |
| Service         | `kebab-case.service.ts`   | `auth.service.ts`        |
| Store           | `entity.store.ts`         | `user.store.ts`          |
| Model/Interface | `entity.model.ts`         | `user.model.ts`          |
| Guard           | `entity.guard.ts`         | `auth.guard.ts`          |

## Import Rules

- Always import from barrel `index.ts`, never from deep paths
- Nx enforces module boundaries via tags — check `nx.json` for rules
- No cross-domain imports (e.g. `lib-orders` cannot import from `lib-users`)

## Component Structure
```

feature/
├── components/ # Dumb/presentational components
├── containers/ # Smart/connected components
├── services/ # Feature-local services
├── store/ # NgRx store (if feature has local state)
├── models/ # Interfaces and types
└── index.ts # Public API (barrel)

```

## Git Conventions
- Branch: `feat/`, `fix/`, `chore/`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`)
- PR: linked to Jira/Linear ticket

## Testing
- Unit tests: Jest, co-located `*.spec.ts`
- E2E: Cypress in `apps/*/e2e/`
- Coverage threshold: {{e.g. 80%}}
```
