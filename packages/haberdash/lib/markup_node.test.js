import test from 'node:test';
import assert from 'node:assert';
import { Worker } from 'node:worker_threads';

import { MarkupNode, parseHtml, parseMarkdown, renderMarkdown } from './markup_node.js';

const roundTrip = async html => (await MarkupNode.fromHtml(html)).toString();
const render = async src => (await parseMarkdown(src).render()).toString();

// ---------------------------------------------------------------------------
// HTML parsing — appendHtml / fromHtml round-trips.
// ---------------------------------------------------------------------------
[
    ['<p>Hello world!</p>', '<p>Hello world!</p>'],
    ['<div><span>x</span></div>', '<div><span>x</span></div>'],
    ['<br>', '<br>'],
    ['<br/>', '<br>'],
    ['<br />', '<br>'],
    ['<input disabled>', '<input disabled>'],
    ['<input disabled required>', '<input disabled required>'],
    ['<a x="1" y="2">z</a>', '<a x="1" y="2">z</a>'],
    ['<p>5 &lt; 10 &amp; rising</p>', '<p>5 &lt; 10 &amp; rising</p>'],
    ['<a href="?foo=apple&bar=pear">Test</a>', '<a href="?foo=apple&amp;bar=pear">Test</a>'],
    ['<img src="<svg>">', '<img src="&lt;svg&gt;">'],
    // attribute quoting is normalised to double quotes
    ["<a href='x'>y</a>", '<a href="x">y</a>'],
    ['<a href=x>y</a>', '<a href="x">y</a>'],
    // tag names are lower-cased
    ['<DIV>x</DIV>', '<div>x</div>'],
    // doctype, comments
    ['<!DOCTYPE html><html></html>', '<!DOCTYPE html><html></html>'],
    ['<!-- hi -->', '<!-- hi -->'],
    ['<!-- a < b -->', '<!-- a &lt; b -->'],
    ['<p>a<!--c-->b</p>', '<p>a<!--c-->b</p>'],
    // text-only tags keep their contents verbatim (no entity escaping)
    ['<script>if (a < b) {}</script>', '<script>if (a < b) {}</script>'],
    ['<style>a{color:red}</style>', '<style>a{color:red}</style>'],
    // a doctype is only honoured at the root, dropped when nested
    ['<p><!DOCTYPE html></p>', '<p></p>'],
].forEach(([input, expected]) => {
    test(`round-trips ${input}`, async () => {
        assert.equal(await roundTrip(input), expected);
    });
});

// ---------------------------------------------------------------------------
// HTML normalisation — the CloseTag unwinding repairs malformed nesting.
// ---------------------------------------------------------------------------
[
    ['<b>a<i>b</b>c</i>', '<b>a<i>b</i></b>c'],   // overlap closed in order
    ['</div>hi', 'hi'],                            // unmatched close discarded
    ['<p>a', '<p>a</p>'],                          // unclosed tag auto-closed
].forEach(([input, expected]) => {
    test(`normalises ${input}`, async () => {
        assert.equal(await roundTrip(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Public surface — text, traverse, appendNode, parseHtml.
// ---------------------------------------------------------------------------
test('text concatenates descendant text in document order', async () => {
    assert.equal((await MarkupNode.fromHtml('<div>a<span>b<i>c</i></span>d</div>')).text, 'abcd');
});

test('traverse visits every node', async () => {
    const root = await MarkupNode.fromHtml('<ul><li>a</li><li>b</li></ul>');
    let items = 0;
    let texts = 0;
    root.traverse(node => {
        if(node.type == 'li') items++;
        if(node.type == '#text') texts++;
    });
    assert.equal(items, 2);
    assert.equal(texts, 2);
});

test('appendNode builds a tree that serialises to HTML', () => {
    const fragment = new MarkupNode();
    fragment.appendNode('p', { class: 'c' }).appendNode('#text', { value: 'hi' });
    assert.equal(fragment.toString(), '<p class="c">hi</p>');
});

test('parseHtml parses plain HTML by default', async () => {
    assert.equal((await parseHtml('a *b*')).toString(), 'a *b*');
});

test('fromHtml parses HTML', async () => {
    assert.equal((await MarkupNode.fromHtml('a *b*')).toString(), 'a *b*');
});

test('fromMarkdown parses Markdown', async () => {
    assert.equal((await MarkupNode.fromMarkdown('# Hi').render()).toString(), '<h1>Hi</h1>');
});

test('renderMarkdown renders and sanitises by default', async () => {
    assert.equal(await MarkupNode.renderMarkdown('# Hi'), '<h1>Hi</h1>');
    assert.equal(await MarkupNode.renderMarkdown('a <b>x</b>'), '<p>a &lt;b&gt;x&lt;/b&gt;</p>');
});

test('renderMarkdown skips sanitising when sanitize is false', async () => {
    assert.equal(await MarkupNode.renderMarkdown('a <b>x</b>', { sanitize: false }), '<p>a <b>x</b></p>');
});

test('renderMarkdown is exposed as a helper', async () => {
    assert.equal(await renderMarkdown('# Hi'), '<h1>Hi</h1>');
});

// ---------------------------------------------------------------------------
// Inline Markdown — target behaviour from MARKDOWN_PARSER_DESIGN.md.
// Each input is wrapped in a paragraph by the block parser.
// ---------------------------------------------------------------------------
[
    ['*foo*', '<p><em>foo</em></p>'],
    ['**bar**', '<p><strong>bar</strong></p>'],
    ['*foo **bar** baz*', '<p><em>foo <strong>bar</strong> baz</em></p>'],
    ['***x***', '<p><em><strong>x</strong></em></p>'],
    ['***foo*** bar', '<p><em><strong>foo</strong></em> bar</p>'],
    ['_foo_', '<p><em>foo</em></p>'],
    ['__foo__', '<p><strong>foo</strong></p>'],
    ['_(foo)_', '<p><em>(foo)</em></p>'],
    // `*` may emphasise intraword; `_` may not (the canSplitWord guard)
    ['a*b*c', '<p>a<em>b</em>c</p>'],
    ['a**b**c', '<p>a<strong>b</strong>c</p>'],
    ['foo_bar_baz', '<p>foo_bar_baz</p>'],
    ['a__b__c', '<p>a__b__c</p>'],
    // a lone delimiter surrounded by whitespace is literal
    ['a * b', '<p>a * b</p>'],
    // overlap with raw HTML is normalised by the tree builder
    ['*a <span>b*</span>', '<p><em>a <span>b</span></em></p>'],
    // raw HTML passes through inline content
    ['text <strong>raw</strong> more', '<p>text <strong>raw</strong> more</p>'],
    ['a <br> b', '<p>a <br> b</p>'],
    // code spans — literal content, longest-run delimiters, space stripping
    ['`<b>x</b>`', '<p><code>&lt;b&gt;x&lt;/b&gt;</code></p>'],
    ['``a`b``', '<p><code>a`b</code></p>'],
    ['`unclosed', '<p>`unclosed</p>'],
    // links and images
    ['[a *b* c](/u)', '<p><a href="/u">a <em>b</em> c</a></p>'],
    ['[**b**](/u)', '<p><a href="/u"><strong>b</strong></a></p>'],
    ['[t](/u?x=1&y=2)', '<p><a href="/u?x=1&amp;y=2">t</a></p>'],
    ['![alt](/img.png)', '<p><img src="/img.png" alt="alt"></p>'],
    ['[text]', '<p>[text]</p>'],
    // backslash escapes
    ['\\*not emphasis\\*', '<p>*not emphasis*</p>'],
    ['\\`code\\`', '<p>`code`</p>'],
    ['\\[x\\]', '<p>[x]</p>'],
    ['a\\\\b', '<p>a\\b</p>'],
].forEach(([input, expected]) => {
    test(`renders ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Long emphasis runs — 4+ delimiters decompose strong-greedy.
// ---------------------------------------------------------------------------
[
    // 4 → strong+strong
    ['****x****', '<p><strong><strong>x</strong></strong></p>'],
    // underscore variant (non-intraword)
    ['____x____', '<p><strong><strong>x</strong></strong></p>'],
    // length-3 special case still gives bold-italic (em outside strong)
    ['***x***', '<p><em><strong>x</strong></em></p>'],
    // 1–2 unchanged
    ['**x**', '<p><strong>x</strong></p>'],
    ['*x*', '<p><em>x</em></p>'],
    // asymmetric run — closes the inner strong, outer strong returns naturally;
    // documented best-effort output (no crash)
    ['****x**', '<p><strong><strong>x</strong></strong></p>'],
].forEach(([input, expected]) => {
    test(`renders long emphasis ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Autolinks — CommonMark `<scheme://...>` and `<email>` → markdown-link.
// ---------------------------------------------------------------------------
[
    ['<https://example.com>', '<p><a href="https://example.com">https://example.com</a></p>'],
    ['<foo@bar.com>', '<p><a href="mailto:foo@bar.com">foo@bar.com</a></p>'],
    // a real HTML tag is NOT an autolink — see the HTML-block section below for
    // how `<div>x</div>` is handled at block start
    // an unpaired `<` that is neither a tag nor an autolink stays literal
    ['a < b', '<p>a &lt; b</p>'],
].forEach(([input, expected]) => {
    test(`renders autolink ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Top-level HTML blocks — a line beginning with a block-level tag / comment /
// declaration starts a raw HTML block, emitted UNWRAPPED (no <p>) and consumed
// up to a blank line. Content is parsed as plain HTML, so Markdown inside stays
// literal. Inline tags (`<em>`, `<br>`) at line start are NOT block triggers —
// they remain paragraph content. Autolinks (`<https://…>`, `<a@b.com>`) and
// bare `a < b` are excluded — see the autolink section above.
// ---------------------------------------------------------------------------
[
    ['<div>x</div>', '<div>x</div>'],
    ['<div class="note">hi</div>', '<div class="note">hi</div>'],   // attributes preserved
    ['<div>**hi**</div>', '<div>**hi**</div>'],                     // raw — markdown not processed
    // multi-line, well-formed HTML round-trips (interior newlines preserved)
    [
        '<figure>\n<img src="a.png">\n<figcaption>Hi</figcaption>\n</figure>',
        '<figure>\n<img src="a.png">\n<figcaption>Hi</figcaption>\n</figure>'
    ],
    ['<!-- note -->', '<!-- note -->'],                             // comment block
    ['text\n<div>x</div>', '<p>text</p><div>x</div>'],              // a block interrupts a paragraph
    ['<div>a</div>\n\n<div>b</div>', '<div>a</div><div>b</div>'],   // blank line separates
    // an inline tag at line start is NOT a block trigger — stays wrapped
    ['<em>hi</em> and more', '<p><em>hi</em> and more</p>'],
    // recursive: an HTML block inside a blockquote container
    ['> <div>x</div>', '<blockquote><div>x</div></blockquote>'],
].forEach(([input, expected]) => {
    test(`renders HTML block ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Linkify — bare http(s):// URLs and emails in prose text runs.
// ---------------------------------------------------------------------------
[
    ['see https://example.com now', '<p>see <a href="https://example.com">https://example.com</a> now</p>'],
    ['mail me at foo@bar.com', '<p>mail me at <a href="mailto:foo@bar.com">foo@bar.com</a></p>'],
    // a URL inside a code span is not linkified
    ['`https://x.com`', '<p><code>https://x.com</code></p>'],
].forEach(([input, expected]) => {
    test(`renders linkified ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Link & image titles and angle-bracket / spaced destinations.
// ---------------------------------------------------------------------------
[
    ['[t](/u "the title")', '<p><a href="/u" title="the title">t</a></p>'],
    ['![a](/i.png "cap")', '<p><img src="/i.png" alt="a" title="cap"></p>'],
    ['[t](</a b>)', '<p><a href="/a%20b">t</a></p>'],
    // no-title regression
    ['[t](/u)', '<p><a href="/u">t</a></p>'],
    // single-quote title
    ["[t](/u 'the title')", '<p><a href="/u" title="the title">t</a></p>'],
    // paren-delimited title
    ['[t](/u (paren title))', '<p><a href="/u" title="paren title">t</a></p>'],
    // `[text]` with no `(...)` stays literal
    ['[text]', '<p>[text]</p>'],
    // malformed destination falls back to literal — no corruption
    ['[t](/u "broken)', '<p>[t](/u &quot;broken)</p>'],
].forEach(([input, expected]) => {
    test(`renders link/image title ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Strikethrough — GFM `~~text~~` → `<s>text</s>`.
// ---------------------------------------------------------------------------
[
    ['~~gone~~', '<p><s>gone</s></p>'],
    // a lone `~` is literal (GFM strikethrough requires `~~`)
    ['a ~ b', '<p>a ~ b</p>'],
    // composes with emphasis
    ['~~*x*~~', '<p><s><em>x</em></s></p>'],
    // unpaired `~~` stays literal
    ['~~', '<p>~~</p>'],
].forEach(([input, expected]) => {
    test(`renders strikethrough ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Hard line breaks — 2+ trailing spaces or `\` before `\n` → `<br>`.
// ---------------------------------------------------------------------------
[
    // two-trailing-spaces form: `<br>` is present (the hard-break absorbs the
    // newline; an inter-`\n` `<br>\nb` would also be acceptable)
    ['a  \nb', '<p>a<br>b</p>'],
    // backslash form: `\` immediately before `\n` → `<br>`
    ['a\\\nb', '<p>a<br>b</p>'],
    // a single newline with no trailing spaces or backslash stays a soft break
    ['a\nb', '<p>a\nb</p>'],
    // a trailing `\` with no following newline stays literal (already correct)
    ['a\\', '<p>a\\</p>'],
].forEach(([input, expected]) => {
    test(`renders hard break ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Block Markdown.
// ---------------------------------------------------------------------------
[
    ['# Heading', '<h1>Heading</h1>'],
    ['### A *b*', '<h3>A <em>b</em></h3>'],
    ['# a\n## b\n###### f', '<h1>a</h1><h2>b</h2><h6>f</h6>'],
    ['## h ##', '<h2>h</h2>'],          // trailing hashes stripped
    ['##', '<h2></h2>'],                // empty heading
    ['#notheading', '<p>#notheading</p>'], // no space → paragraph
    ['---', '<hr>'],
    ['***', '<hr>'],
    ['___', '<hr>'],
    ['> quoted', '<blockquote><p>quoted</p></blockquote>'],
    ['> a\n> b', '<blockquote><p>a\nb</p></blockquote>'],
    ['> # h\n> text', '<blockquote><h1>h</h1><p>text</p></blockquote>'],
    ['- one\n- two', '<ul><li>one</li><li>two</li></ul>'],
    ['- a\n- b\n- c', '<ul><li>a</li><li>b</li><li>c</li></ul>'],
    ['1. one\n2. two', '<ol><li>one</li><li>two</li></ol>'],
    ['1) a\n2) b', '<ol><li>a</li><li>b</li></ol>'],
    ['```\n<b>code</b>\n```', '<pre><code>&lt;b&gt;code&lt;/b&gt;</code></pre>'],
    ['```js\nx\n```', '<pre><code class="language-js">x</code></pre>'],   // info string → class
    ['```js foo bar\nx\n```', '<pre><code class="language-js">x</code></pre>'], // first token only
    ['~~~\ncode\n~~~', '<pre><code>code</code></pre>'], // tilde fence
    ['~~~js\nx\n~~~', '<pre><code class="language-js">x</code></pre>'], // tilde fence + lang
    ['a\nb\nc', '<p>a\nb\nc</p>'],                     // lazy paragraph lines
    ['a\n\nb', '<p>a</p><p>b</p>'],                    // blank line splits
    ['one\n\ntwo\n\nthree', '<p>one</p><p>two</p><p>three</p>'],
    ['text\n# h', '<p>text</p><h1>h</h1>'],            // block interrupts paragraph
    ['# Title\n\npara\n\n- x\n- y', '<h1>Title</h1><p>para</p><ul><li>x</li><li>y</li></ul>'],
].forEach(([input, expected]) => {
    test(`renders block ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Fenced code blocks — closing fence detection and content fidelity. The
// regression: a block must stop at its closing fence, not swallow the rest of
// the document. CRLF / CR line endings are normalised so a trailing `\r` can't
// leave the closing fence unmatched (the original bug: CRLF form POSTs).
// ---------------------------------------------------------------------------
[
    // closes at its fence — does not grab the following paragraph
    ['```\ncode\n```\n\nafter', '<pre><code>code</code></pre><p>after</p>'],
    // CRLF / CR line endings still close the fence
    ['```\r\ncode\r\n```\r\n\r\nafter', '<pre><code>code</code></pre><p>after</p>'],
    ['```\rcode\r```\r\rafter', '<pre><code>code</code></pre><p>after</p>'],
    // two consecutive blocks stay separate
    ['```\na\n```\n\n```\nb\n```', '<pre><code>a</code></pre><pre><code>b</code></pre>'],
    // interior blank lines are preserved verbatim
    ['```\na\n\nb\n```', '<pre><code>a\n\nb</code></pre>'],
    // markdown-looking content inside a fence stays literal
    ['```\n# not a heading\n- not a list\n```', '<pre><code># not a heading\n- not a list</code></pre>'],
    // a longer fence holds a shorter backtick run as content
    ['````\n```\ninner\n```\n````', '<pre><code>```\ninner\n```</code></pre>'],
    // closing fence may be longer than the opening, and may carry trailing spaces
    ['```\ncode\n`````', '<pre><code>code</code></pre>'],
    ['```\ncode\n```   ', '<pre><code>code</code></pre>'],
    // an unclosed fence runs to end of input
    ['```\ncode never closed', '<pre><code>code never closed</code></pre>'],
    // a `~~~` fence holds backtick fences as literal content
    ['~~~\n```\n~~~', '<pre><code>```</code></pre>'],
    // empty code block
    ['```\n```', '<pre><code></code></pre>'],
].forEach(([input, expected]) => {
    test(`renders fenced code ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Setext headings — a `===` / `---` underline after a paragraph line.
// The `-----` form must beat startsBlock's thematic-break reclassification.
// ---------------------------------------------------------------------------
[
    ['Title\n=====', '<h1>Title</h1>'],
    ['Title\n-----', '<h2>Title</h2>'],
    // a `---` / `***` with no preceding paragraph still yields a thematic break
    ['---', '<hr>'],
    ['***', '<hr>'],
].forEach(([input, expected]) => {
    test(`renders setext ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Indented code blocks — 4 spaces / 1 tab at block start → `<pre><code>`.
// The rule is absent from startsBlock, so an indented line right after
// paragraph text stays part of the paragraph (cannot interrupt).
// ---------------------------------------------------------------------------
[
    ['    code line\n    code two', '<pre><code>code line\ncode two\n</code></pre>'],
    // a 4-space line immediately after paragraph text does not interrupt
    ['para\n    not code', '<p>para\n    not code</p>'],
].forEach(([input, expected]) => {
    test(`renders indented code ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Lazy continuation — an unprefixed non-block line folds into an open
// blockquote's paragraph; a blank line or real block start ends the quote.
// ---------------------------------------------------------------------------
[
    ['> a\nb', '<blockquote><p>a\nb</p></blockquote>'],
    ['> a\n\nb', '<blockquote><p>a</p></blockquote><p>b</p>'],
    ['> a\n# H', '<blockquote><p>a</p></blockquote><h1>H</h1>'],
    ['> > a', '<blockquote><blockquote><p>a</p></blockquote></blockquote>'],
].forEach(([input, expected]) => {
    test(`renders lazy continuation ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Rich lists — nested, loose/tight, multi-block items.
// ---------------------------------------------------------------------------
[
    ['- a\n  - b\n  - c', '<ul><li>a<ul><li>b</li><li>c</li></ul></li></ul>'],
    ['- a\n\n- b', '<ul><li><p>a</p></li><li><p>b</p></li></ul>'],
    ['- a\n\n  more', '<ul><li><p>a</p><p>more</p></li></ul>'],
    ['- ```\n  x\n  ```', '<ul><li><pre><code>x</code></pre></li></ul>'],
    ['- a\n  - b\n    - c', '<ul><li>a<ul><li>b<ul><li>c</li></ul></li></ul></li></ul>'],
    ['3. one\n4. two', '<ol start="3"><li>one</li><li>two</li></ol>'],
    ['1. one\n2. two', '<ol><li>one</li><li>two</li></ol>'],
].forEach(([input, expected]) => {
    test(`renders list ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Whitespace-only final line with no trailing newline — regression: these
// inputs (live editor states mid-keystroke) used to hang consumeMarkdown,
// because the blank-line branch required `\n` while startsBlock treated the
// line as blank, so the paragraph collector stopped without consuming.
// ---------------------------------------------------------------------------
[
    [' ', ''],
    ['Test\n ', '<p>Test</p>'],
    ['- Test\n ', '<ul><li>Test</li></ul>'],
    ['- Test\n  ', '<ul><li>Test</li></ul>'],
    ['> quote\n ', '<blockquote><p>quote</p></blockquote>'],
    // the keystroke after the hang state: `-` under a list item reads as a
    // setext underline, so the item content becomes an h2 (per CommonMark)
    ['- Test\n  -', '<ul><li><h2>Test</h2></li></ul>'],
].forEach(([input, expected]) => {
    test(`renders trailing whitespace ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Tables — GFM pipe tables.
// ---------------------------------------------------------------------------
[
    // basic 2-col table: header → thead/th, body → tbody/td
    [
        '| a | b |\n|---|---|\n| 1 | 2 |',
        '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
    ],
    // alignment: :-- left, :-: center, --: right → style="text-align:…"
    [
        '| a | b | c |\n|:--|:-:|--:|\n| 1 | 2 | 3 |',
        '<table><thead><tr><th style="text-align:left">a</th><th style="text-align:center">b</th><th style="text-align:right">c</th></tr></thead><tbody><tr><td style="text-align:left">1</td><td style="text-align:center">2</td><td style="text-align:right">3</td></tr></tbody></table>'
    ],
    // inline markdown inside a cell goes through the inline path
    [
        '| h |\n|---|\n| *x* |',
        '<table><thead><tr><th>h</th></tr></thead><tbody><tr><td><em>x</em></td></tr></tbody></table>'
    ],
    // |-leading line without a valid delimiter row stays a paragraph
    ['| not a table', '<p>| not a table</p>'],
    // ragged: extra body cells dropped
    [
        '| a | b |\n|---|---|\n| 1 | 2 | 3 |',
        '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
    ],
    // ragged: missing body cells empty
    [
        '| a | b |\n|---|---|\n| 1 |',
        '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td></td></tr></tbody></table>'
    ],
].forEach(([input, expected]) => {
    test(`renders table ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// IR and render() semantics.
// ---------------------------------------------------------------------------
test('emits markdown-* IR when render() is skipped', async () => {
    assert.equal(
        await parseMarkdown('Hello World!').toString(),
        '<markdown-paragraph>Hello World!</markdown-paragraph>'
    );
    assert.equal(
        await parseMarkdown('# Hi').toString(),
        '<markdown-heading level="1">Hi</markdown-heading>'
    );
});

test('render() mutates in place and returns the same node', async () => {
    const node = await parseMarkdown('*x*');
    assert.equal(await node.render(), node);
});

test('render() is idempotent', async () => {
    const node = await parseMarkdown('*foo*').render();
    assert.equal((await node.render()).toString(), '<p><em>foo</em></p>');
});

test('render() passes a non-Markdown tree through unchanged', async () => {
    assert.equal((await MarkupNode.fromHtml('<p>hi</p>').render()).toString(), '<p>hi</p>');
});

// render() fires beforeRender on the markdown-* tree and afterRender on the
// lowered HTML tree. Hooks are registered on a subclass so they don't leak into
// the other render tests; afterRender is async to prove render() awaits it.
test('render() fires beforeRender and afterRender hooks', async () => {
    const Subclass = MarkupNode.extend('Subclass');
    const seen = [];
    Subclass.addHook('beforeRender', function(){
        this.traverse(node => { if(node.type.startsWith('markdown-')) seen.push(node.type); });
    });
    Subclass.addHook('afterRender', async function(){
        await Promise.resolve();
        this.traverse(node => { if(node.type == 'h1') node.attributes.id = 'hooked'; });
    });
    const html = (await Subclass.fromMarkdown('# Hi').render()).toString();
    assert.deepEqual(seen, ['markdown-heading']);
    assert.equal(html, '<h1 id="hooked">Hi</h1>');
});

// ---------------------------------------------------------------------------
// Out-of-scope divergences — documented in MARKDOWN_PARSER_DESIGN.md as the
// price of reduced opener→closer pairing. Captured so regressions are visible.
// ---------------------------------------------------------------------------
[
    ['*foo *bar* baz*', '<p><em>foo <em>bar</em> baz</em></p>'], // same-delimiter nesting
    ['*foo**bar*', '<p><em>foo<strong>bar</strong></em></p>'],   // rule of 3
].forEach(([input, expected]) => {
    test(`diverges (out of scope) on ${JSON.stringify(input)}`, async () => {
        assert.equal(await render(input), expected);
    });
});

// ---------------------------------------------------------------------------
// Slash blocks — a single-line, top-level paragraph starting with `/` becomes a
// markdown-slash-block carrying its 1-based source line (plus parsed name/args).
// render() lowers it to a paragraph surfacing the line as data-line-number.
// ---------------------------------------------------------------------------
test('slash block renders as a paragraph with data-line-number', async () => {
    assert.equal(await render('/foo bar'), '<p data-line-number="1">/foo bar</p>');
    assert.equal(await render('/foo'), '<p data-line-number="1">/foo</p>');
});

test('slash block line number reflects its source position', async () => {
    assert.equal(await render('a\n\n/foo bar'), '<p>a</p><p data-line-number="3">/foo bar</p>');
});

test('slash block IR carries line, name and args', async () => {
    assert.equal(
        await parseMarkdown('/image foo bar').toString(),
        '<markdown-slash-block line="1" name="image" args="foo bar">/image foo bar</markdown-slash-block>'
    );
});

test('a slash line is only a slash block at top level', async () => {
    assert.equal(await render('- /foo'), '<ul><li>/foo</li></ul>');
    assert.equal(await render('> /foo'), '<blockquote><p>/foo</p></blockquote>');
});

test('a multi-line paragraph starting with / is not a slash block', async () => {
    assert.equal(await render('/foo\nbar'), '<p>/foo\nbar</p>');
});

// ---------------------------------------------------------------------------
// serialize / deserialize — full round-trip, attributes and text preserved.
// ---------------------------------------------------------------------------
[
    '<a href="/x" class="c">hi</a>',
    '<p>5 &lt; 10 &amp; rising</p>',
    '<ul><li>a</li><li>b</li></ul>',
    '<input disabled>',
    // text-only tags: deserialize must wire each child's parent to its real
    // node (not the class) so toString keeps the body verbatim, not escaped
    '<script>if (a < b) {}</script>',
    '<style>a{color:red}</style>',
].forEach(html => {
    test(`serialize round-trips ${html}`, async () => {
        const node = await MarkupNode.fromHtml(html);
        assert.equal(MarkupNode.deserialize(node.serialize()).toString(), html);
    });
});

// serialize preserves the safe flag the renderer set: the rendered <h1> still
// survives sanitize after a deserialize, while the raw <div> is still escaped.
test('serialize preserves the safe flag', async () => {
    const node = await parseMarkdown('# Hi\n\n<div>raw</div>').render();
    const restored = MarkupNode.deserialize(node.serialize());
    assert.equal(restored.sanitize().toString(), '<h1>Hi</h1>&lt;div&gt;raw&lt;/div&gt;');
});

// The node tree itself survives serialize() -> deserialize() byte-for-byte, not
// just its rendered HTML. One fixture covers every node kind the parse path
// produces — the root #fragment, #doctype, element nodes with attributes,
// #text, #comment, deep nesting — with the `safe` flag exercised both ways.
test('serialize/deserialize losslessly round-trips the node tree byte-for-byte', async () => {
    const node = await MarkupNode.fromHtml(
        '<!DOCTYPE html>' +
        '<html lang="en">' +
            '<head><!-- meta --><title>Docs</title></head>' +
            '<body>' +
                '<div id="a" class="b c" data-x="1">' +
                    '<p>Hello <strong>world</strong> &amp; <em>friends</em></p>' +
                    '<ul><li>one</li><li>two</li></ul>' +
                '</div>' +
            '</body>' +
        '</html>'
    );

    // The parse path leaves every node safe:false; flip a subtree to safe:true
    // so the round-trip exercises the flag in both states.
    node.traverse(n => { if(n.type == 'strong' || n.type == 'li') n.safe = true; });

    // Guard against vacuous coverage: the fixture must actually contain every
    // node kind and both `safe` states under test.
    const kinds = new Set();
    const safeStates = new Set();
    node.traverse(n => { kinds.add(n.type); safeStates.add(n.safe); });
    ['#fragment', '#doctype', '#comment', '#text', 'html', 'div'].forEach(kind => {
        assert.ok(kinds.has(kind), `fixture missing ${kind}`);
    });
    assert.ok(safeStates.has(true) && safeStates.has(false), 'fixture missing a safe state');

    const serialized = node.serialize();
    const restored = MarkupNode.deserialize(serialized);

    // byte-for-byte: re-serializing the restored tree yields identical JSON,
    // and its in-memory shape (type, attributes, safe, children) is identical.
    assert.equal(restored.serialize(), serialized);
    assert.deepStrictEqual(restored.toJSON(), node.toJSON());
});

// ---------------------------------------------------------------------------
// Kitchen sink — every feature composed in one document. Sections are defined
// as [markdown, html] pairs; the combined input is the markdown joined by blank
// lines, and the expected output is the html concatenated (block siblings
// serialise with no separator). The `##` / `###` headings double as separators
// that keep adjacent blocks independent — e.g. they stop two lists merging into
// one loose list. This exercises cross-feature composition over a single parse,
// which the per-feature tables above do not.
// ---------------------------------------------------------------------------
test('kitchen sink — every feature in one document', async () => {
    const sections = [
        ['# Kitchen Sink', '<h1>Kitchen Sink</h1>'],
        [
            'An intro with *em*, **strong**, ***both***, _u_, __U__, `code`, ~~strike~~, and an escaped \\* star.',
            '<p>An intro with <em>em</em>, <strong>strong</strong>, <em><strong>both</strong></em>, <em>u</em>, <strong>U</strong>, <code>code</code>, <s>strike</s>, and an escaped * star.</p>'
        ],
        ['Hard break here  \nand the next line.', '<p>Hard break here<br>and the next line.</p>'],
        ['Raw inline a <br> b html.', '<p>Raw inline a <br> b html.</p>'],
        ['## Links', '<h2>Links</h2>'],
        [
            'A [link](/u), a [titled](/u "the title") one, an ![alt](/img.png), an autolink <https://auto.example> and <a@b.example>, plus bare https://bare.example and mail@bare.example.',
            '<p>A <a href="/u">link</a>, a <a href="/u" title="the title">titled</a> one, an <img src="/img.png" alt="alt">, an autolink <a href="https://auto.example">https://auto.example</a> and <a href="mailto:a@b.example">a@b.example</a>, plus bare <a href="https://bare.example">https://bare.example</a> and <a href="mailto:mail@bare.example">mail@bare.example</a>.</p>'
        ],
        ['## HTML block', '<h2>HTML block</h2>'],
        ['<div class="callout">See the <b>docs</b>.</div>', '<div class="callout">See the <b>docs</b>.</div>'],
        ['## Quotes', '<h2>Quotes</h2>'],
        ['> # Quoted heading\n> body *text*', '<blockquote><h1>Quoted heading</h1><p>body <em>text</em></p></blockquote>'],
        ['> > nested quote', '<blockquote><blockquote><p>nested quote</p></blockquote></blockquote>'],
        ['## Lists', '<h2>Lists</h2>'],
        ['### Nested', '<h3>Nested</h3>'],
        ['- a\n  - b\n  - c', '<ul><li>a<ul><li>b</li><li>c</li></ul></li></ul>'],
        ['### Ordered', '<h3>Ordered</h3>'],
        ['3. one\n4. two', '<ol start="3"><li>one</li><li>two</li></ol>'],
        ['### Loose', '<h3>Loose</h3>'],
        ['- loose a\n\n- loose b', '<ul><li><p>loose a</p></li><li><p>loose b</p></li></ul>'],
        ['## Code', '<h2>Code</h2>'],
        // a multi-line fence with an interior blank line — must close at its own
        // fence and not swallow the sections that follow
        ['```js\nfunction f(){\n\n  return 1;\n}\n```', '<pre><code class="language-js">function f(){\n\n  return 1;\n}</code></pre>'],
        ['    indented code\n    second line', '<pre><code>indented code\nsecond line\n</code></pre>'],
        ['## Table', '<h2>Table</h2>'],
        [
            '| h1 | h2 |\n|:--|--:|\n| *x* | 2 |',
            '<table><thead><tr><th style="text-align:left">h1</th><th style="text-align:right">h2</th></tr></thead><tbody><tr><td style="text-align:left"><em>x</em></td><td style="text-align:right">2</td></tr></tbody></table>'
        ],
        ['## Slash blocks', '<h2>Slash blocks</h2>'],
        // expected filled in below — the slash block carries its 1-based source
        // line, which depends on every preceding (multi-line) section, so we
        // compute it from the assembled document rather than hard-coding it.
        ['/menu about contact', 'COMPUTED_BELOW'],
        ['Setext Title\n============', '<h1>Setext Title</h1>'],
        ['Subtitle\n--------', '<h2>Subtitle</h2>'],
        ['---', '<hr>']
    ];
    const doc = sections.map(s => s[0]).join('\n\n');
    const slashIndex = sections.findIndex(s => s[1] === 'COMPUTED_BELOW');
    const slashLine = sections.slice(0, slashIndex).map(s => s[0]).join('\n\n').split('\n').length + 2;
    sections[slashIndex][1] = `<p data-line-number="${slashLine}">${sections[slashIndex][0]}</p>`;
    const expected = sections.map(s => s[1]).join('');
    assert.equal(await render(doc), expected);
});

// ---------------------------------------------------------------------------
// sanitize() — restrict rendered markup to what render() vouched for. Raw HTML
// the renderer did not produce is re-emitted as escaped, inert literal text;
// dangerous URL schemes are dropped from href/src even on the safe nodes
// markdown built (markdown can still produce e.g. [x](javascript:...)).
// ---------------------------------------------------------------------------
const sanitize = async src => (await parseMarkdown(src).render()).sanitize().toString();

[
    // markdown's own output is trusted and passes through untouched
    ['**bold**', '<p><strong>bold</strong></p>'],
    ['# Heading', '<h1>Heading</h1>'],
    ['[link](http://example.com)', '<p><a href="http://example.com">link</a></p>'],
    ['[rel](/path)', '<p><a href="/path">rel</a></p>'],
    ['[anchor](#sec)', '<p><a href="#sec">anchor</a></p>'],
    ['<foo@bar.com>', '<p><a href="mailto:foo@bar.com">foo@bar.com</a></p>'],
    // raw HTML the renderer did not produce is escaped to inert literal text
    ['a <b>x</b> b', '<p>a &lt;b&gt;x&lt;/b&gt; b</p>'],
    ['a <script>alert(1)</script> b', '<p>a &lt;script&gt;alert(1)&lt;/script&gt; b</p>'],
    ['<div>x</div>', '&lt;div&gt;x&lt;/div&gt;'],
    // dangerous URL schemes are stripped from otherwise-safe links/images
    ['[click](javascript:alert(1))', '<p><a>click</a></p>'],
    ['![a](javascript:x)', '<p><img alt="a"></p>'],
    ['[d](data:text/html)', '<p><a>d</a></p>'],
    ['[v](vbscript:msgbox)', '<p><a>v</a></p>'],
    // obfuscation is still caught: case-folding, and a tab splitting the scheme
    // inside an angle destination (which parsing preserves but browsers ignore)
    ['[u](JaVaScRiPt:alert(1))', '<p><a>u</a></p>'],
    ['[u](<java\tscript:alert(1)>)', '<p><a>u</a></p>'],
].forEach(([input, expected]) => {
    test(`sanitises ${JSON.stringify(input)}`, async () => {
        assert.equal(await sanitize(input), expected);
    });
});

test('sanitize returns the node for chaining', async () => {
    const node = await parseMarkdown('**x**').render();
    assert.equal(node.sanitize(), node);
});

// ---------------------------------------------------------------------------
// Termination property — no input may hang the parser. consumeMarkdown's
// outer loop carries a structural progress guard, but that guard can't reach
// the parser's inner collector loops (list items, fences, blockquotes,
// tables, HTML attributes), nor catastrophic regex backtracking, where the
// hang lives inside a single scan() call. These tests render a large
// adversarial corpus — every construct adjacent to every other, every
// mid-keystroke prefix of mixed documents, and pathological scale inputs —
// asserting only that parsing terminates without throwing.
//
// The corpus renders inside a worker thread because a synchronous hang
// blocks the event loop, so no in-process mechanism — test timeouts, even
// SIGINT handlers — can interrupt it or report which input was responsible;
// only another thread can observe a stuck one. The ordinary table tests
// don't need this (each input is its own named test, so a freeze is
// localised by the last TAP line), but here a hang would otherwise mean
// bisecting thousands of anonymous generated inputs by hand. The parent
// thread terminates the worker on timeout and names the exact culprit.
// ---------------------------------------------------------------------------
const renderEveryInputInWorker = inputs => new Promise((resolve, reject) => {
    const worker = new Worker(`
        const { parentPort, workerData } = require('node:worker_threads');
        import(workerData.modulePath).then(async ({ parseMarkdown, parseHtml }) => {
            for(let i = 0; i < workerData.inputs.length; i++){
                parentPort.postMessage(i);
                (await parseMarkdown(workerData.inputs[i]).render()).toString();
                (await parseHtml(workerData.inputs[i])).toString();
            }
            parentPort.postMessage(-1);
        });
    `, { eval: true, workerData: { modulePath: new URL('./markup_node.js', import.meta.url).href, inputs } });
    let current = -1;
    const culprit = () => JSON.stringify(inputs[current]).slice(0, 200);
    const finish = error => {
        clearTimeout(timer);
        worker.terminate();
        error ? reject(error) : resolve();
    };
    const timer = setTimeout(
        () => finish(new Error(`parse failed to terminate on input ${culprit()}`)),
        30000
    );
    worker.on('message', index => index == -1 ? finish() : current = index);
    worker.on('error', error => finish(new Error(`parse threw on input ${culprit()}: ${error.message}`)));
});

// One line of every block/inline construct, plus truncated and whitespace-only
// forms — the states an editor passes through mid-keystroke.
const CONSTRUCT_ATOMS = [
    '', ' ', '  ', '   ', '\t', 'Test', 'Test  ', 'a\\',
    '#', '# Heading', '##### x #####', '#\t',
    '-', '- item', ' - ', '* item', '+ item', '1.', '1. item', '1)', '12345. x',
    '>', '> quote', '> > deep', '>  ',
    '```', '```js', '~~~', '    code', '\tcode',
    '---', '***', '___', '- - -', '=', '==',
    '|', '| a | b |', '|---|---|', '| a |', '|--',
    '<div>', '</div>', '<div', '<!-- comment', '<!-- c -->', '<br/>', '<https://x.y>',
    '*', '_', '__', '``', '~~', '*em*', '**strong', '`code', 'a_b_c',
    '[', '[x](', '[link](url)', '![img](u', '[x](<y z>)', '[x](y "t', '~~s~~', '\\',
];

// Multi-construct documents whose every prefix is rendered below — simulating
// a user typing the document one keystroke at a time.
const TYPING_DOCS = [
    '- Test\n  - Nested\n    - Deep',
    '# H\n\nPara with *em* and `code`\n\n> quote\n> more',
    '| a | b |\n|---|---|\n| 1 | 2 |',
    '```js\ncode\n```\ntail',
    '1. one\n2. two\n\n   cont',
    '> - mixed\n>   - nest\n\n---\n\nSetext\n===',
    'text **bold _mix_ ~~strike~~** [l](u "t") ![i](v)\\',
    '- a\n\n  - b\n\n    - c\n      ',
];

// Scale inputs — long delimiter runs, deep nesting, unclosed constructs —
// guarding against catastrophic regex backtracking and runaway recursion.
const PATHOLOGICAL_INPUTS = [
    '*'.repeat(20000),
    '*a'.repeat(5000),
    '***a'.repeat(2000),
    '_'.repeat(20000),
    '~~a'.repeat(5000),
    '`'.repeat(20000),
    '['.repeat(20000),
    '[]('.repeat(5000),
    '[x](' + '('.repeat(10000),
    '[x](y ' + ' '.repeat(10000) + ')',
    '> '.repeat(2000) + 'x',
    Array.from({length: 500}, (_, i) => ' '.repeat(i * 2) + '- x').join('\n'),
    '- x\n'.repeat(5000),
    '- '.repeat(5000) + 'x',
    '# ' + ' '.repeat(10000) + 'x',
    '# x ' + '#'.repeat(5000) + ' y',
    '```\n' + 'x\n'.repeat(5000),
    '<div '.repeat(5000),
    '<div>'.repeat(2000),
    '<'.repeat(20000),
    '\\*'.repeat(10000),
    'x\n' + '-'.repeat(20000),
    ' '.repeat(20000),
    ' \n'.repeat(10000),
    '|' + ' a |'.repeat(2000) + '\n|' + '---|'.repeat(2000) + '\n|' + ' 1 |'.repeat(2000),
];

test('parsing terminates on every adjacent pair of construct fragments', async () => {
    const docs = [];
    for(const a of CONSTRUCT_ATOMS) for(const b of CONSTRUCT_ATOMS){
        docs.push(`${a}\n${b}`, `${a}\n\n${b}`);
    }
    await renderEveryInputInWorker(docs);
});

test('parsing terminates on every keystroke prefix of mixed documents', async () => {
    const docs = [];
    for(const doc of TYPING_DOCS)
        for(let i = 1; i <= doc.length; i++) docs.push(doc.slice(0, i));
    await renderEveryInputInWorker(docs);
});

test('parsing terminates on pathological inputs', async () => {
    await renderEveryInputInWorker(PATHOLOGICAL_INPUTS);
});
