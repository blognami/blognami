
import { build } from 'esbuild';
import { promisify } from 'util';
import { writeFile, readFile } from 'fs';
import { dirSync } from 'tmp';

import { Client } from '../client.js';

let buildPromise;

export default {
    create(){
        return this.defer(() => this);
    },

    async build(options = {}){
        const { force = false } = options;
        if(!buildPromise || force){
            buildPromise = this._build();
        }
        return buildPromise;
    },

    async _build(){
        const { name: tmpDir, removeCallback: deleteTmpDir } = dirSync({ unsafeCleanup: true });
        const inFile = `${tmpDir}/in.js`;
        const outFile = `${tmpDir}/out.js`;

        await promisify(writeFile)(inFile, Client.instance.modules.map((_, i) => `import ${JSON.stringify(`${tmpDir}/module-${i}.js`)};`).join('\n'));

        for(let i = 0; i < Client.instance.modules.length; i++){
            await promisify(writeFile)(`${tmpDir}/module-${i}.js`, Client.instance.modules[i]);
        }
        
        await build({
            entryPoints: [inFile],
            bundle: true,
            sourcemap: true,
            outfile: outFile,
            plugins: [this.plugin],
        });

        const out = {
            js: (await promisify(readFile)(outFile, 'utf8')).replace(/\/\/#.*?$/m, ''),
            map: await promisify(readFile)(`${outFile}.map`, 'utf8'),
        };

        await deleteTmpDir();

        return out;
    },

    get plugin(){
        return {
            name: 'pinstripe',
        
            async setup(build){
                build.onLoad({ filter: /\.js$/ }, async args => {
                    const { path } = args;
                    const contents = await promisify(readFile)(path, 'utf8');
                    if(!contents.match(/pinstripe-if-client/)) return;
                    const alteredContents = contents.replace(/(.*)\/\/\s*pinstripe-if-client:\s*(.*)/g, '$2 // pinstripe-if-server: $1');
                    return { contents: alteredContents, loader: 'js' };
                });
            }
        };
    }
};
