import test from 'node:test';
import assert from 'node:assert';

import { titleFromMarkdown } from './title_from_markdown.js';

test('titleFromMarkdown returns the text of the first H1', async () => {
    assert.strictEqual(await titleFromMarkdown('# drop-database Command\n\nBody'), 'drop-database Command');
});

test('titleFromMarkdown strips inline markdown from the H1', async () => {
    assert.strictEqual(await titleFromMarkdown('# The `drop-database` *Command*'), 'The drop-database Command');
});

test('titleFromMarkdown ignores a # line inside a fenced code block', async () => {
    assert.strictEqual(await titleFromMarkdown('```bash\n# comment\n```\n\nBody'), undefined);
});

test('titleFromMarkdown returns undefined when there is only an H2', async () => {
    assert.strictEqual(await titleFromMarkdown('## Subheading\n\nBody'), undefined);
});
