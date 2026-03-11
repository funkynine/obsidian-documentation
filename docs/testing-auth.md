# Authenticated testing setup

This project uses one or more dedicated **test accounts** for automated browser testing via Chrome DevTools MCP.

Real credentials must **never** be committed to git. Instead, configure them in a **local-only credentials file** used by the `project-login` skill.

## Local credentials file (multiple sites)

Credentials for browser login live in a dedicated file next to the `project-login` skill:

- Example template (tracked): `.cursor/skills/project-login/credentials.example.mdc`
- Your real secrets (git-ignored): `.cursor/skills/project-login/credentials.local.mdc`

To configure your local credentials:

1. Copy the example file:

   ```bash
   cp .cursor/skills/project-login/credentials.example.mdc .cursor/skills/project-login/credentials.local.mdc
   ```

2. Edit `credentials.local.mdc` and fill in real data for each environment you use:

   ```yaml
   ---
   sites:
     - id: staging
       baseUrl: https://staging.example.com
       loginPath: /login
       username: your_staging_test_user_email_here
       password: your_staging_test_user_password_here
     - id: dev
       baseUrl: http://localhost:3000
       loginPath: /login
       username: your_local_test_user_email_here
       password: your_local_test_user_password_here
   ---
   ```

`credentials.local.mdc` is listed in `.gitignore` and must never be committed.

## How skills should use the test accounts

- Skills and agents must **not** hardcode credentials.
- When a skill needs to log in (for example, using Chrome DevTools MCP), it should conceptually refer to the **configured site entry** in `credentials.local.mdc` (chosen by `baseUrl` / `id`) rather than embedding literal values.
- When you want Cursor to actually perform login in your environment, you only need to keep `credentials.local.mdc` up to date; tracked repo files should never contain real usernames or passwords.

See also:

- `docs/testing-auth.md` (this file) for env configuration.
- `.cursor/skills/project-login/SKILL.md` for the step-by-step browser login flow used by agents.

