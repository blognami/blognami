
import 'haberdash/node'; // blognami-if(server,service-worker): // kept out: what the walk registers on Node is built in statically

import { importAll } from 'haberdash/lib/import_all.js'; // blognami-if(server,service-worker): const importAll = () => {};
import { IS_SERVER } from './constants.js';

export { importAll };

if(IS_SERVER) importAll(import.meta.url);
