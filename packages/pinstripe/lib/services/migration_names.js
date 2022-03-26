
import { Migration } from '../database/migration.js'

export default () => {
    return Object.keys(Migration.classes).sort();
};
