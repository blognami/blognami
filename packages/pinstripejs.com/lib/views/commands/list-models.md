---
menu:
    path: ["Commands", "list-models"]
---
# list-models Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command lists all available database models with the following signature:

```bash
pinstripe list-models
```

### Parameters

None - this command takes no parameters.

### Examples

```bash
# List all available models
pinstripe list-models
```

## Description

The `list-models` command is a **database introspection tool** that displays all database models currently available in your Pinstripe project. Models are automatically registered when they extend the `Row` class from `@pinstripe/database`.

## Sample Output

```
The following models are available:

  * User
  * Post
  * Comment
  * Tag
  * Page
```

## Key Features

### Automatic Model Discovery
- Discovers all models that extend the `Row` class
- No configuration required - models are automatically registered
- Shows models from both your project and installed packages

### Clean Display
- Simple bulleted list format
- Color-coded model names (green) for better readability
- Alphabetically sorted output

## Use Cases

### Development Workflow
- **Model verification** - Confirm models are properly registered
- **Code exploration** - Discover available models in large projects
- **Debugging** - Troubleshoot model registration issues

### Project Documentation
- **API reference** - Quick reference for available data models
- **Team onboarding** - Help new developers understand project structure

## Related Commands

- **`generate-model`** - Create new database models
- **`list-migrations`** - View database migration history
- **`initialize-database`** - Set up database schema and initial data