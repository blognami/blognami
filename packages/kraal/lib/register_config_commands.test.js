
import test from 'node:test';
import assert from 'node:assert';

import { Command } from './command.js';
import { registerConfigCommands } from './register_config_commands.js';

test('registers a sandbox command for each config entry', t => {
    t.after(() => Command.unregister('run-afk-claude'));

    registerConfigCommands({ sandbox: { commands: { 'run-afk-claude': 'claude --model opus' } } });

    assert.ok(Command.names.includes('run-afk-claude'));
    const klass = Command.for('run-afk-claude');
    assert.match(klass.description, /claude --model opus/);
});

test('skips and warns when the name collides with an existing command', t => {
    Command.register('existing-cmd', { meta(){ this.assignProps({ description: 'original' }); } });
    t.after(() => Command.unregister('existing-cmd'));

    const warnings = [];
    const originalError = console.error;
    console.error = msg => warnings.push(msg);
    try {
        registerConfigCommands({ sandbox: { commands: { 'existing-cmd': 'echo hi' } } });
    } finally {
        console.error = originalError;
    }

    // Left untouched: still the original, not composed into a sandbox command.
    assert.equal(Command.for('existing-cmd').description, 'original');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /existing-cmd/);
});

test('is a no-op when there are no config commands', () => {
    assert.doesNotThrow(() => {
        registerConfigCommands({});
        registerConfigCommands({ sandbox: {} });
        registerConfigCommands(undefined);
    });
});
