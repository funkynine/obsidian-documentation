---
title: Issue solutions hub
type: agent-library
updated: 2026-04-13
---

# Issue solutions hub (vault root)

Cross-project **memory of resolved issues** and **hints for agents** (symptoms → root cause → fix → reusable pattern).

- Prefer short, searchable entries; link to long write-ups under `projects/<name>/sync/` or repo docs.
- Tags help other projects find the same pattern (`#nextjs` `#supabase` `#auth`).

## How agents should use this

1. Before deep debugging, skim **Symptoms** and **Tags** for a match.
2. If match: apply the **Fix / pattern**; cite this note in PR or commit message.
3. If new class of bug: add a section below, then optionally run `/obsidian-sync` to propagate into project notes.

## Entries

### Example: env vars not loaded in CI

- **Symptoms:** Build passes locally, fails in CI with `undefined` config.
- **Root cause:** `.env` not in CI; missing `NEXT_PUBLIC_*` in dashboard secrets.
- **Fix / pattern:** Document required keys in `agent-context.md` + use `.env.example`; CI injects via provider UI.
- **Tags:** `#ci` `#env` `#nextjs`
- **Seen in projects:** (add links)
