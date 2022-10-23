
export default {
    async render(){
        const { _url, ...otherParams } = this.params;
        const slug = _url.pathname.replace(/^\//, '');
        const pageable = await this.database.pageables.where({ slug }).first();
        if(pageable) {
            const pageableName = pageable.constructor.name;
            return this.renderView(`pageables/_${pageable.constructor.name}`, {
                ...otherParams,
                [pageableName]: pageable,
            });
        }
        return this.renderView('_404');
    }
};
