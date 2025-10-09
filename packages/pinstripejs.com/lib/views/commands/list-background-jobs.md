---
sidebar:
    category: ["Commands", "list-background-jobs"]
---
# list-background-jobs Command

## Interface

The command lists all available background jobs in the current project:

```bash
pinstripe list-background-jobs
```

### Parameters

This command takes no parameters.

### Example

```bash
pinstripe list-background-jobs
```

## Description

The `list-background-jobs` command is a **discovery tool** that displays all background jobs registered in your Pinstripe project. It scans the application and shows the names of all available background jobs that can be executed.

## Sample Output

```
The following background jobs are available:

  * send-newsletter
  * process-images
  * cleanup-old-files
```

## Use Cases

- **Development workflow** - Quickly see what background jobs are available
- **Debugging** - Verify that background jobs are properly registered
- **Documentation** - Get an overview of automated tasks in the project
- **Job execution** - Find job names for use with `run-background-job` command

## Related Commands

- **`generate-background-job`** - Create new background jobs
- **`run-background-job`** - Execute a specific background job
- **`list-commands`** - List all available CLI commands