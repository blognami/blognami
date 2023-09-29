
import '../../lib/index.js';

import { Workspace } from 'haberdash';

export const reset = async () => Workspace.run(async function(){
    await this.runCommand('reset-database');
});

export { Workspace } from 'haberdash';
