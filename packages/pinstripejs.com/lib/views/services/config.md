---
menus:
    sidebar: ["Services", "config"]
---
# config

Access application configuration from `pinstripe.config.js`.

## Interface

```javascript
await this.config
await this.config.database
await this.config.mail
await this.config.server
```

### Returns

- Configuration object with database, mail, server, and custom properties

## Description

The `config` service loads and normalizes configuration from `pinstripe.config.js`. It provides defaults for database, mail, and server settings while supporting custom configuration properties.

## Configuration Sections

### Database

```javascript
{
    adapter: 'sqlite' | 'mysql',
    // SQLite
    filename: 'development.db',
    // MySQL
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp'
}
```

### Mail

```javascript
{
    adapter: 'dummy' | 'smtp',
    // SMTP
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: { user: '', pass: '' }
}
```

### Server

```javascript
{
    limits: {
        bodySize: 100_000_000,    // 100MB
        fileSize: 10_000_000,     // 10MB
        imageWidth: 1024,
        imageHeight: 1024
    }
}
```

## Example Configuration

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

export default {
    database,
    mail: {
        adapter: environment === 'production' ? 'smtp' : 'dummy',
        host: 'smtp.example.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    },
    salt: process.env.APP_SALT || 'default-salt'
};
```

## Examples

### Accessing Configuration

```javascript
// Full config
const config = await this.config;

// Specific sections
const dbConfig = await this.config.database;
const mailConfig = await this.config.mail;
```

### Custom Properties

```javascript
// pinstripe.config.js
export default {
    database: { adapter: 'sqlite', filename: 'dev.db' },
    theme: { primaryColor: '#007bff' },
    featureFlags: { betaFeatures: true }
};

// Usage
const { theme, featureFlags } = await this.config;
```

## Notes

- Configuration is loaded once and cached
- SQLite filenames are resolved to absolute paths
- Custom properties can be functions (called with `this` context)
