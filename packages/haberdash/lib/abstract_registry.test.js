import test from 'node:test';
import assert from 'node:assert';
import chalk from 'chalk';

import { Class } from './class.js';
import { AbstractRegistry } from './abstract_registry.js';
import { AbstractCommand } from './abstract_command.js';

const makeRegistry = () => Class.extend().include({ meta(){ this.include(AbstractRegistry); } });

test('a class with no tag() call has tags === []', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', {});
    assert.deepEqual(Registry.for('alpha').tags, []);
});

test('tag() accumulates tags and dedupes duplicates', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', {
        meta(){
            this.tag('a');
            this.tag('b');
            this.tag('a');
        }
    });
    assert.deepEqual(Registry.for('alpha').tags, ['a', 'b']);
});

test('tags array is a fresh literal per class (no shared-array aliasing)', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', { meta(){ this.tag('a'); } });
    Registry.register('beta', {});
    assert.deepEqual(Registry.for('alpha').tags, ['a']);
    assert.deepEqual(Registry.for('beta').tags, []);
});

test('tags getter returns the sorted, de-duplicated union of every class\'s tags', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', { meta(){ this.tag('sandbox'); this.tag('core'); } });
    Registry.register('beta', { meta(){ this.tag('core'); } });
    Registry.register('gamma', { meta(){ this.tag('ralph'); } });
    Registry.register('delta', {});

    assert.deepEqual(Registry.tags, ['core', 'ralph', 'sandbox']);
});

test('tags getter returns [] when no class is tagged', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', {});
    Registry.register('beta', {});
    assert.deepEqual(Registry.tags, []);
});

test('namesMatching returns name-substring and tag-substring hits as a sorted subset', () => {
    const Registry = makeRegistry();
    Registry.register('run-in-sandbox', { meta(){ this.tag('sandbox'); } });
    Registry.register('start-sandbox', { meta(){ this.tag('sandbox'); } });
    Registry.register('generate-command', { meta(){ this.tag('core'); } });
    Registry.register('santiago', {});
    Registry.register('list-services', { meta(){ this.tag('sandbox'); } });

    assert.deepEqual(
        Registry.namesMatching('san'),
        ['list-services', 'run-in-sandbox', 'santiago', 'start-sandbox']
    );
});

test('namesMatching is case-insensitive', () => {
    const Registry = makeRegistry();
    Registry.register('run-in-sandbox', { meta(){ this.tag('sandbox'); } });
    Registry.register('generate-command', { meta(){ this.tag('core'); } });

    assert.deepEqual(Registry.namesMatching('SAN'), Registry.namesMatching('san'));
    assert.deepEqual(Registry.namesMatching('SAN'), ['run-in-sandbox']);
});

test('namesMatching returns [] for an unmatched query', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', { meta(){ this.tag('core'); } });
    assert.deepEqual(Registry.namesMatching('zzz'), []);
});

test('createListCommand builds a list command mixin over a registry', () => {
    const Widgets = makeRegistry();
    Widgets.register('alpha-widget', { meta(){ this.tag('shiny'); } });
    Widgets.register('beta-widget', {});

    const listWidgets = Widgets.createListCommand({ noun: 'widgets' });

    const Command = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
    Command.register('list-widgets', { meta(){ this.include(listWidgets); } });

    const ListWidgets = Command.for('list-widgets');

    assert.equal(ListWidgets.description, 'Lists all available widgets in the current project.');
    assert.deepEqual(ListWidgets.extractParams(['shiny']), { filter: ['shiny'] });
    assert.deepEqual(ListWidgets.extractParams(['--filter', 'shiny']), { filter: ['shiny'] });

    const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
    const UNDERLINE = '\x1b[4m';
    const captureRun = (params) => {
        const raw = [];
        const original = console.log;
        const originalLevel = chalk.level;
        chalk.level = 1;
        console.log = (...args) => raw.push(args.join(' '));
        try {
            const command = ListWidgets.new();
            command.context = { params };
            command.run();
        } finally {
            console.log = original;
            chalk.level = originalLevel;
        }
        return { raw, plain: raw.map(stripAnsi) };
    };

    // Unfiltered: header, tagged + untagged rows, Available tags footer, no highlighting.
    const all = captureRun({});
    assert.ok(all.plain.includes('The following widgets are available:'));
    assert.ok(all.plain.includes('  * alpha-widget (shiny)'));
    assert.ok(all.plain.includes('  * beta-widget'));
    assert.ok(all.plain.includes('Available tags: shiny.'));
    assert.ok(!all.raw.some(l => l.includes(UNDERLINE)), 'no underline in unfiltered output');

    // Filtered with 'shi': matches alpha-widget via tag; highlight 'shi' in name (n/a) and in tag.
    const filtered = captureRun({ filter: 'shi' });
    assert.ok(filtered.plain.includes("The following widgets matching 'shi' are available:"));
    assert.ok(filtered.plain.includes('  * alpha-widget (shiny)'));
    assert.ok(!filtered.plain.some(l => l.includes('beta-widget')), 'non-matching command excluded');
    assert.ok(!filtered.plain.some(l => l.startsWith('Available tags:')), 'no Available tags footer when filtered');
    const shinyLine = filtered.raw.find(l => stripAnsi(l) === '  * alpha-widget (shiny)');
    assert.ok(shinyLine, 'found alpha-widget line');
    assert.ok(shinyLine.includes(`${UNDERLINE}shi\x1b[24m`), "tag substring 'shi' is underlined");

    // Filter with name-substring hit and tag-substring hit: highlight in both.
    Widgets.register('shimmer-widget', { meta(){ this.tag('shiny'); } });
    const both = captureRun({ filter: 'shi' });
    const shimmerLine = both.raw.find(l => stripAnsi(l) === '  * shimmer-widget (shiny)');
    assert.ok(shimmerLine, 'found shimmer-widget line');
    const occurrences = (shimmerLine.match(new RegExp(`${UNDERLINE.replace('[', '\\[')}shi`, 'g')) || []).length;
    assert.ok(occurrences >= 2, 'underline appears in both the name and the tag');

    // No-match: print 'No widgets matching ...' and don't throw.
    let noMatch;
    assert.doesNotThrow(() => {
        noMatch = captureRun({ filter: 'zzz' });
    });
    assert.ok(noMatch.plain.includes("  No widgets matching 'zzz'."));
    assert.ok(!noMatch.plain.some(l => l.includes('available:')), 'no available header when no matches');
});

test('createListCommand highlight() underlines every case-insensitive occurrence of the filter', () => {
    const Widgets = makeRegistry();
    const listWidgets = Widgets.createListCommand({ noun: 'widgets' });

    const Command = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
    Command.register('list-widgets', { meta(){ this.include(listWidgets); } });

    const ListWidgets = Command.for('list-widgets');

    const originalLevel = chalk.level;
    chalk.level = 1;
    try {
        const command = ListWidgets.new();
        command.context = { params: { filter: 'abc' } };
        const highlighted = command.highlight('abcABC');
        assert.equal(highlighted, `${chalk.underline('abc')}${chalk.underline('ABC')}`);

        command.context = { params: {} };
        assert.equal(command.highlight('abcABC'), 'abcABC');
    } finally {
        chalk.level = originalLevel;
    }
});

test('createListCommand invokes the after callback once with { registry }', () => {
    const Widgets = makeRegistry();
    Widgets.register('alpha-widget', {});

    const calls = [];
    let lastThis;
    const listWidgets = Widgets.createListCommand({
        noun: 'widgets',
        after({ registry }){
            calls.push({ registry });
            lastThis = this;
        }
    });

    const Command = Class.extend().include({ meta(){ this.include(AbstractCommand); } });
    Command.register('list-widgets', { meta(){ this.include(listWidgets); } });

    const ListWidgets = Command.for('list-widgets');

    const originalLog = console.log;
    console.log = () => {};
    try {
        const command = ListWidgets.new();
        command.context = { params: {} };
        command.run();
        assert.equal(calls.length, 1);
        assert.strictEqual(calls[0].registry, Widgets);
        assert.strictEqual(lastThis, command);
    } finally {
        console.log = originalLog;
    }
});
