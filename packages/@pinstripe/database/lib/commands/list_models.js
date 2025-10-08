
import chalk from 'chalk';
import { Row } from '@pinstripe/database';

export default {
    meta(){
        this.annotate({
            description: 'Lists all available database models in the project.'
        });
    },

    run(){
        console.log('');
        console.log('The following models are available:');
        console.log('');
        Row.names.forEach(modelName => {
            console.log(`  * ${chalk.green(modelName)}`);
        });
        console.log('');
    }
};
