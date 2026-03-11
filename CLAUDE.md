# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an AI-assisted development template. The repository is a skeleton (Next.js + Supabase stack, based on `.gitignore`) that ships with a structured agent/skill system in `.cursor/` for AI-driven development workflows.

## Development Workflow

### Full Implementation Pipeline (`/implement <task>`)

The primary way to implement features is through the subagent pipeline defined in `.cursor/skills/subagent-orchestration/SKILL.md`:

```
planner → programmer → tester (loop until pass) → code-reviewer → programmer (critical fixes only) → tester
```

Agents are defined in `.cursor/agents/`:
- **planner** — breaks tasks into structured plans, anticipates edge cases
- **programmer** — implements using current APIs, no deprecated patterns, security-first
- **tester** — verifies with Playwright/Chrome DevTools MCP; writes failure reports for programmer
- **code-reviewer** — returns feedback as Critical / Warnings / Suggestions; only Critical goes back to programmer
- **designer** — UI/UX review using browser/screenshot MCP

### Code Review (`/code-review`)

Runs the **code-reviewer** subagent on current changes (`git diff`). Pass: what was implemented, what it should do, and the diff.

### Debug Mode (`/debug-mode`)

Asks for problem description + reproduction steps first, then reproduces in browser, finds root cause, implements proper fix. No workarounds.

## TDD Practice

All new features and bug fixes follow strict TDD (`.cursor/skills/test-driven-development/SKILL.md`):

1. **RED**: Write a failing test first. Run it. Confirm it fails for the right reason.
2. **GREEN**: Write minimal code to pass. Nothing more.
3. **REFACTOR**: Clean up while keeping tests green.

Run a single test:
```bash
npm test path/to/test.test.ts
```

**Iron Law**: No production code without a failing test first. No exceptions (except throwaway prototypes — ask first).

## Agent Handoff Format

When passing work between subagents:
- **→ programmer**: plan/task slice + any tester failure comment or reviewer critical list
- **→ tester**: what was implemented + what to verify (flows, acceptance criteria)
- **→ code-reviewer**: code/diff that passed testing

## Stack (expected when app is added)

Based on `.gitignore`: Next.js, TypeScript, Supabase. Yarn or pnpm workspace.

## Authenticated browser testing

For flows that require a logged-in user in the browser (for example when using Chrome DevTools MCP):

- Configure one or more dedicated test accounts locally in `.cursor/skills/project-login/credentials.local.mdc` (see `docs/testing-auth.md` for details).
- Use the `project-login` skill (`.cursor/skills/project-login/SKILL.md`) to establish an authenticated session before running UI flows behind auth.
- In debug mode or tester flows, ensure `project-login` runs first for any scenario that depends on authentication.

