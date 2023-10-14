
import 'blognami';

import { importAll } from 'pinstripe';

if(process.env.TENANCY == 'multi') import('@pinstripe/multi-tenant');

importAll(import.meta.url);
