
import { deepMerge } from "@pinstripe/utils";

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
