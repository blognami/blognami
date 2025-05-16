
export default {
    render(){
        const that = this;
        
        return this.renderForm(this.database.tags, {
            fields: ['name'],
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        });
    }
};
