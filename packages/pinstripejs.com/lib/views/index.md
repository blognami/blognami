---
sidebar:
    category: ["Getting Started", "Introduction"]
---

# Welcome to Pinstripe JS

Pinstripe JS is a modern, lightweight JavaScript web framework designed for building fast, scalable web applications with minimal configuration. Born from real-world needs while building [Blognami](https://blognami.com), Pinstripe focuses on developer productivity and pragmatic solutions.

## Quick Start

### Try Pinstripe with Blognami

The fastest way to experience Pinstripe is with Blognami, a full-featured blogging platform built on Pinstripe:

```bash
npx pinstripe generate-project --name my-blog --with blognami
cd my-blog
npx pinstripe initialize-database
npx pinstripe start-server
```

Then visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) to see a complete application in action.

### Use Pinstripe Standalone

You can also use Pinstripe independently for your own applications:

```bash
npx pinstripe generate-project --name my-app
cd my-app
npx pinstripe initialize-database
npx pinstripe start-server
```

This gives you a clean Pinstripe foundation to build upon.

## Why Pinstripe?

**Built for Real Projects**: Pinstripe isn't an academic exercise—it powers production applications. Every feature exists because it solved a genuine problem in building [Blognami](https://blognami.com).

**Zero to Production Fast**: From `generate-project` to deployed application in minutes, not hours. Pinstripe handles the infrastructure so you can focus on features.

**Batteries Included**: Authentication, database migrations, background jobs, email, multi-tenancy—all the pieces you need for modern web applications.

## Pinstripe & Blognami: A Symbiotic Relationship

**Blognami** and **Pinstripe** are designed to benefit each other:

- **Blognami** showcases Pinstripe's capabilities and ensures every framework feature solves real-world problems
- **Pinstripe** stays lean and focused because it's tested against actual production needs, not just demo apps
- You get a framework that's both flexible for custom applications and proven in production

This means when you build with Pinstripe, you're building on a foundation that's already running real businesses.

### Features

Pinstripe JS comes with everything you need to build modern web applications:

- **File-based routing** - Organize your app structure intuitively
- **Server-side rendering** - Fast initial page loads and SEO-friendly content  
- **Built-in styling system** - Consistent, maintainable CSS without the complexity
- **Database integration** - SQLite for development, MySQL/PostgreSQL for production
- **Multi-tenant support** - Build SaaS applications from day one
- **Passwordless authentication** - Secure, user-friendly login with one-time passwords
- **Background jobs** - Handle async tasks reliably
- **Email integration** - From development dummy emails to production SMTP
- **CLI tools** - Generate models, migrations, services, and more with simple commands

## Getting Started

Ready to dive in? Check out our guides:

- **New to Pinstripe?** Start with the Blognami tutorial above to see everything working together
- **Want to build custom apps?** Use the standalone setup and explore our documentation
- **Curious about the code?** Both Pinstripe and Blognami are [open source on GitHub](https://github.com/blognami/blognami)
