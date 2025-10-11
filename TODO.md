
---

Perhaps:
- Extract out the pinstripejs.com layout into `_pinstripe/_layout`. This then gets linked to when you initially create a project as an opinionated starting point.
- Extract out the pinstripejs.com layout into `@pinstripe/layout`
- Extract out the pinstripejs.com layout into `@pinstripe/main`
    - Make blognami more static aware.
    - Split up into smaller packages.
        - `@blognami/images`
        - `@blognami/users`
        - `@blognami/stripe`
        - `@blognami/newsletter`
        - `@blognami/revisions`
        - `@blognami/comments`
        - `@blognami/home`?
        - `@blognami/site`?
