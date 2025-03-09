
import { importAll } from 'blognami';
import 'blognami/database';
import 'blognami/only-once';

import '@blognami/revisions';
import '@blognami/users';

importAll(import.meta.url);
