1. Check current branch: `git branch --show-current`. If it's `main`, `master`, `development`, or `dev` — stop and say: "Цю команду заборонено на головних гілках (main, master, development, dev). Використовуй її тільки на feature/fix гілках."
2. Ask me: "Яке повідомлення для нового коміту?"
3. After I provide the message:
   - Save current HEAD: `git rev-parse HEAD` (for possible rollback)
   - Detect base branch (try `main`, then `master`, then `origin/main`)
   - Run `git reset --soft $(git merge-base <base> HEAD)` to squash all commits on the branch
   - Run `git commit -m "<my message>"` with the message I provided
4. Confirm when done and tell me: "Щоб відкатити: `git reset --hard <saved-HEAD>`" (show the saved commit hash).
