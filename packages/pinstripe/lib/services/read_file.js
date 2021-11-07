import { promisify } from 'util'; // pinstripe-if-client: const promisify = undefined;
import { readFile } from 'fs'; // pinstripe-if-client: const readFile = undefined;

export default () => {
    return filePath => promisify(readFile)(filePath)
};
