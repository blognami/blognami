---
menus:
    sidebar: ["Services", "fsBuilder"]
---
# fsBuilder

File system utilities for code generation and scaffolding.

## Interface

```javascript
// Create directory and execute function within it
this.fsBuilder.generateDir(dirPath, fn)

// Generate a file with template content
this.fsBuilder.generateFile(name, options, fn)

// Execute function in project root directory
this.fsBuilder.inProjectRootDir(fn)
```

## Methods

### generateDir(dirPath, fn)

Creates a directory and executes a function within its context.

### generateFile(name, options, fn)

Generates a file with content from a template function.

**Options:**
- `skipIfExists` - Skip if file already exists
- `force` - Overwrite without confirmation

### inProjectRootDir(fn)

Executes a function in the project root directory context.

## Template Helpers

The template function receives:
- `line(content)` - Add a line with newline
- `indent(fn)` - Indent nested content (4 spaces)
- `echo(content)` - Add content without newline

## Examples

### Basic File Generation

```javascript
await this.fsBuilder.generateFile('config.js', ({ line, indent }) => {
    line('export default {');
    indent(({ line }) => {
        line("name: 'MyProject',");
        line("version: '1.0.0'");
    });
    line('};');
});
```

### Generate Service in Project

```javascript
await this.fsBuilder.inProjectRootDir(async () => {
    await this.fsBuilder.generateFile(
        `lib/services/${this.inflector.snakeify(name)}.js`,
        ({ line, indent }) => {
            line('export default {');
            indent(({ line }) => {
                line('create() {');
                line("    return 'Hello World';");
                line('}');
            });
            line('};');
        }
    );
});
```

### Create Directory Structure

```javascript
await this.fsBuilder.generateDir('my-project', async () => {
    await this.fsBuilder.generateFile('README.md', ({ line }) => {
        line('# My Project');
        line();
        line('Project description.');
    });

    await this.fsBuilder.generateFile('lib/index.js', ({ line }) => {
        line("export default 'Hello World';");
    });
});
```

### Skip Existing Files

```javascript
// Only create if doesn't exist
await this.fsBuilder.generateFile(
    'lib/services/_file_importer.js',
    { skipIfExists: true },
    ({ line }) => {
        line("export { ServiceFactory as default } from 'pinstripe';");
    }
);
```

## User Interaction

For existing files, prompts for confirmation:
- **Y** (or Enter) - Proceed
- **N** - Skip file
- **A** - Abort process

## Notes

- Parent directories are created automatically
- Identical content skips without prompting
- Used primarily in generator commands
