
export default {
    async render(){
        const home = await this.database.home;

        const meta = [];
        meta.push({ title: home.metaTitle || await this.database.site.title });
        if(home.metaDescription) meta.push({ name: 'description', content: home.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderViews('index/_*', this.params)
        });
    }
}

