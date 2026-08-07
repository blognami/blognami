
import 'blognami';
import '@blognami/database';
import '@blognami/main';

import { importAll } from 'blognami';

const modules = ['@blognami/pages', '@blognami/posts', '@blognami/tags'];
if(process.env.TENANCY === 'multi'){
    modules.push('@blognami/multi-tenant');
}
for(const module of modules){
    await import(module);
}

importAll(import.meta.url);
