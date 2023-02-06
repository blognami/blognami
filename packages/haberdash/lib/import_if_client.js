
import { IS_CLIENT } from './constants.js';
import { defer } from './defer.js';

export const importIfClient = (name, fn = defaultFn) => {
    return defer(async () => {
        return IS_CLIENT ? import(name) : fn();
    });
};

const defaultFn = () => ({});
