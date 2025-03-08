
import { VirtualNode } from './virtual_node';

[   
    {
        html: '<a class="&pound; ssdsd" href="?foo=apple&bar=pear">Test</a>',
        expectedProperties: [
            [({ children }) => children.length, 1],
            [({ children }) => children[0].type, 'a'],
            [({ children }) => children[0].attributes.href, '?foo=apple&bar=pear'],
            [({ children }) => children[0].children.length, 1]
        ]
    },

    {
        html: `<img src="<svg>">`,
        expectedProperties: [
            [({ children }) => children[0].attributes.src, '<svg>'],
        ]
    }
].forEach(({ html, expectedProperties }, i) => {
    const fragment = VirtualNode.fromString(html);
    expectedProperties.forEach(([selector, expectedValue]) => {
        test(`fromString (${i})`, () => {
            expect(selector(fragment)).toBe(expectedValue);
        });
    })
});
