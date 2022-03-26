
import { Command } from '../command.js';

export default () => {
    return Object.keys(Command.classes).sort();
};
