
import * as Repl from 'repl';

import { Command } from '../command.js';
import { ServiceFactory } from '../service_factory.js';
import { Environment } from '../environment.js';

Command.register('start-console').define(dsl => dsl.props({
    run(){
        const repl = Repl.start('pinstripe > ');
        const environment = Environment.new();

        Object.keys(ServiceFactory.classes).forEach(name => 
            Object.defineProperty(repl.context, name, {
                get: () => environment[name]
            })
        );

        repl.on('exit', () => environment.cleanUp());
    }
}));
