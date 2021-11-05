
import chalk from 'chalk';

import { NodeWrapper } from '../node_wrapper.js';

export default () => {
    console.log('');
    console.log('The following widgets are available:');
    console.log('');
    Object.keys(NodeWrapper.classes).sort().forEach(widgetName => {
        console.log(`  * ${chalk.green(widgetName)}`);
    });
    console.log('');
};
