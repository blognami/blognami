
# 🌟 Welcome to the Blognami Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/blognami/blognami?style=social)](https://github.com/blognami/blognami/stargazers)

> ### ⭐ Why Star This Repo?
>
> Blognami is still in its **early days**, and every star helps others discover it.
> If you like the idea, plan to use it, or just want to support open-source work, please **click the ⭐ at the top** — it’s quick, free, and makes a big difference.

**Blognami** is an open-source, passwordless blogging platform built on top of **Sintra**, its own full-stack JavaScript web framework.

This repository contains the complete codebase for both **Blognami** and **Sintra**, along with all related packages and examples.

---

## 🚀 Quick Start

Want to try Blognami?
Follow the [Getting Started Guide](https://blognami.com/docs/guides/getting-started) to spin up your first blog in minutes:

```bash
npx sintra generate-project --name my-blog --with blognami
cd my-blog
npx sintra initialize-database
npx sintra start-server
```

Then visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in your browser.

---

## ❓ What is Blognami?

Blognami is **both an app and a framework stack**:

* **Blognami** → The blogging platform itself — passwordless authentication, markdown editing, tagging, and more.
* **Sintra** → The underlying full-stack web framework powering Blognami.
  It provides the core runtime, database integration, and CLI commands used to create, run, and manage Blognami projects.

This monorepo contains **all the packages for both Blognami and Sintra**, so you can explore the internals, contribute, or extend them.

---

### 🗺 How They Fit Together

```text
+---------------------------+
|       Blognami App        |
| (Pages, Posts, Tags, etc) |
+---------------------------+
            ⬇ built on
+---------------------------+
|      Sintra Framework     |
| (Core runtime + CLI, DB,  |
|  auth, utils, multi-tenant|
|  static site generation)  |
+---------------------------+
            ⬇ runs on
+---------------------------+
|  Node.js + Your Database  |
+---------------------------+
```

💡 Think of **Blognami** as the *ready-to-use app* and **Sintra** as the *foundation + toolbox* that makes it possible.

---

## 📦 Package Index

### Blognami Core

* [**@blognami/main**](./packages/@blognami/main) – Core Blognami application logic
* [**@blognami/pages**](./packages/@blognami/pages) – Page management for Blognami
* [**@blognami/posts**](./packages/@blognami/posts) – Blog post management
* [**@blognami/tags**](./packages/@blognami/tags) – Tagging system

**Convenience Package**

* [**blognami**](./packages/blognami) – A meta-package that installs a well-chosen subset of Blognami packages (including `@blognami/pages` and `@blognami/posts`) so you can get started quickly without manually installing each one.

---

### Sintra Framework

* [**@sintra/database**](./packages/@sintra/database) – Database layer
* [**@sintra/multi-tenant**](./packages/@sintra/multi-tenant) – Multi-tenancy support
* [**@sintra/one-time-token**](./packages/@sintra/one-time-token) – One-time token auth system
* [**@sintra/static-site**](./packages/@sintra/static-site) – Static site generation
* [**@sintra/utils**](./packages/@sintra/utils) – Utility functions

**Core + CLI**

* [**sintra**](./packages/sintra) – The core Sintra framework **and** the CLI used to scaffold, run, and manage Blognami projects.

---

### Other Packages

* [**demo**](./packages/demo) – Example Blognami project
* [**pinstripe**](./packages/pinstripe) – Pinstripe module

---

## 💡 Contributing

Blognami is still in its **early days**, which means your ideas and contributions can have a real impact!

Here’s how you can help:

* ⭐ **Star this repo** to help others discover Blognami
* 🐞 **Report bugs** or request features via [GitHub Issues](https://github.com/blognami/blognami/issues)
* 🔧 **Fork and contribute** — explore the packages above and start experimenting

👋 I’m **Jody Salt**, creator of Blognami, and I’d be thrilled to see you get involved — even if it’s just to share what you’ve built.

---

## 📄 License

This monorepo is released under the [MIT License](https://opensource.org/licenses/MIT).
