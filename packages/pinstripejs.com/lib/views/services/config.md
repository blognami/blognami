---
menus:
    sidebar: ["Services", "config"]
---
# config Service

The `config` service provides centralized configuration management for Pinstripe applications. It loads and normalizes configuration from `pinstripe.config.js` files, providing defaults and validation for database, mail, server, and custom configuration options.

## Interface

The config service returns a promise that resolves to a configuration object with the following structure:

```javascript
{
    database: DatabaseConfig,
    mail: MailConfig,
    server: ServerConfig,
    // ... any custom configuration properties
}
```

### DatabaseConfig

```javascript
{
    adapter: 'sqlite' | 'mysql',
    
    // For SQLite (default)
    filename: string, // absolute path to database file
    
    // For MySQL
    host: string,
    user: string,
    password: string,
    database: string
}
```

### MailConfig

```javascript
{
    adapter: 'dummy' | 'smtp',
    defaults: object,
    
    // For SMTP adapter
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string
    }
}
```

### ServerConfig

```javascript
{
    limits: {
        bodySize: number,         // Default: 100MB
        rawBodySize: number,      // Default: 1MB
        fieldNameSize: number,    // Default: 100
        fieldSize: number,        // Default: 1MB
        fields: number,          // Default: Infinity
        fileSize: number,        // Default: 10MB
        files: number,           // Default: Infinity
        parts: number,           // Default: Infinity
        headerPairs: number,     // Default: 2000
        imageWidth: number,      // Default: 1024
        imageHeight: number      // Default: 1024
    }
}
```

## Usage

### Basic Configuration Access

```javascript
// Access the full configuration
const config = await this.config;

// Access specific configuration sections
const databaseConfig = await this.config.database;
const mailConfig = await this.config.mail;
const serverConfig = await this.config.server;
```

### Database Configuration

```javascript
// Get database configuration for creating a client
export default {
    create() {
        return this.defer(async () =>
            Client.new(await this.config.database)
        );
    }
};

// Extract database config for command operations
const { adapter, ...databaseConfig } = await this.config.database;

if (adapter === 'mysql') {
    // Use MySQL-specific configuration
    const { host, user, password, database } = databaseConfig;
} else {
    // Use SQLite-specific configuration
    const { filename } = databaseConfig;
}
```

### Mail Configuration

```javascript
// Configure mail service
export default {
    create() {
        return this.defer(async () => {
            const { mail: mailConfig = {} } = await this.config;
            const { adapter = 'dummy', ...adapterConfig } = mailConfig;
            
            if (adapter === 'dummy') return this.createDummy(adapterConfig);
            if (adapter === 'smtp') return this.createSmtp(adapterConfig);
            
            throw new Error(`No such mail adapter '${adapter}' exists.`);
        });
    }
};
```

### Server Configuration

```javascript
// Access server limits for request processing
export default {
    async handleRequest(request, baseUrl) {
        const limits = await this.config.server.limits;
        const params = await this.extractParams(request, baseUrl, limits);
        // ... process request
    }
};
```

### Custom Configuration

```javascript
// Access custom configuration properties
const customConfig = await this.config;
const theme = customConfig.theme || {};
const salt = customConfig.salt;
const featureFlags = customConfig.featureFlags;

// Use in feature flag service
let { featureFlags = defaultCallback } = await this.config;
if (typeof featureFlags === 'function') {
    featureFlags = await featureFlags.call(this);
}
```

### Multi-tenant Configuration

```javascript
// Access tenant-specific configuration
export default {
    create() {
        return this.defer(async () => {
            // Get tenant configuration callback
            let { tenant = defaultCallback } = await this.config;
            
            // Resolve tenant dynamically
            if (typeof tenant === 'function') {
                tenant = await tenant.call(this);
            }
            
            // Use tenant configuration
            return tenant;
        });
    }
};
```

## Configuration File Structure

The config service loads configuration from `pinstripe.config.js` in the project root:

### Basic Configuration

```javascript
// pinstripe.config.js
export default {
    database: {
        adapter: 'sqlite',
        filename: 'development.db'
    },
    mail: {
        adapter: 'dummy'
    },
    salt: 'your-application-salt'
};
```

### Environment-based Configuration

```javascript
// pinstripe.config.js
const environment = process.env.NODE_ENV || 'development';

let database;
if (environment === 'production') {
    database = {
        adapter: 'mysql',
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: `myapp_${environment}`
    };
} else {
    database = {
        adapter: 'sqlite',
        filename: `${environment}.db`
    };
}

let mail;
if (environment === 'production') {
    mail = {
        adapter: 'smtp',
        host: "smtp.example.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    };
} else {
    mail = {
        adapter: 'dummy'
    };
}

export default {
    database,
    mail,
    salt: process.env.APP_SALT || 'default-salt'
};
```

### Advanced Configuration with Functions

```javascript
// pinstripe.config.js
export default {
    database: {
        adapter: process.env.DATABASE_ADAPTER || 'sqlite'
    },
    
    // Dynamic feature flags
    featureFlags() {
        const headers = this.initialParams._headers;
        const flags = headers['x-feature-flags'] || '';
        return flags.split(/\s+/)
                   .filter(name => !!name)
                   .reduce((out, name) => ({ ...out, [name]: true }), {});
    },
    
    // Dynamic tenant resolution
    tenant() {
        const headers = this.initialParams._headers;
        const hostname = this.initialParams._url.hostname;
        const host = (headers['host'] || hostname)
                     .replace(/:\d+$/, '')
                     .toLowerCase();
        return this.database.tenants.where({ host }).first();
    },
    
    // Custom theme configuration
    theme: {
        primaryColor: '#007bff',
        fontFamily: 'Arial, sans-serif'
    }
};
```

## Default Values

The config service provides sensible defaults for all configuration sections:

- **Database**: SQLite adapter with `${environment}.db` filename
- **Mail**: Dummy adapter (logs to console)
- **Server**: Standard limits for request processing
- **Custom properties**: No defaults (undefined unless specified)

## Normalization

Configuration values are automatically normalized:

- **Database paths**: Relative filenames become absolute paths
- **Database names**: Auto-generated from project name and environment for MySQL
- **Server limits**: Missing limit values get sensible defaults
- **Mail defaults**: Empty defaults object if not specified

## Caching

Configuration is loaded once per application lifecycle and cached using the `defer` mechanism. Subsequent calls to `this.config` return the same promise, ensuring consistent configuration across services.