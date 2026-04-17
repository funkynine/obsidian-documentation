# Obsidian history

Create or refresh implementation history and decision records.

## Scope

- Focus only on:
  - `history/`
  - `decisions/`
  - `issues/`
  - shared issue index

## Steps

1. Collect commit range from user (or default `HEAD~1..HEAD`).
2. Build one change-event note per commit.
3. Build one decision-record note per commit with:
   - rationale draft,
   - trade-offs draft,
   - `needs_review: true`.
4. Build/update reusable issue-solution notes with tags.
5. Update `agent-context.md` with links to new change events.
