
export default {
    async render(){
        return this.renderHtml`
            <a href="/_actions/user/edit_notification_preferences" target="_overlay" data-test-id="edit-notification-preferences">Notification preferences</a>
        `;
    }
};
