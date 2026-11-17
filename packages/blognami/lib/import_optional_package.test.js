import test from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { importOptionalPackage } from './import_optional_package.js';

const writeModule = (t, source) => {
    const dir = mkdtempSync(join(realpathSync(tmpdir()), 'blognami-import-optional-package-test-'));
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    const path = join(dir, 'index.mjs');
    writeFileSync(path, source);
    return pathToFileURL(path).href;
};

test('importOptionalPackage returns undefined when the package itself is missing', async () => {
    assert.equal(await importOptionalPackage('@blognami/does-not-exist'), undefined);
});

test('importOptionalPackage rethrows a module-not-found raised inside an existing module', async t => {
    const url = writeModule(t, `import '@blognami/does-not-exist';\n`);
    await assert.rejects(importOptionalPackage(url), { code: 'ERR_MODULE_NOT_FOUND' });
});

test('importOptionalPackage rethrows any other error', async t => {
    const url = writeModule(t, `throw new Error('boom');\n`);
    await assert.rejects(importOptionalPackage(url), { message: 'boom' });
});
