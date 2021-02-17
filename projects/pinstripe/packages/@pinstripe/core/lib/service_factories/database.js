
import { ServiceFactory } from '../service_factory.js';
import { Database } from '../database.js';
import { PathBuilder } from '../path_builder.js'

ServiceFactory.register('database').define(dsl => dsl
    .serviceProps('environment')
    .props({
        create(){
            return new PathBuilder(
               new Database(this.environment)
            );
        }
    })
);
