#!/usr/bin/env bash
set -euo pipefail

payload="$(cat || true)"

command_text="$(printf '%s' "$payload" | python3 -c 'import json,sys
try:
 data=json.load(sys.stdin)
 print(data.get("command",""))
except Exception:
 print("")
')"

if [[ ! "$command_text" =~ ^git[[:space:]]+merge[[:space:]]+(development|dev)($|[[:space:]]) ]]; then
  exit 0
fi

branch_name="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"
current_sha="$(git rev-parse HEAD 2>/dev/null || echo "unknown")"
previous_sha="$(git rev-parse HEAD~1 2>/dev/null || echo "$current_sha")"
timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p .cursor
printf '%s\t%s\t%s\t%s\t%s\n' \
  "$timestamp" \
  "merge-development" \
  "$branch_name" \
  "$previous_sha" \
  "$current_sha" >> .cursor/obsidian-sync-queue.log
