
import Repl from 'repl';
import * as vm from 'vm';
import * as util from 'util';

import { ServiceFactory } from '../service_factory.js';

export default {
    create(){
        return this;
    },
    
    async start(){
        await new Promise(resolve => {
            const repl = Repl.start({
                prompt: 'haberdash > ',
    
                preview: false,
    
                async eval(cmd, context, filename, callback) {
                    if(cmd.length > 1){
                        let result;
                        try {
                            result = await vm.runInContext(cmd, context);
                            if(result != null && typeof result.__beforeInspect == 'function'){
                                await result.__beforeInspect();
                            }
                            callback(null, result);
                        } catch (e) {
                            callback(e);
                        }
                    } else {
                        callback();
                    }
                },
    
                writer(out){
                    if(out != null && typeof out.__inspect == 'function'){
                        return out.__inspect();
                    }
                    return util.inspect(out, false, 2, true);
                }
            });
            
            ServiceFactory.names.forEach(name => {
                Object.defineProperty(repl.context, name, {
                    get: () => this[name]
                });
            });
    
            repl.on('exit', resolve);
        });
    }
};
