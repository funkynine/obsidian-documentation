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
   - If missing or empty, ask user for Obsidian **project docs** absolute path (folder inside vault, e.g. `<vault>/projects/<projectName>/`).
   - Save exactly one line with that path.
2. Resolve project docs directory as:
   - `<obsidianPath>/projects/<projectName>/`
3. Ensure hooks are enabled:
   - **Git `pre-push`**: `scripts/install-git-hooks.sh` sets `core.hooksPath` → `.githooks/`. On **`git push` that includes `dev` or `development`**, the hook appends the sync queue **and** runs `scripts/obsidian-sync-on-push.sh` (git log + `sync/last-commit-code.md`).
   - **Cursor** (optional): `.cursor/hooks.json` + `.cursor/hooks/on-merge-development.sh` for `git merge development|dev` from the integrated terminal.
4. Ensure queue file exists:
   - `.cursor/obsidian-sync-queue.log` (create empty file if missing).
5. Run `/init-project-db` once to create baseline docs (init-project-arhitech-db skill).
6. **Optimize other skills for Obsidian context (recommended)**  
   After the project docs folder exists and `.cursor/obsidian-docs-path` points to it, **review skills in this repo** so agents load vault notes first where that saves time.
   - **Scan:** enumerate `skills/**/SKILL.md` in this plugin repo (and optionally agents in the project if they describe workflows that need project orientation).
   - **Decide:** for each skill, read its `description` and “When to use” / overview. Mark as **good candidates** when the skill routinely needs: architecture, stack, routes, API surface, conventions, feature map, or “where things live” — without needing line-by-line code on the first pass.
   - **Good candidates often include (examples, not exhaustive):** `subagent-orchestration`, `web-app-estimation`, `debug-mode`, `merge-conflict-resolver`, `code-review-after-implementation`, `test-driven-development`, `obsidian-auto-sync`, any skill that scans the repo for structure before acting. **Skip or only lightly touch** skills that are generic and project-agnostic (e.g. pure brainstorming or writing guidance) unless a one-line pointer still helps.
   - **Edit pattern (minimal):** where appropriate, add a short subsection (a few lines) near the top or under “When to use”, e.g.  
     - Point to **`obsidian-project-context`** skill and state: if `.cursor/obsidian-docs-path` is set, **read `agent-context.md`** (or `_index.md`) in that folder **before** large codebase searches for orientation — then open specific files from the docs’ “Key files” / tables as needed.
   - **Do not** boilerplate every skill: only add this where it clearly reduces redundant scanning and speeds up the model. **Do not** duplicate the full `obsidian-project-context` doc inside each skill.
   - If nothing fits, say so in the report.
7. **Issue library:** ensure vault root `issue-solutions-hub.md` and `projects/_shared/issue-solution-index.md` exist (see `obsidian-issue-library` skill). Created by `scripts/obsidian-setup.sh` when possible.
8. Report final docs path, what was initialized, and **which skills were updated** (or “none — not applicable”).
