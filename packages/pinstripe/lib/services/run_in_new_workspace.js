
import { Workspace } from '../workspace.js';

export const client = true;

const runInNewWorkspace = fn => Workspace.run(fn);

export default {
    create(){
        return runInNewWorkspace;
    }
};
