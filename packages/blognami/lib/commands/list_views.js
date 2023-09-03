
import chalk from 'chalk';
import { App, View } from 'blognami';

export default {
    run(){
        const { extractOptions } = this.cliUtils;

        const { app } = extractOptions();

        if(app){
            this.listComposedViews(typeof app == 'string' ? app : 'main');
        } else {
            this.listAllViews();
        }
    },

    listComposedViews(appName){
        const { viewNames, resolveView } = View.mapperFor(App.create(appName, this.context).compose());
        console.log('');
        console.log(`The following views have been composed for app "${appName}":`);
        console.log('');
        viewNames.forEach(viewName => {
            console.log(`  * ${chalk.green(viewName)} -> ${chalk.green(resolveView(viewName))}`);
        });
        console.log('');
    },

    listAllViews(){
        console.log('');
        console.log(`The following views are available:`);
        console.log('');
        View.names.forEach(viewName => {
            console.log(`  * ${chalk.green(viewName)}`);
        });
        console.log('');
    }
};

