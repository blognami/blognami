
import { build } from 'esbuild';
import { promisify } from 'util';
import { isBuiltin } from 'module';
import { fileURLToPath } from 'url';
import { writeFile, readFile } from 'fs';
import { dirSync } from 'tmp';
import { Bundle, Project } from 'blognami';

const buildPromises = {};

// This package's lib directory, as a generated module spells it in an import.
const OWN_LIB_PATH = JSON.stringify(fileURLToPath(new URL('..', import.meta.url))).slice(1, -1);

export default {
    create(){
        return this.defer(() => this);
    },

    build(name = 'window', options = {}){
        const { force = false } = options;
        if(!buildPromises[name] || force){
            const { modules, flags } = Bundle.create(name).constructor;
            // The server service worker is built without this package's services and command, so the core jsBundler and cssBundler stand in.
            buildPromises[name] = this.buildBundle(flags.includes('server') ? modules.filter(module => !module.includes(OWN_LIB_PATH)) : modules, flags);
        }
        return buildPromises[name];
    },

    async buildBundle(modules, flags = []){
        const { name: tmpDir, removeCallback: deleteTmpDir } = dirSync({ unsafeCleanup: true });
        const inFile = `${tmpDir}/in.js`;
        const outFile = `${tmpDir}/out.js`;
        const isServer = flags.includes('server');

        // A server module that is an export statement is the bundle's own export, so it stands in the entry file as written.
        await promisify(writeFile)(inFile, modules.map((module, i) => isServer && module.trimStart().startsWith('export ') ? module : `import ${JSON.stringify(`${tmpDir}/module-${i}.js`)};`).join('\n'));

        for(let i = 0; i < modules.length; i++){
            await promisify(writeFile)(`${tmpDir}/module-${i}.js`, modules[i]);
        }

        const { errors } = await build({
            entryPoints: [inFile],
            bundle: true,
            sourcemap: true,
            outfile: outFile,
            plugins: [this.createPlugin(flags)],
            nodePaths: await Project.instance.nodePaths,
            minify: process.env.NODE_ENV == 'production',
            logLevel: 'silent',
            // The server service worker is an ES module, its Node built-ins left for the runtime to resolve.
            ...(isServer ? { format: 'esm', platform: 'node' } : {})
        });

        errors.forEach(error => console.error(error));

        const out = {
            // Only the closing source map comment: the server service worker holds views with one of their own inside a string.
            js: (await promisify(readFile)(outFile, 'utf8')).replace(/\/\/#.*(?=\n?$)/, ''),
            map: await promisify(readFile)(`${outFile}.map`, 'utf8'),
        };

        await deleteTmpDir();

        return out;
    },

    createPlugin(flags = []){
        return {
            name: 'blognami',

            async setup(build){
                // An ES module has no `require`, so a CommonJS require of a Node built-in is answered by a module that imports it.
                if(flags.includes('server')){
                    build.onResolve({ filter: /.*/ }, ({ path, kind }) => {
                        if(kind == 'require-call' && isBuiltin(path)) return { path, namespace: 'node-builtin' };
                    });
                    build.onLoad({ filter: /.*/, namespace: 'node-builtin' }, ({ path }) => ({
                        contents: `import builtin from ${JSON.stringify(path)}; module.exports = builtin;`
                    }));
                }

                build.onLoad({ filter: /\.js$/ }, async args => {
                    const { path } = args;
                    const contents = await promisify(readFile)(path, 'utf8');
                    if(!contents.includes('blognami-if(')) return;
                    const alteredContents = contents.replace(/(.*)\/\/\s*blognami-if\(([^)]*)\):\s*(.*)/g, (line, before, markerFlags, after) => {
                        const applies = markerFlags.split(',').every(flag => flags.includes(flag.replace(/-(\w)/g, (_, char) => char.toUpperCase())));
                        return applies ? `${after} // blognami-if-not(${markerFlags}): ${before}` : line;
                    });
                    return { contents: alteredContents, loader: 'js' };
                });
            }
        };
    }
};
