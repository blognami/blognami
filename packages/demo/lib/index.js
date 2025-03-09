
import 'blognami';
import '@blognami/main';
import '@blognami/pages';
import '@blognami/posts';
import '@blognami/tags';

import { importAll } from 'blognami';

if(process.env.TENANCY == 'multi') import('blognami/multi-tenant');

importAll(import.meta.url);
