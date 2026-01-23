
import 'pinstripe';
import '@pinstripe/database';
import '@blognami/main';

import { importAll } from 'pinstripe';

const modules = ['@blognami/pages', '@blognami/posts', '@blognami/tags', '@blognami/main'];
if(process.env.TENANCY === 'multi'){
    modules.push('@pinstripe/multi-tenant');
    modules.push('blognami.com');
}
if(process.env.JOB_PROCESSING === 'distributed'){
    modules.push('@pinstripe/distributed-jobs');
}
for(const module of modules){
    await import(module);
}

importAll(import.meta.url);
