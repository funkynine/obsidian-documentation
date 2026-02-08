# Merge Conflict Resolver — Reference

Quick lookup for conflict patterns. Main flow in [SKILL.md](SKILL.md).

## Conflict block structure

```
<<<<<<< HEAD
content from current branch (ours)
=======
content from incoming branch (theirs)
>>>>>>> branch-name
```

## Auto-resolve patterns

| Pattern | Ours | Theirs | Action |
|---------|------|--------|--------|
| Both add different blocks | +block A | +block B | Keep both (merge) |
| One adds, one empty | +block A | (empty) | Keep block A |
| Identical | same | same | Keep one |
| One side deletes | (deleted) | +block | Flag for review (intent unclear) |
| Both delete same | (deleted) | (deleted) | Remove block |

## Flag for manual review

| Pattern | Reason |
|---------|--------|
| Same lines, different content | Semantic conflict — need human |
| Same function/block, different logic | Business logic differs |
| Import paths conflict | May need both or restructuring |
| Type/interface changes | May break other code |

## Generated / lock files

For `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `*.min.js`:
- Prefer `git checkout --ours <file>` then run `npm install` / `yarn` to regenerate
- Or `git checkout --theirs <file>` if merging from main integration branch

## Git commands for rollback

- During merge (before commit): `git merge --abort`
- After failed merge: `git reset --hard <saved-HEAD>`
- To re-run merge: `git merge --abort` then `git merge <branch>` again
