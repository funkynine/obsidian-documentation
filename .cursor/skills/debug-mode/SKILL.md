---
name: debug-mode
description: "Systematic debugging for bugs or issues that resist quick fixes. When user says 'debug mode' (or similar), first asks for the problem and details (steps, errors, environment); then uses sequential-thinking MCP, Chrome DevTools MCP to reproduce and verify in the browser, and Context7 for API/docs. Delivers a ready, best-practice solution—no workarounds or hacks. Use when the user invokes debug mode, reports a bug, or asks to debug or fix an issue."
---

# Debug Mode

When a bug or problem is hard to pin down, follow this workflow. Use **sequential thinking** to structure reasoning, **Chrome DevTools** to reproduce and test in a real browser, and **Context7** when APIs or libraries might have changed. Deliver a **clean, best-practice fix**—no temporary hacks or workarounds.

## Prerequisites

- **Sequential-thinking MCP** — for step-by-step reasoning and revising hypotheses.
- **Chrome DevTools MCP** — for opening the app, reproducing the bug, inspecting console/network, working with the DOM, and verifying the fix.
- **Context7 MCP** — when the issue may involve library/framework API changes or unclear current usage.
- **Authenticated test user (when needed)** — for bugs that occur only for logged-in users in this project, first obtain an authenticated session using the `project-login` skill before reproducing the issue.

## Debug mode command

When the user invokes **debug mode** (e.g. says "debug mode", "run debug mode", "let's debug"), **do not start the workflow yet**. First ask for the problem and the details the agent needs:

**Ask in one message**, in a friendly tone:

1. **What is the problem?** — Short description: what’s broken, what you expected, what actually happens.
2. **Where does it happen?** — URL or page/screen, component or feature name (if known).
3. **How to reproduce?** — Exact steps (e.g. "Click Login → enter email → Submit").
4. **What do you see?** — Any error text, console message, or red error in UI; screenshot or copy-paste if possible.
5. **Environment (if relevant):** — Browser, local vs deployed, logged in or not, special data.

You can offer a short template for the user to fill:

```
• Problem: 
• Where: 
• Steps to reproduce: 
• Errors / what you see: 
• Environment: 
```

**Only after** the user has provided at least (1) and (3)—problem and steps—proceed to the workflow (Understand and Reproduce). If something is missing but you can infer it (e.g. dev URL from the project), you may start reproduction and ask the rest in parallel.

---

## Principles

- **Reproduce first** — Reproduce the bug in the browser (or environment) before changing code.
- **Verify in browser** — After each fix attempt, run the app and confirm the bug is gone (and nothing else broke).
- **Best practices only** — No band-aids: proper error handling, correct API usage, no commented-out code or “TODO fix later.”
- **Use docs when unsure** — If a method/API might be deprecated or changed, check Context7 before implementing.

---

## Workflow

### 1. Understand and Reproduce

- **Gather context:** What exactly happens? When? (user steps, URL, input.) Any console/network errors the user saw?
- **Sequential thinking (optional):** Use a short chain to list: symptoms, likely areas (frontend/API/config), and what to check first.
- **Reproduce with DevTools:**
  - If the bug requires a logged-in user for this project, first use the `project-login` skill to log in as the configured test account.
  - Open the app (e.g. `new_page` or `navigate_page` to the dev URL or target page).
  - Perform the steps that trigger the bug.
  - Capture **console** (`list_console_messages`, `get_console_message` for errors) and **network** (`list_network_requests`, `get_network_request` for failed or relevant requests).
  - Take a **snapshot** or **screenshot** of the broken state if it helps.

If you cannot reproduce, say so and ask for: exact steps, environment (browser, OS), and any error text or screenshots.

### 2. Form a Hypothesis

- **Sequential thinking:** Use a small chain to: state the observed behavior, list 1–3 plausible causes, pick the most likely and why. Use `isRevision` if you get new info (e.g. from console/network).
- **Narrow the scope:** Identify the minimal area to change (component, hook, API call, selector, etc.).

### 3. Check API / Library Usage (When Relevant)

If the bug might be due to wrong or outdated API usage:

- **Context7:** `resolve-library-id` for the library/framework, then `query-docs` with a specific question (e.g. “correct way to do X”, “migration from Y”, “error Z meaning”).
- Use the docs to implement the **recommended** approach, not a workaround.

### 4. Implement the Fix

- Change only what’s needed to fix the root cause.
- Follow project and library best practices (error handling, types, no `any` unless justified).
- **No hacks:** no permanent `try/catch` that swallows errors, no disabling validations, no “fix later” comments.

### 5. Verify in the Browser

- **DevTools:** Reload or navigate again, repeat the same steps that previously caused the bug.
- Confirm: bug is gone, no new console errors, relevant flows still work.
- If the bug persists, use **sequential thinking** to revise the hypothesis (e.g. wrong layer, wrong assumption) and iterate.

### 6. Deliver the Solution

- Summarize: what was wrong, what you changed, and how you verified.
- Optionally suggest one short regression check (e.g. “try logging out and in again”) if relevant.

---

## Using sequential-thinking in Debug Mode

Use the `sequentialthinking` tool in short, focused chains (about 3–6 thoughts per use):

| Stage              | Use for                                                                 | Revisions |
|--------------------|-------------------------------------------------------------------------|-----------|
| After reproduce    | List symptoms → likely causes → next check (console/network/code).     | Yes, when console/network give new data. |
| After hypothesis   | Observed behavior → 2–3 causes → chosen cause and why.                  | Yes, when first fix doesn’t work. |
| When stuck         | What we tried → why it didn’t help → alternative cause or layer.        | Yes, as new clues appear. |

Keep each chain tied to one decision (e.g. “what to inspect next” or “which hypothesis to test first”).

---

## Using Chrome DevTools MCP

Use the browser to **reproduce** and **verify**; avoid fixing blindly. DevTools can also **inspect and interact with the DOM** (read elements, run JS in the page, check state).

| Goal              | Tools to use |
|-------------------|--------------|
| Open app          | `new_page`, `navigate_page` |
| User actions      | `click`, `fill`, `fill_form`, `press_key` |
| See state         | `take_snapshot`, `take_screenshot` |
| DOM               | `take_snapshot` (a11y tree + element `uid`), `evaluate_script` (run JS in page context to read or inspect DOM) |
| Errors            | `list_console_messages` (filter by error), `get_console_message` |
| Network           | `list_network_requests`, `get_network_request` for failed or relevant URLs |
| After code change | Reload (`navigate_page` with `type: "reload"`) then repeat repro steps |

Reproduce the bug once, then after each fix run the same steps again and confirm success.

---

## Using Context7

- **When:** Suspected wrong/deprecated API, unclear method, or migration (e.g. React Query, Next.js, React Router).
- **How:** `resolve-library-id` with the library name, then `query-docs` with a concrete question (include error text or method name if relevant).
- **Limit:** Use sparingly (e.g. 1–3 queries per bug); prefer specific questions over broad “how does X work”.

---

## Anti-patterns (Do Not Do)

- **Implementing without reproducing** — Always reproduce in the browser first.
- **Guessing and patching** — Use sequential thinking and DevTools to form and test hypotheses.
- **Workarounds** — No “catch and ignore”, no turning off validation, no commenting out code to “make it work”.
- **Skipping verification** — Every fix must be re-tested in the same environment (browser) where the bug was reproduced.
- **Ignoring docs** — If the issue looks like API misuse, check Context7 instead of inventing a hack.

---

## Summary Checklist

- [ ] Bug reproduced in browser (or reproduction blocked — user informed).
- [ ] Console/network inspected; hypothesis formed (sequential thinking if useful).
- [ ] Context7 used when API/library usage might be wrong or outdated.
- [ ] Fix is minimal, follows best practices, no workarounds.
- [ ] Fix verified in browser: same steps, bug gone, no new errors.
- [ ] User gets a short summary and, if useful, a regression check to run.

## Additional resources

- For DevTools tool names and Context7/sequential-thinking parameter details, see [reference.md](reference.md).
