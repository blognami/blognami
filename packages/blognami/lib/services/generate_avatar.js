
import { generateFromString } from 'generate-avatar'

export default {
    create(){
        return (string) => generateFromString(string);
    }
};
