/**
 * @jest-environment jsdom
 */

import { unescapeHtml } from './unescape_html';

test('unescapeHtml', () => {
    expect(unescapeHtml('foo=apple&bar=pear')).toBe('foo=apple&bar=pear')
});
