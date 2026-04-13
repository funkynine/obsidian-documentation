# Cursor Marketplace Packaging

This repository is a **Cursor plugin**: skills and commands, plus installable shell assets (`scripts/`, `.githooks/`) so documentation sync works outside the IDE.

## `plugin.json` (`.cursor-plugin/plugin.json`)

| Field | Value |
| ----- | ----- |
| `skills` | `.cursor/skills/` |
| `commands` | `.cursor/commands/` |

## Repository layout (reference)

```
.cursor-plugin/plugin.json
.cursor/
  commands/          init-project-db, obsidian-setup, obsidian-sync, obsidian-sync-pending, obsidian-history
  hooks.json
  hooks/on-merge-development.sh
  obsidian-docs-path.example
  skills/
    init-project-arhitech-db/   (+ references/)
    obsidian-project-context/
    obsidian-auto-sync/
    obsidian-issue-library/
docs/cursor-marketplace-packaging.md
CHANGELOG.md
LICENSE
README.md
obsidian-setup              → wrapper for scripts/obsidian-setup.sh
scripts/
  install-git-hooks.sh
  obsidian-setup.sh
  obsidian-sync-on-push.sh
  obsidian-code-snapshot.sh
templates/vault/issue-solutions-hub.md
.githooks/pre-push
```

Do **not** commit machine-local files (see `.gitignore`): `.cursor/obsidian-docs-path`, `.cursor/obsidian-sync-queue.log`, `.cursor/documentation-obsidian/`.

## End-user flow

1. Install the plugin from the Cursor marketplace.
2. In each git project: `bash /path/to/documentation-obsidian-plugin/scripts/obsidian-setup.sh`
3. Cursor: `/init-project-db` → baseline vault notes.
4. Push **dev** / **development** → automatic `sync/git-push-log.md` + `sync/last-commit-code.md`.
5. `/obsidian-sync` → full AI refresh when needed.

## Obsidian layout

- Project docs: `<vault>/projects/<project-name>/`
- Vault-wide solved issues: `<vault>/issue-solutions-hub.md`
- Shared index: `<vault>/projects/_shared/issue-solution-index.md`

## Pre-publish checklist

- Validate JSON: `.cursor/hooks.json`, `.cursor-plugin/plugin.json`
- `chmod +x` on `obsidian-setup`, `scripts/*.sh`, `.githooks/pre-push`
- Smoke test: `scripts/obsidian-setup.sh` in a temp git repo; `git push --dry-run` on `dev` and check `.cursor/obsidian-sync-queue.log`
