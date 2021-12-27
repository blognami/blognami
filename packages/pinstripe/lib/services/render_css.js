
import { Css } from '../css.js';

export default async () => {
    return (...args) => Css.render(...args);
};
