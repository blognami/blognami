import test from 'node:test';
import assert from 'node:assert';

import { ServiceFactory, importAll } from 'blognami';

import '../index.js';
import diskBlobStore from '../../../blob-store/lib/services/blob_store.js';
import cloudflareBlobStore from './blob_store.js';

test('on Node, with @blognami/cloudflare imported, blobStore is still the disk store', async () => {
    await importAll();

    assert.deepEqual(cloudflareBlobStore, {});
    assert.equal(ServiceFactory.for('blobStore').prototype.create, diskBlobStore.create);
});
