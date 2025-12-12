
import 'pinstripe';
import '@pinstripe/database';
import '@blognami/main';

import { importAll } from 'pinstripe';

const modules = ['@blognami/pages', '@blognami/posts', '@blognami/tags', '@blognami/main'];
if(process.env.TENANCY === 'multi'){
    modules.push('@pinstripe/multi-tenant');
    modules.push('blognami.com');
}
modules.forEach(module => import(module));

importAll(import.meta.url);
