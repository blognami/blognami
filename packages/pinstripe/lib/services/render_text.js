
import { Text } from "../text.js";

export default {
    create(){
        return this.defer(() => (...args) => Text.render(...args));
    }
};
