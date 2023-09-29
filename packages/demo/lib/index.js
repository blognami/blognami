
import 'blognami';

import { importAll } from 'haberdash';


if(process.env.TENANCY == 'multi') import('haberdash/multi-tenant');

importAll(import.meta.url);
