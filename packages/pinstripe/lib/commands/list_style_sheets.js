
import chalk from 'chalk';

import { StyleSheet } from '../style_sheet.js';

export default () => {
    console.log('');
    console.log('The following style sheets are available:');
    console.log('');
    Object.keys(StyleSheet.classes).sort().forEach(styleSheetName => {
        console.log(`  * ${chalk.green(styleSheetName)} (${StyleSheet.classes[styleSheetName].cssNamespace})`);
    });
    console.log('');
};

