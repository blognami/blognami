---
menu:
    path: ["Commands", "show-config"]
---
# show-config Command

## Interface

```bash
pinstripe show-config
```

This command takes no parameters.

## Description

Displays the current project configuration in JSON format. The command outputs the complete resolved configuration from `pinstripe.config.js`, including all environment-specific settings and computed values.

## Example Output

```json
{
  "database": {
    "adapter": "sqlite",
    "filename": "development.db"
  },
  "mail": {
    "adapter": "dummy"
  },
  "server": {
    "port": 3000,
    "limits": {
      "json": "1mb",
      "raw": "5mb"
    }
  },
  "salt": "your-application-salt",
  "theme": {
    "primaryColor": "#007bff",
    "fontFamily": "Arial, sans-serif"
  }
}
```

## Use Cases

### Development Workflow
- **Configuration debugging** - Verify current settings during development
- **Environment validation** - Confirm configuration matches expected values
- **Integration testing** - Check configuration before connecting to external services

### DevOps and Deployment
- **Environment verification** - Validate production configuration settings
- **Configuration auditing** - Review current settings for security and performance
- **Troubleshooting** - Diagnose configuration-related issues

## Configuration Resolution

The command displays the fully resolved configuration, including:

- **Static values** from `pinstripe.config.js`
- **Environment-based settings** (development vs. production)
- **Dynamic configuration** from functions in the config file
- **Default values** provided by Pinstripe framework

## Related Commands

- **`show-theme`** - Display only theme configuration details
- **`start-server`** - Start server using the displayed configuration
- **`generate-project`** - Create projects with default configuration