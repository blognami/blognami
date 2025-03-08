
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        if(!user) return this.renderView('_403', {
            message: 'You need to be signed in to do this.'
        });
    }
}
