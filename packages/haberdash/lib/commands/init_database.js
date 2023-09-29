
import { Command } from 'haberdash';

export default {
    async run(){
        await this.runCommand('migrate-database');
        await this.runCommand('seed-database');
    }
}
