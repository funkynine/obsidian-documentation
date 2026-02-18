# Implement (full pipeline)

Run the **subagent-orchestration** pipeline. The task is whatever the user wrote after `/implement` (or in this message) — treat it as the task/bug/feature description.

**What to do:**
1. Apply the skill `subagent-orchestration` (plan → implement → test → review → critical fixes → test again).
2. Execute the steps in order: **planner** → **programmer** → **tester** (until pass) → **code-reviewer** → **programmer** (critical only) → **tester** again.
3. After each step, briefly state what was done and what you're passing to the next agent.

Start by invoking the **planner** subagent with the task above.
