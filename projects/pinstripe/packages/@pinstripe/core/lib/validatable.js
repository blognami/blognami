
import { Hookable } from './hookable.js';
import { ValidationError } from './validation_error.js';

export const Validatable = dsl => (dsl
    .include(Hookable)
    .hooks('validateWith', 'beforeValidation', 'afterValidation')
    .classProps({
        ['dsl.mustNotBeBlank'](name){
            this.define(dsl => dsl
                .validateWith(validateable => {
                    if(!validateable.isValidationError(name) && `${validateable[name] || ''}` == ''){
                        validateable.setValidationError(name, 'Must not be blank');
                    }
                })
            );
        }
    })
    .props({
        get validationErrors(){
            if(!this._validationErrors){
                this._validationErrors = {};
            }
            return this._validationErrors;
        },

        set validationErrors(value){
            this._validationErrors = value;
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

        throwValidationError(errors = {}) {
            throw new ValidationError(errors);
        },

        async validate(){
            await this._runBeforeValidationCallbacks();
            this.validationErrors = {};
            await this._runValidateWithCallbacks();
            if(this.isValidationError()){
                this.throwValidationError(this.validationErrors);
            }
            await this._runAfterValidationCallbacks();
            return this;
        }
    })
);
