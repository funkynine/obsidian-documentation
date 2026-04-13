# documentation-obsidian

Cursor plugin for project documentation in Obsidian.

It combines skills, commands, and git hooks so AI can:
- initialize project architecture docs,
- keep history after push/merge,
- build reusable issue-solution knowledge across projects.

## Included commands

- `/obsidian-setup` - one-time setup in a project.
- `/init-project-db` - initial architecture and context generation.
- `/obsidian-sync` - full AI sync after delivery events.
- `/obsidian-sync-pending` - process only queued events.
- `/obsidian-history` - refresh history/decisions/issues notes.

## Included skills

- `init-project-arhitech-db`
- `obsidian-project-context`
- `obsidian-auto-sync`
- `obsidian-issue-library`

## Obsidian path policy

Project docs must be stored in:

- `<vault>/projects/<projectName>/`

Shared cross-project index:

- `<vault>/projects/_shared/issue-solution-index.md`

## Quick start (target project)

From the target repository root:

```bash
bash /path/to/documentation-obsidian-plugin/scripts/obsidian-setup.sh
```

Then in Cursor run:

1. `/obsidian-setup`
2. `/init-project-db` if project wasn't create in obsidian

After that:
- push to `dev` or `development` to enqueue sync events automatically,
- run `/obsidian-sync` to update Obsidian notes.

## What setup script installs

- `scripts/obsidian-setup.sh`
- `scripts/install-git-hooks.sh`
- `scripts/obsidian-sync-on-push.sh`
- `scripts/obsidian-code-snapshot.sh`
- `.githooks/pre-push`
- `.cursor/obsidian-sync-queue.log` (created if missing)

It also prompts for `.cursor/obsidian-docs-path` if not set.

## Repository structure (plugin)

- `.cursor/skills/` - runtime skills
- `.cursor/commands/` - slash commands
- `.cursor/hooks.json` + `.cursor/hooks/` - optional IDE-side hook integration
- `.cursor-plugin/plugin.json` - plugin metadata
- `scripts/` + `.githooks/` - shell-based automation outside IDE

## License

MIT
