import test from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import prebuiltAssets, { PREBUILT_ASSETS_DIR } from './prebuilt_assets.js';

const PATHNAME = '/_blognami/_shell/styles.css';

const withProjectRoot = async fn => {
    const rootPath = mkdtempSync(join(tmpdir(), 'prebuilt-assets-'));
    try {
        await fn(rootPath);
    } finally {
        rmSync(rootPath, { recursive: true, force: true });
    }
};

const writePrebuilt = (rootPath, contents) => {
    const filePath = join(rootPath, PREBUILT_ASSETS_DIR, PATHNAME);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, contents);
};

const contextFor = (environment, rootPath) => ({
    environment: Promise.resolve(environment),
    project: Promise.resolve({ rootPath }),
});

test("prebuiltAssets - production returns the prebuilt file's contents", () => withProjectRoot(async rootPath => {
    writePrebuilt(rootPath, 'prebuilt-css');
    assert.equal(await prebuiltAssets.read.call(contextFor('production', rootPath), PATHNAME), 'prebuilt-css');
}));

test("prebuiltAssets - production without the file returns undefined", () => withProjectRoot(async rootPath => {
    assert.equal(await prebuiltAssets.read.call(contextFor('production', rootPath), PATHNAME), undefined);
}));

for(const environment of ['development', 'test']){
    test(`prebuiltAssets - ${environment} ignores the prebuilt file`, () => withProjectRoot(async rootPath => {
        writePrebuilt(rootPath, 'prebuilt-css');
        assert.equal(await prebuiltAssets.read.call(contextFor(environment, rootPath), PATHNAME), undefined);
    }));
}
