---
sidebar:
    category: ["Commands", "list-commands"]
---
# list-commands Command

## Interface

```bash
pinstripe list-commands
```

This command takes no parameters.

## Description

Lists all available Pinstripe commands in the current context and shows how to get help for specific commands.

## Example Output

```
The following commands are available:

  * generate-project
  * generate-service  
  * generate-view
  * list-commands
  * show-config
  * start-server

For more information on a specific command, run:

  pinstripe COMMAND_NAME --help
```

## Context-Aware Behavior

The command shows different commands depending on your location:

- **Outside a project**: Only shows `list-commands` and `generate-project`
- **Inside a project**: Shows all available project commands like `generate-service`, `start-server`, etc.

## Related Commands

- **`generate-project`** - Create new Pinstripe projects