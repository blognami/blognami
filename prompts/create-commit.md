Create a comprehensive commit.

## Steps

1. Ask the user: "Is there a GitHub issue or other reference for this commit? (press Enter to skip)"

2. Write the commit message using the format below.

3. Create the commit.

## Commit Format

```
<type>: <short summary> (#123)
```

- **type**: `feat` | `fix` | `refactor` | `docs` | `test` | `chore` | `perf` | `style` | `ci`
- **summary**: imperative mood, lowercase, no trailing period
- **reference**: GitHub issue or PR number in brackets at the end of the summary, e.g. `(#123)` — omit if none given
- **body**: optional; explain *why*, not *what*; separated from summary by a blank line; wrap at 72 chars

## Rules

- Do NOT add Co-Authored-By or any Claude/AI reference.
