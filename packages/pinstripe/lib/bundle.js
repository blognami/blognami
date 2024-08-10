
import { build } from 'esbuild';
import { promisify } from 'util';
import { writeFile, readFile } from 'fs';
import { dirSync } from 'tmp';
import { fileURLToPath } from 'url';

import { Class } from './class.js';
import { Registry } from './registry.js';
import { Project } from './project.js';

export const Bundle = Class.extend().include({
    meta(){
        this.include(Registry);

        this.assignProps({
            get modules(){
                if(!this.hasOwnProperty('_modules')){
                    this._modules = [];
                }
                return this._modules;
            },

            addModule(environment, module){
                this.register(environment, {
                    meta(){
                        this.modules.push(module);
                    }
                });
            },
        });
    },

    async build(options = {}){
        const { force = false } = options;
        if(!this.constructor.buildPromise || force){
            this.constructor.buildPromise = this._build();
        }
        return this.constructor.buildPromise;
    },

    async _build(){
        const { name: tmpDir, removeCallback: deleteTmpDir } = dirSync({ unsafeCleanup: true });
        const inFile = `${tmpDir}/in.js`;
        const outFile = `${tmpDir}/out.js`;

        await promisify(writeFile)(inFile, this.constructor.modules.map((_, i) => `import ${JSON.stringify(`${tmpDir}/module-${i}.js`)};`).join('\n'));

        for(let i = 0; i < this.constructor.modules.length; i++){
            await promisify(writeFile)(`${tmpDir}/module-${i}.js`, this.constructor.modules[i]);
        }
        
        await build({
            entryPoints: [inFile],
            bundle: true,
            sourcemap: true,
            outfile: outFile,
            plugins: [this.plugin],
            nodePaths: await Project.instance.nodePaths,
            minify: process.env.NODE_ENV == 'production'
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
});

['window', 'worker'].forEach(environment => {
    Bundle.addModule(environment, `import ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};`);
});