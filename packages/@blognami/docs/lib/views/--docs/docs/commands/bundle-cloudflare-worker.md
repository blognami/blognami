---
section: docs
menu:
    path: ["Commands", "bundle-cloudflare-worker"]
---
# bundle-cloudflare-worker Command

> **Note**: This command is implemented as part of the `@blognami/cloudflare` package, which needs to be installed in your project and imported in `lib/index.js` for it to be available. Projects created with `generate-project` do not include it. See [Deploy to Cloudflare](/docs/deploy-to-cloudflare) for the whole walk-through.

## Interface

The command builds the project as a Cloudflare Worker script in the `build/cloudflare-worker` directory, and writes a `wrangler.toml` when the project has none:

```bash
npx blognami bundle-cloudflare-worker
```

### Parameters

No parameters required.

### Examples

```bash
# Build the Cloudflare Worker
npx blognami bundle-cloudflare-worker

# Build it minified, as a production build
NODE_ENV=production npx blognami bundle-cloudflare-worker
```

## Description

The `bundle-cloudflare-worker` command **builds the project into the files `wrangler` runs as a Cloudflare Worker**:

1. **Bundling** - Bundles the project, its `blognami.config.js` included, into one script holding the Cloudflare Worker and its Durable Object, and writes it to `build/cloudflare-worker/index.js`
2. **Static assets** - Runs `bundle-static-assets`, which writes `build/static-assets/`
3. **Assets directory** - Empties `build/cloudflare-worker-assets/`, then fills it with a copy of `build/static-assets/` and each file-backed view under its full view name, any file path feature flag segment kept
4. **Config** - Writes `wrangler.toml` at the project root, only when the project has none

An existing `wrangler.toml` is never rewritten or merged. Run the command again after each change to the project.

## Generated File Structure

```
build/
├── cloudflare-worker/
│   └── index.js                 # The Cloudflare Worker script and its Durable Object
├── cloudflare-worker-assets/    # Emptied and filled on each run
│   ├── service_worker.js
│   └── _blognami/
│       └── _shell/
│           ├── window.js
│           ├── window.js.map
│           ├── styles.css
│           └── service_worker.js.map
└── static-assets/               # Written by bundle-static-assets, which the command runs
wrangler.toml                    # Only when the project has none
```

The written `wrangler.toml` and its bindings are shown in [Deploy to Cloudflare](/docs/deploy-to-cloudflare).

## Related Commands

- **`bundle-static-assets`** - Builds the shell's static assets; this command runs it
- **`list-commands`** - Lists `bundle-cloudflare-worker` once `@blognami/cloudflare` is imported
- **`generate-project`** - Create the project the [Deploy to Cloudflare](/docs/deploy-to-cloudflare) guide starts from
