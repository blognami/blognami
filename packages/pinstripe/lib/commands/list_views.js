
import chalk from 'chalk';
import { App, View } from 'pinstripe';

export default {
    run(){
        const { extractOptions } = this.cliUtils;

        const { app = 'main' } = extractOptions();

        const { viewNames } = View.mapperFor(App.create(app, this.context).compose());
        console.log('');
        console.log(`The following views are available:`);
        console.log('');
        viewNames.forEach(viewName => {
            console.log(`  * ${chalk.green(viewName)}`);
        });
        console.log('');
    }
};

