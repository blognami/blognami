# Blognami

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/blognami/blognami?style=social)](https://github.com/blognami/blognami/stargazers)

**Blognami** is an open-source, passwordless blogging platform built on top of **Pinstripe**, a full-stack JavaScript web framework.

This monorepo contains the complete codebase for both Blognami and Pinstripe, along with all related packages.

## Quick Start

Create a new Blognami blog:

```bash
npx pinstripe generate-project --name my-blog --with blognami
cd my-blog
npx pinstripe initialize-database
npx pinstripe start-server
```

Then visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in your browser.

For more details, see the [Getting Started Guide](https://blognami.com/docs/guides/getting-started).

## Architecture

```
┌─────────────────────────────┐
│        Blognami App         │
│  (Pages, Posts, Tags, etc)  │
├─────────────────────────────┤
│     Pinstripe Framework     │
│  (Core runtime, CLI, DB,    │
│   auth, multi-tenancy)      │
├─────────────────────────────┤
│   Node.js + MySQL/SQLite    │
└─────────────────────────────┘
```

**Blognami** is the ready-to-use blogging application. **Pinstripe** is the underlying framework that provides the core runtime, database layer, CLI tooling, and extensibility system.

## Package Overview

### Blognami Packages

| Package | Description |
|---------|-------------|
| [blognami](./packages/blognami) | Meta-package bundling all Blognami features |
| [@blognami/main](./packages/@blognami/main) | Core application logic, admin UI, authentication |
| [@blognami/posts](./packages/@blognami/posts) | Blog post management |
| [@blognami/pages](./packages/@blognami/pages) | Static page management |
| [@blognami/tags](./packages/@blognami/tags) | Tagging system |

### Pinstripe Framework

| Package | Description |
|---------|-------------|
| [pinstripe](./packages/pinstripe) | Core framework and CLI |
| [@pinstripe/database](./packages/@pinstripe/database) | MySQL and SQLite database layer |
| [@pinstripe/utils](./packages/@pinstripe/utils) | Meta-programming utilities |
| [@pinstripe/window](./packages/@pinstripe/window) | Browser-side framework |
| [@pinstripe/markdown](./packages/@pinstripe/markdown) | Markdown processing |
| [@pinstripe/one-time-token](./packages/@pinstripe/one-time-token) | Passwordless authentication |
| [@pinstripe/multi-tenant](./packages/@pinstripe/multi-tenant) | Multi-tenancy support |
| [@pinstripe/static-site](./packages/@pinstripe/static-site) | Static site generation |

### Other Packages

| Package | Description |
|---------|-------------|
| [demo](./packages/demo) | Example project with tests |
| [blognami.com](./packages/blognami.com) | Marketing site |
| [pinstripejs.com](./packages/pinstripejs.com) | Framework documentation site |

## Development

### Prerequisites

- Node.js 18+
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

The Pinstripe CLI provides commands for development:

```bash
npx pinstripe start-server       # Run development server
npx pinstripe generate-view      # Create a new view
npx pinstripe generate-command   # Create a new command
npx pinstripe generate-service   # Create a new service
npx pinstripe list-views         # List all registered views
npx pinstripe list-commands      # List all registered commands
npx pinstripe list-services      # List all registered services
```

## Contributing

Contributions are welcome! Here's how you can help:

- **Report bugs** or request features via [GitHub Issues](https://github.com/blognami/blognami/issues)
- **Submit pull requests** with bug fixes or new features
- **Star this repo** to help others discover Blognami

I'm **Jody Salt**, the creator of Blognami. I'd love to hear about what you're building with it.

## License

MIT License - see [LICENSE](https://opensource.org/licenses/MIT) for details.
