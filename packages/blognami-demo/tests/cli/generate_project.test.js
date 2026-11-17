

import { afterEach, test, describe } from 'node:test';
import assert from 'node:assert';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`blognami generate-project`, () => inPackagesDir(() => {
    assert.equal(run(`npx blognami generate-project`).stderr, [
        'There was an error validating the command parameters:',
        '',
        '  * name: Must not be blank'
    ].join('\n'));
}));

test(`blognami generate-project --name generate-project-test`, () => inPackagesDir(() => {
    run(`npx blognami generate-project --name generate-project-test`);
    assert.ok(run(`ls`).stdout.includes(`generate-project-test`), `Project directory not created`);
}));

const claudeMd = [
    '# CLAUDE.md',
    '',
    '@node_modules/@blognami/docs/AGENT_GUIDE.md'
].join('\n');

function assertAgentGuide(name){
    assert.equal(run(`cat ${name}/CLAUDE.md`).stdout, claudeMd);
    const { dependencies, devDependencies } = JSON.parse(run(`cat ${name}/package.json`).stdout);
    assert.ok(devDependencies['@blognami/docs'], `@blognami/docs is not a devDependency`);
    assert.equal(dependencies?.['@blognami/docs'], undefined);
}

test(`blognami generate-project --name generate-project-test (agent guide)`, () => inPackagesDir(() => {
    run(`npx blognami generate-project --name generate-project-test`);
    assertAgentGuide(`generate-project-test`);
}));

test(`blognami generate-project --name generate-project-core-test --core`, () => inPackagesDir(() => {
    run(`npx blognami generate-project --name generate-project-core-test --core`);
    assertAgentGuide(`generate-project-core-test`);
}));

test(`blognami generate-project --name generate-project-with-docs-test --with "@blognami/docs"`, () => inPackagesDir(() => {
    run(`npx blognami generate-project --name generate-project-with-docs-test --with "@blognami/docs"`);
    const libIndex = run(`cat generate-project-with-docs-test/lib/index.js`).stdout;
    assert.ok(libIndex.includes(`importAll`), `lib/index.js not generated`);
    assert.ok(!libIndex.includes(`@blognami/docs`), `lib/index.js imports @blognami/docs`);
}));
