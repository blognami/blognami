# Blognami

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/blognami/blognami?style=social)](https://github.com/blognami/blognami/stargazers)

**Blognami** is an open-source, passwordless blogging platform for people who just want to write. Compose in Markdown, distraction-free, and publish — there's no password to manage and no admin sprawl to fight.

It's built on the **Blognami framework**, a full-stack JavaScript framework developed in the same monorepo, in parallel with the app it powers. This repository contains the complete codebase for both.

## Why Blognami?

Blognami started life over four years ago as a Ruby app and has since been ported to JavaScript. It exists for a few connected reasons:

- **A framework kept honest by a real app.** The best framework isn't designed in isolation from theory — it's grown alongside a real application. Blognami is that application, and the Blognami framework falls out of building it. The app keeps the framework practical, and doubles as a reference implementation for anyone building on it.
- **Most web apps are really blogs.** Social networks, job boards, news sites, fitness trackers — they all capture and present content over time. Get a blog right and you've exercised the core patterns behind most of the web.
- **A saner alternative to WordPress.** WordPress powers a huge slice of the internet, but often feels held together with chewing gum and a prayer. Blognami aims for something cleaner and more modern.
- **Writing first.** Inspired by the early days of Ghost, Blognami leans into plain Markdown and distraction-free composition. You can just write text, and still produce really good articles.

Read the full story: [Why Blognami](https://jodysalt.com/why-blognami).

## Quick Start

Create a new Blognami blog:

```bash
npx blognami generate-project --name my-blog --with blognami
cd my-blog
npx blognami initialize-database
npx blognami start-server
```

Then visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in your browser.

## Architecture

```
┌──────────────────────────────────────┐
│             Blognami App             │
│       (Posts, Pages, Tags, Admin)    │
├──────────────────────────────────────┤
│          Blognami Framework          │
│    (Runtime, CLI, DB, views, auth,   │
│     multi-tenancy, static sites)     │
├──────────────────────────────────────┤
│         Haberdash (shared base)      │
├──────────────────────────────────────┤
│       Node.js  +  MySQL / SQLite     │
└──────────────────────────────────────┘
```

**Blognami** is both the ready-to-use blogging application and the underlying framework that provides the runtime, database layer, CLI tooling, view system, passwordless auth, and extensibility. **Haberdash** is the small shared base both Blognami and its sibling agent-orchestration framework, **Kraal**, are built on.

## Package Overview

### Blognami Packages

| Package | Description |
|---------|-------------|
| [blognami](./packages/blognami) | Core framework, CLI, and meta-package bundling all Blognami features |
| [@blognami/main](./packages/@blognami/main) | Core application logic, admin UI, authentication |
| [@blognami/posts](./packages/@blognami/posts) | Blog post management |
| [@blognami/pages](./packages/@blognami/pages) | Static page management |
| [@blognami/tags](./packages/@blognami/tags) | Tagging system |
| [@blognami/docs](./packages/@blognami/docs) | Framework documentation, served at `/docs` |

### Framework Packages

| Package | Description |
|---------|-------------|
| [@blognami/database](./packages/@blognami/database) | MySQL and SQLite database layer |
| [@blognami/window](./packages/@blognami/window) | Browser-side framework |
| [@blognami/markdown](./packages/@blognami/markdown) | Markdown processing |
| [@blognami/one-time-token](./packages/@blognami/one-time-token) | Passwordless authentication |
| [@blognami/multi-tenant](./packages/@blognami/multi-tenant) | Multi-tenancy support |
| [@blognami/static-site](./packages/@blognami/static-site) | Static site generation |
| [@blognami/blob-store](./packages/@blognami/blob-store) | Blob and file storage |
| [@blognami/utils](./packages/@blognami/utils) | Meta-programming utilities |

### Foundations & Tooling

| Package | Description |
|---------|-------------|
| [haberdash](./packages/haberdash) | Shared base framework for Blognami and Kraal |
| [kraal](./packages/kraal) | Agent-orchestration framework built on Haberdash |

### Apps & Sites

| Package | Description |
|---------|-------------|
| [blognami-demo](./packages/blognami-demo) | Example project and the home for the test suite |

## Development

### Prerequisites

- Node.js 22+ (current LTS; CI runs on 22.x and 24.x)
- npm 9+

### Setup

```bash
git clone https://github.com/blognami/blognami.git
cd blognami
npm install
```

### Running the Demo

```bash
npm run start        # Start demo project at http://127.0.0.1:3000
npm run watch        # Start with auto-reload on file changes
```

### Testing

```bash
npm test             # Run all tests
npm run test:unit    # Unit tests only
npm run test:models  # Model tests
npm run test:services # Service tests
npm run test:cli     # CLI command tests
npm run test:e2e     # Playwright end-to-end tests
```

### CLI Commands

The Blognami CLI ships with each project. Outside a project, `generate-project` and `list-commands` are available; the rest become available once you're inside a generated project:

```bash
npx blognami list-commands      # List every registered command
npx blognami start-server       # Run the development server
npx blognami generate-view      # Create a new view
npx blognami generate-model     # Create a new model
npx blognami generate-command   # Create a new command
npx blognami generate-service   # Create a new service
npx blognami migrate-database   # Run pending database migrations
npx blognami list-views         # List all registered views
npx blognami list-services      # List all registered services
```

Run `npx blognami COMMAND --help` for the parameters a specific command accepts.

## Contributing

Contributions are welcome! Here's how you can help:

- **Report bugs** or request features via [GitHub Issues](https://github.com/blognami/blognami/issues)
- **Submit pull requests** with bug fixes or new features
- **Star this repo** to help others discover Blognami

I'm **Jody Salt**, the creator of Blognami. I'd love to hear about what you're building with it.

## License

MIT License - see [LICENSE](https://opensource.org/licenses/MIT) for details.
