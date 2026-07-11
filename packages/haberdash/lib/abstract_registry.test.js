import test from 'node:test';
import assert from 'node:assert';
import chalk from 'chalk';

import { Class } from './class.js';
import { Context } from './context.js';
import { AbstractRegistry } from './abstract_registry.js';
import { AbstractCommand } from './abstract_command.js';
import { AbstractServiceFactory } from './abstract_service_factory.js';

const makeRegistry = () => Class.extend().include({ meta(){ this.include(AbstractRegistry); } });

// A command's this.params comes from the params service inherited from
// AbstractServiceFactory, resolved through the ServiceFactory.Consumerable trap.
const ServiceFactory = Class.extend().include({
    meta(){ this.include(AbstractServiceFactory); this.include(this.Consumerable); }
});

const makeCommand = () => Class.extend().include({
    meta(){ this.include(AbstractCommand); this.include(ServiceFactory.Consumerable); }
});

const contextWithParams = (params = {}) => {
    const context = Context.new();
    context.params = params;
    return context;
};

test('namesMatching returns name-substring hits as a sorted subset', () => {
    const Registry = makeRegistry();
    Registry.register('run-in-sandbox', {});
    Registry.register('start-sandbox', {});
    Registry.register('generate-command', {});
    Registry.register('santiago', {});
    Registry.register('list-services', {});

    assert.deepEqual(
        Registry.namesMatching('san'),
        ['run-in-sandbox', 'santiago', 'start-sandbox']
    );
});

test('namesMatching is case-insensitive', () => {
    const Registry = makeRegistry();
    Registry.register('run-in-sandbox', {});
    Registry.register('generate-command', {});

    assert.deepEqual(Registry.namesMatching('SAN'), Registry.namesMatching('san'));
    assert.deepEqual(Registry.namesMatching('SAN'), ['run-in-sandbox']);
});

test('namesMatching returns [] for an unmatched query', () => {
    const Registry = makeRegistry();
    Registry.register('alpha', {});
    assert.deepEqual(Registry.namesMatching('zzz'), []);
});

test('createListCommand builds a list command mixin over a registry', () => {
    const Widgets = makeRegistry();
    Widgets.register('alpha-widget', {});
    Widgets.register('beta-widget', {});

    const listWidgets = Widgets.createListCommand({ noun: 'widgets' });

    const Command = makeCommand();
    Command.register('list-widgets', { meta(){ this.include(listWidgets); } });

    const ListWidgets = Command.for('list-widgets');

    assert.equal(ListWidgets.description, 'Lists all available widgets in the current project.');
    assert.deepEqual(ListWidgets.extractParams(['alpha']), { filter: ['alpha'] });
    assert.deepEqual(ListWidgets.extractParams(['--filter', 'alpha']), { filter: ['alpha'] });

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
            command.context = contextWithParams(params);
            command.run();
        } finally {
            console.log = original;
            chalk.level = originalLevel;
        }
        return { raw, plain: raw.map(stripAnsi) };
    };

    // Unfiltered: header, all rows, no highlighting.
    const all = captureRun({});
    assert.ok(all.plain.includes('The following widgets are available:'));
    assert.ok(all.plain.includes('  * alpha-widget'));
    assert.ok(all.plain.includes('  * beta-widget'));
    assert.ok(!all.raw.some(l => l.includes(UNDERLINE)), 'no underline in unfiltered output');

    // Filtered with 'alpha': matches alpha-widget by name; highlight the substring; beta excluded.
    const filtered = captureRun({ filter: 'alpha' });
    assert.ok(filtered.plain.includes("The following widgets matching 'alpha' are available:"));
    assert.ok(filtered.plain.includes('  * alpha-widget'));
    assert.ok(!filtered.plain.some(l => l.includes('beta-widget')), 'non-matching command excluded');
    const alphaLine = filtered.raw.find(l => stripAnsi(l) === '  * alpha-widget');
    assert.ok(alphaLine, 'found alpha-widget line');
    assert.ok(alphaLine.includes(`${UNDERLINE}alpha\x1b[24m`), "name substring 'alpha' is underlined");

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

    const Command = makeCommand();
    Command.register('list-widgets', { meta(){ this.include(listWidgets); } });

    const ListWidgets = Command.for('list-widgets');

    const originalLevel = chalk.level;
    chalk.level = 1;
    try {
        const command = ListWidgets.new();
        command.context = contextWithParams({ filter: 'abc' });
        const highlighted = command.highlight('abcABC');
        assert.equal(highlighted, `${chalk.underline('abc')}${chalk.underline('ABC')}`);

        command.context = contextWithParams({});
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

    const Command = makeCommand();
    Command.register('list-widgets', { meta(){ this.include(listWidgets); } });

    const ListWidgets = Command.for('list-widgets');

    const originalLog = console.log;
    console.log = () => {};
    try {
        const command = ListWidgets.new();
        command.context = contextWithParams({});
        command.run();
        assert.equal(calls.length, 1);
        assert.strictEqual(calls[0].registry, Widgets);
        assert.strictEqual(lastThis, command);
    } finally {
        console.log = originalLog;
    }
});
