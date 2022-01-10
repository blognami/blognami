
import { Volume as MemFs } from 'memfs';
import webpack from 'webpack';
import { defineView } from 'pinstripe';

import { client } from '../client.js';
import { StyleSheet } from '../style_sheet.js';


let cache;

defineView('bundle.js', async () => {
    if(!cache){
        const inputVolume = await client.createFs('/pinstripeInput.js');
        const outputVolume = new MemFs();

        const compiler = webpack({
            mode: 'development',
            entry: '/pinstripeInput.js',
            output: {
                path: '/',
                filename: 'pinstripeOutput.js',
            }
        });
        compiler.inputFileSystem = inputVolume;
        compiler.outputFileSystem = outputVolume;

        cache = await new Promise((resolve, reject) => {
            compiler.run((error) => {
                if(error){
                    reject(error);
                } else {
                    resolve(outputVolume.readFileSync('/pinstripeOutput.js'));
                }
            })
        });   
    }
    return [ 200, {'content-type': 'text/javascript'}, [ cache ]];
});

let cssCache;

defineView('bundle.css', async environment => {
    if(!cssCache){
        cssCache = await StyleSheet.compile(environment);
    }
    return [ 200, {'content-type': 'text/css'}, [ cssCache ]];
});
