import { importAll } from 'blognami';

importAll(import.meta.url);

export { Client } from './client.js';
export { Row } from './row.js';
export { Table } from './table.js';
export { Union } from './union.js';
export { Migration } from './migration.js';
export { Migrator } from './migrator.js';
export { Database, Database as default } from './database.js';

// blognami-if(server,service-worker): import './singleton.js'; // the walk imports it on Node
// blognami-if(server,service-worker): import './untenantable.js'; // the walk imports it on Node
