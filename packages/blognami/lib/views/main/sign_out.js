
export default {
    async render(){
        if(await this.session){
            await this.session.delete();
        }
    
        const [ status, headers, body ] = await this.renderHtml`
            <span data-component="a" data-target="_top" data-trigger="click"></span>
        `.toResponseArray();
    
        headers['Set-Cookie'] = 'pinstripeSession=';
    
        return [ status, headers, body ];
    }
};
