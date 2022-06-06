
import { Volume as MemFs } from 'memfs';
import webpack from 'webpack';

import { client } from '../../../client.js';

let cache;

export default async () => {
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
};
