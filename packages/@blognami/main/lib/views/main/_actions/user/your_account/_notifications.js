
export default {
    async render(){
        const user = await this.session.user;
        
        return this.renderHtml`
            <a href="/_actions/user/notifications" target="_top" data-test-id="notifications">Notifications</a>
        `;
    }
};
