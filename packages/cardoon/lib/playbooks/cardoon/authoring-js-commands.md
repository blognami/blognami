# Authoring JS commands

A JS command is a single `.js` file that exports an object with `meta()` and `run()` methods. JS commands offer full control over execution — params, services, scaffolding, agent dispatch, or plain CLI output.

## Directory and filename convention

Place the file under the project's `lib/commands/` directory (typically `.cardoon/lib/commands/`). The filename must be snake_case with a `.js` extension:

```
lib/commands/deploy_staging.js
```

The command name is derived from the filename without the extension, dasherized. So `deploy_staging.js` registers as the `deploy-staging` command.

## Example file

```javascript
import { inflector } from 'haberdash';

export default {
    meta(){
        this.assignProps({
            description: 'Deploys the current branch to the staging environment.',
            sandboxed: true
        });

        this.hasParam('target', {
            type: 'string',
            alias: 'arg1',
            description: 'The deployment target name.'
        });
    },

    async run(){
        const target = inflector.dasherize(this.params.target);
        console.log(`Deploying to ${target}...`);
    }
};
```

## The `meta()` / `run()` shape

The exported object must have:

- **`meta()`** — called at registration time. Declares the command's properties and params. Must be synchronous.
- **`run()`** — called at invocation time. Can be async. Contains the command's logic.

## `assignProps({ description, sandboxed })`

Call `this.assignProps()` inside `meta()` to set command properties:

- **`description`** (string) — a short summary shown in help output.
- **`sandboxed`** (boolean, optional) — when `true`, the command runs inside a Cardoon sandbox. Omit or set to `false` for unsandboxed commands.

## `hasParam(name, spec)`

Call `this.hasParam()` inside `meta()` to declare each parameter:

```javascript
this.hasParam('name', {
    type: 'string',       // 'string', 'number', 'boolean'
    alias: 'arg1',        // positional alias or short flag (e.g. 'n', 'arg1')
    description: 'The name of the thing.',
    optional: true,       // defaults to false
    default: 'world'      // default value when optional and not supplied
});
```

Params are available at runtime via `this.params.<name>`.

## Service-consumer slots

Inside `run()`, the following services are available on `this`:

- **`this.fsBuilder`** — file-system scaffold helper. Provides `generateDir(path, fn)` and `generateFile(name, [opts], fn)` for writing files.
- **`this.logger`** — session logger (async getter). Provides `log(line)` and `sessionDir`. Resolve with `const logger = await this.logger`.
- **`this.agent`** — agent runner. Call `this.agent.run({ systemPrompt, prompt, onLog, interactive })` to dispatch an agent session.
- **`this.project`** — project instance (async getter). Provides `rootPath`, `cardoonPath`, etc. Resolve with `const project = await this.project`.
- **`this.config`** — project configuration (async getter). Resolve with `const config = await this.config`.

## The `_file_importer.js` convention

Every `lib/commands/` directory must contain a `_file_importer.js` file that re-exports the base class for file discovery:

```javascript
export { Command as default } from 'cardoon';
```

Generator commands (like `generate-command`) create this file with `skipIfExists: true` so it is written once and never overwritten. If you are writing a command that scaffolds files into a commands directory, follow this same pattern.
