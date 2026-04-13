#!/usr/bin/env bash
# Bootstrap Obsidian documentation for the current git repository.
#
# First run (from a clone of documentation-obsidian-plugin):
#   bash /path/to/documentation-obsidian-plugin/scripts/obsidian-setup.sh
#
# Later runs can use ./scripts/obsidian-setup.sh from the project (uses bundled copy under .cursor/documentation-obsidian/).
# Override: DOCUMENTATION_OBSIDIAN_PLUGIN_ROOT=/path/to/plugin
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo_root" ]]; then
  echo "obsidian-setup: not inside a git repository." >&2
  exit 1
fi
cd "$repo_root"

BUNDLE="${repo_root}/.cursor/documentation-obsidian"

resolve_source_plugin() {
  if [[ -n "${DOCUMENTATION_OBSIDIAN_PLUGIN_ROOT:-}" && -f "${DOCUMENTATION_OBSIDIAN_PLUGIN_ROOT}/templates/vault/issue-solutions-hub.md" ]]; then
    printf '%s' "${DOCUMENTATION_OBSIDIAN_PLUGIN_ROOT}"
    return
  fi
  local sibling
  sibling="$(cd "${SCRIPT_DIR}/.." && pwd)"
  if [[ -f "${sibling}/templates/vault/issue-solutions-hub.md" ]]; then
    printf '%s' "${sibling}"
    return
  fi
  printf ''
}

if [[ -f "${BUNDLE}/.marker" && -f "${BUNDLE}/scripts/obsidian-sync-on-push.sh" ]]; then
  SOURCE="${BUNDLE}"
else
  SOURCE="$(resolve_source_plugin)"
  if [[ -z "$SOURCE" ]]; then
    echo "obsidian-setup: cannot find documentation-obsidian-plugin (need templates/vault/issue-solutions-hub.md)." >&2
    echo "Run from the plugin clone, or set DOCUMENTATION_OBSIDIAN_PLUGIN_ROOT." >&2
    exit 1
  fi
  mkdir -p "${BUNDLE}/scripts" "${BUNDLE}/.githooks" "${BUNDLE}/templates/vault"
  cp -f "${SOURCE}/scripts/"*.sh "${BUNDLE}/scripts/"
  cp -f "${SOURCE}/.githooks/pre-push" "${BUNDLE}/.githooks/"
  cp -f "${SOURCE}/templates/vault/"*.md "${BUNDLE}/templates/vault/" 2>/dev/null || true
  date -u +"%Y-%m-%dT%H:%M:%SZ" >"${BUNDLE}/.marker"
  echo "Bundled plugin assets into .cursor/documentation-obsidian/"
fi

mkdir -p scripts .githooks .cursor
cp -f "${BUNDLE}/scripts/"*.sh "${repo_root}/scripts/"
cp -f "${BUNDLE}/.githooks/pre-push" "${repo_root}/.githooks/"
chmod +x "${repo_root}/scripts/"*.sh "${repo_root}/.githooks/pre-push"
echo "Updated repo scripts/ and .githooks/ from bundle."

path_file=".cursor/obsidian-docs-path"
if [[ ! -f "$path_file" || ! -s "$path_file" ]]; then
  echo "Obsidian: absolute path to this project's docs folder inside the vault,"
  echo "e.g. /home/you/Documents/ObsidianVault/projects/my-app"
  read -r -p "> " docs_path
  docs_path="${docs_path//[$'\r\n']}"
  mkdir -p "$(dirname "$path_file")"
  printf '%s\n' "$docs_path" >"$path_file"
fi

mkdir -p .cursor
touch .cursor/obsidian-sync-queue.log

bash "${repo_root}/scripts/install-git-hooks.sh"

hub_template="${BUNDLE}/templates/vault/issue-solutions-hub.md"
docs_path="$(tr -d '\r\n' < "$path_file" | head -1)"
if [[ -n "$docs_path" ]]; then
  mkdir -p "$docs_path"
  vault_root=""
  if [[ "$docs_path" =~ /projects/[^/]+$ ]]; then
    vault_root="$(cd "$(dirname "$docs_path")/.." && pwd)"
  fi
  hub=""
  if [[ -n "$vault_root" ]]; then
    hub="${vault_root}/issue-solutions-hub.md"
  fi
  if [[ -n "$hub" ]]; then
    if [[ ! -f "$hub" && -f "$hub_template" ]]; then
      cp "$hub_template" "$hub"
      echo "Created vault issue hub: ${hub}"
    elif [[ -f "$hub" ]]; then
      echo "Issue hub already exists: ${hub}"
    fi
  else
    echo "Skipping vault root issue hub: use a path like <vault>/projects/<projectName>/ in .cursor/obsidian-docs-path"
  fi
  if [[ -n "$vault_root" ]]; then
    shared="${vault_root}/projects/_shared"
    mkdir -p "$shared"
    index="${shared}/issue-solution-index.md"
    if [[ ! -f "$index" ]]; then
      cat >"$index" <<IDX
---
type: issue-index
project: _shared
updated: $(date -u +%Y-%m-%d)
---

# Issue / solution index (this vault)

Link entries from the vault root [[issue-solutions-hub]] note and project \`sync/\` logs.

IDX
      echo "Created shared index: ${index}"
    fi
  fi
fi

echo ""
echo "Done. Next in Cursor:"
echo "  1) /obsidian-setup   — agent confirms paths (optional)"
echo "  2) /init-project-db  — generate project docs (init-project-arhitech-db skill)"
echo "  3) git push dev      — sync/git-push-log.md + sync/last-commit-code.md (automatic)"
echo "  4) /obsidian-sync    — full AI doc refresh (architecture, issue notes, indexes)"
echo ""
echo "Docs path: $(tr -d '\r\n' < "$path_file")"
