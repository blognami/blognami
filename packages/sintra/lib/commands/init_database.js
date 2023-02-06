
import { Command } from 'sintra';

export default {
    async run(){
        await this.runCommand('migrate-database');
        await this.runCommand('seed-database');
    }
}
