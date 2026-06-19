
export default {
    async render(){
        return this.renderForm(this.session.user, {
            title: 'Notification Preferences',
            fields: [
                {
                    name: 'emailNotificationFrequency',
                    type: 'select',
                    options: {
                        none: 'None',
                        asap: 'As soon as possible',
                        daily: 'Daily'
                    }
                }
            ]
        })
    }
};
