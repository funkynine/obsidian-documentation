---
name: nx-obsidian-docs
description: >
  Claude wrapper for the documentation-obsidian project bootstrap flow. Analyze a project
  (Nx or plain JS/TS) and generate structured Obsidian documentation for agent context.
---

# nx-obsidian-docs (Claude wrapper)

This Claude skill intentionally reuses the canonical implementation from the Cursor skill to keep one source of truth.

## Canonical implementation

Read and follow, end-to-end:

- `.cursor/skills/init-project-arhitech-db/SKILL.md`

Use the same references:

- `.cursor/skills/init-project-arhitech-db/references/templates.md`
- `.cursor/skills/init-project-arhitech-db/references/mermaid-patterns.md`

## Path policy for this plugin

- Keep `.cursor/obsidian-docs-path` as the canonical pointer file.
- Keep output under `<vault>/projects/<projectName>/`.
