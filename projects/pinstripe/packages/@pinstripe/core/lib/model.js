
import { Row } from './database/row.js'

export const model = (name, fn) => {
    Row.register(name).define(fn);
};
