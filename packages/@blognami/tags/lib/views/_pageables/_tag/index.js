
export default {
    async render(){
        const { tag } = this.params;
        
        const meta = [];
        meta.push({ title: tag.metaTitle || tag.name });
        if(tag.metaDescription) meta.push({ name: 'description', content: tag.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderViews('_pageables/_tag/_*', this.params)
        });
    }
};
