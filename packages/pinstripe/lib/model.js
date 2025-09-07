
import { Class } from './class.js';
import { Hookable } from './hookable.js';
import { ValidationError } from './validation_error.js';

export const Model = Class.extend().include({
    meta(){
        
        this.include(Hookable);

        this.assignProps({
            mustNotBeBlank(name, options = {}){
                const { message = 'Must not be blank', when = () => true } = options;
                return this.on('validation', async validateable => {
                    if(validateable.isValidationError(name)) return;
                    if(! await when.call(validateable, validateable)) return;
                    const value = `${validateable[name] || ''}`.trim();
                    if(value == ''){
                        validateable.setValidationError(name, message);
                    }
                });
            },

            mustMatchPattern(name, pattern, options = {}){
                const { message = 'Must match pattern', when = () => true } = options;
                return this.on('validation', async validateable => {
                    if(validateable.isValidationError(name)) return;
                    if(! await when.call(validateable, validateable)) return;
                    const value = `${validateable[name] || ''}`.trim();
                    if(!value.match(pattern)){
                        validateable.setValidationError(name, message);
                    }
                });
            },

            mustBeAValidEmail(name, options = {}){
                const { message = 'Must be a valid email',  ...otherOptions } = options;
                return this.mustMatchPattern(name, /^[^@]+@[^@]+$/, { message, ...otherOptions });
            }
        });
    },

    get validationErrors(){
        if(!this._validationErrors){
            this._validationErrors = {};
        }
        return this._validationErrors;
    },

    setValidationError(name, message){
        this.validationErrors[name] = message;
        return this;
    },

    isValidationError(name){
        if(name){ 
            return this.validationErrors[name] !== undefined;
        }
        return Object.keys(this.validationErrors).length > 0;
    },

    async validate(options = {}){
        const { validateWith = () => {} } = options;
        await this.trigger('before:validation');
        this._validationErrors = {};
        await this.trigger('validation');
        await validateWith.call(this, this);
        this.throwValidationErrors();
        await this.trigger('after:validation');
        return this;
    },

    throwValidationErrors(){
        if(this.isValidationError()){
            throw new ValidationError(this.validationErrors);
        }
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

