---
menu:
    path: ["Services", "defer"]
---
# defer

Create lazy-evaluated values that execute only when accessed.

## Interface

```javascript
this.defer(fn)
```

### Parameters

- **fn** (function) - A function that returns the value to be deferred

### Returns

- A proxy object that defers execution until awaited

## Description

The `defer` service creates lazy-evaluated proxies that postpone execution until the result is actually needed. It intercepts property access and method calls, building up a chain of operations that only execute when awaited. This is useful for services that may have expensive initialization or depend on other async services.

## Examples

### Basic Lazy Evaluation

```javascript
export default {
    create() {
        return this.defer(() => {
            console.log('Computing...');
            return { value: 42 };
        });
    }
}

// Usage - computation only happens when awaited
const result = await this.myService;
console.log(result.value); // 42
```

### Service with Dependencies

```javascript
export default {
    create() {
        return this.defer(async () => {
            const session = await this.session;
            if (!session) return null;
            return session.user;
        });
    }
}

// Usage
const user = await this.user;
if (user) {
    // User is logged in
}
```

### Deferred Function Creation

```javascript
export default {
    create() {
        return this.defer(() => (a, b) => a + b);
    }
}

// Usage
const add = await this.calculator;
const sum = add(2, 3); // 5
```

### Property Chain Access

```javascript
const deferred = this.defer(() => ({
    config: { database: { host: 'localhost' } }
}));

// Chain properties before awaiting
const host = await deferred.config.database.host;
// 'localhost'
```

## Notes

- The deferred function is only called once when the result is first awaited
- Property access chains are recorded and replayed after the function executes
- Throws a descriptive error if trying to access properties on undefined values
- Available both server-side and client-side
