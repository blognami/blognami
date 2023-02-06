
import chalk from 'chalk';
import { Component } from 'sintra';

export default {
    run(){
        console.log('');
        console.log('The following components are available:');
        console.log('');
        Component.names.forEach(componentName => {
            console.log(`  * ${chalk.green(componentName)}`);
        });
        console.log('');
    }
};

