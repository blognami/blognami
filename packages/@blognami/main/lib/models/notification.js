import * as crypto from 'crypto';

export default {
    meta(){
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('body');

        this.scope('body', function(body){
            const bodyHash = crypto.createHash('sha1').update(body || '').digest('base64');
            return this.where({ bodyHash });
        });

        this.addHook('beforeValidation', function(){
            const now = new Date();

            if(!this.createdAt){
                this.createdAt = now;
            }
            if(!this.updatedAt){
                this.updatedAt = now;
            }

            this.bodyHash = crypto.createHash('sha1').update(this.body || '').digest('base64');
        });

        this.addHook('beforeUpdate', function(){
            this.updatedAt = new Date();
        });
    }
};