
import { deepMerge } from "./deep_merge.js";

export const Annotatable = {
    meta(){
        this.assignProps({
            get annotations(){
                if(!this.hasOwnProperty('_annotations')){
                    this._annotations = {};
                }
                return this._annotations;
            },

            annotate(annotations){
                deepMerge(this.annotations, annotations);
            }
        })
    }
};
