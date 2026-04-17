---
name: obsidian-issue-library
description: Maintain a vault-wide library of solved issues and agent-playbook hints at the Obsidian vault root (issue-solutions-hub.md) and optional per-project index. Use when closing bugs, documenting recurring fixes, or onboarding agents with reusable patterns across projects.
---

# Obsidian issue library

## Purpose

Build a **reusable knowledge base** of problems and fixes so developers and AI agents do not re-solve the same issues from scratch.

## Locations (after `/obsidian-setup`)

| Location | Role |
| -------- | ---- |
| `<vault>/issue-solutions-hub.md` | Vault root — cross-project entries, tags, symptoms → fix |
| `<vault>/projects/_shared/issue-solution-index.md` | Short index / links |
| `<project-docs>/sync/` | Auto push logs and code snapshots from this plugin |

## When to add an entry

- A non-trivial bug was fixed and might recur elsewhere.
- Onboarding pattern (e.g. “how we configure X in this org”).
- Agent struggled once — capture the **hint** for next time.

## Entry shape

Use a small repeatable block:

- **Symptoms** — what you see (errors, UX).
- **Root cause** — one or two lines.
- **Fix / pattern** — steps or code shape (no secrets).
- **Tags** — `#stack` `#area`.
- **Seen in projects** — optional links.

## Coordination with `/obsidian-sync`

The **obsidian-auto-sync** skill can append structured “issue / solution” notes from queue events. This skill is for **manual or agent-curated** hub content that must stay readable across projects.
