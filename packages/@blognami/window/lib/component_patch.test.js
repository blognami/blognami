import test from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

import { MarkupNode } from './markup_node.js';

// component.js reads DOM globals at module-evaluation time (the matchesSelector
// IIFE touches document), so the globals must exist before it is imported —
// hence the jsdom setup here and the dynamic import below.
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
for(const name of ['window', 'document', 'DocumentType', 'SVGElement', 'MutationObserver', 'CustomEvent', 'Node', 'Element']){
    globalThis[name] = dom.window[name];
}

const { Component } = await import('./component.js');

// Patch a fresh, detached element from an HTML string (the existing branch).
const patchFromHtml = (html, tag) => {
    const node = document.createElement(tag);
    Component.instanceFor(node).patch(html);
    return node.innerHTML;
};

// Patch a fresh, detached element from a deserialized MarkupNode — mirroring the
// worker → window round-trip (parse, serialize, deserialize, patch the node).
const patchFromNode = (html, tag) => {
    const node = document.createElement(tag);
    const markupNode = MarkupNode.deserialize(new MarkupNode().appendHtml(html).serialize());
    Component.instanceFor(node).patch(markupNode);
    return node.innerHTML;
};

// Representative fixtures: a frame body, <head> children, and text/comment/
// doctype/void edge nodes. Each must patch to byte-identical DOM via both paths.
[
    ['frame body', 'div', '<div class="card"><h1>Title</h1><p>Hello <strong>world</strong> &amp; more</p><a href="/x">link</a><form><input name="q"></form></div>'],
    ['head children', 'head', '<title>Hi</title><meta charset="utf-8"><link rel="stylesheet" href="/a.css"><script src="/a.js"></script>'],
    ['text/comment/doctype edges', 'div', '<!DOCTYPE html>Hello <!-- note --> world<br>end'],
].forEach(([label, tag, html]) => {
    test(`patch(MarkupNode) matches patch(html): ${label}`, () => {
        const fromHtml = patchFromHtml(html, tag);
        assert.ok(fromHtml.length > 0, 'fixture should produce non-empty DOM');
        assert.strictEqual(patchFromNode(html, tag), fromHtml);
    });
});

test('virtual node filters fire on the MarkupNode patch path', () => {
    const component = Component.instanceFor(document.createElement('div'));
    let fired = false;
    component.addVirtualNodeFilter(function(node){
        fired = true;
        assert.strictEqual(this, node);
        assert.ok(node instanceof MarkupNode);
    });
    component.patch(MarkupNode.deserialize(new MarkupNode().appendHtml('<p>x</p>').serialize()));
    assert.ok(fired, 'registered filter should run on the node path');
});
