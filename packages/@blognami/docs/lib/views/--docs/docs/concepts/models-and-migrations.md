---
section: docs
menu:
    path: ["Concepts", "Models and migrations"]
    displayOrder: 3
---
# Models and migrations

A migration changes the database schema; a model adds behaviour to the rows of one table. Both come from `@blognami/database`, and both are reached through the [`database`](/docs/services/database) service.

## Where models and migrations live

Models are files under `lib/models/` and migrations are files under `lib/migrations/`. [Project structure](/docs/concepts/project-structure) says how each directory's `_file_importer.js` turns a file's path into its registered name: `lib/models/_file_importer.js` re-exports `Row` and `lib/migrations/_file_importer.js` re-exports `Migration`, both from `@blognami/database`.

A model's name is camelized, so `lib/models/stripe_product.js` registers as the model `stripeProduct`. A migration's name must begin with a unix timestamp, as in `1678631402_create_comment.js`; any other name throws when the file is registered.

[`generate-migration`](/docs/commands/generate-migration) writes `lib/migrations/_file_importer.js`, unless it exists, and a migration file named by the current unix time and the suffix it is given. [`generate-model`](/docs/commands/generate-model) writes `lib/models/_file_importer.js`, unless it exists, and `lib/models/{name}.js`. When `database` has no collection for the model yet, it first runs `generate-migration` with the suffix `create_{name}`, the model's collection name as the table and the fields it was given. [`list-models`](/docs/commands/list-models) and [`list-migrations`](/docs/commands/list-migrations) list what is registered.

## How a migration changes the schema

A migration exports a `migrate()` method, and reaches the database as `this.database`. This is the file `generate-migration` writes for the table `comments` and the fields `body:text createdAt:datetime`:

```javascript
export default {
    async migrate(){
        await this.database.table('comments', async comments => {
            await comments.addColumn('body', 'text');
            await comments.addColumn('createdAt', 'datetime');
        });
    }
};
```

`this.database.table(name, fn)` calls `fn` with the table. `addColumn(name, type, options)` creates the table first when it does not exist, with an `id` column, and does nothing when the table already has a column of that name. `removeColumn(name)` drops one.

The column types are `alternate_key`, `foreign_key`, `binary`, `boolean`, `date`, `datetime`, `decimal`, `float`, `integer`, `string` and `text`. A column is indexed when `index: true` is passed in the options, and by default when its type is `alternate_key` or `foreign_key`:

```javascript
await comments.addColumn('userId', 'foreign_key');
await comments.addColumn('approved', 'boolean', { index: true });
```

## How a migration is run

[`migrate-database`](/docs/commands/migrate-database) calls `this.database.migrate()`. Under a database lock, it sorts the registered migrations by the timestamp their names begin with and, for each one that the `appliedMigrations` table does not hold, calls its `migrate()` and records its timestamp there. A migration therefore runs once per database, and a new one runs on the next `migrate-database`.

[`initialize-database`](/docs/commands/initialize-database) runs `migrate-database` and then `seed-database`.

## How a model is defined

This is the file `generate-model comment` writes:

```javascript
export default {

};
```

A model's table is the plural of its name: the model `comment` is the class of the rows of the `comments` table. The columns come from the migrations, not from the model file. The file adds to the row class, usually in `meta()`:

```javascript
export default {
    meta(){
        this.belongsTo('user');

        this.mustNotBeBlank('body');

        this.addHook('beforeValidation', function(){
            if(!this.createdAt){
                this.createdAt = new Date();
            }
        });
    }
};
```

Inside `meta()`:

- `belongsTo(name)`, `hasOne(name)` and `hasMany(name)` define relationships to other collections
- `mustNotBeBlank(name)`, `mustMatchPattern(name, pattern)`, `mustBeAValidEmail(name)` and `mustBeUnique(name)` add validations
- `addHook(name, fn)` adds a hook; a row runs `beforeInsert` or `beforeUpdate`, then its validations, then `afterInsert` or `afterUpdate` when it is saved, and `beforeDelete` and `afterDelete` when it is deleted
- `scope(name, fn)` adds a scope to the model's table, for use in `where()`
- `include(name)` includes another model, such as `singleton`

A model whose plural names no table is abstract: it has no rows of its own, and is there for other models to include.

## How a model is reached through `database`

`this.database.<collection>` is the table for a model, named by the model's plural:

```javascript
const comment = await this.database.comments.insert({ userId: user.id, body: 'Hello' });

const comments = await this.database.comments.where({ userId: user.id }).orderBy('createdAt', 'desc').all();

await comment.update({ body: 'Hello again' });

await comment.delete();
```

`insert(fields)` makes a row of the model's class with a new `id`, validates it and saves it. `where()` takes an object of scopes: each column gives the table one scope by its own name and one for each comparison suffix, such as `userIdNe`. `all()`, `first()` and `count()` run the query, and the rows that come back are instances of the model. A row's `update(fields)` validates and saves it, and its `delete()` removes it.

What a name on `database` gives depends on the model:

- the plural of a model with a table - that table
- the plural of an abstract model - a union
- the name of a model that includes `singleton`, such as `site` - the table's one row, inserted when the table is empty

`this.database.info` maps each of these names to `table`, `union` or `singleton`.

A model that is not backed by a table is made with [`createModel`](/docs/services/create-model), which takes a definition of the same shape and has the validations but not the relationships or `mustBeUnique`.
