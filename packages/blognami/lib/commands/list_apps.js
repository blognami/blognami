
import chalk from 'chalk';
import { App } from 'blognami';

export default {
    run(){
        console.log('');
        console.log('The following apps are available:');
        console.log('');
        App.names.forEach(appName => {
            console.log(`  * ${chalk.green(appName)} (composed of ${JSON.stringify(App.create(appName, this.context).compose())} views)`);
        });
        console.log('');
    }
};
