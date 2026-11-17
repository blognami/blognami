import test from 'node:test';
import assert from 'node:assert';

import jsBundler from './js_bundler.js';

test('jsBundler - build rejects naming bundle-static-assets', async () => {
    await assert.rejects(jsBundler.build('window'), /bundle-static-assets" or install @blognami\/bundler/);
});
