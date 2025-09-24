
import { Workspace } from '../workspace.js';

const runInNewWorkspace = fn => Workspace.run(fn);

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return runInNewWorkspace;
    }
};
