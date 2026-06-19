import test from 'node:test';
import assert from 'node:assert';

import { StringScanner } from './string_scanner.js';

// ---------------------------------------------------------------------------
// Construction, length, toString.
// ---------------------------------------------------------------------------
test('length and toString reflect the remaining string', () => {
    const scanner = new StringScanner('abc');
    assert.equal(scanner.length, 3);
    assert.equal(scanner.toString(), 'abc');
    assert.equal(`${scanner}`, 'abc');
});

test('a null/undefined input is coerced to an empty string', () => {
    assert.equal(new StringScanner().length, 0);
    assert.equal(new StringScanner(null).length, 0);
    assert.equal(new StringScanner(undefined).toString(), '');
});

test('a non-string input is coerced via toString', () => {
    assert.equal(new StringScanner(42).toString(), '42');
});

// ---------------------------------------------------------------------------
// scan — match at the cursor and advance.
// ---------------------------------------------------------------------------
test('scan matches at the cursor and advances past the match', () => {
    const scanner = new StringScanner('foobar');
    const match = scanner.scan(/^foo/);
    assert.equal(match[0], 'foo');
    assert.equal(scanner.toString(), 'bar');
    assert.equal(scanner.length, 3);
});

test('scan returns capture groups', () => {
    const scanner = new StringScanner('key=value');
    const match = scanner.scan(/^(\w+)=(\w+)/);
    assert.equal(match[1], 'key');
    assert.equal(match[2], 'value');
});

test('scan returns null and does not advance on no match', () => {
    const scanner = new StringScanner('foobar');
    assert.equal(scanner.scan(/^bar/), null);
    assert.equal(scanner.toString(), 'foobar');
    assert.equal(scanner.length, 6);
});

test('scan is anchored — a later match does not advance the cursor', () => {
    const scanner = new StringScanner('xfoo');
    assert.equal(scanner.scan(/^foo/), null);
    assert.equal(scanner.toString(), 'xfoo');
});

test('repeated scans walk the whole string', () => {
    const scanner = new StringScanner('ab');
    assert.equal(scanner.scan(/^a/)[0], 'a');
    assert.equal(scanner.scan(/^b/)[0], 'b');
    assert.equal(scanner.length, 0);
    assert.equal(scanner.scan(/^./), null);
});

// ---------------------------------------------------------------------------
// match — like scan, but never advances (renamed from `check`).
// ---------------------------------------------------------------------------
test('match returns the match without advancing', () => {
    const scanner = new StringScanner('foobar');
    const match = scanner.match(/^foo/);
    assert.equal(match[0], 'foo');
    assert.equal(scanner.toString(), 'foobar');
    assert.equal(scanner.length, 6);
});

test('match returns null on no match', () => {
    assert.equal(new StringScanner('foo').match(/^bar/), null);
});

// ---------------------------------------------------------------------------
// scanLine — consume one line + its terminator, return the content.
// ---------------------------------------------------------------------------
test('scanLine returns the line content without the newline and consumes it', () => {
    const scanner = new StringScanner('one\ntwo\n');
    assert.equal(scanner.scanLine(), 'one');
    assert.equal(scanner.toString(), 'two\n');
    assert.equal(scanner.scanLine(), 'two');
    assert.equal(scanner.length, 0);
});

test('scanLine handles a final line with no trailing newline', () => {
    const scanner = new StringScanner('last');
    assert.equal(scanner.scanLine(), 'last');
    assert.equal(scanner.length, 0);
});

test('scanLine returns an empty string for a blank line and consumes the newline', () => {
    const scanner = new StringScanner('\nnext');
    assert.equal(scanner.scanLine(), '');
    assert.equal(scanner.toString(), 'next');
});

// ---------------------------------------------------------------------------
// matchLine — peek at the next line's content, no consume.
// ---------------------------------------------------------------------------
test('matchLine returns the next line content without consuming', () => {
    const scanner = new StringScanner('one\ntwo');
    assert.equal(scanner.matchLine(), 'one');
    assert.equal(scanner.toString(), 'one\ntwo');
});

test('matchLine returns an empty string at a newline', () => {
    assert.equal(new StringScanner('\nrest').matchLine(), '');
});

// ---------------------------------------------------------------------------
// consumedString — the prefix consumed so far.
// ---------------------------------------------------------------------------
test('consumedString grows as the cursor advances', () => {
    const scanner = new StringScanner('foobar');
    assert.equal(scanner.consumedString, '');
    scanner.scan(/^foo/);
    assert.equal(scanner.consumedString, 'foo');
    scanner.scan(/^bar/);
    assert.equal(scanner.consumedString, 'foobar');
});

// ---------------------------------------------------------------------------
// previousChar — the char immediately left of the cursor.
// ---------------------------------------------------------------------------
test('previousChar is empty at the start, then the char left of the cursor', () => {
    const scanner = new StringScanner('ab');
    assert.equal(scanner.previousChar, '');
    scanner.scan(/^a/);
    assert.equal(scanner.previousChar, 'a');
    scanner.scan(/^b/);
    assert.equal(scanner.previousChar, 'b');
});

// ---------------------------------------------------------------------------
// line — 1-based line of the cursor, derived from consumed newlines.
// ---------------------------------------------------------------------------
test('line starts at 1 and counts consumed newlines', () => {
    const scanner = new StringScanner('a\nb\nc');
    assert.equal(scanner.line, 1);
    scanner.scan(/^a\n/);
    assert.equal(scanner.line, 2);
    scanner.scan(/^b\n/);
    assert.equal(scanner.line, 3);
});

test('line counts every newline in a single multi-line scan', () => {
    const scanner = new StringScanner('a\nb\nc\nd');
    scanner.scan(/^a\nb\nc\n/);
    assert.equal(scanner.line, 4);
});
