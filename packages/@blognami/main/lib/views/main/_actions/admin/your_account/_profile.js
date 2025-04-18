
export default {
    async render(){
        const user = await this.session.user;
        
        return this.renderHtml`
            <a href="/${user.slug}" target="_top" data-test-id="profile">Profile</a>
        `;
    }
};
