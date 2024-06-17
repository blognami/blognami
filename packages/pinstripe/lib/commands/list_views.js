
import chalk from 'chalk';
import { App, View } from 'pinstripe';

export default {
    run(){
        const { app = 'main' } = this.params;

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

