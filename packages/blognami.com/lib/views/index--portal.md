
## Why Blognami?
- **Open Source First** — MIT licensed, transparent, and community-driven.  
- **Passwordless by Design** — Fewer headaches, fewer attack surfaces.  
- **Markdown Workflow** — Write fast, preview instantly.  
- **Pages, Posts, Tags** — The essentials, thoughtfully implemented.  
- **Self-Host or SaaS** — Your infrastructure or ours. Switch anytime.

> Blognami is in its **early days**—and that’s exciting. Decisions are fresh, APIs are modern, and your feedback genuinely shapes the roadmap.

---

## How It Works
```text
+---------------------------+
|       Blognami App        |
| (Pages, Posts, Tags, etc) |
+---------------------------+
            ⬇ built on
+---------------------------+
|   Pinstripe Framework     |
| (Core runtime + CLI, DB,  |
|  auth, utils, multi-tenant|
|  static site generation)  |
+---------------------------+
            ⬇ runs on
+---------------------------+
|  Node.js + Your Database  |
+---------------------------+
````

---

## Two Ways to Use Blognami

### 1) Self-Host (Open Source)

Own the stack from day one. Perfect for teams that like control.

* ✅ Local dev in minutes
* ✅ Use your infra + CI/CD
* ✅ Extend and customize freely

**Quick Start**

```bash
npx pinstripe generate-project --name my-blog --with blognami
cd my-blog
npx pinstripe initialize-database
npx pinstripe start-server
# open http://127.0.0.1:3000
```

**Docs**

* [Getting started](/docs/guides/getting-started)
* https://github.com/blognami/blognami

---

### 2) Hosted (SaaS)

Skip servers. We handle infra, updates, and backups.

* 🚀 **3-day demo/trial — no credit card required**
* 🔒 Secure & maintained
* 📤 Export anytime

This is not here yet - but we are working on it!

---

## Feature Highlights

**🔐 Passwordless Auth**
One-time codes by default. Smoother UX, fewer secrets to store.

**📝 Split-Screen Markdown Editor**
Write on the left, live preview on the right. Minimal, fast, focused.

**🏷 Tags & Pages**
Model content your way—posts for the feed, pages for the evergreen stuff.

**🧩 Built on Pinstripe**
Modern framework + CLI. Lean by design, extensible where it counts.

**📦 Self-Host Friendly**
SQLite for dev, plug in heavier DBs for prod. Zero-bloat philosophy.

---

## Open Source, Together

Blognami and Pinstripe live in one monorepo. Your ideas matter here.

* ⭐ **Star the project**: it helps others discover us
* 🐞 **Issues & ideas**: [https://github.com/blognami/blognami/issues](https://github.com/blognami/blognami/issues)
* 🔧 **Contribute**: pick a package, open a PR, shape the direction
* 🗣 **Early feedback**: performance, API design, docs—tell us what you think

> Hi, I’m **Jody Salt**. I’d be thrilled for you to get involved—whether that’s code, docs, testing, or just telling us what you built.

---

## FAQ

**Is Blognami production-ready?**
We’re early, but moving fast. Production use is possible for teams comfortable with open-source velocity.

**Can I migrate away later?**
Yes. Your content is yours. Export anytime.

**Does SaaS lock me in?**
No. SaaS is convenience. You can self-host the same open-source stack.

**What databases are supported?**
SQLite for development; other (mysql compatible) databases can be plugged in for production via Pinstripe’s data layer.

---

## License

MIT — [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

