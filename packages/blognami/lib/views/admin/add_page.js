
export default {
    render(){
        const that = this;
        
        return this.renderForm(this.database.pages, {
            fields: ['userId', 'title'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="a" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
                `;
            }
        });
    }
};
