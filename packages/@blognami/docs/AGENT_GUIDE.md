# Blognami agent guide

This guide is for a coding agent working in a Blognami project. Blognami is a blogging app built on its own general-purpose JavaScript web framework; a project is an npm package that imports the Blognami packages it wants and adds its own code on top.

`npx blognami generate-project <name>` writes four files: `package.json` (an ES module package whose entry point is `./lib/index.js`), `blognami.config.js` (database, mail and salt settings, with SQLite and a dummy mail adapter outside production), `lib/index.js` and `CLAUDE.md` (which imports this guide). It then installs the dependencies (`blognami`, `@blognami/main`, `@blognami/pages`, `@blognami/posts` and `@blognami/tags` by default, plus `@blognami/bundler` and `@blognami/docs` as dev dependencies) and runs `blognami initialize-project`.

`lib/index.js` imports each Blognami package and then calls `importAll(import.meta.url)`, which loads the project's own files. Code lives in directories under `lib/`, one per kind of thing: `views/`, `models/`, `services/`, `jobs/`, `commands/` and `migrations/`. The Blognami packages are laid out the same way, and the `generate-*` commands write into these directories.

The links below are relative to this guide's own directory, which is `node_modules/@blognami/docs/` in a generated project, so resolve them from there and not from the project root. Every page ships in the package at the installed version. Commands are run as `npx blognami <command>`; services are named in camelCase. Start with the concept pages in the first group below, which say how a project fits together; the command and service pages after them are reference.

## Understand how a project fits together

- [Project structure](lib/views/--docs/docs/concepts/project-structure.md)
- [Views](lib/views/--docs/docs/concepts/views.md)
- [Models and migrations](lib/views/--docs/docs/concepts/models-and-migrations.md)
- [Services](lib/views/--docs/docs/concepts/services.md)

## Get started and run a project

- [Introduction](lib/views/--docs/docs/index.md)
- [generate-project](lib/views/--docs/docs/commands/generate-project.md)
- [initialize-database](lib/views/--docs/docs/commands/initialize-database.md)
- [start-server](lib/views/--docs/docs/commands/start-server.md)
- [start-repl](lib/views/--docs/docs/commands/start-repl.md)
- [project](lib/views/--docs/docs/services/project.md)
- [environment](lib/views/--docs/docs/services/environment.md)
- [server](lib/views/--docs/docs/services/server.md)
- [repl](lib/views/--docs/docs/services/repl.md)
- [version](lib/views/--docs/docs/services/version.md)

## Deploy a project

- [Deploy to Cloudflare](lib/views/--docs/docs/deploy-to-cloudflare.md)
- [bundle-cloudflare-worker](lib/views/--docs/docs/commands/bundle-cloudflare-worker.md)
- [bundle-static-assets](lib/views/--docs/docs/commands/bundle-static-assets.md)
- [generate-static-site](lib/views/--docs/docs/commands/generate-static-site.md)
- [serviceWorker](lib/views/--docs/docs/services/service-worker.md)
- [jsBundler](lib/views/--docs/docs/services/js-bundler.md)

## Generate code

- [generate-view](lib/views/--docs/docs/commands/generate-view.md)
- [generate-model](lib/views/--docs/docs/commands/generate-model.md)
- [generate-migration](lib/views/--docs/docs/commands/generate-migration.md)
- [generate-service](lib/views/--docs/docs/commands/generate-service.md)
- [generate-job](lib/views/--docs/docs/commands/generate-job.md)
- [generate-command](lib/views/--docs/docs/commands/generate-command.md)
- [fsBuilder](lib/views/--docs/docs/services/fs-builder.md)
- [inflector](lib/views/--docs/docs/services/inflector.md)

## Work with the database and models

- [Models and migrations](lib/views/--docs/docs/concepts/models-and-migrations.md)
- [initialize-database](lib/views/--docs/docs/commands/initialize-database.md)
- [migrate-database](lib/views/--docs/docs/commands/migrate-database.md)
- [seed-database](lib/views/--docs/docs/commands/seed-database.md)
- [reset-database](lib/views/--docs/docs/commands/reset-database.md)
- [drop-database](lib/views/--docs/docs/commands/drop-database.md)
- [generate-model](lib/views/--docs/docs/commands/generate-model.md)
- [generate-migration](lib/views/--docs/docs/commands/generate-migration.md)
- [list-models](lib/views/--docs/docs/commands/list-models.md)
- [list-migrations](lib/views/--docs/docs/commands/list-migrations.md)
- [database](lib/views/--docs/docs/services/database.md)
- [createModel](lib/views/--docs/docs/services/create-model.md)

## Write views and render output

- [Views](lib/views/--docs/docs/concepts/views.md)
- [generate-view](lib/views/--docs/docs/commands/generate-view.md)
- [list-views](lib/views/--docs/docs/commands/list-views.md)
- [view](lib/views/--docs/docs/services/view.md)
- [viewMap](lib/views/--docs/docs/services/view-map.md)
- [renderView](lib/views/--docs/docs/services/render-view.md)
- [renderHtml](lib/views/--docs/docs/services/render-html.md)
- [renderTag](lib/views/--docs/docs/services/render-tag.md)
- [renderText](lib/views/--docs/docs/services/render-text.md)
- [renderForm](lib/views/--docs/docs/services/render-form.md)
- [renderTable](lib/views/--docs/docs/services/render-table.md)
- [cssClassesFor](lib/views/--docs/docs/services/css-classes-for.md)
- [parseHtml](lib/views/--docs/docs/services/parse-html.md)
- [isClient](lib/views/--docs/docs/services/is-client.md)

## Handle requests and responses

- [params](lib/views/--docs/docs/services/params.md)
- [initialParams](lib/views/--docs/docs/services/initial-params.md)
- [cookies](lib/views/--docs/docs/services/cookies.md)
- [callHandler](lib/views/--docs/docs/services/call-handler.md)
- [renderRedirect](lib/views/--docs/docs/services/render-redirect.md)
- [server](lib/views/--docs/docs/services/server.md)
- [sendMail](lib/views/--docs/docs/services/send-mail.md)

## Run background jobs

- [generate-job](lib/views/--docs/docs/commands/generate-job.md)
- [list-jobs](lib/views/--docs/docs/commands/list-jobs.md)
- [run-job](lib/views/--docs/docs/commands/run-job.md)
- [runJob](lib/views/--docs/docs/services/run-job.md)
- [jobCoordinator](lib/views/--docs/docs/services/job-coordinator.md)
- [jobScheduler](lib/views/--docs/docs/services/job-scheduler.md)
- [jobQueue](lib/views/--docs/docs/services/job-queue.md)
- [jobWorker](lib/views/--docs/docs/services/job-worker.md)

## Change config, feature flags and the theme

- [show-config](lib/views/--docs/docs/commands/show-config.md)
- [show-theme](lib/views/--docs/docs/commands/show-theme.md)
- [config](lib/views/--docs/docs/services/config.md)
- [environment](lib/views/--docs/docs/services/environment.md)
- [featureFlags](lib/views/--docs/docs/services/feature-flags.md)
- [theme](lib/views/--docs/docs/services/theme.md)

## Inspect a project

- [list-commands](lib/views/--docs/docs/commands/list-commands.md)
- [list-services](lib/views/--docs/docs/commands/list-services.md)
- [list-views](lib/views/--docs/docs/commands/list-views.md)
- [list-models](lib/views/--docs/docs/commands/list-models.md)
- [list-migrations](lib/views/--docs/docs/commands/list-migrations.md)
- [list-jobs](lib/views/--docs/docs/commands/list-jobs.md)
- [show-config](lib/views/--docs/docs/commands/show-config.md)
- [show-theme](lib/views/--docs/docs/commands/show-theme.md)
- [start-repl](lib/views/--docs/docs/commands/start-repl.md)

## Write services and commands, and reach for utilities

- [Services](lib/views/--docs/docs/concepts/services.md)
- [generate-service](lib/views/--docs/docs/commands/generate-service.md)
- [generate-command](lib/views/--docs/docs/commands/generate-command.md)
- [runCommand](lib/views/--docs/docs/services/run-command.md)
- [runInNewWorkspace](lib/views/--docs/docs/services/run-in-new-workspace.md)
- [defer](lib/views/--docs/docs/services/defer.md)
- [trapify](lib/views/--docs/docs/services/trapify.md)
- [formatDate](lib/views/--docs/docs/services/format-date.md)
- [inflector](lib/views/--docs/docs/services/inflector.md)
