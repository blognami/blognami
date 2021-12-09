import { default as mimeTypes } from 'mime-types'; // pinstripe-if-client: const mimeTypes = undefined;

export default ({ readFile }) => {
    return async (filePath) => [
        200,
        { 'content-type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
        [ await readFile(filePath) ]
    ];
};
