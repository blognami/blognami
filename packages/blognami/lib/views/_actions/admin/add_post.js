
export default {
    render(){
        const that = this;

        return this.renderForm(this.database.posts, {
            fields: [
                { name: 'userId', type: 'forced', value: this.session.user.id },
                'title'
            ],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        });
    }
};
