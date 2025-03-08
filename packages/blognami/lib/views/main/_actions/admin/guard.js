
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        if(!user || user.role != 'admin') return this.renderView('_403', {
            message: this.renderHtml`
                You need to be an &quot;admin&quot; user to do this.
            `
        });
    }
}
