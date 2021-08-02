
import chalk from 'chalk';
import { defineCommand, Widget } from 'pinstripe';

defineCommand('list-widgets', () => {
    console.log('');
    console.log('The following widgets are available:');
    console.log('');
    Object.keys(Widget.classes).sort().forEach(widgetName => {
        console.log(`  * ${chalk.green(widgetName)}`);
    });
    console.log('');
});
