
export default {
    meta(){
        this.addHook('beforeRender', 'setTitleFromSite');
    },

    async setTitleFromSite(){
        this.title = await this.database.site.title;
    }
}
