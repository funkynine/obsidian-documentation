---
name: project-login
description: "Use before browser tests that require an authenticated user. Opens the app, logs in with the configured test account via Playwright MCP, and verifies login succeeded."
---

# Project login (authenticated browser session)

## When to use

- Before any **Chrome DevTools MCP** testing that hits pages behind authentication for this project.
- At the start of **debug-mode** flows when the bug occurs for a **logged-in user**.
- Whenever the tester needs a **clean, known test user** session.
This skill assumes a standard email/password login form and one or more dedicated **test accounts** configured in a local-only credentials file.

## Credentials storage (multiple sites / URLs)

Instead of reading from `.env.local`, this skill uses a **local credentials file** that is not committed to git:

- Example template (tracked): `.cursor/skills/project-login/credentials.example.mdc`
- Your real secrets (git-ignored): `.cursor/skills/project-login/credentials.local.mdc`

Structure of `credentials.local.mdc`:

```yaml
---
sites:
  - id: some-site-id
    baseUrl: https://staging.example.com
    loginPath: /login
    username: test-user@example.com
    password: super-secret-password
  - id: another-site-id
    baseUrl: http://localhost:3000
    loginPath: /login
    username: local-user@example.com
    password: local-secret
---
```

- Each entry in `sites` represents one environment / URL with its own login.
- `credentials.local.mdc` is listed in `.gitignore` and must never be committed.
- To configure:
  - Copy `credentials.example.mdc` → `credentials.local.mdc`.
  - Fill real `baseUrl`, `loginPath`, `username`, and `password` for each site you use.

When running login for a particular URL, choose the matching `sites` entry by `baseUrl` (and optionally by `id` if you want to be explicit in your prompt).

## App URL and login route

For this project, the app is expected to run at a base URL and login path such as:

- Base URL: `<APP_BASE_URL>` (for example `http://localhost:3000` or your staging URL)
- Login path: `<LOGIN_PATH>` (for example `/login`)

When using this skill, substitute the actual URL for your environment (dev, staging, etc.). If unsure, prefer the **development** URL (usually `http://localhost:3000`).

## DOM selectors (customize for this app)

Update these selectors to match the actual login page:

- **Email/username input**: `EMAIL_SELECTOR` (for example `input[name="email"]` or `[data-test="login-email"]`)
- **Password input**: `PASSWORD_SELECTOR` (for example `input[name="password"]` or `[data-test="login-password"]`)
- **Submit button**: `SUBMIT_SELECTOR` (for example `button[type="submit"]` or `[data-test="login-submit"]`)

If you do not know the selectors, use DevTools MCP (`take_snapshot`, `evaluate_script`) to inspect the login form and adjust the selectors accordingly.

## Login flow with Playwright MCP

When you need an authenticated session for this project, perform the following steps with the **Playwright MCP**:

1. **Open the login page**
   - Decide which site to use (for example by `baseUrl` in `credentials.local.mdc`).
   - Use Playwright MCP navigation tools to go to: `<baseUrl><loginPath>` from the chosen site entry.
   - Wait until the login form is visible (for example wait for `EMAIL_SELECTOR`).

2. **Fill credentials**
   - From `credentials.local.mdc`, take:
     - `username` for the selected site and fill it into the email/username field (`EMAIL_SELECTOR`).
     - `password` for the selected site and fill it into the password field (`PASSWORD_SELECTOR`).

3. **Submit the form**
   - Click the submit button (`SUBMIT_SELECTOR`).
   - Wait for navigation or page update to complete.

4. **Verify login succeeded**
   - Confirm that:
     - The login form is **no longer** visible, and/or
     - The URL changes to a protected route (for example `/dashboard`), and/or
     - A logged-in UI element appears (for example a user avatar, profile menu, or `data-test="user-menu"` element).
   - If verification fails (still on login page, error message visible), treat this as a **failed login** and stop testing until credentials or selectors are fixed.

## Re-using an existing session

Before running the full login flow, check if the user is already logged in:

1. Navigate to the protected page you need to test (for example `<APP_BASE_URL>/dashboard`).
2. If you are **not** redirected to the login page and a logged-in indicator is present, you can **reuse** the existing session and skip the login steps.
3. If you are redirected to login or the protected content is not visible, run the full login flow described above, then navigate again to the target page.

## Usage from other skills/agents

- **Tester subagent**:
  - When a test scenario requires authenticated access to this project, run the **project-login** skill first to ensure a valid session, then execute the scenario steps.
- **Debug-mode**:
  - When reproducing a bug that only occurs for logged-in users, first ensure an authenticated session using **project-login**, then follow the reproduction steps.
- **Planner/programmer**:
  - When describing what the tester should do for an authenticated flow, explicitly mention: “Use the `project-login` skill to log in as the test user, then …”.

Always keep credentials in env files only and never in tracked repo content.

