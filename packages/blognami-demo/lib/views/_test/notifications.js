
export default {
    async render(){
        const { email } = this.params;
        const user = await this.database.users.where({ email }).first();
        const notifications = user ? await user.notifications.all() : [];

        return [200, {'content-type': 'text/json'}, [JSON.stringify({
            notifications: notifications.map(notification => notification.body)
        })]];
    }
};
