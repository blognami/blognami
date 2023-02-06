
import { IS_SERVER } from './constants.js';
import { defer } from './defer.js';

export const importIfServer = (name, fn = defaultFn) => {
    return defer(async () => {
        return IS_SERVER ? import(name) : fn();
    });
};

const defaultFn = () => ({});
