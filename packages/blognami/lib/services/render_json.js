
import { Json } from "../json.js";

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return this.defer(() => (...args) => Json.render(...args));
    }
};
