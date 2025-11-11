
import { Class } from './class.js';
import { Validateable } from './validateable.js';


export const Model = Class.extend().include({
    meta(){
        this.include(Validateable);

        this.assignProps({
            mustNotBeBlank(name, options = {}){
                const { message = 'Must not be blank', when = () => true } = options;
                return this.addHook('validation', async function(){
                    if(this.isValidationError(name)) return;
                    if(! await when.call(this, this)) return;
                    const value = `${this[name] || ''}`.trim();
                    if(value == ''){
                        this.setValidationError(name, message);
                    }
                });
            },

            mustMatchPattern(name, pattern, options = {}){
                const { message = 'Must match pattern', when = () => true } = options;
                return this.addHook('validation', async function(){
                    if(this.isValidationError(name)) return;
                    if(! await when.call(this, this)) return;
                    const value = `${this[name] || ''}`.trim();
                    if(!value.match(pattern)){
                        this.setValidationError(name, message);
                    }
                });
            },

            mustBeAValidEmail(name, options = {}){
                const { message = 'Must be a valid email',  ...otherOptions } = options;
                return this.mustMatchPattern(name, /^[^@]+@[^@]+$/, { message, ...otherOptions });
            }
        });
    },

    toFormAdapter(){
        return {
            title: 'Submit',
            fields: [],
            submitTitle: 'Submit',
            cancelTitle: 'Cancel',
            submit: async (values, options = {}) => {
                const { success = () => {}, validateWith } = options;
                Object.assign(this, values);
                await this.validate({ validateWith });
                return success(this);
            }
        }
    }
});

