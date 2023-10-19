
export default {
    render(){
        const that = this;
        
        return this.renderForm(this.database.pages, {
            fields: ['userId', 'title'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="blognami-anchor" data-href="/${slug}" data-target="_top"><script type="blognami">this.parent.trigger('click');</script></span>
                `;
            }
        });
    }
};
