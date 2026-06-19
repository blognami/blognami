

import { afterEach, test } from 'node:test';
import assert from 'node:assert';
import { chdir } from 'node:process';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`pinstripe list-commands`, () => inPackagesDir(() => {
    assert.equal(run(`npx pinstripe list-commands`).stdout, [
        'The following commands are available:',
        '',
        '  * generate-project (core)',
        '  * list-commands (core)',
        '',
        'Available tags: core.',
        '',
        'For more information on a specific command, run:',
        '',
        '  pinstripe COMMAND_NAME --help'
    ].join('\n'));

    run(`npx pinstripe generate-project --name list-commands-test --with blognami`);

    chdir('list-commands-test');

    assert.equal(run(`npx pinstripe list-commands`).stdout, [
        'The following commands are available:',
        '',
        '  * drop-database (database)',
        '  * generate-command (core)',
        '  * generate-job (job)',
        '  * generate-migration (database)',
        '  * generate-model (database)',
        '  * generate-service (core)',
        '  * generate-view (view)',
        '  * initialize-database (database)',
        '  * list-commands (core)',
        '  * list-jobs (job)',
        '  * list-migrations (database)',
        '  * list-models (database)',
        '  * list-services (core)',
        '  * list-views (view)',
        '  * migrate-database (database)',
        '  * reset-database (database)',
        '  * run-job (job)',
        '  * seed-database (database)',
        '  * show-config (core)',
        '  * show-theme (core)',
        '  * start-repl (core)',
        '  * start-server (server)',
        '',
        'Available tags: core, database, job, server, view.',
        '',
        'For more information on a specific command, run:',
        '',
        '  pinstripe COMMAND_NAME --help'
        ].join('\n'));
}));

test(`pinstripe`, () => inPackagesDir(() => {
    assert.equal(run(`npx pinstripe`).stdout, [
        'The following commands are available:',
        '',
        '  * generate-project (core)',
        '  * list-commands (core)',
        '',
        'Available tags: core.',
        '',
        'For more information on a specific command, run:',
        '',
        '  pinstripe COMMAND_NAME --help'
    ].join('\n'));

    run(`npx pinstripe generate-project --name list-commands-test --with blognami`);

    chdir('list-commands-test');

    assert.equal(run(`npx pinstripe`).stdout, [
        'The following commands are available:',
        '',
        '  * drop-database (database)',
        '  * generate-command (core)',
        '  * generate-job (job)',
        '  * generate-migration (database)',
        '  * generate-model (database)',
        '  * generate-service (core)',
        '  * generate-view (view)',
        '  * initialize-database (database)',
        '  * list-commands (core)',
        '  * list-jobs (job)',
        '  * list-migrations (database)',
        '  * list-models (database)',
        '  * list-services (core)',
        '  * list-views (view)',
        '  * migrate-database (database)',
        '  * reset-database (database)',
        '  * run-job (job)',
        '  * seed-database (database)',
        '  * show-config (core)',
        '  * show-theme (core)',
        '  * start-repl (core)',
        '  * start-server (server)',
        '',
        'Available tags: core, database, job, server, view.',
        '',
        'For more information on a specific command, run:',
        '',
        '  pinstripe COMMAND_NAME --help'
        ].join('\n'));
}));