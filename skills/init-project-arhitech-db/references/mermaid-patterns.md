# Mermaid Patterns for Project Documentation

## Nx Dependency Graph

Use when: documenting which apps/libs depend on which.

```mermaid
graph LR
    subgraph apps
        A[app-web]
        B[app-admin]
    end
    subgraph feature-libs
        C[lib-dashboard]
        D[lib-profile]
    end
    subgraph shared-libs
        E[lib-auth]
        F[lib-ui]
        G[lib-utils]
    end

    A --> C
    A --> D
    A --> E
    B --> E
    C --> F
    D --> F
    E --> G
    F --> G
```

## Layer Architecture

Use when: showing how the system is organized in layers.

```mermaid
graph TB
    Browser["🌐 Browser"]
    App["📱 Angular App (Shell)"]
    Features["🧩 Feature Modules"]
    State["📦 NgRx Store"]
    API["🔌 API Services"]
    Backend["🖥️ Backend API"]

    Browser --> App
    App --> Features
    Features --> State
    State --> API
    API --> Backend
```

## Data Flow (NgRx)

Use when: explaining state management flow.

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Store
    participant E as Effects
    participant A as API Service

    C->>S: dispatch(LoadUsers)
    S->>E: actions$ filtered
    E->>A: getUsers()
    A-->>E: users[]
    E-->>S: dispatch(LoadUsersSuccess)
    S-->>C: select(users$)
```

## Feature Module Structure

Use when: showing internal structure of a feature lib.

```mermaid
graph TD
    Index["index.ts (public API)"]
    Container["containers/"]
    Components["components/"]
    Store["store/"]
    Services["services/"]
    Models["models/"]

    Index --> Container
    Container --> Components
    Container --> Store
    Container --> Services
    Store --> Services
    Services --> Models
```

## Auth Flow

Use when: documenting authentication.

```mermaid
flowchart TD
    Start([User visits route])
    Guard{AuthGuard}
    Token{Token valid?}
    Refresh{Can refresh?}
    Login[Redirect to /login]
    Allow[Allow navigation]

    Start --> Guard
    Guard --> Token
    Token -- Yes --> Allow
    Token -- No --> Refresh
    Refresh -- Yes --> Allow
    Refresh -- No --> Login
```

## Module Boundary Rules (Nx tags)

Use when: showing which libs can import which.

```mermaid
graph LR
    subgraph "✅ Allowed"
        A1[app] -->|can import| F1[type:feature]
        F1 -->|can import| U1[type:ui]
        F1 -->|can import| D1[type:data-access]
        U1 -->|can import| U2[type:util]
    end

    subgraph "❌ Forbidden"
        U3[type:ui] -.-x|cannot import| F2[type:feature]
        U4[type:util] -.-x|cannot import| D2[type:data-access]
    end
```
