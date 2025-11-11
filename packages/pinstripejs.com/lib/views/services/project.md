---
menus:
    sidebar: ["Services", "project"]
---
# project Service

The `project` service provides access to information about the current Pinstripe project, including its configuration, paths, and metadata. It acts as a bridge to the underlying `Project` class, which is a singleton that analyzes the current working directory to find and parse project information from `package.json`.

## Description

The project service gives you access to essential project metadata and file system information needed for building applications, generating files, and configuring services. It automatically discovers project boundaries by walking up the directory tree to find the nearest `package.json` file, then extracts relevant information about the project structure.

This service is particularly useful for:
- Accessing project name and version information
- Getting absolute paths to project root and entry points
- Reading project configuration from `package.json`
- Determining if you're currently within a valid project
- Finding node_modules directories in the project hierarchy

## Interface

The project service returns a Project instance with the following properties:

### Properties

#### `name` (String)
The project name from `package.json`, or `'unknown'` if not found.

#### `rootPath` (String) 
The absolute path to the project root directory (where `package.json` is located).

#### `configPath` (String)
The absolute path to the `package.json` file.

#### `config` (Object)
The parsed contents of the `package.json` file.

#### `exists` (Boolean)
Whether a valid project was found (has both `configPath` and `config.name`).

#### `entryPath` (String)
The absolute path to the main entry point file (from exports['.'] or main field).

#### `mainPath` (String)
The absolute path to the main file specified in `package.json`.

#### `exports` (Object)
Map of export names to their resolved absolute file paths.

#### `nodePaths` (Array)
Array of absolute paths to `node_modules` directories found in the project hierarchy.

## Examples

### Basic Project Information

```javascript
export default {
    async run(){
        // Get project name for database naming
        const projectName = await this.project.name;
        console.log(`Project: ${projectName}`);
        
        // Check if we're in a valid project
        if(await this.project.exists){
            console.log('Valid project detected');
        } else {
            console.log('No project found');
        }
    }
};
```

### File Path Resolution

```javascript
export default {
    async run(){
        // Get project root for file operations
        const rootPath = await this.project.rootPath;
        const configFile = `${rootPath}/pinstripe.config.js`;
        
        // Access package.json data
        const config = await this.project.config;
        console.log(`Version: ${config.version}`);
        console.log(`Description: ${config.description}`);
    }
};
```

### Database Configuration

```javascript
// From config service - using project info for database names
export default {
    async normalizeDatabaseConfig(config){
        const environment = process.env.NODE_ENV || 'development';
        
        return {
            ...config,
            database: `${this.inflector.snakeify(await this.project.name)}_${environment}`
        };
    }
};
```

### Version Management

```javascript
// From version service - using project config for versioning
export default {
    create(){
        return this.defer(async () => {
            let version = await this.project.config.version || '0.1.0';
            
            if(await this.environment == 'development'){
                version += `.${Date.now()}`;
            }
            
            return version;
        });
    }
};
```

### Project Initialization

```javascript
// From initialize_project command - using project name for setup
export default {
    async generateSeedDatabaseCommand(){
        const { generateFile } = this.fsBuilder;
        
        await generateFile(`lib/commands/seed_database.js`, ({ line, indent }) => {
            line(`export default {`);
            indent(({ line, indent }) => {
                line('async run(){');
                indent(({ line }) => {
                    line(`await this.database.site.update({`);
                    indent(async ({ line }) => {
                        // Capitalize project name for site title
                        line(`title: '${this.inflector.capitalize(await this.project.name)}'`);
                    });
                    line(`});`);
                });
                line('}');
            });
            line('};');
        });
    }
};
```

### Configuration File Resolution

```javascript
// From config service - using project root to find config files
export default {
    async createConfig(){
        const candidateConfigFilePath = `${await this.project.rootPath}/pinstripe.config.js`;
        
        let config = {};
        if(existsSync(candidateConfigFilePath)){
            config = await (await import(candidateConfigFilePath)).default;
        }
        
        return config;
    }
};
```

### CLI Integration

```javascript
// From cli.js - using project existence to determine available commands  
const { entryPath, exists } = await Project.instance;

if(exists){
    Command.unregister('generate-project');
} else {
    // Remove most commands when not in a project
    Command.names.forEach(commandName => {
        if(commandName == 'list-commands' || commandName == 'generate-project') return;
        Command.unregister(commandName);
    });
}
```

### Bundle Configuration

```javascript
// From bundle.js - using node paths for build resolution
export default {
    async build(){
        return esbuild.build({
            // Use project's node_modules for resolution
            nodePaths: await Project.instance.nodePaths,
            // ... other build options
        });
    }
};
```

## Notes

- The project service uses deferred initialization, so accessing properties requires `await`
- The service automatically walks up the directory tree to find the project root
- Returns reasonable defaults (like `'unknown'` for name) when project information is missing
- The `exists` property is useful for determining if you're running within a valid project context
- All file paths returned are absolute and resolved (symlinks are resolved to actual paths)
- The service is a singleton, so the same project instance is shared across the application