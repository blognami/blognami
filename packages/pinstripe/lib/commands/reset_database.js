
import { Command } from 'pinstripe';

export default {
    async run(){
        await this.runCommand('drop-database');
        await this.runCommand('init-database');
    }
};
