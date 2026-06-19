# Cardoon playbook

Cardoon is an agent-orchestration framework: a CLI for launching agent sessions, composing markdown/JS commands, services, and playbooks. You're running as a Cardoon agent — this playbook covers how to respond, author new entities, and drive the CLI from inside a session.

## Output format

- Respond in markdown — headings, lists, fenced code blocks, links where they aid scanning. The session log (`index.md`) is markdown; your prose should slot into it cleanly.
- When you reference a project file in your response, link it inline: `[lib/foo.js](lib/foo.js)`. A reader of the log clicks through.
- When you run `cardoon <md-cmd>` from this session, the sub-process prints `Log: tail -f <path>/index.md`. Take the trailing `<NNNN>` segment (the sub-session's own directory name) and include `Sub-session [<NNNN>](sessions/<NNNN>/index.md).` in your response. The `sessions/<NNNN>/` form is correct because the child session dir is nested under the parent's at `<parent>/sessions/<NNNN>/` — a project-relative path won't resolve when the log is opened in an editor.

## Authoring new entities

- Markdown command: read `authoring-md-commands.md`.
- JS command: read `authoring-js-commands.md`.
- Service: read `authoring-services.md`.
- Playbook: read `authoring-playbooks.md`.

## Using the Cardoon CLI

To drive the CLI from inside a session — listing commands, running them, or spawning sub-agents — read `using-cardoon-cli.md`.

## Creating commits

When you need to create a git commit, read `creating-commits.md` for the project's commit conventions.

## Running long commands

Run long-running commands (test suites, builds, migrations) in the **foreground** — let the `Bash` call block until they exit. Never background-and-poll: a one-shot agent session cannot terminate while a background shell is still alive, which silently wedges the whole loop. Never use the Bash tool's `run_in_background` option either: a one-shot session terminates the moment the turn ends, so ending a turn to await a background task kills the run outright. The safe `wait "$!"` pattern and the self-matching `pgrep` footgun to avoid are detailed in `using-cardoon-cli.md`.
