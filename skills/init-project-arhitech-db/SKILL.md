---
name: init-project-arhitech-db
description: >
  Analyzes a software project (Nx monorepo or any JS/TS project) and generates structured
  agent-ready documentation, saving it as an organized folder in Obsidian vault. Use this
  skill whenever a user wants to document a project for an AI agent, create Obsidian notes
  from a codebase, analyze an Nx workspace and save results, generate a project knowledge
  base, map project architecture to Obsidian, onboard an agent to a project, or create
  living documentation for a monorepo. Trigger even if the user says things like
  "document my project", "create notes about my codebase", "help agent understand my
  project", or "analyze project structure".
---

# init-project-arhitech-db

Analyzes a software project and creates a rich, agent-ready documentation folder in Obsidian. Works with Nx monorepos (via Nx MCP) or any JS/TS project (via filesystem analysis).

## Overview

The skill produces two output modes:

1. **Agent Context** — compact, structured notes optimized for AI agent consumption
2. **Human Docs** — readable documentation with diagrams and explanations

Both are saved as markdown files in a per-project Obsidian folder.

---

## Step 0: Gather inputs

Before starting, confirm from the user:

- **Project path** (local filesystem path, e.g. `/Users/me/projects/my-app`)
- **Obsidian vault path** (e.g. `/Users/me/Documents/ObsidianVault`)
- **Output folder name** inside vault (default: project name from `package.json` or dir name)
- **Analysis mode**: Nx workspace? Plain JS/TS? Auto-detect if unsure.
- **Modes to generate**: Agent Context only / Human Docs only / Both (default: Both)

If Nx MCP is available in the environment, prefer it. Otherwise fall back to filesystem.

---

## Step 1: Detect project type

```bash
# Check if it's an Nx monorepo
ls <project_path>/nx.json 2>/dev/null && echo "NX" || echo "PLAIN"

# Read package.json
cat <project_path>/package.json
```

If `nx.json` exists → use **Nx Analysis** (Step 2A).  
Otherwise → use **Filesystem Analysis** (Step 2B).

---

## Step 2A: Nx Analysis (if Nx MCP available)

Use Nx MCP tools in this order:

1. `nx_workspace` — get full workspace config (projects, targets, tags)
2. `nx_project_details` for each app/lib — get targets, dependencies, config
3. `nx_graph` — get the dependency graph between projects
4. `nx_lint_workspace` (optional) — check for issues

Extract and record:

- List of all **apps** (name, type, root path, tags)
- List of all **libs** (name, type, scope, root path, tags)
- **Dependency graph** between projects (who imports whom)
- Each project's **main targets** (build, test, lint, serve, deploy)
- **Shared libs** (imported by 3+ projects) — mark as critical
- **Entry points** (main.ts, index.ts) for each project

If Nx MCP is NOT available but project is Nx, parse manually:

```bash
cat <project_path>/nx.json
find <project_path> -name "project.json" -not -path "*/node_modules/*"
```

---

## Step 2B: Filesystem Analysis (plain or fallback)

```bash
# Project structure (2 levels deep, excluding noise)
find <project_path> -maxdepth 3 \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.nx/*" \
  -not -path "*/coverage/*" \
  | sort

# Key config files
cat <project_path>/tsconfig*.json 2>/dev/null
cat <project_path>/.eslintrc* 2>/dev/null || cat <project_path>/eslint.config* 2>/dev/null

# Find main entry points
find <project_path>/src -name "main.ts" -o -name "index.ts" -o -name "app.module.ts" \
  2>/dev/null | head -20
```

For each major source directory (apps/, libs/, src/), extract:

- Folder names → likely feature/domain names
- Core files (router, store, services, modules)

---

## Step 3: Deep feature analysis

For the top-level features/domains found in Step 2, do a focused scan:

```bash
# Find all Angular/React/Vue modules or feature folders
find <project_path>/src -maxdepth 4 -type d | grep -v node_modules

# Find routing files
find <project_path> -name "*.routing.ts" -o -name "*-routing.module.ts" \
  -o -name "router.ts" -not -path "*/node_modules/*" | head -20

# Find API service files
find <project_path> -name "*.service.ts" -o -name "*api*.ts" -o -name "*client*.ts" \
  -not -path "*/node_modules/*" | head -30

# Find store/state management
find <project_path> -name "*.store.ts" -o -name "*.reducer.ts" -o -name "*.effects.ts" \
  -not -path "*/node_modules/*" | head -20
```

Read the most important files (routing, main module, key services) to extract:

- Route definitions → list of features
- Service names → API surface
- Store slices → state domains

---

## Step 4: Build the knowledge model

Synthesize findings into this structure (in memory before writing):

```
ProjectKnowledge {
  meta: { name, type, framework, mainStack[] }
  architecture: { type, layers[], pattern }
  projects[]: { name, type, path, role, tags, dependencies[] }
  features[]: { name, path, routes[], services[], store? }
  sharedLibs[]: { name, purpose, usedBy[] }
  entryPoints[]: { project, file, purpose }
  apiSurface[]: { service, methods[], baseUrl? }
  conventions: { naming, fileStructure, stateManagement }
  criticalPaths[]: { description, files[] }
}
```

---

## Step 5: Write Obsidian files

Create the folder: `<vault_path>/<project_name>/`

Write these files (see templates in `references/templates.md`):

### Always create:

| File               | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `_index.md`        | Entry point, links to all other notes        |
| `architecture.md`  | High-level architecture + Mermaid diagram    |
| `projects.md`      | All apps and libs with roles (Nx only)       |
| `features.md`      | Feature map — what the product does          |
| `agent-context.md` | **Compact note optimized for agent loading** |

### If Human Docs mode:

| File                  | Purpose                          |
| --------------------- | -------------------------------- |
| `api-surface.md`      | Services, endpoints, patterns    |
| `state-management.md` | Stores, reducers, effects        |
| `conventions.md`      | Naming, file structure, patterns |
| `dependencies.md`     | External deps, versions, purpose |

### File creation command:

```bash
mkdir -p "<vault_path>/<project_name>"
# Then write each file using available tools
```

Always add YAML frontmatter to each file:

```yaml
---
project: <project_name>
updated: <today's date>
type: agent-context | architecture | features | ...
---
```

---

## Step 6: agent-context.md (most important file)

This file must be **dense, structured, scannable** — an agent should load this single file and immediately understand the project.

See `references/templates.md` → `## agent-context template` for the exact format.

Key rules for this file:

- Max ~300 lines
- Use tables, not prose
- Include: stack, project list, feature list, critical file paths, naming conventions, "gotchas"
- Add a `## Quick Commands` section with common nx/npm commands
- Add a `## Key Files` section with the 10-15 most important files an agent would need

---

## Step 7: Verify and report

After writing all files:

```bash
ls -la "<vault_path>/<project_name>/"
```

Report to user:

- ✅ Files created (with paths)
- 📊 Stats: N projects, N features, N libs found
- 🔗 Vault path to open in Obsidian
- ⚠️ Any areas where analysis was limited (e.g., couldn't read minified files)

---

## MCP priority order

When analyzing, use tools in this order (first available wins):

1. **Nx MCP** (`nx_workspace`, `nx_project_details`, `nx_graph`) — best for Nx monorepos
2. **Filesystem MCP** — read files directly if available
3. **bash_tool** — shell commands (always available in Claude Code / Cowork)
4. **Claude.ai** — manual file reading via uploads (fallback, limited)

---

## Common pitfalls

- **Don't read all files** — focus on config, routing, services, entry points. Avoid components, templates, tests.
- **node_modules** — always exclude from searches
- **Large monorepos (50+ libs)** — group libs by scope/tag, don't list individually
- **Private vaults** — always ask for vault path, never assume
- **Overwriting** — if vault folder exists, ask before overwriting (or append `-new`)

---

## References

- `references/templates.md` — Obsidian file templates for each document type
- `references/mermaid-patterns.md` — Mermaid diagram patterns for architecture, dep graphs

**Downstream use:** The docs produced by this skill are consumed by the **obsidian-project-context** skill: agents can read from this folder (path in `.cursor/obsidian-docs-path`) for architecture, API, features, and conventions instead of re-analyzing the codebase.
