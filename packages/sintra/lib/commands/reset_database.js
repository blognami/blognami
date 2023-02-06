
import { Command } from 'sintra';

export default {
    async run(){
        await this.runCommand('drop-database');
        await this.runCommand('init-database');
    }
};
