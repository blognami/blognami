
import chalk from 'chalk';
import { View } from 'pinstripe';

export default {
    run(){
        const apps = [];

        View.names.forEach(viewName => {
            const matches = viewName.match(/^_apps\/([^/]+)\//);
            if(!matches || apps.includes(matches[1])) return;
            apps.push(matches[1]);
        });

        apps.sort();

        console.log('');
        console.log('The following apps are available:');
        console.log('');
        apps.forEach(appName => {
            console.log(`  * ${chalk.green(appName)}`);
        });
        console.log('');
    }
};
