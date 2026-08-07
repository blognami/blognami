import test from 'node:test';
import assert from 'node:assert';

import { Markdown } from './markdown.js';

test('Markdown.render yields a slash-free, acronym-clean heading id', async () => {
    const html = `${await Markdown.render('## ...CMS/blogging platforms')}`;
    assert.ok(html.includes('id="heading-cms-blogging-platforms"'), html);
    assert.ok(!html.includes('c-m-s'), 'acronym must not be split');
});
