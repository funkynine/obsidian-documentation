# Obsidian setup

Prepare this repository for automated Obsidian documentation sync (documentation-obsidian plugin).

## One-time shell bootstrap (optional)

From the project repo, run the plugin script so `scripts/`, `.githooks/`, and `.cursor/documentation-obsidian/` are installed:

```bash
bash /path/to/documentation-obsidian-plugin/scripts/obsidian-setup.sh
```

After that you can re-run `./scripts/obsidian-setup.sh` from the project without the plugin clone.

## Steps (agent)

1. Verify `.cursor/obsidian-docs-path`:
   - If missing or empty, ask user for Obsidian project docs absolute path (folder inside vault, e.g. `<vault>/projects/<projectName>/`).
   - Save exactly one line with that path.
2. Resolve project docs directory as:
   - `<obsidianPath>/projects/<projectName>/`
3. Ensure hooks are enabled:
   - Git `pre-push`: `scripts/install-git-hooks.sh` sets `core.hooksPath` -> `.githooks/`. On `git push` that includes `dev` or `development`, the hook appends the sync queue and runs `scripts/obsidian-sync-on-push.sh` (git log + `sync/last-commit-code.md`).
   - Cursor (optional): `.cursor/hooks.json` + `.cursor/hooks/on-merge-development.sh` for `git merge development|dev` from the integrated terminal.
4. Ensure queue file exists:
   - `.cursor/obsidian-sync-queue.log` (create empty file if missing).
5. Run `/init-project-db` once to create baseline docs (init-project-arhitech-db skill).
6. Optimize other skills for Obsidian context (recommended).
   - Scan: enumerate `.cursor/skills/**/SKILL.md` and `.claude/skills/**/SKILL.md`.
   - Decide: mark as good candidates when the skill routinely needs architecture, stack, routes, API surface, conventions, feature map, or "where things live".
   - Do not boilerplate every skill. Only add context hints where this reduces redundant scanning.
7. Issue library: ensure vault root `issue-solutions-hub.md` and `projects/_shared/issue-solution-index.md` exist (see `obsidian-issue-library` skill). Created by `scripts/obsidian-setup.sh` when possible.
8. Report final docs path, what was initialized, and which skills were updated (or "none - not applicable").
