
import 'pinstripe';
import '@blognami/main';
import '@blognami/docs';

import { importAll } from 'pinstripe';

const defaultModules = '@blognami/pages, @blognami/posts, @blognami/tags';
const modules = (process.env.MODULES ?? defaultModules).split(/\s*,\s*/).filter(Boolean);
modules.forEach(module => import(module));

importAll(import.meta.url);
