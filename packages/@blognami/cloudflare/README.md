# @blognami/cloudflare

Deploys a single Blognami blog to Cloudflare as a Cloudflare Worker, with the whole engine running in one SQLite-backed Durable Object.

## Getting started

```bash
    blognami bundle-cloudflare-worker
```

The full walk-through, from a generated project to `wrangler deploy`, is the "Deploy to Cloudflare" guide in the docs (`/docs/deploy-to-cloudflare`).

## Status

The build, the R2 bucket and `wrangler deploy` have been run once on a real Cloudflare account, from a freshly generated project, on 2026-11-13 with `wrangler` 4.160.1. On that deploy the first request created the schema, pages and static assets were served, the client service worker registered, a featured image was stored in R2, a row write whose after hook threw left no row, and the Durable Object's alarm ran the scheduled jobs. Uploads and publishing were run behind a stand-in admin session, because no sign-in code could be mailed.

Nobody has yet signed in to a deployed blog with an emailed code, and no email has been delivered from one.

## Outstanding

Things still to be settled or built. Each is something to weigh before relying on this package.

### Mail is unproven

- **No email has been delivered.** Every send on the real deploy was refused, because no sending domain was onboarded to Cloudflare's Email Sending. Sign-in by emailed code and emailing a new post to subscribers are therefore untested end to end.
- **Onboarding a sending domain is required**, and a successful `wrangler deploy` says nothing about mail: the deploy accepts the `send_email` binding with no domain set up. Without one, a sender whose domain is not a zone on the account is refused `E_SENDER_DOMAIN_NOT_AVAILABLE`, and a send to an address that is not a verified destination address is refused `E_RECIPIENT_NOT_ALLOWED`.
- **Whether an onboarded domain reaches any address is not yet observed.** Cloudflare's documentation says so on one page and two other pages say a binding reaches verified addresses only. If it does not, the mail adapter (`lib/services/send_mail.js`) has to be replaced by a mail provider's HTTP API.
- **Email Sending is a public beta** on the Workers Paid plan, and whether every paid account is let in is not documented.
- **"Transactional email only."** Cloudflare's Email Service does not support marketing email. Whether a new post emailed to subscribers counts as transactional is unanswered, and a no would also mean replacing the adapter for that mail.
- **Quotas are unpublished.** A daily sending quota and a rate limit exist, with no numbers documented.

### Known gaps in behaviour

- **A refused sign-in send fails silently.** The sign-in form does not await its send, so the reader is redirected to enter a code that was never sent, and nothing is logged.
- **A subscriber run is not resumed.** If emailing a post to subscribers throws or is cut off, the subscribers after that point are not mailed, nothing records that a send was owed, and nothing is retried. One run reaches at most about 10,000 subscribers, or what a 15 minute alarm allows.
- **A job that throws is dropped**, logged once with the error's message alone, without the job's name or the error's `code`.
- **Queued jobs live in memory.** A job queued by a request is lost if the Durable Object leaves memory before its alarm runs.
- **An open transaction holds every other request**, static assets included, since each passes through the Durable Object. Notification mail is sent inside a transaction, so the blog waits for as long as each of those sends takes. Measured on the deploy: about 1.8 seconds for a two second transaction, against 49 to 161 ms with nothing held.
- **Markdown views are not served.** A `.md` view in a project is not in the Cloudflare Worker bundle, so its path answers a 404 (read from the code, not run).
- **Every query is logged** on a deployed blog: over a thousand log lines on the first request.
- **Images are stored as uploaded**, with no resize.
- **An existing `wrangler.toml` is never rewritten.** A project that already holds one adds the static assets, R2 bucket and `send_email` blocks by hand, and without the `send_email` block a send fails with a `TypeError` that does not name it.

### Not yet checked

- Installing `@blognami/cloudflare` and `wrangler` from npm into a generated project: the packages were linked from the workspace.
- `wrangler login`: the deploy was authenticated by an API token.
- Whether a browser already holding an earlier client service worker takes the new assets after a redeploy. The assets are requested with the project's `package.json` version, which a redeploy does not change.
- Any browser other than headless Chromium.
- Behaviour at a Cloudflare limit: the 15 minute alarm, the subrequest ceiling, the daily sending quota.
- Rendering the home page with a real Stripe secret key set. An earlier local run saw a 30 second hang on the Stripe call, cause unknown; with no key the page renders normally.
- The seeded admin's address must be changed before the first deploy, as the seed runs once and the sign-in code is mailed there. `generate-project` also writes no `.gitignore`, so `build/`, `.wrangler/` and `node_modules/` are the project's to exclude.
