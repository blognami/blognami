
import { Class } from './class.js';

export const Json = Class.extend().include({
    meta(){
        this.assignProps({
            async resolveValue(value){
                let out = await value;
                if(out && typeof out.toJson == 'function'){
                    out = await out.toJson();
                } else if(typeof out == 'function'){
                    out = await this.resolveValue(out());
                }

                if(Array.isArray(out)){
                    out = [...out];
                    for(let i = 0; i < out.length; i++){
                        out[i] = await this.resolveValue(out[i]);
                    }
                } else if(out && typeof out == 'object'){
                    out = {...out};
                    for(const key of Object.keys(out)){
                        out[key] = await this.resolveValue(out[key]);
                    }
                }

                return out;
            },

            async render(data){
                return this.new(await this.resolveValue(data));
            }
        });
    },

    initialize(data){
        this.data = data;
    },

    toString(){
        return JSON.stringify(this.data);
    },

    toResponseArray(status = 200, headers = {}){
        return [status, {'content-type': 'application/json', ...headers}, [JSON.stringify(this.data)]];
    }
});