
export default {
    async render(){
        if(await this.session){
            await this.session.delete();
        }

        return this.renderRedirect({ target: '_top' }).toResponseArray(200, {
            'Set-Cookie': 'pinstripeSession='
        });
    }
};
