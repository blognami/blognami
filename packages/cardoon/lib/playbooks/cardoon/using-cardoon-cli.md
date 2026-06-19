# Using the Cardoon CLI

The `cardoon` binary (or `npx cardoon`) is how you invoke commands, scaffold entities, and dispatch sub-agents.

## Listing and running commands

`cardoon list-commands` prints every registered command. `cardoon <name> --help` shows per-command params. Run a command with `cardoon <name> [params]`, passing params as space-separated `--flag value` pairs (shell-quote values containing spaces) — the CLI does not support `--flag=value` or JSON-quoted values.

## Authorable entities and their generators

Cardoon has four authorable entity types, each with a generator command and an authoring doc:

| Entity | Generator | Authoring doc |
|--------|-----------|---------------|
| Markdown command | `generate-command` | `authoring-md-commands.md` |
| JS command | `generate-command <name>.js` | `authoring-js-commands.md` |
| Service | `generate-service` | `authoring-services.md` |
| Playbook | `generate-playbook` | `authoring-playbooks.md` |

`start-agent` launches an interactive agent session (no scaffolding). All generators accept `--skip-agent-handoff` / `-S` to scaffold without entering an agent session.

## Where session logs land

Each command invocation allocates its own session directory. Top-level invocations land under the project log root; sub-sessions (commands run from inside another session via Bash) nest under the parent's `sessions/` subdirectory:

```
.cardoon/logs/sessions/NNNN/         # top-level session
├── index.md                        # append-only session log (agent output streams here)
├── system-prompt.md                # the assembled system prompt, written once at session start
├── prompt.md                       # the user prompt, written once at session start
└── sessions/NNNN/                  # nested sub-session (recursively, same layout)
    ├── index.md
    ├── system-prompt.md
    └── prompt.md
```

`NNNN` is a zero-padded four-digit sequence number, restarted at `0001` inside each parent. The sub-process prints `Log: tail -f <path>/index.md` to stdout at startup — the trailing `<NNNN>` segment of that path is the sub-session's own directory name.

## The sub-agent pattern

Inside an active Cardoon session, you can run `cardoon <md-cmd>` via Bash to spawn a one-shot nested session. Key properties:

- **Same sandbox.** The `CARDOON_IN_SANDBOX` environment guard at `cardoon/lib/command.js:26` prevents re-entering the sandbox — the sub-process reuses the parent's sandbox directly, with no rebuild.
- **Own session directory, nested under the parent's.** The sub-session inherits `CARDOON_PARENT_SESSION_DIR` (set by the parent's agent spawn) and allocates the next `<parent>/sessions/<NNNN>/` slot, restarting the counter at `0001` within each parent.
- **Streams to its own `index.md`.** The parent agent can `tail` or read the nested `index.md` to inspect what the sub-agent did.
- **Inherits the host playbook contract.** Per the mandatory-read contract (see `md-commands-load-playbooks.md`), the sub-agent loads the same playbooks as the parent unless the command's frontmatter narrows it.

## Dispatch sequentially, not in parallel

Always wait for one sub-session to finish before kicking off the next. Two reasons:

1. **Session-directory race.** `allocateDir` (`cardoon/lib/services/logger.js:22-34`) uses `readdirSync` + `mkdirSync({ recursive: true })` with no lock. Concurrent allocators can pick the same `NNNN` — `mkdirSync` with `recursive: true` does not error on an existing directory — and both sub-sessions silently append to the same files.
2. **Workspace file races.** Sub-sessions edit the shared workspace. Running two write-touching commands at once races on any file they both touch.

Sequential dispatch also matches a one-shot agent's single-threaded execution model — a `Bash` call blocks until the sub-process exits.

## Run long commands in the foreground — never background-and-poll

A one-shot (non-interactive) agent session will not exit while a background shell it spawned is still alive. Because the sub-agent pattern relies on a blocking `Bash` call that only returns once the sub-process exits, one leaked background process wedges the whole loop: the agent finishes its work but cannot terminate, so the parent's blocking `Bash` never returns and the orchestrator hangs indefinitely.

So run long-running commands — test suites, builds, migrations — in the **foreground** and let the `Bash` call block until they finish. Do not start them in the background and poll for completion.

The Bash tool's `run_in_background` option is just as fatal, via the opposite mechanism: a one-shot session terminates the moment the model ends its turn, so ending a turn to "wait" for a background task's completion notification ends the session on the spot — and the CLI terminates still-running background children a few seconds after the final result, killing the child mid-flight. Long blocking calls are safe instead — cardoon raises the Bash tool's timeout caps (`BASH_DEFAULT_TIMEOUT_MS` / `BASH_MAX_TIMEOUT_MS`) in every session it spawns, so pass an explicit `timeout` (up to `14400000`, 4 hours) rather than backgrounding.

If you genuinely must background a job, `wait` on the exact PID you started — never poll with a pattern matcher:

```bash
npm test > /tmp/test.log 2>&1 &   # only if unavoidable
wait "$!"                          # waits on THIS pid, then returns
```

Never wait with `while kill -0 $(pgrep -f "<pattern>"); do sleep …; done`. `pgrep -f` matches against full command lines, and the polling shell's own command line contains the pattern string — so the loop matches itself, `kill -0` always succeeds, and it spins forever. This footgun once hung a `complete-tasks` worker on a `pgrep -f "node.*test-lock"` loop that matched its own shell, blocking the entire Ralph run until the process was killed by hand.

## Worked example

A parent agent decomposes a task into two sub-tasks, dispatching them sequentially:

```bash
# 1. Write a transient markdown command for the first sub-task
cat > .cardoon/lib/commands/sub_task_one.md << 'EOF'
---
description: Implements the first sub-task.
---

You are a focused agent. Do X, then Y, then Z.
EOF

# 2. Run it synchronously (foreground, blocking)
cardoon sub-task-one
# stdout includes: Log: tail -f <parent-session-dir>/sessions/0001/index.md

# 3. Read the sub-session output — use the full path from the stdout line above
cat <parent-session-dir>/sessions/0001/index.md
```

After the sub-process exits, include `Sub-session [<NNNN>](sessions/<NNNN>/index.md).` in your response (substituting the sub-session's directory name). For the example above:

```
Sub-session [0001](sessions/0001/index.md).
```

The `sessions/<NNNN>/index.md` form is correct because the child session dir is nested under the parent's at `<parent>/sessions/<NNNN>/` — a link from the parent's `index.md` resolves into its own `sessions/` subdirectory. A project-relative path (the form the sub-process prints) would not resolve when the log is opened in an editor or markdown viewer.

Then repeat the pattern for the next sub-task — scaffold, dispatch, read, link — always waiting for the previous sub-session to exit first.
