
import { Html } from "../html.js";

export const client = {
    create(){
        return this.defer(() => (...args) => Html.render(...args));
    }
};

export default client;