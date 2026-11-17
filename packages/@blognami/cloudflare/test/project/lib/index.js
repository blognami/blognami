
import '@blognami/main';
import '@blognami/pages';
import '@blognami/posts';
import '@blognami/tags';
import '@blognami/cloudflare';

import { importAll } from 'blognami';

importAll(import.meta.url);
