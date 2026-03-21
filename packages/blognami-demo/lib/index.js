
import 'pinstripe';
import '@pinstripe/database';
import '@blognami/main';

import { importAll } from 'pinstripe';

const modules = ['@blognami/pages', '@blognami/posts', '@blognami/tags'];
if(process.env.TENANCY === 'multi'){
    modules.push('@pinstripe/multi-tenant');
}
for(const module of modules){
    await import(module);
}

importAll(import.meta.url);
