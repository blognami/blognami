
import { Class } from './class.js'

export const Text = Class.extend().include({
    meta(){
        this.assignProps({
            dslProps: ['echo', 'line', 'indent'],
            render(...args){
                return this.new().render(...args);
            }
        });
    },

    initialize(){
        this.outputBuffer = [];
    },

    get dsl(){
        return this.bindProps(this.constructor.dslProps);
    },

    echo(stringable){
        this.outputBuffer.push((async () => `${await stringable}`)());
    },

    line(stringable = ''){
        if(this.outputBuffer.length){
            this.echo((async () => `\n${await stringable}`)());
        } else {
            this.echo(stringable);
        }
    },

    indent(fn){
        this.outputBuffer.push((async () => {
            const lines = (await this.constructor.render(fn)).outputBuffer;

            if(!lines.length){
                return;
            }

            let out = [];

            lines.join('').split(/\n/).forEach((string) => {
                out.push(`    ${string}`);
            });

            out = out.join('\n');

            return this.outputBuffer.length - 1 > 0 ? `\n${out}` : out;
        })());
    },

    async render(fn){
        await fn(this.dsl);

        this.outputBuffer = await Promise.all(this.outputBuffer);

        return this;
    },

    toString(){
        return this.outputBuffer.join('');
    }
});
