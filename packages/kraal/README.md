# Kraal

Kraal is a sandboxing tool built on haberdash. It runs project commands inside an isolated Docker container, composing `AbstractCommand` and `AbstractServiceFactory` from haberdash to provide a standalone CLI.

## Getting started

Run `npx kraal generate-project` in your project root to create a `kraal.js` config file:

```js
export default {
    sandbox: {
        provider: 'docker',
        name: 'my-project-kraal-sandbox',

        // Env vars passed into the sandbox container.
        env: {},

        // Shell script run as root (sh -e) at image build time, after the
        // kraal user exists — add the tools your sandboxed commands need.
        install: ``
    }
};
```

The sandbox image is generated in memory from this config — no Dockerfile is written to your project. Editing `install` triggers a rebuild (and container recreation) on the next `start-sandbox`; named volumes survive, so installed `node_modules` carry over.

## Custom commands

Define named commands under `sandbox.commands` to expose them as first-class `kraal` subcommands. Each value is a shell string run inside the sandbox:

```js
export default {
    sandbox: {
        commands: {
            'run-afk-claude': 'claude --dangerously-skip-permissions --model opus'
        }
    }
};
```

`kraal run-afk-claude` then runs that string in the sandbox (interactively), and it appears in `kraal list-commands` and `kraal run-afk-claude --help`. Names that collide with a built-in command are skipped with a warning.

## Commands

- `generate-project` — creates `kraal.js` (only available outside a project)
- `list-commands` — lists the available commands (the default when none is given)
- `start-sandbox` — builds the sandbox image (cached no-op when unchanged) and starts the container
- `stop-sandbox` — stops the container
- `remove-sandbox` — removes the container and its named volumes
- `run-in-sandbox [command]` — runs a command (default `bash`) inside the sandbox
- any command defined under `sandbox.commands` in `kraal.js` (see [Custom commands](#custom-commands))
