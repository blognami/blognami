
# Welcome to Blognami

Blognami is a modern, passwordless blogging platform built for developers who value simplicity and control. Born from the need for a clean, extensible blogging solution, Blognami focuses on the essentials: writing, publishing, and managing content without unnecessary complexity.

## Quick Start

Get your blog running in minutes:

```bash
npx pinstripe generate-project --name my-blog --with blognami
cd my-blog
npx pinstripe initialize-database
npx pinstripe start-server
```

Then visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) to start writing.

## Why Blognami?

**Built for Writers**: Clean markdown editor with live preview. No distractions, just focused writing.

**Passwordless by Design**: One-time codes replace traditional passwords. Better security, smoother experience.

**Zero to Production Fast**: From idea to published blog in minutes. Blognami handles the infrastructure so you can focus on content.

**Self-Host or SaaS**: Own your stack completely or let us handle hosting. Switch between options anytime.

## Blognami & Pinstripe: A Powerful Partnership

**Blognami** and **Pinstripe** are designed to work together seamlessly:

- **Blognami** is the complete blogging application with posts, pages, tags, and user management
- **Pinstripe** is the underlying web framework that powers Blognami's features
- You get a proven blogging platform built on a framework that's tested in production

This symbiotic relationship means:
- Pinstripe stays practical and focused, tested against real blogging needs
- Blognami benefits from a robust, full-featured framework designed for modern web apps
- You can extend Blognami or build custom applications using the same proven foundation

```text
+---------------------------+
|       Blognami App        |
| (Posts, Pages, Tags, etc) |
+---------------------------+
            ⬇ built on
+---------------------------+
|   Pinstripe Framework     |
| (Authentication, Database,|
|  CLI, Multi-tenancy, etc) |
+---------------------------+
            ⬇ runs on
+---------------------------+
|  Node.js + Your Database  |
+---------------------------+
```

## Features

Blognami includes everything you need for professional blogging:

- **Markdown-first editing** - Write in markdown with live preview
- **Passwordless authentication** - Secure, user-friendly login with one-time codes
- **Posts and Pages** - Blog posts for your timeline, pages for evergreen content
- **Tag system** - Organize and categorize your content
- **Multi-tenant ready** - Support multiple blogs from one installation
- **Database flexibility** - SQLite for development, MySQL/PostgreSQL for production
- **Static site generation** - Generate static sites for maximum performance
- **Self-hosting friendly** - Deploy anywhere Node.js runs

## Two Ways to Use Blognami

### Self-Host (Open Source)

Perfect for developers who want complete control:

- ✅ Run on your own infrastructure
- ✅ Customize and extend freely
- ✅ Use your own CI/CD pipeline
- ✅ MIT licensed and transparent

### Hosted Service

*Coming Soon* - Skip the server management:

- 🚀 Managed hosting and backups
- 🔒 Security updates handled for you
- 📤 Export your data anytime
- 🎯 Focus purely on writing

## Getting Started

Ready to start blogging?

- **New to Blognami?** Follow the quick start above to get your first blog running
- **Want to customize?** Explore the [Pinstripe documentation](https://pinstripejs.com) to learn about the underlying framework
- **Ready to contribute?** Both Blognami and Pinstripe are [open source on GitHub](https://github.com/blognami/blognami)

---

*Blognami is in active development. We're moving fast and your feedback shapes the roadmap. [Join the community](https://github.com/blognami/blognami) and help us build the future of developer-friendly blogging.*

## License

MIT — [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

