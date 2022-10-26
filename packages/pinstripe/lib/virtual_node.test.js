/**
 * @jest-environment jsdom
 */

import { VirtualNode } from './virtual_node';
import R from 'ramda';

[   
    {
        html: '<a class="&pound; ssdsd" href="?foo=apple&bar=pear">Test</a>',
        expectedProperties: {
            'children.length': 1,
            'children.0.type': 'a',
            'children.0.attributes.href': '?foo=apple&bar=pear',
            'children.0.children.length': 1
        }
    }
].forEach(({ html, expectedProperties }, i) => {
    const fragment = VirtualNode.fromString(html);
    for(const path in expectedProperties){
        test(`fromString (${i}, ${path})`, () => {
            expect(R.path(path.split(/\./), fragment)).toBe(expectedProperties[path]);
        });
    }
});
