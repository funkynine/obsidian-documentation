---
name: obsidian-project-context
description: Claude wrapper for loading project architecture and context from Obsidian notes before broad codebase scans.
---

# Obsidian project context (Claude wrapper)

Use the canonical skill content:

- `.cursor/skills/obsidian-project-context/SKILL.md`

## Path policy

- Resolve docs path from `.cursor/obsidian-docs-path`.
- Prefer reading `agent-context.md` or `_index.md` in that folder before full-repo exploration.
