
export default {
    async render(){
        return this.renderHtml`
            <a href="/_actions/user/edit_user_notification_preferences" target="_overlay" data-test-id="edit-user-notification-preferences">Notification preferences</a>
        `;
    }
};
