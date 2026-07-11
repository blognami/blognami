import { AbstractCommand } from 'haberdash';
import { Class } from 'haberdash';
import { ServiceFactory } from './service_factory.js';

export const Command = Class.extend('Command').include({
    meta(){
        this.include(AbstractCommand);
        this.include(ServiceFactory.Consumerable);

        this.hasParam('branch', {
            type: 'string',
            optional: true,
            description: 'Target a sandbox for the given git branch (worktree); defaults to the current checked-out branch.'
        });

        const { run } = this;

        this.assignProps({
            binaryName: 'kraal',

            async run(context, name, params = {}){
                if(Array.isArray(params) && this.shouldRouteToSandbox(name)){
                    return ServiceFactory.Workspace.run(async function(){
                        const result = await this.sandbox.run(['npx', 'kraal', name, ...params], { interactive: true });
                        return result.exitCode;
                    }, context);
                }
                return run.call(this, context, name, params);
            },

            shouldRouteToSandbox(name){
                if(process.env.KRAAL_IN_SANDBOX) return false;
                const normalizedName = this.normalizeName(name);
                if(!this.mixins[normalizedName]) return false;
                return Boolean(this.for(name).sandboxed);
            }
        });
    }
});
