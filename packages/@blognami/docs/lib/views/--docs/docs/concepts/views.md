---
section: docs
menu:
    path: ["Concepts", "Views"]
    displayOrder: 2
---
# Views

A view answers a request, or renders a fragment for another view. Each one is a file under `lib/views/`.

## Where a view file lives

[`generate-view`](/docs/commands/generate-view) writes `lib/views/_file_importer.js`, unless it exists, and the view file itself, with a `.js` extension unless the name has one. [Project structure](/docs/concepts/project-structure) says how `_file_importer.js` turns a file's path into its registered name: `lib/views/about.js` registers as the view `about`. [`list-views`](/docs/commands/list-views) lists the registered views.

What a file registers depends on its extension:

- `.js` - a view made from the file's default export, named by the path without the extension
- `.md` - with `@blognami/markdown` loaded, a view made from the file's frontmatter and markdown body, named by the path without the extension. Requested directly it renders inside the `_layout` view; rendered from another view it returns the body alone
- any other extension - a file-backed view, named by the path with its extension, that responds with the file's bytes and its mime type

## How a path becomes a URL

The request's path, with its leading and trailing slashes removed, is the name of the view to render; an empty path is `index`. A view named `x/index` also answers at `x`. So `lib/views/about.js` answers `/about`, and `lib/views/index.js` answers `/`.

For each request `callHandler` renders, in order, until one returns a response:

1. The guard views, from the root down the path: for `/admin/users`, `guard`, then `admin/guard`, then `admin/users/guard`. A guard that returns nothing lets the request through.
2. The view named by the path. This step is skipped when the last segment of the name starts with `_`, or when the name ends in `/index` under such a segment, so `_layout` and `_sidebar/index` cannot be requested and are only rendered from other views.
3. The default views, from the path back up to the root: `admin/users/default`, then `admin/default`, then `default`.

When none does, the response is a 404.

## What a view exports and renders

This is the file `generate-view about` writes:

```javascript
export const styles = `
    .root {
        background: yellow;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <h1>about.js view</h1>
            </div>
        `;
    }
};
```

The default export is included into the view's class. Its `render()` returns the response; a view with no `render()` returns nothing. `render()` can return:

- an array of `[status, headers, body]`
- an object with a `toResponseArray()` method
- any other value, which is sent as its string form with status 200 and the content type `text/plain`

Inside a view, `this.params` holds the request's params, or the params the view was rendered with. `this.cssClasses` is the result of [`cssClassesFor`](/docs/services/css-classes-for) for the view, and `this.isRoot` is true when no other view is rendering this one. The services are reached as `this.<name>`, as [`renderHtml`](/docs/services/render-html) is above.

A view renders another with [`renderView`](/docs/services/render-view):

```javascript
this.renderView('_layout', { title: 'About', body })
```

It resolves to nothing when no view of that name is in the view map. [`view`](/docs/services/view) is the view instance being rendered.

## File path feature flags

A file path feature flag is a `--flag` path segment, or a `--flag` suffix on a segment. A view with one is in the view map only when the flag is on, and it is then served at the path with those segments and suffixes removed:

- `lib/views/--docs/docs/index.md` answers `/docs` when the `docs` flag is on
- `lib/views/pricing--portal.js` answers `/pricing` when the `portal` flag is on

A flag's name is camelized, so `--dark-mode` is the flag `darkMode`. A segment can carry several (`--docs--portal`), and the view is on when any one of its flags is. The flags come from the [`featureFlags`](/docs/services/feature-flags) service, and [`viewMap`](/docs/services/view-map) holds the names that resolve for the flags that are on.
