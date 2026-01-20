---
menu:
    path: ["Commands", "list-jobs"]
---
# list-jobs Command

## Interface

The command lists all available jobs in the current project:

```bash
pinstripe list-jobs
```

### Parameters

This command takes no parameters.

### Example

```bash
pinstripe list-jobs
```

## Description

The `list-jobs` command is a **discovery tool** that displays all jobs registered in your Pinstripe project. It scans the application and shows the names of all available jobs that can be executed.

## Sample Output

```
The following jobs are available:

  * send-newsletter
  * process-images
  * cleanup-old-files
```

## Use Cases

- **Development workflow** - Quickly see what jobs are available
- **Debugging** - Verify that jobs are properly registered
- **Documentation** - Get an overview of automated tasks in the project
- **Job execution** - Find job names for use with `run-job` command

## Related Commands

- **`generate-job`** - Create new jobs
- **`run-job`** - Execute a specific job
- **`list-commands`** - List all available CLI commands
