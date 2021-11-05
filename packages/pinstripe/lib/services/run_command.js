
import { Command } from '../command.js';

export default ({ forkEnvironment }) => {
    return (name, ...args) => forkEnvironment(environment => {
        environment.args = args;
        return Command.run(name, environment);
    });
};
