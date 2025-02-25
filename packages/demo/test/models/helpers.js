
import '../../lib/index.js';

import { Workspace } from 'blognami';

export const reset = async () => Workspace.run(async function(){
    await this.runCommand('database:reset');
});

export { Workspace } from 'blognami';
