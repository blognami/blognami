
import { serviceFactory } from '../service_factory.js';
import { Command } from '../command.js';

serviceFactory('run', ({ fork }) => {
    return (commandName = 'list-commands', ...args) => {
        return fork(({ environment, inject }) => {
            const command = Command.create(commandName, environment);
            inject('command', command);
            inject('args', args);
            return command.run();
        });
    };
});
