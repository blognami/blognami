
export default {
    async render(){
        return this.renderHtml`
            <a href="/${this.user.slug}" target="_top" data-test-id="profile">Profile</a>
        `;
    }
};
