# Init project DB (Obsidian docs)

Run the **`init-project-arhitech-db`** skill: read and follow `.cursor/skills/init-project-arhitech-db/SKILL.md` end-to-end (project analysis → structured notes in Obsidian).

**Before analysis — Obsidian path config**

1. Check whether `.cursor/obsidian-docs-path` exists in this repo and contains a non-empty **single line** (absolute path to your Obsidian vault root **or** the folder inside the vault where this project’s docs should live — same convention as `obsidian-project-context`).
2. **If the file is missing, empty, or unreadable:** stop and **ask the user** for that absolute path. Do not guess.
3. **Create or overwrite** `.cursor/obsidian-docs-path` with exactly one line: the path the user gave (no quotes, no extra lines). Then continue with the skill so agents and other commands can resolve the vault/docs location reliably.

**Then**

4. Execute **Step 0** of the skill (project path, Obsidian path — use the path from `obsidian-docs-path` unless the user overrides in the same message, output folder name, analysis mode, generation modes).
5. Proceed with the rest of the skill (detect Nx vs plain, analyze, write markdown into the vault folder).

Start by checking `obsidian-docs-path`; only run the full skill after the path file is valid or freshly created from the user’s answer.
