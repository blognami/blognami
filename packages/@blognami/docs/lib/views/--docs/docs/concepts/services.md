---
section: docs
menu:
    path: ["Concepts", "Services"]
    displayOrder: 4
---
# Services

A service is a named value, such as `database` or `renderHtml`, that views, commands and other services read as `this.<name>`. Each one is a file under `lib/services/`.

## Where a service lives

[`generate-service`](/docs/commands/generate-service) writes `lib/services/_file_importer.js`, unless it exists, and `lib/services/{name}.js`, with the name in snake case. [Project structure](/docs/concepts/project-structure) says how `_file_importer.js` turns a file's path into its registered name; `lib/services/_file_importer.js` re-exports `ServiceFactory` from `blognami`.

A service's name is camelized, so `lib/services/user_auth.js` registers as the service `userAuth`. [`list-services`](/docs/commands/list-services) lists the registered services, and takes a partial name to filter them by.

## What a service file exports

This is the file `generate-service greeter` writes:

```javascript
export default {
    create(){
        return 'Example greeter service'
    }
};
```

The default export is included into a service factory class, a subclass of `ServiceFactory` named for the service. Whatever its `create()` returns is the service: a string here, and just as well an object or a function. A file with no `create()` gives a service that is `undefined`.

A `meta()` method on the export runs against the class. Calling `this.addToClient()` there puts the service into the client service worker's bundle; without it the service is registered there under its name only, and reading it there throws an error saying it is not available on the client:

```javascript
export default {
    meta(){
        this.addToClient();
    },

    create(){
        return 'Example greeter service'
    }
};
```

## How a service is reached as `this.<name>`

Reading `this.greeter` on a view, as [Views](/docs/concepts/views) says, or on a service factory or a workspace, looks the camelized name up among the registered services. When there is one, it makes a new instance of that service's factory for the current context and returns the result of its `create()`. A name that is no service reads as `undefined`.

`create()` therefore runs on every read. A service that should be built once per context keeps its value on the context with `getOrCreate()`, which returns the value stored under a name, or stores and returns what the function gives:

```javascript
export default {
    create(){
        return this.context.getOrCreate('greeter', () => ({ greetings: [] }));
    }
};
```

A context lasts for one `Workspace.run()`. When the run ends, each object the context holds that has a `destroy()` method has it called.

`Workspace` is exported from `blognami`. `Workspace.run(fn)` loads the project's files, makes a new context and calls `fn` with `this` as a workspace, on which every service is `this.<name>`:

```javascript
import { Workspace } from 'blognami';

await Workspace.run(async function(){
    console.log(this.greeter);
});
```

[`runInNewWorkspace`](/docs/services/run-in-new-workspace) does the same from inside a view or a service.

## How one service uses another

Inside `create()`, and any other method of the export, `this` is the service factory, so another service is `this.<name>` and the context is `this.context`. A function the service returns has to be an arrow function to keep that `this`:

```javascript
export default {
    create(){
        return name => `${this.greeter}, ${name}`;
    }
};
```

A service whose value takes `await` to build returns it through [`defer`](/docs/services/defer). The function passed to `defer` does not run until the result is awaited, and property reads and calls made on the result before then are applied in order once it has:

```javascript
export default {
    create(){
        return this.defer(async () => {
            return { greeting: await this.greeter };
        });
    }
};
```

```javascript
const greeting = await this.welcome.greeting;
```

`this.serviceManager.intercept(name, fn)` replaces a service for the rest of the context: each later read of `this.<name>` returns `fn(service)`, where `service` is what `create()` returned. A context forked from this one starts with the same interceptors.
