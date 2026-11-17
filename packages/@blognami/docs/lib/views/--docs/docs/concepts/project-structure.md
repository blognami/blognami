---
section: docs
menu:
    path: ["Concepts", "Project structure"]
    displayOrder: 1
---
# Project structure

A Blognami project is an npm package that imports the Blognami packages it wants and adds its own code under `lib/`.

## What generate-project writes

[`generate-project`](/docs/commands/generate-project) writes four files into a new directory:

- `package.json` - an ES module package whose `.` export is `./lib/index.js`, the project's entry point
- `blognami.config.js` - the `database` and `mail` settings and a `salt`: SQLite and the `dummy` mail adapter outside production, MySQL and SMTP in production
- `lib/index.js` - the entry point, described below
- `CLAUDE.md` - one line that imports `AGENT_GUIDE.md` from `@blognami/docs`

It then installs the dependencies, with `@blognami/bundler` and `@blognami/docs` as dev dependencies, and runs `initialize-project`, which writes a `README.md` unless one exists. A package can hook its own steps into `initialize-project`.

## lib/index.js

```javascript
import '@blognami/main';
import '@blognami/pages';
import '@blognami/posts';
import '@blognami/tags';

import { importAll } from 'blognami';

importAll(import.meta.url);
```

Each `import` loads a Blognami package. `importAll(import.meta.url)` then walks the directory that holds `lib/index.js`, subdirectories included, in sorted order, and imports each file once. The Blognami packages do the same in their own `lib/index.js`: `@blognami/main` has the same six directories as the table below.

## Directories under lib/

Each kind of thing has a directory of its own. None exists in a new project; the matching `generate-*` command creates the directory, its `_file_importer.js` and the first file.

| Directory | Holds | `_file_importer.js` exports | Written by |
| --- | --- | --- | --- |
| `lib/views/` | Views | `View` from `blognami` | [`generate-view`](/docs/commands/generate-view) |
| `lib/models/` | Models | `Row` from `@blognami/database` | [`generate-model`](/docs/commands/generate-model) |
| `lib/migrations/` | Migrations | `Migration` from `@blognami/database` | [`generate-migration`](/docs/commands/generate-migration) |
| `lib/services/` | Services | `ServiceFactory` from `blognami` | [`generate-service`](/docs/commands/generate-service) |
| `lib/jobs/` | Jobs | `Job` from `blognami` | [`generate-job`](/docs/commands/generate-job) |
| `lib/commands/` | Commands | `Command` from `blognami` | [`generate-command`](/docs/commands/generate-command) |

## How _file_importer.js decides what a file registers as

A directory's `_file_importer.js` is one line that re-exports a class as its default export:

```javascript
export { View as default } from 'blognami';
```

When `importAll` meets a directory holding a `_file_importer.js`, it hands every file in that directory and below to that class's `importFile`, in place of importing it. The class picks an importer by the file's extension. For a `.js` file the importer registers the file's default export with the class, under the file's path relative to the directory without its extension, so `lib/services/greeter.js` registers as the service `greeter`. A subdirectory with a `_file_importer.js` of its own starts again with its own class.

A file outside any such directory is imported as a plain module, and only when it is a `.js` file with no other dot in its name, so `lib/helper.js` is imported and `lib/helper.test.js` is not.
