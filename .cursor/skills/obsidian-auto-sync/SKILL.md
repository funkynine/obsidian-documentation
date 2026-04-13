---
name: obsidian-auto-sync
description: Updates Obsidian project documentation after git push/merge events by consuming the sync queue, regenerating architecture context when needed, and appending implementation history notes. Use when docs need post-delivery refresh or when the user asks to sync documentation from recent commits.
---

# Obsidian Auto Sync

Use this skill to process git-triggered sync events and keep Obsidian docs current.

**Already automatic without this skill (plugin):** `git push` to **dev** or **development** runs `scripts/obsidian-sync-on-push.sh` → `sync/git-push-log.md` and `sync/last-commit-code.md`. The vault root **issue-solutions-hub** is maintained separately — see `obsidian-issue-library`.

**This skill** adds AI-enriched updates (history, decisions, issue notes, `agent-context` sections). Run via `/obsidian-sync` when you want that depth.

## Inputs and paths

- Project repository path: current workspace root
- Obsidian docs path pointer: `.cursor/obsidian-docs-path`
- Queue file: `.cursor/obsidian-sync-queue.log`
- Project docs target: `<obsidianPath>/projects/<projectName>/`

If `.cursor/obsidian-docs-path` is missing, ask the user for the absolute vault path and write one line to that file.

## Workflow

1. Read `.cursor/obsidian-sync-queue.log`.
2. If queue is empty:
   - Run a lightweight sync based on `HEAD~1..HEAD`.
3. If queue has events:
   - Process each line in order (`timestamp event branch fromSha toSha`).
4. Ensure baseline docs exist:
   - `_index.md`, `agent-context.md`, `architecture.md`, `features.md`, `projects.md`.
   - If missing, run `init-project-arhitech-db` flow first.
5. For each event, create or update notes:
   - `history/change-event-<toSha>.md`
   - `decisions/decision-record-<toSha>.md`
   - `issues/issue-solution-<slug>.md`
6. Update shared index:
   - `<vault>/projects/_shared/issue-solution-index.md`
   - Optionally link or summarize into `<vault>/issue-solutions-hub.md` for cross-project reuse (coordinate with `obsidian-issue-library`).
7. Append event links to `agent-context.md` under `## Recent Change Events`.
8. Truncate or rotate processed queue entries.

## Note format requirements

- Include frontmatter keys:
  - `project`, `updated`, `type`
- For history notes also include:
  - `issue_key`, `solution_tags`, `confidence`, `rating`, `needs_review`
- Keep `needs_review: true` for AI-inferred rationale.

## Commit analysis heuristics

- Subject drives `issue_key` and short summary.
- Changed paths drive tags (`auth`, `api`, `db`, `ui`, `docs`, `ci`, `test`).
- If no reliable rationale is inferred, mark as draft and request manual refinement.

## Safety rules

- Never overwrite existing hand-written sections outside managed blocks.
- Never delete user notes in Obsidian.
- If branch is `main`/`master`, still record event but flag `high_impact: true`.
