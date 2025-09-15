
import '../../lib/index.js';

import test from 'node:test';

import { Workspace } from 'pinstripe';

test(`database.lock (1)`, () => Workspace.run(async function(){
    await Promise.all([
        this.database.lock(async () => {
            await new Promise(resolve => setTimeout(resolve));
        }),
        this.database.lock(async () => {
            await new Promise(resolve => setTimeout(resolve));
        })
    ]);
}));

test(`database.lock (2)`, () => Workspace.run(async function(){
    await Promise.all([
        this.database.lock(async () => {
            await new Promise(resolve => setTimeout(resolve));
        }),
        this.runInNewWorkspace(async function(){
            await this.database.lock(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
        })
    ]);
}));
