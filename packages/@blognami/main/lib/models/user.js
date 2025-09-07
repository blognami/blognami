
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

        this.on('before:insert', function(){
            if(this.salt) return;
            this.salt = crypto.randomUUID();
        });

        this.assignProps({
            asapEmailNotificationDelay: 10 * 60 * 1000,
        });

        this.scope('readyToDeliverNotifications', function(enabled = false){
            if(!enabled) return;
            this.where(
                `? in ('asap', 'daily') and ? < ?`,
                this.tableReference.createColumnReference('emailNotificationFrequency'),
                this.tableReference.createColumnReference('emailNotificationScheduledAt'),
                new Date()
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
        if(this.emailNotificationFrequency == 'none') return;

        const body = await this.workspace.renderText(fn).toString();
        
        await this.database.lock(async () => {
            if(!this.emailNotificationScheduledAt || this.emailNotificationScheduledAt < this.emailNotificationLastSentAt){
                if(this.emailNotificationFrequency == 'asap') await this.update({
                    emailNotificationScheduledAt: Date.now() + this.constructor.asapEmailNotificationDelay
                });
                if(this.emailNotificationFrequency == 'daily') await this.update({
                    emailNotificationScheduledAt: new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
                });
            }

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
        if(this.emailNotificationFrequency == 'none') return false;
        return this.emailNotificationScheduledAt != null && this.emailNotificationScheduledAt < new Date();
    },

    async deliverNotifications({ force = false } = {}){
        if(!force && !this.readyToDeliverNotifications) return;
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
