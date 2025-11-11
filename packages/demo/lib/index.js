
import 'pinstripe';
import '@pinstripe/database';
import '@blognami/main';

import { importAll } from 'pinstripe';

const defaultModules = '@blognami/pages, @blognami/posts, @blognami/tags, @blognami/main';
const modules = (process.env.MODULES ?? defaultModules).split(/\s*,\s*/).filter(Boolean);
modules.forEach(module => import(module));

importAll(import.meta.url);
