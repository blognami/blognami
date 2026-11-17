
# @blognami/docs

## Getting started

```bash
    blognami initialize-database
    blognami start-server
```

The docs are served at `/docs` with no extra configuration — this package's own
`blognami.config.js` pre-enables the `docs` feature flag.

## Browsing the docs offline from your own app

Install `@blognami/docs` as a devDependency:

```bash
    npm install --save-dev @blognami/docs
```

Import it in your app's `lib/index.js`:

```js
    import '@blognami/docs';
```

Then enable the `docs` feature flag in development in your app's `blognami.config.js`:

```js
    const environment = process.env.NODE_ENV || 'development';

    export default {
        // ...

        featureFlags(){
            return environment == 'development' ? { docs: true } : {};
        }
    };
```

The docs now serve at `/docs` in development, straight from `node_modules`, with no
network access.

## Using the docs with Claude Code

This package ships `AGENT_GUIDE.md`, a guide for a coding agent working in a Blognami
project: what a project is, how it is laid out, and a link to each docs page, all at
the installed version.

`blognami generate-project` sets this up for every new project: it installs
`@blognami/docs` as a devDependency and writes a `CLAUDE.md` that imports the guide, so
Claude Code loads it with nothing to configure.

For a project generated earlier, install `@blognami/docs` as a devDependency:

```bash
    npm install --save-dev @blognami/docs
```

Then create a `CLAUDE.md` in the project root holding the import line:

```markdown
    # CLAUDE.md

    @node_modules/@blognami/docs/AGENT_GUIDE.md
```

If the project already has a `CLAUDE.md`, add the import line to it rather than
replacing the file.
