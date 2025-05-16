
export default {
    render(){
        const that = this;
        
        return this.renderForm(this.database.pages, {
            fields: [
                { name: 'userId', type: 'forced', value: this.session.user.id },
                'title'
            ],
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        });
    }
};
