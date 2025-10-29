---
menus:
    sidebar: ["Services", "renderText"]
---
# renderText Service

## Interface

The service creates an async function that accepts a single function parameter:

```javascript
await this.renderText(textFunction)
```

### Parameters

- **`textFunction`** (function) - A function that receives a utilities object with text formatting methods (`echo`, `line`, `indent`)

### Return Value

Returns a `Promise` that resolves to a `Text` instance that:
- Can be converted to string with `toString()`
- Can be used in HTTP responses with `toResponseArray()`
- Provides plain text content with proper line breaks and indentation

## Description

The `renderText` service is a powerful plain text template rendering utility that:

1. **Provides structured text output** through specialized formatting functions (`echo`, `line`, `indent`)
2. **Handles asynchronous content** by supporting promises in all text operations
3. **Manages indentation automatically** with nested scope-aware indentation levels
4. **Supports flexible text composition** ideal for code generation, configuration files, and formatted output
5. **Processes content lazily** allowing for complex nested structures and conditional rendering
6. **Returns structured text objects** that can be converted to strings or HTTP responses

The service is built on top of the `Text` class and is available on all views via `this.renderText`.

## Key Features

- **Line-based output** with automatic newline management
- **Scope-aware indentation** with 4-space increments per level
- **Promise-aware rendering** for async content resolution
- **Minimal API** with just three core functions: `echo`, `line`, `indent`
- **HTTP response compatibility** for serving text content directly

## Examples

### Basic Text Output

```javascript
// Simple text with echo
const result = await this.renderText(({ echo }) => {
    echo('Hello world');
});
// Result: "Hello world"

// Line-based output
const result = await this.renderText(({ line }) => {
    line('First line');
    line('Second line');
});
// Result: "First line\nSecond line"
```

### File Generation

```javascript
// Generate a JavaScript service file
const serviceCode = await this.renderText(({ line, indent }) => {
    line(`export default {`);
    indent(({ line, indent }) => {
        line('create(){');
        indent(({ line }) => {
            line(`return 'Example ${serviceName} service'`);
        });
        line('}');
    });
    line('};');
});

// Result:
// export default {
//     create(){
//         return 'Example MyService service'
//     }
// };
```

### Email Template Generation

```javascript
// Generate plain text email content
const emailBody = await this.renderText(({ line, indent }) => {
    line('Dear Customer,');
    line();
    line('Thank you for your recent order. Here are the details:');
    line();
    indent(({ line }) => {
        line(`Order ID: ${order.id}`);
        line(`Date: ${order.date}`);
        line(`Total: $${order.total}`);
    });
    line();
    line('Best regards,');
    line('The Team');
});
```

### Configuration File Generation

```javascript
// Generate configuration files
const configFile = await this.renderText(({ line, indent }) => {
    line('[database]');
    indent(({ line }) => {
        line(`host = ${config.db.host}`);
        line(`port = ${config.db.port}`);
        line(`name = ${config.db.name}`);
    });
    line();
    line('[server]');
    indent(({ line }) => {
        line(`port = ${config.server.port}`);
        line(`debug = ${config.server.debug}`);
    });
});
```

### Asynchronous Content

```javascript
// Handle promises and async operations
const report = await this.renderText(async ({ line, indent }) => {
    line('System Report');
    line('=============');
    line();
    
    const users = await this.database.users.count();
    line(`Total Users: ${users}`);
    
    const posts = await this.database.posts.count();
    line(`Total Posts: ${posts}`);
    
    line();
    line('Recent Activity:');
    indent(async ({ line }) => {
        const recentUsers = await this.database.users.recent(5);
        for(const user of recentUsers) {
            line(`- ${user.name} joined ${user.createdAt}`);
        }
    });
});
```

### Multi-level Indentation

```javascript
// Complex nested structure generation
const structuredOutput = await this.renderText(({ line, indent }) => {
    line('Root Level');
    indent(({ line, indent }) => {
        line('Level 1');
        indent(({ line, indent }) => {
            line('Level 2');
            indent(({ line }) => {
                line('Level 3');
                line('Still Level 3');
            });
            line('Back to Level 2');
        });
        line('Back to Level 1');
    });
    line('Back to Root');
});

// Result:
// Root Level
//     Level 1
//         Level 2
//             Level 3
//             Still Level 3
//         Back to Level 2
//     Back to Level 1
// Back to Root
```

### Conditional Content Generation

```javascript
// Generate content based on conditions
const buildScript = await this.renderText(({ line, indent }) => {
    line('#!/bin/bash');
    line();
    line('echo "Starting build process..."');
    line();
    
    if(includeTests) {
        line('echo "Running tests..."');
        line('npm test');
        line();
    }
    
    line('echo "Building application..."');
    line('npm run build');
    
    if(deployAfterBuild) {
        line();
        line('echo "Deploying..."');
        indent(({ line }) => {
            line('if [ $? -eq 0 ]; then');
            line('    npm run deploy');
            line('    echo "Deployment complete"');
            line('else');
            line('    echo "Build failed, skipping deployment"');
            line('fi');
        });
    }
});
```

### Integration with Other Services

```javascript
export default {
    async render() {
        if(this.requestMethod === 'GET') {
            // Return HTML form
            return this.renderView('_form', { model: this.user });
        }
        
        // Generate notification email on form submission
        const emailText = await this.renderText(({ line, indent }) => {
            line(`Hello ${this.user.name},`);
            line();
            line('Your profile has been updated with the following changes:');
            line();
            indent(({ line }) => {
                if(this.user.nameChanged) line(`- Name: ${this.user.name}`);
                if(this.user.emailChanged) line(`- Email: ${this.user.email}`);
                if(this.user.bioChanged) line(`- Bio: ${this.user.bio}`);
            });
        });
        
        await this.sendMail({
            to: this.user.email,
            subject: 'Profile Updated',
            text: emailText
        });
        
        return this.renderRedirect('/profile');
    }
}
```

## Utilities Reference

### `echo(content)`
Adds content directly to the output buffer without adding line breaks.

```javascript
echo('Hello ');
echo('World');
// Result: "Hello World"
```

### `line(content = '')`
Adds content as a new line. If called without arguments, adds an empty line.

```javascript
line('First line');
line('Second line');
line(); // Empty line
line('After empty line');
// Result: "First line\nSecond line\n\nAfter empty line"
```

### `indent(function)`
Creates a new indentation scope (4 spaces) and executes the provided function within that scope.

```javascript
line('Root');
indent(({ line }) => {
    line('Indented');
    line('Also indented');
});
line('Back to root');
// Result: "Root\n    Indented\n    Also indented\nBack to root"
```

## Common Use Cases

### Code Generation
- **Service files**: Generate JavaScript service templates
- **Model classes**: Create database model boilerplate
- **Configuration**: Generate configuration files and scripts
- **Build scripts**: Create deployment and build automation

### Communication
- **Email templates**: Plain text email bodies with structured content
- **Notifications**: System alerts and user notifications
- **Reports**: Generate formatted text reports and logs
- **Documentation**: Create structured text documentation

### Data Export
- **CSV files**: Generate comma-separated value files
- **Configuration dumps**: Export system settings
- **Log files**: Create structured log output
- **API responses**: Plain text API responses

## Performance Notes

- Content is rendered asynchronously and supports promises throughout
- Indentation is calculated efficiently using string manipulation
- Output buffer is optimized for append operations
- Memory usage scales linearly with content size
- The service is designed for server-side text generation

## Return Value Details

The `Text` instance returned by `renderText` provides:

```javascript
const textResult = await this.renderText(/* ... */);

// Convert to string
const stringContent = textResult.toString();

// Convert to HTTP response
const [status, headers, body] = textResult.toResponseArray();
// Returns: [200, {'content-type': 'text/plain'}, [content]]

// Custom HTTP response with different status
const [status, headers, body] = textResult.toResponseArray(404, {'custom': 'header'});
```