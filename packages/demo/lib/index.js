
import '@blognami/default';

import { importAll } from 'blognami';

if(process.env.TENANCY == 'multi') import('blognami/multi-tenant');

importAll(import.meta.url);
