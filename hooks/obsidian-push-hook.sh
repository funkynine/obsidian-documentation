#!/usr/bin/env bash
# Obsidian Documentation — PostToolUse hook
#
# Fires after every Bash tool call. Exits silently unless:
#   1. The command was a git push to dev or development
#   2. The current project has .cursor/obsidian-docs-path (plugin is set up here)
#
# When both conditions match, outputs a reminder so Claude runs /obsidian-sync.

INPUT=$(cat)

# --- Extract the bash command from the hook JSON payload ---
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except Exception:
    print('')
" 2>/dev/null)

# --- Only act on git push targeting dev or development ---
if ! echo "$COMMAND" | grep -qE 'git\s+push[^|&;]*\b(dev(elopment)?)\b'; then
  exit 0
fi

# --- Only act if this project has the plugin configured ---
DOCS_PATH_FILE=".cursor/obsidian-docs-path"
if [ ! -f "$DOCS_PATH_FILE" ]; then
  exit 0
fi

# --- Check queue and report ---
QUEUE_FILE=".cursor/obsidian-sync-queue.log"
if [ -f "$QUEUE_FILE" ] && [ -s "$QUEUE_FILE" ]; then
  PENDING=$(wc -l < "$QUEUE_FILE" | tr -d ' ')
  echo "📚 Obsidian sync: ${PENDING} event(s) queued from this push. Run /obsidian-sync to update project documentation with AI-enriched history, decisions, and issue notes."
else
  echo "📚 Pushed to dev/development. Run /obsidian-sync to refresh Obsidian project docs with the latest changes."
fi
