---
menus:
    sidebar: ["Services", "project"]
---
# project

Access project metadata and paths.

## Interface

```javascript
await this.project.name
await this.project.rootPath
await this.project.config
await this.project.exists
```

## Properties

| Property | Description |
|----------|-------------|
| `name` | Project name from package.json (or 'unknown') |
| `rootPath` | Absolute path to project root |
| `configPath` | Path to package.json |
| `config` | Parsed package.json contents |
| `exists` | Boolean - valid project found |
| `entryPath` | Main entry point path |
| `nodePaths` | Array of node_modules directories |

## Description

The `project` service provides access to project metadata from `package.json`. It walks up the directory tree to find the project root and parses configuration.

## Examples

### Basic Usage

```javascript
export default {
    async run() {
        const projectName = await this.project.name;
        console.log(`Project: ${projectName}`);

        if (await this.project.exists) {
            console.log('Valid project detected');
        }
    }
}
```

### Access Package.json

```javascript
export default {
    async run() {
        const config = await this.project.config;

        console.log(`Version: ${config.version}`);
        console.log(`Description: ${config.description}`);
    }
}
```

### Database Naming

```javascript
export default {
    async normalizeDatabaseConfig(config) {
        const environment = process.env.NODE_ENV || 'development';

        return {
            ...config,
            database: `${this.inflector.snakeify(await this.project.name)}_${environment}`
        };
    }
}
```

### Version Service

```javascript
export default {
    create() {
        return this.defer(async () => {
            let version = await this.project.config.version || '0.1.0';

            if (await this.environment === 'development') {
                version += `.${Date.now()}`;
            }

            return version;
        });
    }
}
```

## Notes

- Uses deferred initialization (requires `await`)
- Returns 'unknown' for name when not found
- All paths are absolute and resolved
- Singleton instance shared across application
