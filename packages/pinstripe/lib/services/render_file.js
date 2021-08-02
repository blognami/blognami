import { default as mimeTypes } from 'mime-types'; // pinstripe-if-client: const mimeTypes = undefined;
import { promisify } from 'util'; // pinstripe-if-client: const promisify = undefined;
import { readFile } from 'fs'; // pinstripe-if-client: const readFile = undefined;
import { defineService } from 'pinstripe';

defineService('renderFile', () => {
    return async (filePath) => [
        200,
        { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
        [ await promisify(readFile)(filePath) ]
    ];
});
