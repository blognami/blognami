---
section: docs
menu:
    path: ["Getting Started", "Deploy to Cloudflare"]
    displayOrder: 2
---
# Deploy to Cloudflare

This guide takes a project made by `generate-project` to a blog running as a Cloudflare Worker on your own Cloudflare account: the blog runs inside one Durable Object, which holds its database; uploads go to an R2 bucket; mail goes out through Cloudflare's Email Sending.

> **Note**: This guide's build, `wrangler r2 bucket create` and `wrangler deploy` have been run once, against a real Cloudflare account, and the deployed blog answered. No mail has been accepted from a deployed blog: the deploy succeeded on an account with no sending domain onboarded, every send was then refused, and nobody has signed in to a deployed blog with an emailed code. The installs from npm and `wrangler login` were not run. Read "Status" and "Known Limits" below before you rely on it.

## What You Need

- A project made by `generate-project` (see the [Introduction](/docs))
- A Cloudflare account on the Workers Paid plan. Nothing is promised for the Workers Free plan.
- A domain on Cloudflare DNS, onboarded to Email Sending, for mail. The deploy succeeds without it, and the blog then cannot mail an address that is not a verified destination address (see "Set Up Your Cloudflare Account"). Email Sending is a public beta on the Workers Paid plan (as read in Cloudflare's documentation on 2026-11-13, not run).

Local `wrangler dev` was run with no Cloudflare account, so you can try everything up to "Try It Locally" before you open one.

## Install and Import

In the project, install `@blognami/cloudflare`, and `wrangler` as a development dependency:

```bash
npm install @blognami/cloudflare
npm install --save-dev wrangler
```

Then import the package in `lib/index.js`, after the packages the project already imports:

```javascript
import '@blognami/pages';
import '@blognami/posts';
import '@blognami/tags';
import '@blognami/cloudflare';
```

The import adds the `bundle-cloudflare-worker` command; `npx blognami list-commands` lists it. A Node process is otherwise unchanged by the package: its database, uploads and mail stay as they are.

## Before the First Deploy

A generated project needs three changes before its first deploy.

### The Seeded Admin's Address

The first request to a new blog migrates its database and, on an empty database, runs `seed-database`. There is no `initialize-database` step. The seed runs once, and it inserts the admin as `admin@example.com`. On a deployed blog the sign-in code is mailed to that address, so change it to your own in `lib/commands/seed_database.js` first:

```javascript
await this.database.users.insert({
    name: 'Admin',
    email: 'you@yourdomain.com',
    role: 'admin'
});
```

### The Sender

On Cloudflare every message is sent from `mail.defaults.from`. `mail.adapter` and the smtp keys are ignored. With no sender, a send throws:

```
No sender: set `mail.defaults.from` in the config to send mail on Cloudflare.
```

The generated `blognami.config.js` sets `mail` per environment and holds no `defaults`. Plain `wrangler dev` reads the `else` branch, and `NODE_ENV=production wrangler dev` and a deploy read the `production` branch, so set the sender in both. On the deploy that was run, `process.env.NODE_ENV` was `production` and the config's `production` branch was the one read; that branch's `smtp` and `mysql` keys did no harm.

```javascript
let mail;
if(environment == 'production'){
    mail = {
        adapter: 'smtp',
        defaults: {
            from: 'noreply@yourdomain.com'
        },
        host: "smtp.example.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "username",
            pass: "password",
        }
    };
} else {
    mail = {
        adapter: 'dummy',
        defaults: {
            from: 'noreply@yourdomain.com'
        }
    };
}
```

The address must be at the domain you onboard to Email Sending under "Set Up Your Cloudflare Account". On the deploy that was run, a sender at a domain that is not a zone on the account was refused, and every send from a sender at a zone that is not onboarded was refused too; both refusals are under that heading.

### The Config Is Bundled

The build imports `blognami.config.js` into the script it writes, and the config is evaluated inside the Durable Object, not in your shell:

- Whatever the config holds, the generated `salt` included, is in the script you upload.
- A secret is not read from `process.env` there: your shell's environment at deploy time is not the Durable Object's. Read a secret through `_cloudflare` instead, as "Reading Your Own Bindings" shows.
- The `database` block is ignored on Cloudflare: the database is the Durable Object's own storage.

No secret needs setting on the Cloudflare Worker: the blog reads none.

## Build the Cloudflare Worker

```bash
npx blognami bundle-cloudflare-worker
```

The command takes no parameters (see [bundle-cloudflare-worker](/docs/commands/bundle-cloudflare-worker)). It writes:

```
build/
├── cloudflare-worker/
│   └── index.js                 # The Cloudflare Worker script and its Durable Object
├── cloudflare-worker-assets/    # Emptied and filled on each run
│   ├── service_worker.js
│   └── _blognami/
│       └── _shell/
│           ├── window.js
│           ├── window.js.map
│           ├── styles.css
│           └── service_worker.js.map
└── static-assets/               # Written by bundle-static-assets, which the command runs
wrangler.toml                    # Only when the project has none
```

`build/cloudflare-worker-assets/` holds a copy of `build/static-assets/` and each file-backed view of the project under its full view name, any file path feature flag segment kept.

Run the command again after each change to the project. `generate-project` writes no `.gitignore`, so keep `build/`, `.wrangler/` and `node_modules/` out of version control yourself.

## The wrangler.toml

When the project has no `wrangler.toml`, the build writes one. For a project named `my-blog`:

```toml
name = "my-blog"
main = "build/cloudflare-worker/index.js"
compatibility_date = "2026-11-01"
compatibility_flags = ["nodejs_compat"]

[[durable_objects.bindings]]
name = "BLOGNAMI"
class_name = "BlognamiDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["BlognamiDurableObject"]

[assets]
directory = "build/cloudflare-worker-assets"
binding = "ASSETS"
run_worker_first = true
html_handling = "none"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "my-blog"

[[send_email]]
name = "EMAIL"
```

### Bindings

The binding names are fixed:

| Binding | What it is |
|---------|------------|
| `BLOGNAMI` | The Durable Object that runs the blog and holds its database |
| `ASSETS` | The static assets in `build/cloudflare-worker-assets` |
| `R2_BUCKET` | The R2 bucket that holds uploads |
| `EMAIL` | The binding every message is sent through |

`bucket_name` is the project's name. If your bucket is named otherwise, edit `bucket_name`.

### A Project With Its Own wrangler.toml

The build never rewrites or merges an existing `wrangler.toml`. A project that already holds one needs every line above. One written by an earlier build may lack the last three blocks; add them by hand:

```toml
[assets]
directory = "build/cloudflare-worker-assets"
binding = "ASSETS"
run_worker_first = true
html_handling = "none"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "my-blog"

[[send_email]]
name = "EMAIL"
```

Without the bucket block an upload fails on a missing binding; without the `send_email` block a send fails with a `TypeError` that does not name the block.

## Try It Locally

```bash
npx wrangler dev
```

`wrangler dev` lists the four bindings as `local`, then answers on `http://localhost:8787`. The first request applies the migrations and seeds the database.

The `EMAIL` binding is simulated: a message is logged, not sent. Signing in with the admin's address logs a block like this:

```
[wrangler:info] send_email binding called with MessageBuilder:
From: noreply@yourdomain.com
To: you@yourdomain.com
Subject: Your one-time-password

Text: <a text file under .wrangler/tmp/email/>
```

The sign-in code is not in the terminal: it is in the text file the block names.

`wrangler dev` keeps its state in `.wrangler/` beside `wrangler.toml`: the database, the bucket and the simulated messages. Remove `.wrangler/` and the next start gives an empty blog.

A deploy reads the config's `production` branches: on the deploy that was run, `process.env.NODE_ENV` was `production`. The nearest local stand-in is:

```bash
NODE_ENV=production npx wrangler dev
```

## Set Up Your Cloudflare Account

`wrangler r2 bucket create` below and `wrangler deploy` in the next section have been run on a real Cloudflare account, in one run. `wrangler login` has not: an API token stood in for it. "Status" lists how that run differed from yours.

Sign `wrangler` in to your account:

```bash
npx wrangler login
```

Create the R2 bucket, under the name `bucket_name` holds in `wrangler.toml`:

```bash
npx wrangler r2 bucket create my-blog
```

Onboard the sending domain. This is required, not a step to put off: until it is done the blog cannot mail an address that is not a verified destination address, so neither the sign-in code to you nor a post to subscribers. How it is done, as read in Cloudflare's documentation on 2026-11-13, not run:

- The domain must be on Cloudflare DNS, and is onboarded to Email Sending in the Cloudflare dashboard.
- The address in `mail.defaults.from` must be at that domain.
- Email Sending is a public beta, on the Workers Paid plan.
- 3,000 emails a month are included. A daily quota also applies; its number is not published.

### A Deploy Succeeds Without It

`wrangler deploy` accepted the `[[send_email]]` block on an account with no domain onboarded to Email Sending. So a deploy that succeeds says nothing about whether the blog can send.

On that account every send from the deployed blog was refused: the `EMAIL` binding threw an `Error` with a `code`. Two cases were seen:

| The sender | `code` | Message |
|------------|--------|---------|
| At a domain that is not a zone on the account | `E_SENDER_DOMAIN_NOT_AVAILABLE` | `email from example.org not allowed because domain is not owned by the same account` |
| At a zone on the account that is not onboarded to Email Sending | `E_RECIPIENT_NOT_ALLOWED` | `destination address is not a verified address` |

`example.org` in the first message is the sender's domain in that run. In the second case the address was taken as a sender and the send was refused for every recipient tried.

Sign-in is by emailed code only, so until a send is accepted nobody can sign in to the blog, you included.

Not observed: that an onboarded domain delivers to any address, since no domain was onboarded and no send was accepted for any address; and that a verified destination address is delivered to without onboarding, which is read from the second refusal's message only.

## Deploy

```bash
npx wrangler deploy
```

You run the deploy yourself, with your own Cloudflare credentials: Blognami never holds them. The command has been run on a real Cloudflare account, in one run ("Status" lists how that run differed from yours).

After a deploy, the first request migrates and seeds the database. Once mail works, signing in mails the code to the seeded admin's address; no send has been accepted from a deployed blog, so that is not yet run on a deployed blog.

When the send is refused, as under "A Deploy Succeeds Without It", the sign-in form still answers its redirect to the page that asks for the code. No code is sent, and nothing was seen logged for it: the `wrangler tail` events for the sign-in posts held no log line for the send and no exception. That the form's own send was refused is inferred from the same message sent and awaited, which threw the first refusal; the form's send was not seen to be refused as such.

In the run, a later deploy kept the blog's data and the bucket, checked at the first redeploy and at the last. Across the first, the rows read back were as before and the seed did not run again. After the last deploy the image, the bucket's one object and the pages a reader is served were read directly and were as they were; that the rows were as before after it is inferred from those pages.

## Reading Your Own Bindings

Every request and every job gets the Cloudflare Worker's bindings as `this.initialParams._cloudflare`, with the Durable Object's storage added as `DATABASE`. `DATABASE` is not a binding and needs nothing in `wrangler.toml`.

A binding or secret of your own is read as `this.initialParams._cloudflare.NAME`. For a secret set with `npx wrangler secret put MY_API_KEY`:

```javascript
const { MY_API_KEY } = this.initialParams._cloudflare;
```

As seen on the deploy that was run: `wrangler secret put` makes a new version of the Cloudflare Worker and deploys it by itself; a later `wrangler deploy` keeps the secret, without listing it among the bindings; and the Durable Object's data was as before.

On Node `this.initialParams._cloudflare` is undefined.

## Jobs

Nothing is configured for jobs, and `wrangler.toml` holds nothing for them. The Durable Object's alarm runs the scheduled jobs, and each job a request queues runs straight after that request's response.

- The Durable Object wakes at least every five minutes, whether or not anyone reads the blog.
- A job that throws is logged and dropped. Its error is only in the Cloudflare Worker's logs. In `wrangler tail` on the deploy that was run, the log line held the error's message alone, neither the job's name nor the error's `code`.
- A post emailed to subscribers whose send is refused goes the same way. On the deploy that was run, the job ran from the alarm, the refused send was logged once, and the job was dropped and not run again in the next two alarm runs: the subscriber was not emailed, and nothing stored says a send was owed.
- `wrangler tail` is not a full record. On the deploy that was run, one tail held no event for 7 of its first 21 requests and another held the Durable Object's event for 77 of about 144, and neither said so; a third dropped few. So a missing line in it is not proof that nothing ran.
- A schedule that fell due several times while no alarm ran is run once.

## Browsing the Data

No `wrangler` command reads the Durable Object's data. As read in Cloudflare's documentation, not run:

- **Deployed** - Data Studio, in the Cloudflare dashboard
- **Under `wrangler dev`** - Local Explorer, at `/cdn-cgi/local/explorer` on the local server

## Known Limits

- **Markdown views** - A `.md` view in the project is not served on Cloudflare: its path answers a 404 (read from the code, not run).
- **Images** - An image is stored as uploaded, with no resize. A file over `server.limits.fileSize` (10 MiB by default) is refused with a message, as is a TIFF.
- **Subscriber emails are not resumed** - A run that emails a post to subscribers and throws or is cut off is not picked up again: the subscribers after that point are not mailed.
- **Subscriber ceiling** - One run reaches at most about 10,000 subscribers, or what 15 minutes allow, whichever is lower (as read in Cloudflare's documentation on 2026-11-13, not run). The daily sending quota can stop a run sooner.
- **Transactional email only** - Email Sending supports transactional email only. Whether a new post emailed to subscribers is within that is unanswered.
- **Notification mail** - A notification mail holds the blog's other requests while it sends. It is one case of a wider limit: any open transaction holds every other request to the blog until it ends, static assets included, as each passes through the Durable Object. Measured on the deploy that was run: while one request held a transaction open for two seconds, four others each took 1765 to 1812 ms, against 49 to 161 ms with nothing held.
- **Always waking** - The Durable Object wakes at least every five minutes.
- **Paid plan** - A paid Workers plan is assumed.

## Status

**Run under local `wrangler dev` by the test suite**, on a test project: the build, the written `wrangler.toml`, pages, static assets, file-backed views, uploads to R2, the sign-in code through the simulated `EMAIL` binding, and the jobs from the alarm.

**Run once by hand, on 2026-11-13**, on a project made by `generate-project`, with `wrangler` 4.160.1: the steps of this guide up to and including "Try It Locally". The home page answered and the sign-in code reached the simulated binding's log. With `NODE_ENV=production` set, `wrangler dev` read the config's `production` branch, and the home page and the sign-in code still worked; uploads, jobs and entering the code were not checked there. In that walk:

- `npm install @blognami/cloudflare` and `npm install --save-dev wrangler` were not run: the package was unreleased, so the packages were linked from the source tree.
- The sign-in form was posted by a script, not from a browser, and the code was not entered.

**Run on a real deploy, once, on 2026-11-13**, on one Cloudflare account, on a project made by `generate-project`, with `wrangler` 4.160.1:

- `bundle-cloudflare-worker`, `wrangler r2 bucket create` and `wrangler deploy` as this guide writes them, with no edit to the project beyond the three under "Before the First Deploy"; and `wrangler secret put`.
- The first request answered the home page, with no step run before it.
- `/service_worker.js` and the shell assets were served.
- The client service worker registered, in headless Chromium only.
- A post was published, and read by a reader with no session.
- A featured image was stored in R2 as uploaded and served. A file over the limit was refused, and a TIFF was refused. An upload with no session was answered the redirect to the sign-in form, and nothing was stored.
- A row write whose after hook throws left nothing.
- The alarm armed itself, and purged old sessions and used hashes.
- `process.env.NODE_ENV` was `production`, and the config's `production` branch was read.
- The data was kept across redeploys, as "Deploy" says.

That run differed from yours:

- The packages were linked from the source tree, not installed from npm.
- `wrangler` authenticated by an API token, not by `wrangler login`, and was run from an install outside the project, not as `npx wrangler`. The project was built in one place and deployed from another.
- The registry held `wrangler` 4.161.0 that day, which was not deployed with.
- The requests were made by a script, not from a browser. The one check made in a browser used headless Chromium, with a fresh profile and no person at it.
- Every admin action, the post, its featured image and both publishes, ran behind a stand-in session: an admin session inserted for the checks, not one signed in with an emailed code. The row write ran through a view and a hook added for the check.
- After the first deploy, views were added to the project for the checks. `NODE_ENV`, the alarm's time, the purges and the empty bucket after the upload with no session were read through them, on those later deploys.
- "Try It Locally" was skipped; it stands on the walk above.

**Read in Cloudflare's documentation and not run** (read on 2026-11-13): what this guide says of Email Sending past the two refusals, so how a domain is onboarded, its beta status, the 3,000 emails a month and the daily quota; the subscriber ceiling; "transactional email only"; Data Studio and Local Explorer.

**Not yet run on a deployed blog**: any send that was accepted, so a sign-in code or a subscriber's email arriving, and the code entered in a browser; `npm install @blognami/cloudflare` and `npm install --save-dev wrangler` from npm; `wrangler login`; any browser but headless Chromium, and a person at one; a `.md` view, a file-backed view and a project with its own `wrangler.toml`.
