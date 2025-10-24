
export default {
    async render(){
        return this.renderForm(this.session.user, {
            title: 'Notification Preferences',
            width: 'small',
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
