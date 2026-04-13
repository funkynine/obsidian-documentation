#!/usr/bin/env bash
# Deterministic doc from last commit: file list + stat (no AI). Complements /obsidian-sync.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

path_file=".cursor/obsidian-docs-path"
[[ -f "$path_file" ]] || exit 0
docs_path="$(tr -d '\r\n' < "$path_file" | head -1)"
[[ -n "$docs_path" && -d "$docs_path" ]] || exit 0

mkdir -p "${docs_path}/sync"
out="${docs_path}/sync/last-commit-code.md"
timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")"
sha_short="$(git rev-parse --short HEAD 2>/dev/null || echo "?")"

{
  echo "---"
  echo "project: $(basename "$docs_path")"
  echo "updated: ${timestamp:0:10}"
  echo "type: code-snapshot"
  echo "---"
  echo ""
  echo "# Last commit — code snapshot (auto)"
  echo ""
  echo "> Written by \`scripts/obsidian-code-snapshot.sh\` on push to **dev** / **development**. For AI-refreshed architecture docs run \`/obsidian-sync\`."
  echo ""
  echo "## ${timestamp} — \`${branch}\` @ \`${sha_short}\`"
  echo ""
  echo "### Files changed"
  echo ""
  echo '```'
  git diff-tree --no-commit-id --name-status -r HEAD 2>/dev/null || echo "(no diff-tree)"
  echo '```'
  echo ""
  echo "### Stat"
  echo ""
  echo '```'
  git show --stat --format="" HEAD 2>/dev/null || git show --stat HEAD 2>/dev/null || echo "(no show)"
  echo '```'
  echo ""
} >"$out"

echo "obsidian-code-snapshot: wrote ${out}" >&2
