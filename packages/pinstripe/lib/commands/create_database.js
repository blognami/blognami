
import { defineCommand } from 'pinstripe';

defineCommand('create-database', ({ database }) => database.create());
