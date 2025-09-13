
import '../../lib/index.js';

import test from 'node:test';
import assert from 'node:assert';

import { Workspace } from 'pinstripe';


test(`database.lock`, () => Workspace.run(async function(){
    await Promise.all([
        this.database.lock(async () => {
            await new Promise(resolve => setTimeout(resolve));
        }, '1'),
        this.database.lock(async () => {
            await new Promise(resolve => setTimeout(resolve));
        }, 'lock2')
    ])
}));
