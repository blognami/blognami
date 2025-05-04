
export default {
    async render(){
        return this.renderHtml`
            <a href="/_actions/user/notifications" target="_overlay" data-test-id="notifications">Notifications</a>
        `;
    }
};
