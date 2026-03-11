---
name: subagent-orchestration
description: Orchestrates subagents (planner, programmer, tester, code-reviewer) for tasks and bugs. Runs the pipeline: user → planner → programmer → tester (loop until pass) → code-reviewer → programmer (critical fixes) → tester again. Use when the user gives a task, bug, or feature to implement and expects the full workflow.
---

# Subagent orchestration

When the user gives a **task**, **bug**, or **feature** to implement, run the following pipeline. Subagents live in `.cursor/agents/` (planner, programmer, tester, code-reviewer).

## Pipeline

```
User (task/bug/feature)
    → planner
    → programmer (implements by plan)
    → tester (if fail → comment → programmer again, repeat until pass)
    → code-reviewer
    → programmer (implements critical feedback only)
    → tester (verify critical-fix changes again)
```

## Step-by-step

### 1. Planner

- **Input**: User request (task, bug, feature — anything they want done).
- **Optional**: If the project has Obsidian docs (see **obsidian-project-context** skill or `.cursor/obsidian-docs-path`), load `agent-context.md` or `architecture.md` and pass relevant context to the planner so the plan aligns with existing structure and API.
- **Action**: Invoke the **planner** subagent. Planner creates a plan and breaks it into tasks.
- **Handoff**: Pass the plan (and first implementation task) to **programmer**.

### 2. Programmer

- **Input**: Plan and task(s) from planner.
- **Optional**: If project Obsidian docs exist, programmer can use them (e.g. **obsidian-project-context** — critical files, conventions, API surface) to avoid re-scanning the codebase.
- **Action**: Invoke the **programmer** subagent. Programmer implements according to the plan.
- **Handoff**: When implementation is done, pass the result and “what to verify” to **tester**.

### 3. Tester (loop until pass)

- **Input**: What was implemented and what should be verified.
- **Action**: Invoke the **tester** subagent. Tester runs checks (e.g. Playwright, Chrome DevTools) and confirms if it works.
  - For this project, when a scenario requires a logged-in user and uses Chrome DevTools MCP, the tester should first establish an authenticated session by using the `project-login` skill, then run the rest of the steps.
- **If it does not work**: Tester leaves a **comment** for the programmer (what’s wrong, steps, context). Hand back to **programmer** with that comment. Repeat until tests pass.
- **If it works**: Proceed to **code-reviewer**.

### 4. Code-reviewer

- **Input**: The code that passed testing.
- **Action**: Invoke the **code-reviewer** subagent. Code-reviewer reviews and returns feedback (critical / warnings / suggestions).
- **Handoff**: **Critical** items must be implemented. Pass critical feedback to **programmer**.

### 5. Programmer (critical fixes only)

- **Input**: Only **critical** feedback from code-reviewer.
- **Action**: Invoke the **programmer** subagent to implement those critical changes.
- **Handoff**: Pass the changed code and “what to verify” to **tester** again.

### 6. Tester (after critical fixes)

- **Input**: The code after programmer applied code-reviewer’s critical feedback; same verification scope as before (or focus on changed areas).
- **Action**: Invoke the **tester** subagent again. Confirm that behavior still works and nothing broke. If something fails, hand back to **programmer** with tester’s comment; otherwise the pipeline is done.

## When to use this skill

- User describes a task, bug, or feature and expects it to be implemented and reviewed.
- User asks to “run the pipeline”, “do the full flow”, or similar.
- User assigns work that should go through plan → implement → test → review.

## Handoff format

When passing work between subagents, provide:

- **To programmer**: Plan (or task slice), file/area, and any tester comment or code-reviewer critical list.
- **To tester**: What was implemented, what to verify (flows, acceptance criteria).
- **To code-reviewer**: The code or diff that passed testing.

Keep handoffs short and clear so each subagent knows exactly what to do.

## Testing the pipeline

To verify the skill works: use a small task (e.g. "add a utility function add(a,b)") and run the full pipeline. See [TESTING.md](TESTING.md) for test prompts and checklist.
