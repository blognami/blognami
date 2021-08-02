
import { defineService } from 'pinstripe';

import { Database } from '../database.js';

defineService('database', { scope: 'root' }, environment => Database.new(environment));

