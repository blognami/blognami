
import 'blognami';

import { Workspace } from 'pinstripe';

export const reset = async () => Workspace.run(async function(){
    await this.database.drop();
    await this.database.migrate();
});

export { Workspace } from 'pinstripe';
