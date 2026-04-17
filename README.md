# documentation-obsidian

Cursor plugin for project documentation in Obsidian.

It combines skills, commands, and git hooks so AI can:
- initialize project architecture docs,
- keep history after push/merge,
- build reusable issue-solution knowledge across projects.

This repository now includes both Cursor and Claude-compatible entrypoints that share the same scripts, hooks, and `.cursor` data files.

## Included commands

- `/obsidian-setup` - one-time setup in a project.
- `/init-project-db` - initial architecture and context generation.
- `/obsidian-sync` - full AI sync after delivery events.
- `/obsidian-sync-pending` - process only queued events.
- `/obsidian-history` - refresh history/decisions/issues notes.

Claude command specs live in:

- `.claude/commands/obsidian-setup.md`
- `.claude/commands/init-project-db.md`
- `.claude/commands/obsidian-sync.md`
- `.claude/commands/obsidian-history.md`

## Included skills

- `init-project-arhitech-db`
- `obsidian-project-context`
- `obsidian-auto-sync`
- `obsidian-issue-library`

Claude skill wrappers live in:

- `.claude/skills/init-project-arhitech-db/SKILL.md`
- `.claude/skills/obsidian-project-context/SKILL.md`
- `.claude/skills/obsidian-auto-sync/SKILL.md`
- `.claude/skills/obsidian-issue-library/SKILL.md`

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

## Claude usage

Claude-compatible plugin metadata is in:

- `.claude-plugin/plugin.json`
- `.mcp.json`

The Claude wrappers intentionally keep these canonical files:

- `.cursor/obsidian-docs-path`
- `.cursor/obsidian-sync-queue.log`

This avoids split state between Cursor and Claude when both are used on the same repository.

## Publish for Claude (GitHub path)

Recommended distribution flow:

1. Keep plugin metadata current in `.claude-plugin/plugin.json` (`name`, `version`, `description`, `repository`).
2. Commit changes and push to GitHub.
3. Install from repo id:

```bash
npx plugins add <owner>/<repo>
```

4. After each update:
   - bump `version` in `.claude-plugin/plugin.json`,
   - push commit/tag,
   - reload/refresh plugins in Claude environment.

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
