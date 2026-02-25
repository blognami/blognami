
export default {
    meta(){
        this.schedule('*/5 * * * *');
    },

    async run(){
        // Check email allowance via usage tracking
        const tenant = await this.database.tenant;
        let usage;
        let emailAllowance = Infinity;

        if(tenant){
            emailAllowance = tenant.monthlyEmailAllowance;
            if(this.database.info.emailUsages){
                usage = await tenant.emailUsageForCurrentPeriod;
            }
        }

        for(let user of await this.database.users.where({ readyToDeliverNotifications: true }).all()){
            // Check if we've reached the email allowance
            if(usage && usage.emailsSent >= emailAllowance){
                console.warn(`Email allowance of ${emailAllowance} reached. Skipping notification delivery.`);
                return;
            }

            const notificationCount = await user.notifications.count();
            await user.deliverNotifications();

            // Increment usage tracking if notifications were actually delivered
            if(usage && notificationCount > 0){
                await usage.incrementBy(1);
            }
        }
    }
};
