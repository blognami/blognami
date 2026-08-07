
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
