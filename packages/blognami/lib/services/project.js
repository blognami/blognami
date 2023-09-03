
import { Project } from '../project.js';

export default {
    create(){
        return this.defer(() =>  Project.instance);
    }
};
