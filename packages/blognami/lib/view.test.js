import test, { after } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { View } from './view.js';
import { Bundle } from './bundle.js';

const VIEW_NAME = '--beta/images/my logo.png';
const FILE_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0xff, 0xfe]);

const dirPath = mkdtempSync(join(tmpdir(), 'blognami-view-test-'));

after(() => rmSync(dirPath, { recursive: true, force: true }));

const modulesOf = name => Bundle.create(name).constructor.modules;
const naming = module => module.includes(JSON.stringify(VIEW_NAME));

test('a file-backed view is registered in the serviceWorker bundle and in neither client bundle', async () => {
    const filePath = join(dirPath, VIEW_NAME);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, FILE_BYTES);

    assert.equal(modulesOf('serviceWorker').some(naming), false);

    await View.importFile({ dirPath, filePath });

    const modules = modulesOf('serviceWorker').filter(naming);
    assert.equal(modules.length, 1);
    assert.match(modules[0], /View\.register\(/);
    assert.equal(modules[0].includes(`'content-type': "image/png"`), true);
    assert.equal(modules[0].includes(`[STATIC_ASSET_HEADER]: ${JSON.stringify(encodeURI(VIEW_NAME))}`), true);

    assert.equal(modulesOf('window').some(naming), false);
    assert.equal(modulesOf('clientServiceWorker').some(naming), false);

    const view = View.for(VIEW_NAME);
    assert.equal(view.isFileBacked, true);
    assert.deepEqual(view.featuresIsEnabledFor, ['beta']);
    const [status, headers, body] = await view.prototype.render();
    assert.equal(status, 200);
    assert.deepEqual(headers, { 'content-type': 'image/png' });
    assert.deepEqual(Buffer.concat(body), FILE_BYTES);
});
