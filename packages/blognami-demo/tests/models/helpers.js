
import '../../lib/index.js';

import { Workspace } from 'blognami';

// The first reset in a process rebuilds the schema from scratch; the rest only wipe the rows and reseed.
let schemaIsCurrent = false;

export const reset = async () => Workspace.run(async function(){
    if(schemaIsCurrent){
        await this.runCommand('reseed-database');
    } else {
        await this.runCommand('reset-database');
        schemaIsCurrent = true;
    }
});

export { Workspace } from 'blognami';
