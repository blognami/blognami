
import { Model } from '../model.js';

export default {
    create(){
        return definition => Model.extend().include(definition).new();
    }
};