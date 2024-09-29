
import * as crypto from 'crypto';

export default {
    meta(){
        this.include('singleton');

        this.beforeInsert(function(){
            if(this.webhookSecret) return;
            this.webhookSecret = crypto.randomUUID();
        });
    }
};
