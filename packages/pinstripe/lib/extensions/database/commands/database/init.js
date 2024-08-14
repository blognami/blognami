
import { Command } from 'pinstripe';

export default {
    async run(){
        await this.runCommand('database:migrate');
        await this.runCommand('database:seed');
    }
}
