# Debug Mode — Reference

Optional detail for when the agent needs a quick lookup. Main flow stays in [SKILL.md](SKILL.md).

## Chrome DevTools MCP — Tool mapping

| Action | MCP tool |
|--------|----------|
| **DOM** — snapshot (tree + element uids) | `take_snapshot` |
| **DOM** — run JS in page (read/inspect DOM, get state) | `evaluate_script` with `function` (and optional `args` for element uids) |
| Open URL in new tab | `new_page` with `url` |
| Go to URL / reload / back | `navigate_page` with `type` ("url" / "reload" / "back") and `url` when type is "url" |
| Click element | `click` with `uid` from snapshot |
| Type in input | `fill` with `uid` and `value` |
| Snapshot (a11y tree + uids) | `take_snapshot` |
| Full page screenshot | `take_screenshot` with `fullPage: true` |
| Console messages | `list_console_messages` (optional `types: ["error"]`), then `get_console_message` with `msgid` |
| Network requests | `list_network_requests` (optional `resourceTypes: ["fetch","xhr"]`), then `get_network_request` with `reqid` |
| Wait for text | `wait_for` with `text` and optional `timeout` |

Snapshot elements have a `uid`; use it for `click`, `fill`, `hover`, etc. After code changes, reload and repeat the same user steps to verify.

## Context7 — When and how

- **resolve-library-id:** `query` = user task, `libraryName` = e.g. "React", "Next.js", "TanStack Query".
- **query-docs:** `libraryId` = result from resolve-library-id, `query` = specific question (e.g. "useQuery error handling", "App Router redirect").
- Prefer 1–3 focused queries per bug; include error text or method names in the query when relevant.

## Sequential thinking — Parameters

- `thought` — current step; `thoughtNumber`, `totalThoughts` — position and length.
- `nextThoughtNeeded: true` until the chain reaches a conclusion (e.g. "inspect console next" or "hypothesis: wrong event handler").
- `isRevision: true`, `revisesThought: N` — when new info invalidates thought N (e.g. console shows different error).
- `needsMoreThoughts: true` — when you realize the chain needs more steps mid-way.
- Keep chains short (3–6 thoughts) and one decision per chain in debug mode.
