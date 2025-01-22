
import chalk from 'chalk';
import { FileImporter } from 'pinstripe';

export default {
    run(){
        console.log('');
        console.log('The following file importers are available:');
        console.log('');
        FileImporter.names.forEach(fileImporterName => {
            console.log(`  * ${chalk.green(fileImporterName)}`);
        });
        console.log('');
    }
};

