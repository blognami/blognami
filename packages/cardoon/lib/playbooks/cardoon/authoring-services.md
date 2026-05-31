# Authoring services

A service is a single `.js` file that exports a plain object with a `create()` method. Services are workspace-scoped singletons — created once on first access and reused for the lifetime of the context.

## Directory and filename convention

Place the file under the project's `lib/services/` directory (typically `.cardoon/lib/services/`). The filename must be snake_case with a `.js` extension:

```
lib/services/github_client.js
```

The service name is derived from the filename without the extension, camelized. So `github_client.js` registers as `githubClient`.

Every `lib/services/` directory must contain a `_file_importer.js` that re-exports the base class for file discovery:

```javascript
export { ServiceFactory as default } from 'cardoon';
```

Generator commands create this file with `skipIfExists: true` so it is written once and never overwritten. Reference shapes: `cardoon/lib/service_factory.js` and `haberdash/lib/abstract_service_factory.js`.

## Service module shape

The default export is a plain object. The only required method is `create()`. You may add helper methods alongside it. Services have **no `meta()`, no `assignProps()`, no `destroy()`** — they are not commands. No annotations, no teardown.

```javascript
export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('myService', async () => {
            // build and return the singleton instance
        }));
    },

    someHelper(instance, arg){
        // optional — helper methods alongside create()
    }
};
```

## The `create()` idiom

The canonical shape is:

```javascript
return this.defer(async () => this.context.root.getOrCreate('<name>', async () => /* instance */));
```

- **`this.defer`** wraps the factory in a lazy promise — the service is not instantiated until the first `await`.
- **`this.context.root.getOrCreate(key, factory)`** memoises a workspace-scoped singleton. The `key` must be unique across all services; by convention it matches the camelized service name.

## Consuming other services via the `Consumerable` trap

Inside `create()`, any registered service name is reachable as a property on `this`. The `Consumerable` mixin intercepts property access and resolves the matching service:

```javascript
const project = await this.project;
const config = await this.config;
const logger = await this.logger;
```

This works for any service — built-in or user-defined. If you register `github_client.js`, other services (and commands) can consume it via `await this.githubClient`.

## Worked example

A service that depends on `this.project` and exposes one method:

```javascript
// lib/services/git_status.js
import { execSync } from 'node:child_process';

export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('gitStatus', async () => {
            const project = await this.project;
            return {
                isDirty(){
                    const out = execSync('git status --porcelain', {
                        cwd: project.rootPath,
                        encoding: 'utf8'
                    });
                    return out.trim().length > 0;
                }
            };
        }));
    }
};
```

Consumer snippet inside a command's `run()`:

```javascript
const gitStatus = await this.gitStatus;
if(gitStatus.isDirty()){
    console.log('Working tree has uncommitted changes.');
}
```

## Canonical built-in services

When in doubt, read these as reference shapes:

- `cardoon/lib/services/logger.js` — session logger with directory allocation.
- `cardoon/lib/services/agent.js` — agent runner with provider dispatch.
- `cardoon/lib/services/sandbox.js` — sandbox provider factory.
