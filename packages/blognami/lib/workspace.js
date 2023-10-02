
import { Class } from './class.js';
import { ServiceConsumer } from './service_consumer.js';
import { importAll } from './import_all.js';
import { Context } from './context.js';

export const Workspace = Class.extend().include({
    meta(){
        this.include(ServiceConsumer);

        this.assignProps({
            async run(fn){
                await importAll();
                return await Context.new().run(async context => {
                    const workspace = this.new(context);
                    return await fn.call(workspace, workspace);
                });
            }
        });
    }
});
