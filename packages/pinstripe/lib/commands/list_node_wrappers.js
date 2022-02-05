
import chalk from 'chalk';

import { NodeWrapper } from '../node_wrapper.js';

export default () => {
    console.log('');
    console.log('The following node wrappers are available:');
    console.log('');
    Object.keys(NodeWrapper.classes).sort().forEach(nodeWrapperName => {
        console.log(`  * ${chalk.green(nodeWrapperName)}`);
    });
    console.log('');
};
