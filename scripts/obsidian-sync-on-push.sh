#!/usr/bin/env bash
# On dev/development pre-push: git log line + code snapshot; optional issue-hub touch.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

path_file=".cursor/obsidian-docs-path"
if [[ ! -f "$path_file" ]]; then
  echo "obsidian-sync-on-push: missing ${path_file}" >&2
  exit 0
fi

docs_path="$(tr -d '\r\n' < "$path_file" | head -1)"
if [[ -z "$docs_path" ]]; then
  echo "obsidian-sync-on-push: empty obsidian-docs-path" >&2
  exit 0
fi

if [[ ! -d "$docs_path" ]]; then
  echo "obsidian-sync-on-push: docs folder does not exist: ${docs_path}" >&2
  exit 0
fi

mkdir -p "${docs_path}/sync"

log_file="${docs_path}/sync/git-push-log.md"
timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
date_day="$(date -u +"%Y-%m-%d")"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")"
sha_full="$(git rev-parse HEAD 2>/dev/null || echo "?")"
sha_short="$(git rev-parse --short HEAD 2>/dev/null || echo "?")"
subject="$(git log -1 --pretty=%s 2>/dev/null || echo "unknown")"

if [[ ! -f "$log_file" ]]; then
  project_slug="$(basename "$docs_path")"
  cat >"$log_file" <<EOF
---
project: ${project_slug}
updated: ${date_day}
type: git-push-log
---

# Git push log (automatic)

Entries are appended when you \`git push\` **dev** or **development** (see \`.githooks/pre-push\`).

- **sync/last-commit-code.md** — files touched + stat (deterministic).
- Run \`/obsidian-sync\` for full AI refresh (architecture, history notes, issue index).

EOF
fi

{
  echo ""
  echo "## ${timestamp}"
  echo "- **Branch:** \`${branch}\`"
  echo "- **Commit:** \`${sha_short}\` (${sha_full}) — ${subject}"
  echo ""
} >>"$log_file"

code_snap="${repo_root}/scripts/obsidian-code-snapshot.sh"
if [[ -f "$code_snap" ]]; then
  bash "$code_snap" || true
fi

echo "obsidian-sync-on-push: wrote ${log_file}" >&2
