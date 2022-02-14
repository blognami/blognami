
import { Hookable } from './hookable.js';
import { ValidationError } from './validation_error.js';

export const Validatable = {
    meta(){
        this.include(Hookable)
        this.hooks('validateWith', 'beforeValidation', 'afterValidation')
        this.assignProps({
            mustNotBeBlank(name, options = {}){
                const { message = 'Must not be blank' } = options;
                return this.validateWith(validateable => {
                    const value = `${validateable[name] || ''}`.trim();
                    if(!validateable.isValidationError(name) && value == ''){
                        validateable.setValidationError(name, message);
                    }
                });
            },

            mustMatchPattern(name, pattern, options = {}){
                const { message = 'Must match pattern' } = options;
                return this.validateWith(validateable => {
                    const value = `${validateable[name] || ''}`.trim();
                    if(!validateable.isValidationError(name) && !value.match(pattern)){
                        validateable.setValidationError(name, message);
                    }
                });
            },

            mustBeAValidEmail(name, options = {}){
                const { message = 'Must be a valid email',  ...otherOptions } = options;
                return this.mustMatchPattern(name, /^[^@]+@[^@]+$/, { message, ...otherOptions });
            }
        })
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

    async validate(){
        await this._runBeforeValidationCallbacks();
        this._validationErrors = {};
        await this._runValidateWithCallbacks();
        if(this.isValidationError()){
            throw new ValidationError(this.validationErrors);
        }
        await this._runAfterValidationCallbacks();
        return this;
    }
};
