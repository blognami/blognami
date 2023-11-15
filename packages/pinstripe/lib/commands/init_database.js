
import { Command } from 'pinstripe';

export default {
    async run(){
        await this.runCommand('migrate-database');
        await this.runCommand('seed-database');
    }
}
