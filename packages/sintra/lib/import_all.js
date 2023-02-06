
import { importAll, IS_SERVER } from 'haberdash';

if(IS_SERVER) importAll(import.meta.url);

export { importAll } from 'haberdash';
