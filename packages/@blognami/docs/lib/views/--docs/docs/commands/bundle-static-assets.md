---
section: docs
menu:
    path: ["Commands", "bundle-static-assets"]
---
# bundle-static-assets Command

> **Note**: This command is implemented as part of the `@blognami/bundler` package and needs to be included in your project's `devDependencies` for it to be available. Projects created with `generate-project` include it automatically.

## Interface

The command builds the shell's static assets into the `build/static-assets` directory:

```bash
blognami bundle-static-assets
```

### Parameters

No parameters required.

### Examples

```bash
# Build the static assets
blognami bundle-static-assets

# Build them for a production image (needs no database and no .env.production)
NODE_ENV=production blognami bundle-static-assets
```

## Description

The `bundle-static-assets` command **prebuilds the shell's JavaScript and CSS** so a production server never has to bundle them at runtime:

1. **Rendering** - Renders each asset with the build tooling in `@blognami/bundler`
2. **Writing** - Saves the output under `build/static-assets/`, replacing any files from an earlier build

Outside `development` and `test`, `start-server` serves these prebuilt files. In `development` and `test` they are never read: the assets are always built on the fly through `@blognami/bundler`.

## Generated File Structure

```
build/static-assets/
├── service_worker.js                    # /service_worker.js
└── _blognami/
    └── _shell/
        ├── window.js                    # /_blognami/_shell/window.js
        ├── window.js.map                # /_blognami/_shell/window.js.map
        ├── styles.css                   # /_blognami/_shell/styles.css
        └── service_worker.js.map        # /_blognami/_shell/service_worker.js.map
```

## Production Images

Production images run the command at build time, then remove `@blognami/bundler` and its build tooling with the other development dependencies:

```dockerfile
RUN npm install \
    && NODE_ENV=production npx blognami bundle-static-assets \
    && npm prune --omit=dev
```

## Upgrading Existing Projects

Older projects do not have `@blognami/bundler` installed. Add it to `devDependencies`:

```bash
npm install --save-dev @blognami/bundler
```

Without the package, and without prebuilt files in `build/static-assets/`, every asset URL fails with:

```
Static assets are not built: run "blognami bundle-static-assets" or install @blognami/bundler
```

## Related Commands

- **`start-server`** - Serves the prebuilt assets outside `development` and `test`
- **`generate-static-site`** - Generate static files, including the shell's assets
- **`generate-project`** - Create projects with `@blognami/bundler` as a devDependency
