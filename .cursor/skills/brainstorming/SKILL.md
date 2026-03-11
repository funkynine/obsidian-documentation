---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation. Uses sequential-thinking MCP when available for structured reasoning."
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in small sections (200-300 words), checking after each section whether it looks right so far.

**When sequential-thinking MCP is available:** use it to structure reasoning at key stages—breaking down the idea, comparing approaches, and structuring the design. It helps avoid missing aspects, keep trade-offs explicit, and revise when new information appears.

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent commits). *Optional:* if the project has Obsidian docs (**.cursor/obsidian-docs-path** or **obsidian-project-context**), read `agent-context.md` or `features.md` for architecture and existing features before asking questions.
- *Optional — sequential thinking:* use it to break down the idea into: purpose, constraints, success criteria, unknowns; then derive the next question from the most important gap
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible, but open-ended is fine too
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria

**Exploring approaches:**
- *Optional — sequential thinking:* list 2–3 approaches, compare trade-offs step by step, mark assumptions; use revisions if the user adds constraints
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**
- *Optional — sequential thinking:* structure the design into sections (architecture → components → data flow → errors → testing), note dependencies and validation points; use revisions if the user corrects something
- Once you believe you understand what you're building, present the design
- Break it into sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## After the Design

**Documentation:**
- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Use elements-of-style:writing-clearly-and-concisely skill if available
- Commit the design document to git

**Implementation (if continuing):**
- Ask: "Ready to set up for implementation?"
- Use superpowers:using-git-worktrees to create isolated workspace
- Use superpowers:writing-plans to create detailed implementation plan

## Using sequential-thinking MCP

Use the `sequentialthinking` tool at these stages when the MCP is connected:

1. **Before asking the first (or next) question** — Thoughts: what we already know, what’s unclear, what would reduce risk most. Output: one clear question (or choice).
2. **When comparing approaches** — Thoughts: list options, pros/cons, assumptions, recommendation. Use `isRevision` if the user adds a constraint or corrects something.
3. **Before writing the design** — Thoughts: section order, dependencies, what must be validated with the user. Use `needsMoreThoughts` if you discover missing parts mid-way.

Keep chains short (e.g. 3–6 thoughts per use). Prefer one focused chain per stage rather than one long chain for the whole brainstorm.

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Incremental validation** - Present design in sections, validate each
- **Be flexible** - Go back and clarify when something doesn't make sense
- **Structured reasoning when MCP available** - Use sequential thinking to make breakdown and trade-offs explicit, and to revise when new info appears