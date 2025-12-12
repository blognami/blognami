
import '../../lib/index.js';

import { Workspace } from 'pinstripe';

export const reset = async () => Workspace.run(async function(){
    await this.runCommand('reset-database');
});

export { Workspace } from 'pinstripe';
