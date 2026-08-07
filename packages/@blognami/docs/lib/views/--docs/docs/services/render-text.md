---
menu:
    path: ["Services", "renderText"]
---
# renderText

Generate plain text output with structured formatting.

## Interface

```javascript
await this.renderText(fn)
```

### Parameters

- **fn** - A function receiving formatting utilities (`echo`, `line`, `indent`)

### Returns

- A Text instance that can be converted to string or HTTP response

## Description

The `renderText` service generates structured plain text output with automatic indentation management. It's useful for generating code files, configuration files, emails, and other plain text content.

## Formatting Utilities

| Method | Description |
|--------|-------------|
| `echo(content)` | Output content without line break |
| `line(content)` | Output content as a new line |
| `indent(fn)` | Increase indentation for nested content |

## Examples

### Basic Text Output

```javascript
const text = await this.renderText(({ line }) => {
    line('Hello');
    line('World');
});
// "Hello\nWorld"
```

### Code Generation

```javascript
const code = await this.renderText(({ line, indent }) => {
    line('export default {');
    indent(({ line, indent }) => {
        line('create() {');
        indent(({ line }) => {
            line("return 'Hello World';");
        });
        line('}');
    });
    line('};');
});
// export default {
//     create() {
//         return 'Hello World';
//     }
// };
```

### Email Template

```javascript
const email = await this.renderText(({ line, indent }) => {
    line(`Dear ${user.name},`);
    line();
    line('Your order has been shipped:');
    line();
    indent(({ line }) => {
        line(`Order ID: ${order.id}`);
        line(`Tracking: ${order.tracking}`);
    });
    line();
    line('Best regards,');
    line('The Team');
});
```

### Configuration File

```javascript
const config = await this.renderText(({ line, indent }) => {
    line('[database]');
    indent(({ line }) => {
        line(`host = ${db.host}`);
        line(`port = ${db.port}`);
    });
    line();
    line('[server]');
    indent(({ line }) => {
        line(`port = ${server.port}`);
    });
});
```

## Notes

- Indentation uses 4 spaces per level
- Empty `line()` calls add blank lines
- Supports async functions for dynamic content
- Returns a Text instance with `toString()` and `toResponseArray()` methods
