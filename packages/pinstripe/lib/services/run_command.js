
import { defineService } from 'pinstripe';

import { Command } from '../command.js';

defineService('runCommand', ({ forkEnvironment }) => {
    return (name, ...args) => forkEnvironment(environment => {
        environment.args = args;
        return Command.run(name, environment);
    });
});
