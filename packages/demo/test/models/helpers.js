
import { ValidationError } from '../../../blognami/lib/validation_error.js';
import '../../lib/index.js';

import { Workspace } from 'blognami';

export const reset = async () => Workspace.run(async function(){
    await this.runCommand('reset-database');
});

export { Workspace } from 'blognami';
