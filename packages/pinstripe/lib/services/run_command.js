
import { Command } from '../command.js';

export default {
    create(){
        return (...args) => Command.run(this.context, ...args);
    }
};
