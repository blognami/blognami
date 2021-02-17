
import { ServiceFactory } from '../service_factory.js';
import { project } from  '../project.js';

ServiceFactory.register('project').define(dsl => dsl
    .props({
        create(){
           return project;
        }
    })
);
