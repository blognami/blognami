import test from 'node:test';
import assert from 'node:assert';

import cssBundler from './css_bundler.js';

test('cssBundler - build rejects naming bundle-static-assets', async () => {
    await assert.rejects(cssBundler.build(), /bundle-static-assets" or install @blognami\/bundler/);
});
