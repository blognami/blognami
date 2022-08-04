
import { Url } from './url'

test('constructor has expected defaults', () => {
    expect(new Url().toString()).toBe('http://localhost/')
});

[
    {
        fromStringArgs: ['?fruit=pear', 'http://localhost/example?fruit=apple'],
        expectedToStringOutput: 'http://localhost/example?fruit=pear'
    },
    {
        fromStringArgs: ['?page=2&q=1', 'http://localhost:3000/posts?page=1&q=1'],
        expectedToStringOutput: 'http://localhost:3000/posts?page=2&q=1'
    },
    {
        fromStringArgs: ['&foo=bar', 'http://localhost/example?fruit=apple'],
        expectedToStringOutput: 'http://localhost/example?fruit=apple&foo=bar'
    },
].forEach(({ fromStringArgs, expectedToStringOutput }, i) => {
    test(`fromString works as expected (${i})`, () => expect(
        Url.fromString(...fromStringArgs).toString()).toBe(expectedToStringOutput)
    );
});
