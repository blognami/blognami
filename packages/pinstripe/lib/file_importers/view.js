import { promisify } from 'util'; // pinstripe-if-client: const promisify = undefined;
import { readFile } from 'fs'; // pinstripe-if-client: const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // pinstripe-if-client: const mimeTypes = undefined;

import { FileImporter } from "../file_importer.js";
import { View } from "../view.js";

FileImporter.register('view', {
    async importFile(){
        const {relativeFilePath, filePath} = this;
        View.register(relativeFilePath, {
            meta(){
                this.filePaths.push(filePath);
            },

            render(){
                return renderFile(filePath);
            }
        });
    }
});

const renderFile = async filePath => [
    200,
    { 'content-type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
    [ await promisify(readFile)(filePath) ]
];