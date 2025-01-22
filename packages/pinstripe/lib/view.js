
import * as crypto from 'crypto'; // pinstripe-if-client: const crypto = undefined;

import { Class } from './class.js';
import { Registry } from './registry.js';
import { ServiceConsumer } from './service_consumer.js';

export const View = Class.extend().include({
    meta(){
        this.assignProps({ name: 'View' });

        this.include(Registry);
        this.include(ServiceConsumer);
        
        this.assignProps({
            run(context, name, fn){
                return context.fork().run(async context => {
                    context.view = await this.create(name, context);
                    return fn.call(context.view, context.view);
                });
            },

            render(context, name, params = {}){
                return this.run(context, name, view => {
                    view.context.params = params;
                    return view.render();
                });
            }
        });
    },

    get hash(){
        if(!this._hash){
            this._hash = createHash(this.constructor.name);
        }
        return this._hash;
    },

    get cssClasses(){
        if(!this._cssClasses){
            this._cssClasses = this.cssClassesFor(this.constructor.name);
        }
        return this._cssClasses;
    },
    
    render(){
        // by default do nothing
    }
});

export function createHash(data){
    return crypto.createHash('sha1').update(data).digest('base64').replace(/[^a-z0-9]/ig, '').replace(/^(.{10}).*$/, '$1');
}

