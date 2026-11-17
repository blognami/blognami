
import { beforeEach, test, after } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { Workspace, reset } from './helpers.js';
// Core's defaults, the "package not installed" branch: blognami's exports map allows only '.'.
import coreJsBundler from '../../../blognami/lib/services/js_bundler.js';
import coreCssBundler from '../../../blognami/lib/services/css_bundler.js';

// From the cwd, not this file: blognami-saas-demo re-runs this test with its own project root.
const outDir = resolve(process.cwd(), '../../build/static-assets');

const CONTENT_TYPES = {
    '/_blognami/_shell/window.js': 'text/javascript',
    '/_blognami/_shell/window.js.map': 'application/json',
    '/_blognami/_shell/service_worker.js.map': 'application/json',
    '/_blognami/_shell/styles.css': 'text/css',
    '/service_worker.js': 'text/javascript'
};

const PATHNAMES = Object.keys(CONTENT_TYPES);

const sentinelFor = pathname => `prebuilt sentinel for ${pathname}`;

const writeSentinels = pathnames => {
    rmSync(outDir, { recursive: true, force: true });
    for(const pathname of pathnames){
        const filePath = `${outDir}${pathname}`;
        mkdirSync(dirname(filePath), { recursive: true });
        writeFileSync(filePath, sentinelFor(pathname));
    }
};

const WITHOUT_PACKAGE = { jsBundler: coreJsBundler, cssBundler: coreCssBundler };

const fetchAsset = (pathname, environment, services = {}) => Workspace.run(async function(){
    if(environment) this.serviceManager.intercept('environment', () => environment);
    for(const [ name, service ] of Object.entries(services)) this.serviceManager.intercept(name, () => service);
    // useContext, so the call renders in this workspace and sees the intercept; without it handleCall starts a fresh one.
    const [ status, headers, body ] = await this.callHandler.handleCall({ _url: pathname }, true);
    return { status, contentType: headers['content-type'], body: body.join('') };
});

beforeEach(reset);

after(() => rmSync(outDir, { recursive: true, force: true }));

test('in production each asset URL serves its prebuilt file verbatim', async () => {
    writeSentinels(PATHNAMES);

    for(const pathname of PATHNAMES){
        const { status, contentType, body } = await fetchAsset(pathname, 'production');
        assert.equal(status, 200, pathname);
        assert.equal(contentType, CONTENT_TYPES[pathname], pathname);
        assert.equal(body, sentinelFor(pathname), pathname);
    }
});

test('in test each asset URL builds on the fly even when a prebuilt file exists', async () => {
    writeSentinels(PATHNAMES);

    for(const pathname of PATHNAMES){
        const { status, contentType, body } = await fetchAsset(pathname);
        assert.equal(status, 200, pathname);
        assert.equal(contentType, CONTENT_TYPES[pathname], pathname);
        assert.notEqual(body, sentinelFor(pathname), pathname);
        assert.ok(body.length > 0, pathname);
    }
});

test('in production an asset URL whose prebuilt file is missing builds on the fly', async () => {
    const [ missing, ...present ] = PATHNAMES;
    writeSentinels(present);

    const onTheFly = await fetchAsset(missing);
    const { status, contentType, body } = await fetchAsset(missing, 'production');
    assert.equal(status, 200);
    assert.equal(contentType, CONTENT_TYPES[missing]);
    assert.equal(body, onTheFly.body);
});

test('in production with no prebuilt files and the package loaded each asset URL builds on the fly, window.js minified', async () => {
    rmSync(outDir, { recursive: true, force: true });

    for(const pathname of PATHNAMES){
        const { status, contentType, body } = await fetchAsset(pathname, 'production');
        assert.equal(status, 200, pathname);
        assert.equal(contentType, CONTENT_TYPES[pathname], pathname);
        assert.ok(body.length > 0, pathname);
    }

    // NODE_ENV, not the environment service, drives minify; the bundler caches per name, so force a rebuild each way.
    const windowJs = '/_blognami/_shell/window.js';
    const rebuildWindow = () => Workspace.run(function(){ return this.jsBundler.build('window', { force: true }); });
    const unminified = (await fetchAsset(windowJs, 'production')).body;
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
        await rebuildWindow();
        const minified = (await fetchAsset(windowJs, 'production')).body;
        assert.ok(minified.length < unminified.length);
    } finally {
        process.env.NODE_ENV = originalNodeEnv;
        await rebuildWindow();
    }
});

test('in production with no prebuilt files and the package not loaded each asset URL fails naming bundle-static-assets', async () => {
    rmSync(outDir, { recursive: true, force: true });

    for(const pathname of PATHNAMES){
        await assert.rejects(fetchAsset(pathname, 'production', WITHOUT_PACKAGE), /bundle-static-assets/, pathname);
    }
});

test('in production with prebuilt files and the package not loaded each asset URL serves its file', async () => {
    writeSentinels(PATHNAMES);

    for(const pathname of PATHNAMES){
        const { status, contentType, body } = await fetchAsset(pathname, 'production', WITHOUT_PACKAGE);
        assert.equal(status, 200, pathname);
        assert.equal(contentType, CONTENT_TYPES[pathname], pathname);
        assert.equal(body, sentinelFor(pathname), pathname);
    }
});
