
import { Class } from './class.js';
import { ValidationError } from './validation_error.js';

export const Model = Class.extend().include({
    meta(){
        defineCallbacks.call(this, 'validateWith', 'beforeValidation', 'afterValidation');
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

    async validate(){
        await this._runBeforeValidationCallbacks();
        this._validationErrors = {};
        await this._runValidateWithCallbacks();
        if(this.isValidationError()){
            throw new ValidationError(this.validationErrors);
        }
        await this._runAfterValidationCallbacks();
        return this;
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
});

export function defineCallbacks(...names){
    names.forEach(name => {
        const callbacks = `${name}Callbacks`;
        const _callbacks = `_${callbacks}`;

        this.assignProps({
            get [callbacks](){
                if(!this.hasOwnProperty(_callbacks)){
                    this[_callbacks] = [];
                }
                return this[_callbacks];
            },

            [name](fn){
                this[callbacks].push(fn);
                return this;
            }
        });

        this.include({
            async [`_run${name[0].toUpperCase() + name.slice(1)}Callbacks`](){
                for(let i = 0; i < this.constructor[callbacks].length; i++){
                    await this.constructor[callbacks][i].call(this, this);
                }
            }
        });
    });
    return this;
}

