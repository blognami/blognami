
- Extract out the `pinstripejs.com` layout into `@pinstripe/main`
    - Make blognami more static aware.
    - Split up into smaller packages.
        - `@blognami/images`
        - `@blognami/users`
        - `@blognami/sessions`
        - `@blognami/stripe`
        - `@blognami/newsletter`
        - `@blognami/revisions`
        - `@blognami/comments`
        - `@blognami/home`?
        - `@blognami/site`?

- Use `@pinstripe/main` to act as base for `pinstripejs.com`

-  Remove `@blognami/docs`:
    - Merge content into `blognami.com`

---

## Package Refactoring Template

**Prompt for extracting functionality from `@blognami/main` into smaller packages:**

```
I need to refactor `@blognami/main` to extract [FEATURE_NAME] functionality into a new `@blognami/[PACKAGE_NAME]` package.

CRITICAL GUIDELINES from previous refactoring:

**Package Structure:**
- Create standard package structure: package.json, README.md, LICENSE, lib/index.js
- Set version to "0.35.0" to match existing packages
- Use "MIT" license and "Jody Salt" as author
- Set dependency on "@blognami/main": "^0.35.0"

**What to Move:**
Identify and move ALL related components:
- Models: Look for [feature] models in lib/models/
- Services: Check lib/services/ for [feature] services (including is_*, has_*, etc.)
- Migrations: Find migration files related to [feature] tables
- Views: Search for [feature] views in lib/views/_actions/, lib/views/_pageables/
- Menu Items: Extract [feature] menu items from lib/services/menus.js

**File Importers - CRITICAL:**
- Only create _file_importer.js at TOP LEVEL directories (models/, services/, views/, migrations/)
- Each _file_importer.js should ONLY export the base class:
  - models/_file_importer.js: `export { Row as default } from '@pinstripe/database';`
  - services/_file_importer.js: `export { ServiceFactory as default } from 'pinstripe';`
  - views/_file_importer.js: `export { View as default } from 'pinstripe';`
  - migrations/_file_importer.js: `export { Migration as default } from '@pinstripe/database';`
- DO NOT create _file_importer.js in subdirectories like _actions/admin/, _actions/user/, etc.

**Views Selection:**
- Only move views that directly manage/create/edit the [feature] entity
- Guards belong with their feature (user guards → @blognami/users, etc.)
- Comment/subscription management stays where the feature belongs
- Be selective - not every view that references [feature] should move

**Menu Service Pattern:**
- Create lib/services/menus.js in new package
- Extract ONLY [feature]-related menu items from main menus.js
- Use same hook pattern: `this.addHook('initializeMenus', async function(){...})`
- Include both navbar and burgerMenu variants
- Remove moved menu items from main package menus.js

**Dependencies & Imports:**
- New package depends on @blognami/main (NOT the reverse)
- Add new package as dependency in @blognami/pages and @blognami/posts
- Import new package in pages/lib/index.js and posts/lib/index.js
- DO NOT import in main package

**Cleanup:**
- Remove moved files from @blognami/main
- Keep cross-cutting concerns in main (like newsletter subscription UI can stay in main even if user-triggered)
- Preserve main package's menu normalization/sorting logic

**Package.json template:**
```json
{
  "type": "module",
  "name": "@blognami/[PACKAGE_NAME]",
  "description": "Implements [feature] functionality in the main app.",
  "version": "0.35.0",
  "author": "Jody Salt", 
  "license": "MIT",
  "exports": { ".": "./lib/index.js" },
  "dependencies": { "@blognami/main": "^0.35.0" },
  "repository": {
    "type": "git",
    "url": "git://github.com/blognami/blognami.git",
    "directory": "packages/@blognami/[PACKAGE_NAME]"
  }
}
```

**Main lib/index.js:**
```javascript
import { importAll } from 'pinstripe';

importAll(import.meta.url);
```

You will need to analyze the current structure of @blognami/main to identify all [FEATURE_NAME]-related components before starting the extraction.
```
