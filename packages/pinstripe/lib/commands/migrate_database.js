
import { defineCommand } from 'pinstripe';

defineCommand('migrate-database', ({ database }) => database.migrate());  
