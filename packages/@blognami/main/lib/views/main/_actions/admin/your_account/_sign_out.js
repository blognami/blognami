
export default {
    meta(){
        this.displayOrder = 200;
    },

    render(){
        return this.renderHtml`
            <a href="/_actions/guest/sign_out" target="_overlay" data-test-id="sign-out">Sign out</a>
        `;
    }
};
