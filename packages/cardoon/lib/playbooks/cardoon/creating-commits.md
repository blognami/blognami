# Creating commits

Conventions for git commits in this project. Follow them whenever you create a commit — whether driven by a human request or as part of an automated loop. Write exactly one commit per logical change. Never push, never open a PR, never `--amend` unless explicitly asked.

## Before you commit — inspect state

You cannot write an accurate subject without knowing what's in the diff. Look first:

- `git status` — untracked, unstaged, and staged changes. (Avoid `-uall` on large repos — memory issues.)
- `git diff` — unstaged changes.
- `git diff --staged` — already-staged changes.
- Optionally `git log --pretty=format:'%s' -20` to match the house tone.

## Secret / size gate

Before staging, scan the diff for things that must not be committed:

- Secret-bearing files: `.env`, `.env.*`, `credentials.json`, anything under `secrets/`, private keys (`*.pem`, `id_rsa`, `*.key`).
- Embedded credentials: API keys, `BEGIN PRIVATE KEY`, tokens, passwords, long opaque config strings.
- Large binaries / build artefacts: `dist/`, `build/`, `*.zip`, `*.tar.gz`, files > ~1 MB.

If any are about to land, do **not** stop to ask — these sessions run unattended, so blocking for confirmation wedges the loop. Create the commit anyway, but first emit a prominent warning that names the specific file(s) and what triggered the gate, so a human can catch it when reviewing the session log. Never commit silently through the warning.

## Staging

Stage only the files relevant to this change — not everything that happens to be dirty.

- Prefer explicit paths: `git add path/a path/b`.
- Avoid `git add -A` and `git add .` — they sweep in `.env` files, editor junk, and unrelated work.
- Never use `git add -i` or any interactive flag — it hangs a non-interactive session.
- If unrelated changes are already staged, unstage them (`git restore --staged <path>`) rather than committing them.

## Message

### Subject

- Format: `type: past-tense summary`.
- Types: `fix` (corrects behaviour), `feat` (adds user-visible behaviour), `refactor` (restructures, no behaviour change), `chore` (cleanup/deps/tooling), `docs` (docs/comments), `test` (test-only).
- Past tense, lowercase after the prefix. ≤72 chars (hard cap ~80).
- Describe the *why*, not a verbatim diff restatement. "added" / "dropped" / "stripped" beat "updated" / "changed".
- Do not start with "Update", "Change", "Modify", a capital letter after the prefix, or an imperative verb.

Examples:

```
fix: stripped port from Stripe webhook URL to prevent incorrect endpoint registration
docs: added AI agent service feature spec for @pinstripe/ai package
```

### Body (optional)

Include one when the motivation is non-obvious, several related changes are worth enumerating, or there's a caveat/follow-up to record.

- Blank line between subject and body.
- Past tense; prefer bullets, one fact each; hard-wrap ~72 cols.
- Don't repeat the subject.

### Attribution

No AI-attribution anywhere — no `Co-Authored-By: <assistant>` trailer, no "Generated with…" footer, no mention of AI assistance in subject, body, or trailers. Human `Co-Authored-By:` trailers are fine when specified.

## Creating the commit

Use a HEREDOC to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
fix: dropped bad config flag and stale workspace name from deploy workflow

- removed unused --legacy flag from deploy.yml
- renamed workspace target to match current package name
EOF
)"
```

- Do not pass `--no-verify`, `--no-gpg-sign`, or `-c commit.gpgsign=false`.
- Do not `--amend` unless explicitly asked — the default is always a new commit.
- One commit per logical change.

## After & failure handling

- Confirm the result: `git status` (clean/expected tree), `git log -1 --stat` (what landed).
- Do not push or open a PR unless explicitly asked.
- Pre-commit hook failed: read the output, fix the real issue, re-stage, commit again — never bypass with `--no-verify`.
- Nothing to commit: stop and say so; don't create an empty commit.
- Merge-conflict markers in a staged file: stop, surface the conflict, do not commit.
