---
name: merge-conflict-resolver
description: Resolves git merge conflicts automatically when merging branches. Analyzes conflict blocks, auto-resolves simple cases (non-overlapping changes, additions), leaves ambiguous cases with REVIEW comments for manual resolution. Preserves user's logic (ours) as default. Use when merging with dev/another branch, resolving conflicts, or when user asks to merge and fix conflicts.
---

# Merge Conflict Resolver

When the user wants to merge with another branch (e.g. dev) and has or expects conflicts, use this workflow to auto-resolve what's safe and flag the rest for manual review.

## Prerequisites

- User is on a feature/fix branch (not main, master, development, dev)
- User wants to merge with dev (or another branch they specify)

## Workflow

### 1. Safety Check

- Run `git branch --show-current`
- If branch is `main`, `master`, `development`, or `dev` — stop and say: "Цю команду заборонено на головних гілках. Переключись на feature/fix гілку."
- Save current HEAD: `git rev-parse HEAD` — show it to the user for possible rollback: "Для відкату: `git merge --abort` або `git reset --hard <saved-HEAD>`"

### 2. Ask Merge Target

- Ask: "В яку гілку мерджити? (за замовчуванням: dev)"
- If user doesn't specify — use `dev`

### 3. Run Merge

- Run `git fetch origin` (if remote exists)
- Run `git merge <target-branch>` (e.g. `git merge dev`)
- If no conflicts — done. Say "Merge успішний, конфліктів немає."
- If conflicts — proceed to step 4

### 4. Resolve Conflicts

For each conflicted file (find via `git status` or `git diff --name-only --diff-filter=U`):

**Parse conflict blocks** — each block has:
```
<<<<<<< HEAD (ours — поточна гілка)
...our changes...
=======
...their changes...
>>>>>>> branch-name
```

**Auto-resolve when:**
- Ours and theirs add different lines in different places → merge both, remove markers
- One side adds, other unchanged → keep the addition
- Identical changes → keep one version
- package-lock.json, yarn.lock, *.min.js, generated files → prefer ours (current branch), or suggest `git checkout --ours <file>`

**Leave for manual review when:**
- Same lines changed differently (semantic conflict)
- Both modified the same function/block with different logic
- Imports or type definitions conflict in non-obvious way
- Business logic differs

For manual-review blocks: keep conflict markers but add a comment above:
```
// CONFLICT REVIEW: Обидві сторони змінили цей блок. 
// Ours: [короткий опис]
// Theirs: [короткий опис]  
// Потрібно вирішити вручну.
<<<<<<< HEAD
...
```

### 5. Summary

After processing:
- List files **auto-resolved** ✅
- List files **need manual review** ⚠️ with paths
- Remind rollback command
- For manual-review files: user edits, then `git add <file>` and `git commit`

## Principles

- **Preserve user logic** — when ambiguous, default to keeping ours (current branch)
- **Don't guess** — if unsure, leave for review
- **Be conservative** — one wrong auto-merge can break the app
- For details on conflict patterns, see [reference.md](reference.md)
