
import chalk from 'chalk';
import { View } from 'pinstripe';

export default {
    meta(){
        this.annotate({
            description: 'Lists all available views in the current project.'
        });
    },

    run(){
        console.log('');
        console.log(`The following views are available:`);
        console.log('');
        View.names.forEach(viewName => {
            console.log(`  * ${chalk.green(viewName)}`);
        });
        console.log('');
    }
};

