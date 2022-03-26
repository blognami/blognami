
import { Row } from '../database/row.js';

export default () => {
    return Object.keys(Row.classes).sort();
};
