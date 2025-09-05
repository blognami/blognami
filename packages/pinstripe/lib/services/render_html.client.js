
import { Html } from "../html.js";

export default {
    create(){
        return this.defer(() => (...args) => Html.render(...args));
    }
};
