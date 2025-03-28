
import { Class } from './class.js'

export const Text = Class.extend().include({
    meta(){
        this.assignProps({
            render(...args){
                return this.new().render(...args);
            }
        });
    },

    initialize(){
        this.outputBuffer = [];
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
            const lines = await this.grab(fn);

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

    async grab(fn){
        return (await this.constructor.render(fn)).outputBuffer;
    },

    async render(fn){
        await fn({
            echo: this.echo.bind(this),
            line: this.line.bind(this),
            indent: this.indent.bind(this)
        });

        this.outputBuffer = await Promise.all(this.outputBuffer);

        return this;
    },

    toString(){
        return this.outputBuffer.join('');
    },

    toResponseArray(status = 200, headers = {}){
        return [status, {'content-type': 'text/plain', ...headers}, [this.value.trim()]];
    }
});
