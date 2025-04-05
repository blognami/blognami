
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

    async render(fn){
        await fn({
            echo: echo.bind(this),
            line: line.bind(this),
            indent: indent.bind(this)
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


function echo(stringable){
    this.outputBuffer.push((async () => `${await stringable}`)());
}

function line(stringable = ''){
    if(this.outputBuffer.length){
        echo.call(this, (async () => `\n${await stringable}`)());
    } else {
        echo.call(this, stringable);
    }
}

function indent(fn){
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
}
