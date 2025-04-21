
import { Class } from './class.js';
import { inflector } from './inflector.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';

const optionPattern = /^-([a-z]|-[a-z\-]+)$/;

export const Command = Class.extend().include({
    meta(){
        this.assignProps({ 
            name: 'Command'
        });

        this.include(ImportableRegistry);
        this.include(ServiceConsumer);

        this.assignProps({
            normalizeName(name){
                return inflector.dasherize(name);
            },

            async run(context, name = 'list-commands', params = {}){
                await context.fork().run(async context => {
                    context.params = Array.isArray(params) ? this.extractParams(params) : params;
                    await this.create(name, context).run();
                });
            },

            extractParams(_args = []){
                const args = [ ..._args ];
                const out = {};
                let currentName;
                while(args.length){
                    const arg = args.shift();
                    const matches = arg.match(optionPattern);
                    if(matches){
                        currentName = inflector.camelize(matches[1]);
                        if(out[currentName] === undefined){
                            out[currentName] = [];
                        }
                    } else {
                        if(currentName === undefined){
                            currentName = 'args';
                            out[currentName] = [];
                        }
                        out[currentName].push(arg);
                    }
                }
                Object.keys(out).forEach(name => {
                    const value = out[name];
                    if(!value.length){
                        out[name] = true;
                    } else {
                        out[name] = value.join(' ');
                    }
                });
                return out;
            }
        });
    },

    run(){
        console.error(`No such command "${this.constructor.name}" exists.`);
    }
});
