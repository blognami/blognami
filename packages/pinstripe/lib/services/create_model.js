
import { Base } from '../base.js';
import { Validatable } from '../validatable.js';

export default () => {
    return definition => Base.extend().include({
        meta(){
            this.include(Validatable);
            this.include(definition);
        },

        toFormAdapter(){
            return {
                title: 'Submit',
                fields: [],
                submitTitle: 'Submit',
                cancelTitle: 'Cancel',
                submit: async (values, fn) => {
                    Object.assign(this, values);
                    await this.validate();
                    return fn(this);
                }
            }
        }
    }).new();
};