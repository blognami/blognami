

import { afterEach, test } from 'node:test';
import assert from 'node:assert';
import { chdir } from 'node:process';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`blognami list-commands`, () => inPackagesDir(() => {
    assert.equal(run(`npx blognami list-commands`).stdout, [
        'The following commands are available:',
        '',
        '  * generate-project',
        '  * list-commands'
    ].join('\n'));

    run(`npx blognami generate-project --name list-commands-test`);

    chdir('list-commands-test');

    assert.equal(run(`npx blognami list-commands`).stdout, [
        'The following commands are available:',
        '',
        '  * drop-database',
        '  * generate-app',
        '  * generate-background-job',
        '  * generate-command',
        '  * generate-migration',
        '  * generate-model',
        '  * generate-service',
        '  * generate-view',
        '  * initialize-database',
        '  * list-apps',
        '  * list-background-jobs',
        '  * list-commands',
        '  * list-migrations',
        '  * list-models',
        '  * list-services',
        '  * list-views',
        '  * migrate-database',
        '  * reset-database',
        '  * run-background-job',
        '  * seed-database',
        '  * show-config',
        '  * start-repl',
        '  * start-server'
        ].join('\n'));
}));

test(`blognami`, () => inPackagesDir(() => {
    assert.equal(run(`npx blognami`).stdout, [
        'The following commands are available:',
        '',
        '  * generate-project',
        '  * list-commands'
    ].join('\n'));

    run(`npx blognami generate-project --name list-commands-test`);

    chdir('list-commands-test');

    assert.equal(run(`npx blognami`).stdout, [
        'The following commands are available:',
        '',
        '  * drop-database',
        '  * generate-app',
        '  * generate-background-job',
        '  * generate-command',
        '  * generate-migration',
        '  * generate-model',
        '  * generate-service',
        '  * generate-view',
        '  * initialize-database',
        '  * list-apps',
        '  * list-background-jobs',
        '  * list-commands',
        '  * list-migrations',
        '  * list-models',
        '  * list-services',
        '  * list-views',
        '  * migrate-database',
        '  * reset-database',
        '  * run-background-job',
        '  * seed-database',
        '  * show-config',
        '  * start-repl',
        '  * start-server'
        ].join('\n'));
}));