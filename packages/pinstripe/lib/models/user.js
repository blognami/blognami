import { hash, compare } from 'bcrypt';
import { defineModel } from 'pinstripe';

defineModel('user', ({ hasMany, mustNotBeBlank, mustBeAValidEmail, beforeValidation, props }) => {
    hasMany('sessions');

    mustNotBeBlank('name');
    mustNotBeBlank('email');
    mustBeAValidEmail('email');
    mustNotBeBlank('encryptedPassword');

    beforeValidation(async function(){
        if(this.password){
            this.encryptedPassword = await new Promise((resolve, reject) => {
                hash(this.password, 10, (error, encryptedPassword) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(encryptedPassword)
                    }
                });
            });
        }
    });

    props({
        initialize(...args){
            this.constructor.parent.prototype.initialize.call(this, ...args);
            this.password = null;
        },

        comparePassword(password){
            return new Promise((resolve, reject) => {
                compare(password, this.encryptedPassword, (error, isEqual) => {
                    if(error){
                        reject(error);
                    } else {
                        resolve(isEqual);
                    }
                });
            });
        }
    });
});
