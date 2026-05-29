# Authoring markdown commands

A markdown command is a single `.md` file that defines a sandboxed agent session. The file's body becomes the agent's system prompt; frontmatter declares metadata and params.

## Directory and filename convention

Place the file under the project's `lib/commands/` directory (typically `.sartor/lib/commands/`). The filename must be snake_case with an `.md` extension:

```
lib/commands/review_pr.md
```

The command name is derived from the filename without the extension, dasherized. So `review_pr.md` registers as the `review-pr` command.

## Example file

```markdown
---
description: Reviews a pull request and leaves inline comments.
params:
  prNumber:
    type: number
    description: The PR number to review.
  repo:
    type: string
    optional: true
    description: The GitHub repo slug (defaults to the current repo).
---

You are a code reviewer. Review the pull request thoroughly.

Focus on correctness, readability, and security. Leave inline comments where appropriate.
```

## Frontmatter keys

- **`description`** (string) — a short summary shown in help output and playbook listings.
- **`params`** (object, optional) — a map of param names to specs. Each spec follows the same shape used by `hasParam()` in JS commands: `type`, `description`, `optional`, `alias`, `default`.

Any other keys in the frontmatter are passed through to `assignProps()` on the command.

## Sandboxing

All markdown commands are hard-coded to `sandboxed: true`. You cannot opt out — if you need an unsandboxed command, author it in JS instead.

## The `--follow` flag

Every markdown command automatically receives a `--follow` / `-f` boolean param. When set, session log lines are streamed to stdout in real time in addition to being written to the log file. You must not declare a param named `follow` yourself — the importer will throw if you do.

## Body as system prompt

Everything after the frontmatter `---` fence is the agent's system prompt, verbatim. Write it as you would any system prompt: instructions, constraints, persona, examples.

## Appended `## Params` block

If the command declares any params, the runtime appends a `## Params` section to the system prompt at invocation time containing a markdown table with columns `Param`, `Description`, and `Value (JSON)`. Descriptions are sourced from `params.<name>.description` in the frontmatter. Values are rendered as compact `JSON.stringify(...)` wrapped in inline-code backticks. The section opens with a one-line preamble explaining the encoding:

```markdown
## Params

Values below are JSON-encoded — strings appear quoted, numbers/booleans/null appear bare.

| Param | Description | Value (JSON) |
|-------|-------------|--------------|
| topic | The topic to write | `"Cats"` |
| count | How many rhymes | `3` |
| draft | Save as draft | `true` |
```

Rows appear in frontmatter declaration order. Params whose value is `undefined` (not supplied by the caller) are skipped — the section is omitted entirely when no rows would be emitted. Boolean `false` IS included (the user explicitly opted out; the agent should know). The synthetic `follow` flag is never included.

This block is appended automatically — do not include it in the file body.

## Agent runtime call

The runtime invokes the agent with:

```javascript
await this.agent.run({ systemPrompt, prompt: 'Begin the session.', onLog });
```

The `onLog` callback writes each line to the session log (and to stdout when `--follow` is active). The process exits with the agent's exit code.

## Session logs

Each invocation creates a session directory under the project's log root. The index log is written to `<sessionDir>/index.log`. The session ID and log path are printed to stdout at startup.
