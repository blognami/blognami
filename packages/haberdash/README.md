# Haberdash

Shared base framework for Pinstripe and Kraal. Provides runtime conventions — class composition, hooks, registries, service injection, file discovery, context propagation — extracted into a neutral package. Pinstripe and Kraal both depend on it; neither depends on the other.

## Class

`Class` is the base for everything. Subclass with `.extend()` and compose with `.include()`:

```js
import { Class } from 'haberdash';

const Greeter = Class.extend('Greeter').include({
    initialize(name){ this.name = name; },
    greet(){ return `Hello, ${this.name}`; }
});

new Greeter('world').greet(); // → "Hello, world"
```

`.extend(name?)` returns a subclass. `.include(...mixins)` mixes plain objects into the prototype. `initialize()` is the constructor hook.

## Mixins

A mixin is a plain object. Optional `meta()` runs at include time with `this` bound to the class — for class-level setup and pulling in dependencies. Other props become prototype methods/getters.

```js
export const Annotatable = {
    meta(){
        this.assignProps({
            get annotations(){
                if(!this.hasOwnProperty('_annotations')){
                    this._annotations = {};
                }
                return this._annotations;
            },

            annotate(annotations){
                deepMerge(this.annotations, annotations);
            }
        });
    }
};
```

Mixins compose other mixins from inside `meta()`:

```js
export const Validatable = {
    meta(){
        this.include(Hookable);
    },
    async validate(){
        await this.runHook('validation');
        // ...
    }
};
```

Classes consume mixins with a single inline `.include({ meta(){ ... } })`:

```js
export const Command = Class.extend('Command').include({
    meta(){
        this.include(AbstractCommand);
        this.include(ServiceFactory.Consumerable);
    }
});
```

### Conventions

- Plain PascalCase objects: `Hookable`, `Validatable`, `Annotatable`. No `Mixin` suffix.
- Capability traits use `-able`; framework bases use the `Abstract*` prefix (`AbstractRegistry`, `AbstractCommand`) — still mixins despite the name.
- File name = snake_case of the export: `hookable.js` exports `Hookable`.
- `meta()` runs eagerly at include time, not lazily. Including the same mixin twice runs `meta` twice — there is no idempotence guard.
- Inside `meta()`, `this.assignProps({ ... })` puts props on the **class**; props sitting outside `meta` land on the **prototype**.
- Lazy own-property init (`if(!this.hasOwnProperty('_x')) this._x = ...`) is the standard for any cached state.
- One inline `.include({ meta(){ ... } })` per class definition. Don't chain `.include(A).include(B)` on the class.

## Hookable

Adds named hook lists to a class. `addHook` sits on the class (registered in `meta()`); `runHook` sits on the instance and walks the class hierarchy parent-first via `allHooks`, so hooks accumulate down the chain.

```js
const Saver = Class.extend('Saver').include({
    meta(){
        this.include(Hookable);
        this.addHook('beforeSave', async function(){ /* ... */ });
    },
    async save(){
        await this.runHook('beforeSave');
        // ...
    }
});
```

`runHook` returns a deferred promise of the collected hook results and accepts options for `args`, `stopIf`, `beforeEach`, `afterEach`, `ifNone`, `filter`, and `sort`.

## Registries

`AbstractRegistry` lets a class hold a named map of subclasses. `AbstractImportableRegistry` extends that with file-system discovery — subclasses are loaded from a directory by convention. `AbstractCommand` builds on the importable registry to define a CLI command tree, and is what Kraal uses to compose its standalone CLI.

## Service factory

`AbstractServiceFactory` is the base for keyed service creation. `ServiceFactory.Consumerable` is a mixin returned by a getter on the factory; it uses `trapify()` (a Proxy wrapper) to intercept missing methods on a consumer and resolve them as services from the factory — so a class can `include(Factory.Consumerable)` and call services as if they were its own methods.

## Context

`Context` is the root carrier passed through a request or command run. Children inherit from a root and propagate values down — used by Pinstripe for request-scoped state and by Kraal for command-scoped state.

## Other primitives

- `Annotatable` — attach metadata to a class (`description`, `params`, etc.).
- `Validatable` — `validate()` + `setValidationError()`; integrates with `Hookable`.
- `AbstractSingleton` — single-instance-per-class base.
- `FileSystem` — small async wrapper used by importable registries.
- `deepMerge`, `defer`, `Inflector`, `importAll`, `trapify` — standalone utilities used by the rest of the package.
