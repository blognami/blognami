import { hash, compare } from 'bcrypt';

export default {
    meta(){
        this.hasMany('sessions');

        this.mustNotBeBlank('name');
        this.mustNotBeBlank('email');
        this.mustBeAValidEmail('email');
        this.mustNotBeBlank('encryptedPassword');

        this.beforeValidation(async function(){
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

        this.mustNotBeBlank('role');
    },

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
};
