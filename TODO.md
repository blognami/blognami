
For sidebar implement:
- _section
- _link_group
- _link_group/_link
- _link_group_section

For navbar implement
- _link
- _menu
- _menu/_link

---

- Implement navigation service to be able to specify the navbar / sidebar content
    - use hooks to build the navigation
    - initialize this.sections.navbar etc...

---

- Refactor navbar
    - use hooks
    - make partial able to handle whole nav menu.
        - implement `expose()` feature so that partials can be directly accessible.
    - make viewMap actually map to view classes

---

Perhaps:
- Extract out the pinstripejs.com layout into `_pinstripe/_layout`. This then gets linked to when you initially create a project as an opinionated starting point.
- Extract out the pinstripejs.com layout into `@pinstripe/layout`
- Extract out the pinstripejs.com layout into `@pinstripe/main`
    - Make blognami more static aware.
    - Split up into smaller packages.
        - `@blognami/images`
        - `@blognami/users`
        - `@blognami/sessions`
        - `@blognami/stripe`
        - `@blognami/newsletter`
        - `@blognami/revisions`
        - `@blognami/comments`
        - `@blognami/home`?
        - `@blognami/site`?
