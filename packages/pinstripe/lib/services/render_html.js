
import { Html } from "../html.js";

export const client = true;

export default {
    create(){
        return this.defer(() => (...args) => Html.render(...args));
    }
};
