---
menu:
    path: ["Getting Started", "Introduction"]
    displayOrder: 1
---
# Introduction

Blognami is a blogging app you actually own and can hack on, all the way down. It's built on its own general-purpose JavaScript web framework — and when you outgrow the blogging defaults, you can strip it back to that framework and build whatever you want. The source lives on [GitHub](https://github.com/blognami/blognami).

## Quick Start

```bash
npx blognami@latest generate-project my-blog
cd my-blog
npx blognami initialize-database
npx blognami start-server
```

## Features

- **File-based Routing** - Organize your app structure intuitively with automatic route generation.
- **Server-side Rendering** - Fast initial page loads and SEO-friendly content out of the box.
- **Built-in Styling** - Scoped CSS with theme system for consistent, maintainable styles.
- **Database Integration** - SQLite for development, MySQL for production.
- **Multi-tenant Support** - Build SaaS applications with built-in multi-tenancy from day one.
- **CLI Tools** - Generate models, migrations, services, and more with simple commands.

## Why Blognami?

- **Built for Real Projects** - Powers production applications like [blognami.com](https://blognami.com). Every feature solves a genuine problem.
- **Zero to Production Fast** - From generate-project to deployed application in minutes, not hours.
- **Batteries Included** - Authentication, database migrations, background jobs, email, and multi-tenancy built in.

## App & Framework

The **Blognami app** and the **Blognami framework** are designed to benefit each other:

- The **app** proves the framework — every framework feature exists because the app needed it to solve a real-world problem
- The **framework** stays lean and focused because it's tested against actual production needs, not just demo apps
- You get a blogging app that's fully hackable, and a framework that's proven in production when you strip back to it

When you build with Blognami, you're building on a foundation that's already running real businesses.

## Let us host it for you

Want a Blognami blog without running a server? [blognami.com](https://blognami.com/pricing) will host it for you — sign up and start writing in minutes.

Prefer to run it yourself? See the Quick Start above.
