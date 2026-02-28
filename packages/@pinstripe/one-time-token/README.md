
# @pinstripe/one-time-token

A Pinstripe plugin that provides one-time token (OTP) infrastructure for passwordless authentication. It tracks used tokens to prevent replay attacks and automatically purges expired records.

## Features

- **Replay prevention:** Tracks used token hashes in the database so each OTP can only be verified once.
- **Automatic cleanup:** A scheduled job runs every 5 minutes to purge expired hash records.
- **Cryptographic hashing:** Stores SHA-1 hashes of tokens rather than raw values.

## Getting started

Install the package alongside Pinstripe:

```bash
npm install @pinstripe/one-time-token
```

Import it in your project's `lib/index.js`:

```javascript
import '@pinstripe/one-time-token';
```

Initialize the database to create the required `usedHashes` table:

```bash
npx pinstripe initialize-database
npx pinstripe start-server
```

## Usage

The package registers a `oneTimeToken` service that can be accessed from any Pinstripe context (views, services, commands):

```javascript
const { oneTimeToken } = this;

// Check if a token has already been used
const used = await oneTimeToken.hasBeenUsed('some-token-key');

// Mark a token as used (with optional expiry, defaults to 24 hours)
await oneTimeToken.markAsUsed('some-token-key', {
    expiresAt: new Date(Date.now() + 1000 * 60 * 10) // 10 minutes
});
```

## How it works

1. **`hasBeenUsed(key)`** — Hashes the key with SHA-1 and checks the `usedHashes` table for a matching record.
2. **`markAsUsed(key, options)`** — Hashes the key and inserts a record into `usedHashes` with an expiration timestamp (defaults to 24 hours).
3. **Purge job** — A background job runs on a `*/5 * * * *` cron schedule to delete records where `expiresAt` is in the past.

## Database

This package creates a `usedHashes` table via migration with the following columns:

| Column      | Type     | Description                        |
|-------------|----------|------------------------------------|
| `value`     | string   | SHA-1 hash of the token (indexed)  |
| `expiresAt` | datetime | When the record can be purged (indexed) |
