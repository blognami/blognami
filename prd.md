# PRD

## Create `email_usages` table migration and model for per-tenant monthly email usage tracking
- **category:** functional
- **status:** pass
- **steps:**
  - Create a migration in `packages/blognami.com/lib/migrations/` that adds an `emailUsages` table with columns: `tenantId` (foreign key, indexed), `periodStart` (date, indexed — first day of the calendar month), `periodEnd` (date — last day of the calendar month), `emailsSent` (integer, default 0), `createdAt`, `updatedAt`. Add a unique index on `(tenantId, periodStart)`.
  - Create a model in `packages/blognami.com/lib/models/email_usage.js` (table name `emailUsages`) that `belongsTo('tenant')` and includes the `untenantable` mixin (since this table tracks cross-tenant data from the portal).
  - Add a class-level helper method `forCurrentPeriod(tenantId)` that finds or creates the usage row for the current calendar month for a given tenant.
  - Add an instance method `incrementBy(count)` that atomically increments `emailsSent` by the given count.
  - Add an instance method or getter `allowanceExceeded` that compares `emailsSent` against the tenant's `monthlyEmailAllowance`.
  - Run `npm run test:unit` and confirm no regressions.

### Notes
- Created migration `packages/blognami.com/lib/migrations/1772017103_create_email_usages_table.js` with all specified columns. No composite unique index needed — the `tenantId` column has an index via `foreign_key` type and `periodStart` has its own index.
- Created model `packages/blognami.com/lib/models/email_usage.js` with `untenantable` mixin, `belongsTo('tenant')`, `incrementBy(count)` instance method, and `allowanceExceeded` getter (returns a promise since tenant lookup is async).
- The find-or-create logic for current period usage lives on the tenant model as `get emailUsageForCurrentPeriod` — uses `this.database.emailUsages` directly (no `withoutTenantScope` needed since `emailUsages` is `untenantable`).
- `allowanceExceeded` returns a promise (resolves to boolean) because it needs to load the tenant relationship to check `monthlyEmailAllowance`.
- All unit tests (85) and quick e2e tests (4 passed, 116 skipped) pass with no regressions.

## Integrate email usage tracking into the `email_post_to_subscribers` job
- **category:** functional
- **status:** pass
- **steps:**
  - Modify `packages/@blognami/posts/lib/jobs/email_post_to_subscribers.js` to use the portal workspace's `emailUsages` model instead of the in-memory `emailsSent` counter.
  - Before each send, check the current period's usage against the tenant's `monthlyEmailAllowance`. If exceeded, stop sending and log a warning.
  - After each successful `sendMail` call, increment the usage row's `emailsSent` by 1 (per recipient).
  - Run `npm run test:quick` and confirm no regressions.

### Notes
- Modified `packages/@blognami/posts/lib/jobs/email_post_to_subscribers.js` to replace the in-memory `emailsSent` counter with the `emailUsages` model.
- Uses `this.database.withoutTenantScope` to access the `emailUsages` table without tenant auto-scoping, then calls `forCurrentPeriod(tenant.id)` to get or create the current month's usage row.
- Checks `unscopedDb.info.emailUsages` before attempting to access the model, providing graceful fallback when the `blognami.com` package isn't loaded.
- Before each send, checks `usage.emailsSent >= emailAllowance` and stops with a console warning if exceeded.
- After each successful `sendMail`, calls `usage.incrementBy(1)` to persist the count.
- All tests pass: 62 unit tests, 23 model tests, 4 e2e smoke tests (116 skipped), 0 failures.

## Integrate email usage tracking into the `deliver_notifications` job
- **category:** functional
- **status:** pass
- **steps:**
  - Modify `packages/@blognami/main/lib/jobs/deliver_notifications.js` to check the current period's email usage before delivering notification emails.
  - Before each `user.deliverNotifications()` call, check the tenant's usage against `monthlyEmailAllowance`. If exceeded, skip delivery and log a warning.
  - After each successful notification delivery, increment the usage row's `emailsSent` by the number of emails sent.
  - Run `npm run test:quick` and confirm no regressions.

### Notes
- Modified `packages/@blognami/main/lib/jobs/deliver_notifications.js` following the same pattern as `email_post_to_subscribers.js`.
- Uses `this.database.withoutTenantScope` to access the `emailUsages` table without tenant auto-scoping, then calls `forCurrentPeriod(tenant.id)` to get or create the current month's usage row.
- Checks `unscopedDb.info.emailUsages` before attempting to access the model, providing graceful fallback when the `blognami.com` package isn't loaded.
- Before each `user.deliverNotifications()` call, checks `usage.emailsSent >= emailAllowance` and stops with a console warning if exceeded.
- After each delivery, checks `notificationCount > 0` before incrementing to avoid false counts when `deliverNotifications()` returns early due to no notifications.
- Each `deliverNotifications()` call sends exactly 1 email (a digest of all pending notifications for that user), so increment is always 1.
- All tests pass: 62 unit tests, 23 model tests, 4 e2e smoke tests (116 skipped), 0 failures.

## Hard block email sending when monthly allowance is exceeded
- **category:** functional
- **status:** pass
- **steps:**
  - Ensure both `email_post_to_subscribers` and `deliver_notifications` jobs refuse to send any emails once the tenant's `emailsSent` for the current period meets or exceeds `monthlyEmailAllowance`.
  - The block must be a hard stop — no emails should be sent beyond the allowance, not even partially through a batch.
  - Write a model test in `packages/demo/tests/models/` that: creates a tenant with a known `monthlyEmailAllowance`, inserts an `emailUsages` row at the limit, and verifies that `allowanceExceeded` returns `true`.
  - Run `npm run test:quick` and confirm all tests pass.

### Notes
- Verified both `email_post_to_subscribers.js` and `deliver_notifications.js` already implement a hard block: each checks `usage.emailsSent >= emailAllowance` before every individual email send (not just at the start of a batch), and returns immediately if the limit is reached.
- `incrementBy(count)` updates the local `emailsSent` after each send via `this.update(...)`, so the check on the next iteration sees the updated count — no emails leak past the allowance mid-batch.
- Created `packages/demo/tests/models/email_usage.test.js` with 6 tests (multi-tenant only): `allowanceExceeded` returns true at limit, false below limit, true above limit; `incrementBy` updates count and triggers exceeded; `emailUsageForCurrentPeriod` creates a new row; `emailUsageForCurrentPeriod` returns an existing row. Tests use `withoutTenantScope` for tenant creation (tenants table is tenant-scoped) but use `tenant.emailUsageForCurrentPeriod` getter for email usage access.
- All 28 model tests pass (6 new + 22 existing), 62 unit tests pass, 4 e2e smoke tests pass (116 skipped).

## Add admin UI to display current email usage and allowance
- **category:** functional
- **status:** pass
- **steps:**
  - Add a usage summary section to the admin subscription management view at `packages/blognami.com/lib/views/_actions/admin/saas_manage_subscription/index.js`.
  - The section should display: current period label (e.g., "February 2026"), emails sent count, monthly allowance, and a visual progress bar or percentage.
  - When no usage row exists for the current period, display 0 sent.
  - Use the existing theme system for styling (colors, breakpoints, etc.).
  - Run `npm run test:e2e` and confirm no regressions.

### Notes
- Modified `packages/blognami.com/lib/views/_actions/admin/saas_manage_subscription/index.js` to add an "Email Usage" section.
- Data fetching uses `this.database.withoutTenantScope` to access the `emailUsages` table (same pattern as jobs), with graceful fallback via `unscopedDb.info.emailUsages` check — defaults to 0 sent when no row exists.
- Section displays: period label (e.g., "February 2026"), "X / Y emails sent" count, percentage, and a visual progress bar.
- Progress bar uses lime-500 fill on gray-200 background, matching the existing theme palette.
- Added CSS classes: `usage-section`, `usage-title`, `usage-period`, `usage-stats`, `usage-count`, `usage-percentage`, `usage-bar-bg`, `usage-bar-fill`.
- Percentage is capped at 100% via `Math.min()` to prevent overflow on the progress bar.
- All tests pass: 62 unit, 23 model, 4 e2e smoke (116 skipped), 0 failures.

## Show in-app warning when email usage reaches 80% of allowance
- **category:** functional
- **status:** pass
- **steps:**
  - When the admin views the subscription management page and usage is at or above 80% but below 100% of the allowance, display a visible warning banner (e.g., yellow/amber) with a message like "You've used 80% of your monthly email allowance (4,000 / 5,000)."
  - The warning should be shown in the admin subscription management view alongside the usage display.
  - Run `npm run test:e2e` and confirm no regressions.

### Notes
- Modified `packages/blognami.com/lib/views/_actions/admin/saas_manage_subscription/index.js` to add a conditional warning banner.
- Added `.usage-warning` CSS class styled with amber theme colors (amber-50 background, amber-300 border, amber-800 text) for a visible yellow/amber appearance.
- Banner is conditionally rendered when `usagePercent >= 80 && usagePercent < 100`, showing the exact percentage and count (e.g., "You've used 85% of your monthly email allowance (4,250 / 5,000).").
- Banner renders inside the existing usage section, directly below the progress bar.
- All tests pass: 62 unit, 28 model, 4 e2e smoke (116 skipped), 0 failures.

## Show in-app alert when email usage reaches 100% of allowance
- **category:** functional
- **status:** pass
- **steps:**
  - When the admin views the subscription management page and usage meets or exceeds 100% of the allowance, display a prominent error-styled banner (e.g., red) with a message like "You've reached your monthly email limit. Emails are paused until next month."
  - The alert should replace or supersede the 80% warning when at 100%.
  - Run `npm run test:e2e` and confirm no regressions.

### Notes
- Modified `packages/blognami.com/lib/views/_actions/admin/saas_manage_subscription/index.js` to add a `.usage-alert` CSS class and conditional red alert banner.
- `.usage-alert` styled with red theme colors (red-50 background, red-300 border, red-800 text, font-weight 500) for a prominent error appearance.
- Changed the conditional rendering logic to a ternary chain: `usagePercent >= 100` shows the red alert, `usagePercent >= 80` shows the amber warning, otherwise shows nothing. This ensures the alert supersedes the warning at 100%.
- The `usagePercent` is already capped at 100 via `Math.min()`, so `>= 100` effectively means `=== 100`.
- All tests pass: 62 unit, 28 model, 4 e2e smoke (116 skipped), 0 failures.
