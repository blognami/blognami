
import 'sintra';
import '@blognami/main';

import { importAll } from 'sintra';

const defaultModules = '@blognami/pages, @blognami/posts, @blognami/tags';
const modules = (process.env.MODULES ?? defaultModules).split(/\s*,\s*/).filter(Boolean);
modules.forEach(module => import(module));

importAll(import.meta.url);
