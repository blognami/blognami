
import crypto from 'crypto';

export default {
    create(){
        return this;
    },

    async hasBeenUsed(key){
        return await this.database.withoutTenantScope.usedHashes.where({value: this.createHash(key)}).count() > 0;
    },

    async markAsUsed(key, options = {}){
        const { expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24)) } = options;
        await this.database.usedHashes.insert({
            value: this.createHash(key),
            expiresAt
        });
    },

    createHash(key){
        return crypto.createHash('sha1').update(JSON.stringify(key)).digest('base64');
    }
};