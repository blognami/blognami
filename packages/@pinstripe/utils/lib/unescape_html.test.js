import test from 'node:test';
import assert from 'node:assert';

import { unescapeHtml } from './unescape_html.js';

test('unescapeHtml', () => {
    assert.equal(unescapeHtml('foo=apple&bar=pear'), 'foo=apple&bar=pear')
});
