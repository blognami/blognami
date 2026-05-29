
import 'haberdash/node';

export { importAll } from 'haberdash/lib/import_all.js';

import { importAll } from 'haberdash/lib/import_all.js';
import { IS_SERVER } from './constants.js';

if(IS_SERVER) importAll(import.meta.url);
