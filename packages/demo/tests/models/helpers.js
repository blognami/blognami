
import '../../lib/index.js';

import { Workspace } from 'pinstripe';

export const reset = async () => Workspace.run(async function(){
    await this.runCommand('reset-database');
});

const defaultModules = '@blognami/pages, @blognami/posts, @blognami/tags';
export const modules = (process.env.MODULES ?? defaultModules).split(/\s*,\s*/).filter(Boolean);

export { Workspace } from 'pinstripe';
