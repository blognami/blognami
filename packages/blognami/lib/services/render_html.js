
import { Html } from "../html.js";

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return this.defer(() => (...args) => Html.render(...args));
    }
};
