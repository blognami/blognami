
import * as crypto from 'crypto';

const passwordTimeToLiveInMinutes = 3;

export default {
    meta(){
        this.hasMany('sessions');

        this.mustNotBeBlank('name');
        this.mustNotBeBlank('email');
        this.mustBeAValidEmail('email');
        this.mustNotBeBlank('role');

        this.beforeInsert(function(){
            if(this.salt) return;
            this.salt = crypto.randomUUID();
        });
    },

    async initialize(...args){
        await this.constructor.parent.prototype.initialize.call(this, ...args);
    },

    async generatePassword(){
        const currentUnixTimestamp = await this._database.getUnixTimestamp();
        return generatePasswords(this.salt, this.lastSuccessfulSignInAt, currentUnixTimestamp,  1).pop();
    },

    async verifyPassword(password){
        const unixTimestamp = await this._database.getUnixTimestamp();
        const candidatePasswords = generatePasswords(this.salt, this.lastSuccessfulSignInAt, unixTimestamp,  passwordTimeToLiveInMinutes);
        return candidatePasswords.includes(password);
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

const generatePasswords = (salt, lastSuccessfulSignInAt, unixTimestamp, count) => {
    const out = [];
    const unixTimestampCurrentMinuteStart = Math.floor(unixTimestamp / 60) * 60;
    for(let i = 0; i < count; i++){
        const hash = crypto.createHash('sha1').update(`${salt}:${lastSuccessfulSignInAt.getTime() / 1000}:${unixTimestampCurrentMinuteStart - (i * 60)}`).digest('base64');
        out.push(hash.substring(0, 8));
    }
    return out;
};