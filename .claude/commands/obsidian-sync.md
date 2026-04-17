# Obsidian sync

Run full documentation synchronization after git activity (AI-driven: history, decisions, issue notes - see skill).

Already automatic (no command): `git push` to `dev` / `development` updates `sync/git-push-log.md` and `sync/last-commit-code.md` via `.githooks/pre-push`.

## Use this flow

1. Read and apply `.claude/skills/obsidian-auto-sync/SKILL.md`.
2. If baseline docs are missing, run `/init-project-db` first.
3. Process events from `.cursor/obsidian-sync-queue.log`.
4. Update notes under:
   - `<obsidianPath>/projects/<projectName>/`
   - `<obsidianPath>/projects/_shared/issue-solution-index.md`
   - Optionally `<vault>/issue-solutions-hub.md` (vault root - cross-project reuse; see `obsidian-issue-library`)
5. Summarize:
   - how many events were processed,
   - which notes were created or updated,
   - what still needs manual review (`needs_review: true`).
