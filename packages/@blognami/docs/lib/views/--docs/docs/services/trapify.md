---
menu:
    path: ["Services", "trapify"]
---
# trapify

Create proxy objects with custom property access behavior.

## Interface

```javascript
this.trapify(object)
```

### Parameters

- **object** - The object to wrap, optionally containing special trap methods

### Returns

- A proxy object with custom get/set behavior

## Description

The `trapify` service creates enhanced proxy objects that intercept property access and modification. It supports special methods prefixed with `__` that define custom behaviors for missing properties, making it useful for dynamic property generation, service containers, and metaprogramming patterns.

## Special Methods

- **`__getMissing(target, name)`** - Called when accessing a non-existent property
- **`__setMissing(target, name, value)`** - Called when setting a property without a setter

Standard JavaScript proxy traps can also be implemented with `__` prefix: `__get`, `__set`, `__has`, `__deleteProperty`, `__ownKeys`, etc.

## Examples

### Dynamic Property Handler

```javascript
const config = this.trapify({
    host: 'localhost',
    __getMissing(target, name) {
        return `Unknown config: ${name}`;
    }
});

config.host;      // 'localhost'
config.anything;  // 'Unknown config: anything'
```

### CSS Class Generator

```javascript
const classes = this.trapify({
    __getMissing(target, name) {
        return `component-${this.inflector.dasherize(name)}`;
    }
});

classes.submitButton;  // 'component-submit-button'
classes.errorMessage;  // 'component-error-message'
```

### Dynamic Service Container

```javascript
const services = this.trapify({
    __getMissing(target, serviceName) {
        return ServiceFactory.create(serviceName);
    }
});

const database = services.database;  // Creates database service on demand
```

### Custom Setter Logic

```javascript
const validated = this.trapify({
    _data: {},
    __setMissing(target, name, value) {
        if (typeof value === 'string' && value.length > 100) {
            throw new Error(`Value for ${name} too long`);
        }
        target._data[name] = value;
        return true;
    },
    __getMissing(target, name) {
        return target._data[name];
    }
});

validated.title = 'Hello';  // Works
validated.title;            // 'Hello'
```

## Notes

- Existing properties and getters take precedence over `__getMissing`
- Trap methods receive the trapified `this` context
- Used internally for database table access and CSS class generation
