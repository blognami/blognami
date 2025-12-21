---
menu:
    path: ["Commands", "list-services"]
---
# list-services Command

## Interface

The command lists all available services in the current project:

```bash
pinstripe list-services
```

### Parameters

No parameters required.

### Examples

```bash
# List all services in the current project
pinstripe list-services
```

## Description

The `list-services` command is a **project inspection tool** that displays all services available in the current Pinstripe project. Services are business logic components that handle application functionality like user management, content processing, or data manipulation.

The command outputs:
- **Service names** - Each service is displayed with a green-colored name for easy identification
- **Clean formatting** - Services are listed with bullet points and proper spacing

## Sample Output

```
The following services are available:

  * UserService
  * PostService  
  * CommentService
  * TagService
  * EmailService
```

## Use Cases

### Development Workflow
- **Code exploration** - Quickly see what services exist in a project
- **Integration planning** - Understand available business logic components
- **Debugging** - Verify services are properly registered

### Project Documentation
- **Architecture overview** - Get a high-level view of application components  
- **Team onboarding** - Help new developers understand the project structure
- **Service inventory** - Maintain awareness of existing functionality

## Related Commands

- **`generate-service`** - Create new services for the project
- **`list-commands`** - List all available CLI commands
- **`list-background-jobs`** - List all available background jobs
- **`show-config`** - Display project configuration details