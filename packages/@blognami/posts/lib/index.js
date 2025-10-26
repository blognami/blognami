
import '@blognami/comments';
import '@blognami/home';
import '@blognami/images';
import '@blognami/main';
import '@blognami/revisions';
import '@blognami/site';
import '@blognami/tags';
import '@blognami/users';

import { importAll } from 'pinstripe';

importAll(import.meta.url);
