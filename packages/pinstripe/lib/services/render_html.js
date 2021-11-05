
import { Html } from '../html.js';

export default async () => {
    return (...args) => Html.render(...args);
};
