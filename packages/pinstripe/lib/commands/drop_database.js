
import { defineCommand } from 'pinstripe';

defineCommand('drop-database', ({ database }) => database.drop());
