
import { Command } from 'pinstripe';

export default {
    async run(){
        await this.runCommand('database:drop');
        await this.runCommand('database:init');
    }
};
