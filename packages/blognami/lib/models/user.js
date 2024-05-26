
import * as crypto from 'crypto';

export default {
    meta(){
        this.include('pageable');

        this.hasMany('sessions');
        this.hasMany('posts');
        this.hasMany('comments');

        this.mustNotBeBlank('name');
        this.mustNotBeBlank('email');
        this.mustBeAValidEmail('email');
        this.mustBeUnique('email');
        this.mustNotBeBlank('role');

        this.beforeInsert(function(){
            if(this.salt) return;
            this.salt = crypto.randomUUID();
        });
    },

    async generatePassword(){
        return this.database.site.generatePassword(`${this.salt}:${this.lastSuccessfulSignInAt}`);
    },

    verifyPassword(password){
        return this.database.site.verifyPassword(`${this.salt}:${this.lastSuccessfulSignInAt}`, password);
    },

    logSuccessfulSignIn(){
        return this.update({
            lastSuccessfulSignInAt: Date.now()
        });
    },

    logFailedSignIn(){
        return this.update({
            lastFailedSignInAt: Date.now()
        });
    }
};
