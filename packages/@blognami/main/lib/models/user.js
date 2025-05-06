
import * as crypto from 'crypto';



export default {
    meta(){
        this.include('pageable');

        this.hasMany('sessions');
        this.hasMany('posts');
        this.hasMany('comments');
        this.hasMany('notifications');

        this.mustNotBeBlank('name');
        this.mustNotBeBlank('email');
        this.mustBeAValidEmail('email');
        this.mustBeUnique('email');
        this.mustNotBeBlank('role');

        this.beforeInsert(function(){
            if(this.salt) return;
            this.salt = crypto.randomUUID();
        });

        this.assignProps({
            asapNotificationDelay: 10 * 60 * 1000,
        });

        this.scope('readyToDeliverNotifications', function(enabled = false){
            if(!enabled) return;

            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            this.where(
                `((? = 'asap' and (? <= ?)) or (? = 'daily' and (? <= ?)))`,
                this.tableReference.createColumnReference('emailNotificationFrequency'),
                this.tableReference.createColumnReference('emailNotificationLastSentAt'),
                tenMinutesAgo,
                this.tableReference.createColumnReference('emailNotificationFrequency'),
                this.tableReference.createColumnReference('emailNotificationLastSentAt'),
                oneDayAgo
            );
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
    },

    async notify(fn){
        const body = await this.workspace.renderText(fn).toString();
        
        await this.database.lock(async () => {
            const notification = await this.notifications.where({ body }).first();
            if(notification) {
                await notification.update({
                    counter: notification.counter + 1
                });
                return;
            }
            await this.database.notifications.insert({
                userId: this.id,
                body
            });
        });
    },

    async sendMail(options = {}){
        await this.workspace.sendMail({
            ...options,
            to: this.email
        });
    },

    get readyToDeliverNotifications(){

        return false;
    },

    async deliverNotifications(){
        const site = await this.database.site;
        const notifications = await this.notifications.orderBy('createdAt').all();
        if(notifications.length == 0) return;
        await this.database.transaction(async () => {
            await this.sendMail({
                subject: `${site.title}: ${notifications.length} new notification${notifications.length == 1 ? '' : 's'}`,
                text: async ({ line }) => {
                    line(`Hello ${this.name},`);
                    line();
                    line(`You have ${notifications.length} new notification${notifications.length == 1 ? '' : 's'}.`);
                    for(let notification of notifications){
                        line();
                        line('---');
                        line();
                        line(notification.body);
                        await notification.delete();
                    }
                    line();
                    line('---');
                    line();
                }
            });
            await this.update({
                emailNotificationLastSentAt: Date.now()
            });
        });
    }
};
