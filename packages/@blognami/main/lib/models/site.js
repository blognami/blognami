import * as crypto from 'crypto';

const passwordTimeToLiveInMinutes = 3;
const passwordCharset = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32 — no ambiguous I, L, O or U
const passwordLength = 8;

export default {
    meta(){
        this.include('singleton');
        this.include('revisable');

        this.addHook('beforeInsert', function(){
            if(this.salt) return;
            this.salt = crypto.randomUUID();
        });

        this.trackRevisionsFor('navigation');
    },

    async generatePassword(salt){
        const currentUnixTimestamp = await this.database.getUnixTimestamp();
        return generatePasswords(`${this.salt}:${salt}`, currentUnixTimestamp,  1).pop();
    },

    async verifyPassword(salt, password){
        const unixTimestamp = await this.database.getUnixTimestamp();
        const candidatePasswords = generatePasswords(`${this.salt}:${salt}`, unixTimestamp,  passwordTimeToLiveInMinutes);
        return candidatePasswords.includes(normalizePassword(password));
    },
};


const generatePasswords = (salt, unixTimestamp, count) => {
    const out = [];
    const unixTimestampCurrentMinuteStart = Math.floor(unixTimestamp / 60) * 60;
    for(let i = 0; i < count; i++){
        const digest = crypto.createHash('sha1').update(`${salt}:${unixTimestampCurrentMinuteStart - (i * 60)}`).digest();
        let password = '';
        for(let j = 0; j < passwordLength; j++){
            password += passwordCharset[digest[j] % passwordCharset.length];
        }
        out.push(password);
    }
    return out;
};

// Forgiving on entry: ignore case, map the ambiguous glyphs users are likely to
// type back to their canonical Crockford digits, and drop the display dash/spaces.
const normalizePassword = password => [...`${password}`.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')]
    .filter(character => passwordCharset.includes(character))
    .join('');