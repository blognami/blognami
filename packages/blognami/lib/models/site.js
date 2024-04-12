
import * as crypto from 'crypto';

const passwordTimeToLiveInMinutes = 3;

export default {
    meta(){
        this.include('singleton');
        this.include('revisable');

        this.beforeInsert(function(){
            if(this.salt) return;
            this.salt = crypto.randomUUID();
        });

        this.trackRevisionsFor('description');
    },

    async generatePassword(salt){
        const currentUnixTimestamp = await this.database.getUnixTimestamp();
        return generatePasswords(`${this.salt}:${salt}`, currentUnixTimestamp,  1).pop();
    },

    async verifyPassword(salt, password){
        const unixTimestamp = await this.database.getUnixTimestamp();
        const candidatePasswords = generatePasswords(`${this.salt}:${salt}`, unixTimestamp,  passwordTimeToLiveInMinutes);
        return candidatePasswords.includes(password);
    },
};


const generatePasswords = (salt, unixTimestamp, count) => {
    const out = [];
    const unixTimestampCurrentMinuteStart = Math.floor(unixTimestamp / 60) * 60;
    for(let i = 0; i < count; i++){
        const hash = crypto.createHash('sha1').update(`${salt}:${unixTimestampCurrentMinuteStart - (i * 60)}`).digest('base64');
        out.push(hash.substring(0, 8));
    }
    return out;
};
