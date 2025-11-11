---
menus:
    sidebar: ["Services", "trapify"]
---
# trapify Service

## Interface

```javascript
trapify(object): ProxyObject
```

### Parameters

- **`object`** (Object) - The object to wrap with proxy traps. Can contain special trap methods that define custom behaviors.

### Returns

- **ProxyObject** - A double-wrapped proxy that provides custom get/set behavior and supports all JavaScript proxy traps

## Description

The `trapify` service is a powerful utility that creates enhanced proxy objects with customizable behavior for property access, method calls, and other object operations. It provides a clean interface for implementing missing property handlers, custom getters/setters, and all standard JavaScript proxy traps.

The service creates a **double proxy** structure:
1. **Inner proxy**: Handles basic get/set operations with support for `__getMissing` and `__setMissing` hooks
2. **Outer proxy**: Dynamically registers handlers for all standard proxy traps based on methods prefixed with `__`

Key features:
- **Missing Property Handling**: Automatically handles access to undefined properties
- **Dynamic Trap Registration**: Supports all 13 JavaScript proxy traps via `__` prefixed methods
- **Recursive Trapification**: Maintains trapified context through method calls
- **Custom Getter/Setter Logic**: Respects existing property descriptors while adding custom behavior

## Special Trap Methods

The trapify service recognizes several special methods that define custom behaviors:

### `__getMissing(target, propertyName, ...args)`

Called when accessing a property that doesn't exist on the object.

- **`target`** - The original object
- **`propertyName`** - Name of the missing property
- **`...args`** - Additional arguments from the proxy get trap
- **Returns**: Value to return for the missing property

### `__setMissing(target, propertyName, value, ...args)`

Called when setting a property that doesn't have a setter.

- **`target`** - The original object  
- **`propertyName`** - Name of the property being set
- **`value`** - Value being assigned
- **`...args`** - Additional arguments from the proxy set trap
- **Returns**: Boolean indicating if the set operation succeeded

### Standard Proxy Trap Methods

All standard JavaScript proxy traps can be implemented by prefixing with `__`:

- `__get`, `__set`, `__deleteProperty`, `__ownKeys`, `__has`
- `__apply`, `__construct`, `__defineProperty`  
- `__getPrototypeOf`, `__setPrototypeOf`
- `__isExtensible`, `__preventExtensions`
- `__getOwnPropertyDescriptor`, `__enumerate`

## Examples

### Basic Missing Property Handler

```javascript
const dynamicObject = trapify({
    name: 'example',
    __getMissing(target, prop) {
        return `Missing property: ${prop}`;
    }
});

console.log(dynamicObject.name);        // 'example'
console.log(dynamicObject.anything);    // 'Missing property: anything'
```

### CSS Class Name Generator

```javascript
// Used in cssClassesFor service
const classGenerator = trapify({
    __getMissing: (target, name) => `view-${hash}-${inflector.dasherize(name)}`
});

// Usage:
const classes = classGenerator;
console.log(classes.modalDialog);     // 'view-abc123def0-modal-dialog'
console.log(classes.submitButton);    // 'view-abc123def0-submit-button'
```

### Service Consumer Pattern

```javascript
// Used in ServiceConsumer for dynamic service access
const serviceConsumer = trapify({
    context: context,
    __getMissing(target, serviceName) {
        if(ServiceFactory.mixins[serviceName]) {
            return ServiceFactory.create(serviceName, this.context).create();
        }
    }
});

// Usage:
const database = serviceConsumer.database;  // Dynamically creates database service
const renderer = serviceConsumer.renderHtml; // Dynamically creates renderHtml service
```

### Event Proxy with Method Delegation

```javascript
// Used in ComponentEvent to proxy DOM events
const eventProxy = trapify({
    event: domEvent,
    __get(target, name) {
        const value = target.event[name];
        if(value instanceof Node) {
            return ComponentEvent.Component.instanceFor(value);
        }
        if(typeof value === 'function') {
            return (...args) => value.call(target.event, ...args);
        }
        return value;
    }
});

// Usage:
eventProxy.preventDefault();  // Calls event.preventDefault()
eventProxy.target;           // Returns wrapped component if it's a Node
eventProxy.type;             // Returns event.type
```

### Database Dynamic Table Access

```javascript
// Used in Database class for dynamic table/model access
const database = trapify({
    client: dbClient,
    info: { users: 'table', posts: 'table', settings: 'singleton' },
    
    __getMissing(target, name) {
        const type = this.info[name];
        if(type === 'table') return this.table(name);
        if(type === 'singleton') return this.singleton(name);
        if(type === 'union') return this.union(name);
    }
});

// Usage:
const users = await database.users;      // Returns table('users')
const settings = await database.settings; // Returns singleton('settings')  
const posts = await database.posts;      // Returns table('posts')
```

### Custom Setter Logic

```javascript
const validatedObject = trapify({
    _values: {},
    
    __setMissing(target, prop, value) {
        // Custom validation logic
        if(typeof value === 'string' && value.length > 100) {
            throw new Error(`Value for ${prop} too long`);
        }
        target._values[prop] = value;
        return true;
    },
    
    __getMissing(target, prop) {
        return target._values[prop];
    }
});

// Usage:
validatedObject.title = 'Short title';  // Works
validatedObject.description = 'Very long description...'; // May throw error
console.log(validatedObject.title);     // 'Short title'
```

### Advanced Proxy Trap Implementation

```javascript
const advancedProxy = trapify({
    data: { count: 0 },
    
    __has(target, prop) {
        console.log(`Checking if ${prop} exists`);
        return prop in target.data;
    },
    
    __ownKeys(target) {
        console.log('Getting all keys');
        return Object.keys(target.data);
    },
    
    __deleteProperty(target, prop) {
        console.log(`Deleting ${prop}`);
        delete target.data[prop];
        return true;
    }
});

// Usage:
'count' in advancedProxy;        // Logs: "Checking if count exists"
Object.keys(advancedProxy);      // Logs: "Getting all keys"  
delete advancedProxy.count;      // Logs: "Deleting count"
```

## Use Cases

### 1. Dynamic Service Resolution
Perfect for dependency injection systems where services are resolved on-demand:

```javascript
const serviceContainer = trapify({
    __getMissing(target, serviceName) {
        return ServiceFactory.create(serviceName);
    }
});
```

### 2. Missing Property Fallbacks
Providing default values or computed properties for missing attributes:

```javascript
const configWithDefaults = trapify({
    env: 'production',
    __getMissing(target, key) {
        return process.env[key.toUpperCase()] || null;
    }
});
```

### 3. Method Interception and Delegation
Wrapping objects to intercept and modify method calls:

```javascript
const loggingProxy = trapify({
    target: originalObject,
    __getMissing(target, method) {
        if(typeof target.target[method] === 'function') {
            return (...args) => {
                console.log(`Calling ${method} with`, args);
                return target.target[method](...args);
            };
        }
        return target.target[method];
    }
});
```

### 4. Dynamic Property Generation
Creating objects that generate properties based on access patterns:

```javascript
const mathProxy = trapify({
    __getMissing(target, operation) {
        return (a, b) => {
            switch(operation) {
                case 'add': return a + b;
                case 'multiply': return a * b;
                case 'subtract': return a - b;
                default: throw new Error(`Unknown operation: ${operation}`);
            }
        };
    }
});

// Usage: mathProxy.add(2, 3) returns 5
```

## Implementation Details

The trapify service creates a sophisticated proxy structure:

1. **Property Access Priority**:
   - Existing property descriptors (getters/values) take precedence
   - `__getMissing` is called only for truly missing properties
   - Getters are called with trapified `this` context

2. **Property Setting Priority**:
   - Existing setters take precedence  
   - `__setMissing` handles properties without setters
   - Setters receive trapified `this` context

3. **Trap Method Registration**:
   - All methods starting with `__` + trap name are automatically registered
   - Trap methods receive trapified `this` context
   - Original target is passed as first argument

4. **Context Preservation**:
   - All callback methods maintain proper `this` context
   - Recursive trapification ensures consistent behavior
   - Original object structure remains intact

## Performance Considerations

- **Double Proxy Overhead**: Creates two proxy layers, slight performance cost
- **Trap Method Lookup**: Uses property descriptor traversal for method detection
- **Recursive Trapification**: May create proxy chains in deeply nested operations
- **Memory Usage**: Maintains references to original objects and trap methods

The trapify service is essential for creating flexible, dynamic objects in the Pinstripe framework, enabling patterns like service containers, dynamic property generation, and sophisticated object proxying.