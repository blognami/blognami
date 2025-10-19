
import { Hookable } from './hookable.js';
import { ValidationError } from './validation_error.js';

export const Validateable = {
    meta(){
        this.include(Hookable);
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
        await this.runHook('beforeValidation');
        this._validationErrors = {};
        await this.runHook('validation');
        await validateWith.call(this, this);
        this.throwValidationErrors();
        await this.runHook('afterValidation');
        return this;
    },

    throwValidationErrors(){
        if(this.isValidationError()){
            throw new ValidationError(this.validationErrors);
        }
    },
};
