

import { afterEach, test } from 'node:test';
import assert from 'node:assert';
import { chdir } from 'node:process';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`pinstripe list-commands`, () => inPackagesDir(() => {
    assert.equal(run(`npx pinstripe list-commands`).stdout, [
        'The following commands are available:',
        '',
        '  * generate-project',
        '  * list-commands',
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
        '  * drop-database',
        '  * generate-background-job',
        '  * generate-command',
        '  * generate-migration',
        '  * generate-model',
        '  * generate-service',
        '  * generate-view',
        '  * initialize-database',
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
        '  * show-theme',
        '  * start-repl',
        '  * start-server',
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
        '  * generate-project',
        '  * list-commands',
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
        '  * drop-database',
        '  * generate-background-job',
        '  * generate-command',
        '  * generate-migration',
        '  * generate-model',
        '  * generate-service',
        '  * generate-view',
        '  * initialize-database',
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
        '  * show-theme',
        '  * start-repl',
        '  * start-server',
        '',
        'For more information on a specific command, run:',
        '',
        '  pinstripe COMMAND_NAME --help'
        ].join('\n'));
}));