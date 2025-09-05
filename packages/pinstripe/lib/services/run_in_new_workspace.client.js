
import { Workspace } from '../workspace.js';

const runInNewWorkspace = fn => Workspace.run(fn);

export default {
    create(){
        return runInNewWorkspace;
    }
};
