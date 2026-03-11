---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Invoke the **code-reviewer** subagent (from `.cursor/agents/code-reviewer.md`) to review current changes. Use this for a one-off review without running the full `/implement` pipeline.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Get the diff to review:**
```bash
# Option A: last commit vs current
git diff HEAD~1..HEAD

# Option B: vs branch (e.g. main)
git diff origin/main..HEAD
```

**2. Invoke the code-reviewer subagent**

Call the **code-reviewer** subagent and pass:

- **What was implemented** — short description of the change
- **Plan/requirements** — what it should do (if any)
- **The diff** — output of `git diff` for the range you care about

The code-reviewer will return feedback in: Critical (must fix) / Warnings (should fix) / Suggestions (consider).

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important/Warnings before proceeding
- Note Minor/Suggestions for later
- Push back if reviewer is wrong (with reasoning)

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Fix before moving to next task

**Executing Plans:**
- Review after each batch (e.g. 3 tasks)
- Get feedback, apply, continue

**Ad-Hoc Development:**
- Review before merge
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

## Optional reference

For a detailed checklist and output format the reviewer can follow, see [code-reviewer.md](code-reviewer.md). The subagent in `.cursor/agents/code-reviewer.md` already defines its own workflow; use this file only as a reference for scope (quality, architecture, testing, production readiness).

**Project conventions / architecture:** If the project has Obsidian docs (**.cursor/obsidian-docs-path** or **obsidian-project-context** skill), the reviewer can optionally load `conventions.md` or `architecture.md` to check alignment with documented patterns.
