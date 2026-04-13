#!/usr/bin/env bash
# Point this repo at tracked hooks under .githooks/ (pre-push → Obsidian sync on dev/development).
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"
git config core.hooksPath .githooks
chmod +x .githooks/pre-push 2>/dev/null || true
chmod +x scripts/obsidian-sync-on-push.sh scripts/obsidian-code-snapshot.sh 2>/dev/null || true
echo "core.hooksPath=$(git config core.hooksPath) (relative to repo root)"
