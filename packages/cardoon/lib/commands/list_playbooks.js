
import chalk from 'chalk';
import { Playbook } from 'cardoon';

export default {
    meta(){
        this.assignProps({
            description: 'Lists the registered playbooks.'
        });
    },

    run(){
        console.log('');
        console.log('The following playbooks are available:');
        console.log('');
        Playbook.names.forEach(playbookName => {
            console.log(`  * ${chalk.green(playbookName)}`);
        });
        console.log('');
    }
};
