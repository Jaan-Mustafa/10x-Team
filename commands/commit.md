# /commit — Smart Commit Message Generator

Analyze all staged and unstaged changes, then create a well-structured commit.

## Steps

1. **Gather context** — Run these commands to understand the full picture:
   - `git status` to see all changed, staged, and untracked files
   - `git diff` to see unstaged changes
   - `git diff --cached` to see staged changes
   - `git log --oneline -5` to see recent commit style

2. **Analyze the changes** — For each changed file, understand:
   - What was added, removed, or modified
   - The intent behind the change (feature, fix, refactor, docs, test, chore)
   - Whether multiple concerns are mixed (suggest splitting if so)

3. **Stage files** — If nothing is staged, stage the relevant files by name. Never use `git add -A` or `git add .`. Skip files that look like secrets (`.env`, credentials, tokens).

4. **Write the commit message** using this format:

   ```
   <type>(<scope>): <short summary>

   <body — what changed and why, not how>

   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
   ```

   **Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `ci`, `build`

   **Rules**:
   - Summary line: imperative mood, lowercase, no period, under 50 chars
   - Body: wrap at 72 chars, explain WHY not WHAT
   - If changes span multiple concerns, suggest separate commits
   - Match the project's existing commit style from `git log`

5. **Show the proposed commit message** to the user and ask for confirmation before committing.

6. **Commit** using a HEREDOC to preserve formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   <the message>
   EOF
   )"
   ```

## Examples

```
feat(auth): add OAuth2 login flow

Users can now sign in with Google and GitHub. Session tokens
are stored in HTTP-only cookies per security requirements.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

```
fix(api): prevent duplicate webhook deliveries

Race condition in the queue consumer caused the same event to
fire twice when processing lagged. Added idempotency key check.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

```
refactor(db): extract query builder from repository layer

Reduces duplication across 6 repository files. No behavior change.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

## Anti-Patterns

- Never write vague messages like "update files" or "fix stuff"
- Never commit secrets or `.env` files — warn the user if detected
- Never combine unrelated changes in one commit without flagging it
- Never amend previous commits unless explicitly asked
- Never skip pre-commit hooks
