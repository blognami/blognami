
import { beforeEach, test, after } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { Workspace, reset } from './helpers.js';

// From the cwd, not this file: blognami-saas-demo re-runs this test with its own project root.
const outDir = resolve(process.cwd(), '../../build/static-assets');

const PATHNAMES = [
    '/_blognami/_shell/window.js',
    '/_blognami/_shell/window.js.map',
    '/_blognami/_shell/service_worker.js.map',
    '/_blognami/_shell/styles.css',
    '/service_worker.js'
];

beforeEach(reset);

after(() => rmSync(outDir, { recursive: true, force: true }));

test('bundle-static-assets writes each asset byte-for-byte as its URL serves it', async () => {
    rmSync(outDir, { recursive: true, force: true });

    // In-process rather than a spawned CLI: Bundle embeds its random tmp dir in the js comments and
    // the source maps, so two processes never serve the same bytes; one process shares the cached build.
    await Workspace.run(function(){
        return this.runCommand('bundle-static-assets');
    });

    for(const pathname of PATHNAMES){
        const [ responseStatus, , body ] = await Workspace.run(function(){
            return this.callHandler.handleCall({ _url: pathname });
        });
        assert.equal(responseStatus, 200, pathname);
        assert.equal(readFileSync(`${outDir}${pathname}`, 'utf8'), body.join(''), pathname);
    }
});

test('bundle-static-assets in production overwrites stale prebuilt files with on-the-fly bytes', async () => {
    rmSync(outDir, { recursive: true, force: true });
    for(const pathname of PATHNAMES){
        mkdirSync(dirname(`${outDir}${pathname}`), { recursive: true });
        writeFileSync(`${outDir}${pathname}`, `stale sentinel for ${pathname}`);
    }

    await Workspace.run(function(){
        this.serviceManager.intercept('environment', () => 'production');
        return this.runCommand('bundle-static-assets');
    });

    for(const pathname of PATHNAMES){
        const [ , , body ] = await Workspace.run(function(){
            return this.callHandler.handleCall({ _url: pathname });
        });
        const written = readFileSync(`${outDir}${pathname}`, 'utf8');
        assert.notEqual(written, `stale sentinel for ${pathname}`, pathname);
        assert.equal(written, body.join(''), pathname);
    }
});
